const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const User = mongoose.model("User");

const typeDefs = `
  extend type Subscription {
    gameEvent: GameUpdate!
  }
  type GameUpdate {
    p1: User!
    p2: User!
    spectators: [User]
    status: String!
    gameId: String!
  }
`;

const resolvers = {
  Mutation: {

  },
  Subscription: {
    gameEvent: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("gameEvent"),
      resolve: payload => payload,
    },
  },
};

module.exports = {
  typeDefs,
  resolvers
};
