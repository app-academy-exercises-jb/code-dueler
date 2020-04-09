const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const User = mongoose.model("User");

const typeDefs = `
  extend type Mutation {
    updateGameUserLastSubmitted(
      player: ID!,
      lastSubmittedResult: String!
    ): GameUser!
    updateGameUserCurrentCode(
      player: ID!,
      charCount: Int!,
      lineCount: Int!,
      currentCode: String!
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
    updateGameUserLastSubmitted: (_, input, { user }) => {
      const { player, lastSubmittedResult } = input;
      
    },
    updateGameUserCurrentCode: (_, input, { user }) => {
      const { player, charCount, lineCount, currentCode } = input;
      
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
        },
      ),
      resolve: ({p1, p2, spectators, status, gameId}) => {
        if (p1.charCount === undefined) {
          const details = {
            lastSubmittedResult: "",
            charCount: 0,
            lineCount: 0,
            currentCode: ""
          };
          return {
            p1: {
              player: p1,
              ...details
            },
            p2: {
              player: p2,
              ...details
            },
            spectators, status, gameId
          }
        } else return {
          p1, p2, spectators, status, gameId
        };
      },
    },
  },
};

module.exports = {
  typeDefs,
  resolvers
};
