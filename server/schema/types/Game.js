const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const typeDefs = `
  extend type Mutation {
    leaveGame(player: ID!, gameId: String!): String!
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

const generatePublishGameUpdate = ({pubsub, ws, gameId, player, _id, game, input, user}) => {
  const gameUser = Object.assign(
    {...game[player]},
    { ...input },
    {player: user}
  ),
  publishGameUpdate = gameUser => {
    // console.log(ws.gameId === gameId && player !== undefined && _id === ws.userId);
    // console.log({ws: ws.gameId})
    // console.log({gameId})
    // console.log({player})
    // console.log({_id})
    if (ws.gameId === gameId && player !== undefined && _id === ws.userId) {
      Object.assign(game, { [player]: { ...gameUser } });
      pubsub.publish("gameEvent", game);
    }
  };

  return [gameUser, publishGameUpdate];
}


const resolvers = {
  Mutation: {
    leaveGame: (_, {player: _id, gameId}, { user, pubsub, ws }) => {
      //please leave game.
      const game = pubsub.games[gameId];
      pubsub.games.inGame[_id] = false;
      delete ws.gameId;
      
      if (!game || 
        game.users[_id] === undefined || 
        user._id !== _id) return "ok";

      game.endGame({_id});
      return "ok";
    },
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
      
      const [gameUser, publishGameUpdate] = generatePublishGameUpdate({
        pubsub, ws, gameId, player, _id, game, input, user
      });
    
      publishGameUpdate(gameUser);
      return gameUser;
    },
    updateGameUserCurrentCode: (_, input, { user, pubsub, ws }) => {
      const { player: _id, gameId } = input;

      const game = pubsub.games[gameId];

      if (game === undefined) return false;

      game.status = "ongoing";

      const player = getPlayer(game, user);

      const [gameUser, publishGameUpdate] = generatePublishGameUpdate({
        pubsub, ws, gameId, player, _id, game, input, user
      });


      publishGameUpdate(gameUser);
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

          if (game.connections === 2) {
            game.initializeGame();
          }

          return pubsub.asyncIterator("gameEvent");
        },
        ({ p1, p2, spectators, status, gameId }, _, { user, pubsub, ws }) => {
          return (
            user._id === ws.userId &&
            p1.player._id === user._id ||
            p2.player._id === user._id ||
            spectators.some(s => s._id === user._id)
          );
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
