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
    updateGameUserLastSubmitted: (_, input, { user, pubsub }) => {
      const { player, lastSubmittedResult, gameId } = input;
    },
    updateGameUserCurrentCode: (_, input, { user, pubsub, ws }) => {
      const { charCount, lineCount, currentCode, gameId } = input;

      const game = pubsub.games[gameId];

      console.log({ game });

      let player;

      if (game.p1.player._id === user._id) {
        // player = game.p1.player;
        player = "p1";
      } else if (game.p2.player._id === user._id) {
        // player = game.p2.player;
        player = "p2";
      }

      const gameUser = {
        player: user,
        ...input,
      };

      if (ws.gameId === gameId && player !== undefined) {
        Object.assign(game, { [player]: { ...input } });
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
        if (p1.charCount === undefined) {
          const details = {
            lastSubmittedResult: "",
            charCount: 0,
            lineCount: 0,
            currentCode: "",
          };
          return {
            p1: {
              player: p1,
              ...details,
            },
            p2: {
              player: p2,
              ...details,
            },
            spectators,
            status,
            gameId,
          };
        } else
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
