const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const typeDefs = `
  extend type Mutation {
    updateGameUserLastSubmitted(
      player: ID!,
      lastSubmittedResult: String!,
      gameId: String!
    ): GameUser!
    updateGameUserCurrentCode(
      player: ID!,
      charCount: Int!,
      lineCount: Int!,
      currentCode: String!,
      gameId: String!
    ): GameUser!
    updateGameUserStatus(
      player: ID!,
      status: String!,
      gameId: String!
    ): GameUser!
  }
  extend type Subscription {
    gameEvent(gameId: String!): GameUpdate!
  }
  type GameUpdate {
    p1: GameUser!
    p2: GameUser!
    spectators: [User]
    status: String!
    gameId: String!
    winner: String
    connections: Int
  }
  type GameUser {
    player: User!
    lastSubmittedResult: String
    charCount: Int
    lineCount: Int
    currentCode: String
  }
`;

const getPlayer = (game, user) => {
  if (game.p1.player._id === user._id) {
    return "p1";
  } else if (game.p2.player._id === user._id) {
    return "p2";
  }
};

const generatePublishGame = ({pubsub, ws, gameId, player, _id, game, input, user}) => ({
    publishGame: gameUser => {
      if (ws.gameId === gameId && player !== undefined && _id === ws.userId) {
        Object.assign(game, { [player]: { ...gameUser } });
        pubsub.publish("gameEvent", game);
      }
    },
    gameUser: Object.assign(
      {...game[player]},
      { ...input },
      {player: user}
    )
  });

const resolvers = {
  Mutation: {
    updateGameUserLastSubmitted: (_, input, { user, pubsub, ws }) => {
      const { player: _id, lastSubmittedResult, gameId } = input;

      const game = pubsub.games[gameId];
      game.status = "ongoing";
      
      const player = getPlayer(game, user);

      const parsedResult = JSON.parse(lastSubmittedResult);
      if (parsedResult.passed === true) {
        game.status = "over";
        game.winner = player;
      }
      
      const {gameUser, publishGame} = generatePublishGame({
        pubsub, ws, gameId, player, _id, game, input, user
      });
    
      publishGame(gameUser);
      return gameUser;
    },
    updateGameUserCurrentCode: (_, input, { user, pubsub, ws }) => {
      const { player: _id, gameId } = input;

      const game = pubsub.games[gameId];
      game.status = "ongoing";

      const player = getPlayer(game, user);

      const {gameUser, publishGame} = generatePublishGame({
        pubsub, ws, gameId, player, _id, game, input, user
      });

      publishGame(gameUser);
      return gameUser;
    },
  },
  Subscription: {
    gameEvent: {
      subscribe: withFilter(
        (_, __, { pubsub, ws, user }, { variableValues: { gameId } }) => {
          if (ws.gameId === undefined && user._id === ws.userId) {
            ws.gameId = gameId;
          }

          const game = pubsub.games[ws.gameId];
          game.connections += 1;

          if (game.connections === 2) {
            game.initializeGame(pubsub);
          }

          return pubsub.asyncIterator("gameEvent");
        },
        ({ p1, p2, spectators, status, gameId }, _, { user, pubsub, ws }) => {
          return pubsub.games && pubsub.games[gameId].users[user._id] > 0;
        }
      ),
      resolve: payload => payload
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
