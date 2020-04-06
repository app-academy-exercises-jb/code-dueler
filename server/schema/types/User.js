const mongoose = require("mongoose");

const User = mongoose.model("User");

const typeDefs = `
  type User {
    _id: ID!
    username: String!
  }
  extend type Query {
    me: User
    users: [User]
  }
  extend type Mutation {
    signup(username: String!, password: String!): UserCredentials!
    login(username: String!, password: String!): UserCredentials!
  }
  extend type Subscription {
    userLoggedEvent: UserUpdate!
  }
  type UserCredentials {
    _id: ID!
    username: String!
    token: String
    loggedIn: Boolean
  }
  type UserUpdate {
    user: User
    loggedIn: Boolean!
  }
`;

const resolvers = {
  Query: {
    me(_, __, context) {
      // user provided by passport
      return context.user;
    },
    users: (_, __, { pubsub }) => {
      return User.find({
        _id: { $in: 
          Object.keys(pubsub.subscribers)
        }
      });
    },
  },
  Mutation: {
    signup(_, { username, password }) {
      return User.signup(username, password);
    },
    login(_, { username, password }) {
      return User.login(username, password);
    },
  },
  Subscription: {
    userLoggedEvent: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator('userLoggedEvent');
      },
      resolve: async payload => {
        payload.user = await User.findById(payload);
        delete payload._id;
        return payload;
      }
    }
  }
};

module.exports = {
  typeDefs,
  resolvers,
};
