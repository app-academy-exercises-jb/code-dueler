const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const User = mongoose.model("User");

const typeDefs = `
  extend type Mutation {
    updateGameUserLastSubmitted(
      player: ID!,
      lastSubmittedResult: String!,
      gameId: String!
    ): GameUser!
    updateGameUserCurrentCode(
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
  }
  type GameUser {
    player: User!
    lastSubmittedResult: String
    charCount: Int
    lineCount: Int
    currentCode: String
  }
`;

const resolvers = {
  Mutation: {
    updateGameUserLastSubmitted: (_, input, { user, pubsub, ws }) => {
      const { player: _id, lastSubmittedResult, gameId } = input;

      const game = pubsub.games[gameId];
      game.status = "ongoing";
      
      let player;
      if (game.p1.player._id === user._id) {
        player = "p1";
      } else if (game.p2.player._id === user._id) {
        player = "p2";
      }

      const gameUser = Object.assign(
        {...game[player]},
        { ...input },
        {player: user});

        if (ws.gameId === gameId && player !== undefined && _id === ws.userId) {
          Object.assign(game, { [player]: { ...gameUser } });
          console.log("publishing game:", {game})
          pubsub.publish("gameEvent", game);
        }
  
        return gameUser;
  
    },
    updateGameUserCurrentCode: (_, input, { user, pubsub, ws }) => {
      const { charCount, lineCount, currentCode, gameId } = input;
      const game = pubsub.games[gameId];

      game.status = "ongoing";

      let player;
      if (game.p1.player._id === user._id) {
        player = "p1";
      } else if (game.p2.player._id === user._id) {
        player = "p2";
      }

      const gameUser = {
        player: user,
        ...input,
      };

      if (ws.gameId === gameId && player !== undefined) {
        Object.assign(game, { [player]: { ...gameUser } });
        pubsub.publish("gameEvent", game);
      }

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
          return pubsub.games[gameId].users[user._id] > 0;
        }
      ),
      resolve: ({ p1, p2, spectators, status, gameId }) => {
        return {
          p1,
          p2,
          spectators,
          status,
          gameId,
        };
      },
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
