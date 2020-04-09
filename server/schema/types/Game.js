const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const User = mongoose.model("User");

const typeDefs = `
  extend type Mutation {
    updateGameUser(user: GameUser!): GameUser!
  }
  extend type Subscription {
    gameEvent: GameUpdate!
  }
  type GameUpdate {
    p1: GameUser!
    p2: GameUser!
    spectators: [User]
    status: String!
    gameId: String!
  }
  scalar GameUser {
    player: User
    lastSubmittedResult: String
    charCount: Int
    lineCount: Int
    currentCode: String
  }
`;

const resolvers = {
  Mutation: {
    updateGameUser: (_, input, { user }) => {
      const { player, lastSubmittedResult, charCount, lineCount, currentCode } = input;
      
    }
  },
  Subscription: {
    gameEvent: {
      subscribe: withFilter(
        (_, __, { pubsub, ws }) => {
          const game = pubsub.games[ws.gameId];
          game.connections += 1;

          if (game.connections === 2) {
            game.initializeGame(pubsub);
          }

          return pubsub.asyncIterator("gameEvent");
        },
        ({ p1, p2, spectators, status, gameId }, _, { user, pubsub }) => {
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
