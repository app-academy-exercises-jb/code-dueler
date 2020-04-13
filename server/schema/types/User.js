const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const User = mongoose.model("User");

const typeDefs = `
  type User {
    _id: ID!
    username: String!
    loggedIn: Boolean
  }
  extend type Query {
    me: User
    users: [User]
  }
  extend type Mutation {
    signup(username: String!, password: String!): UserCredentials!
    login(username: String!, password: String!): UserCredentials!
    logout: String!
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
    user: User!
  }
`;

const resolvers = {
  Query: {
    me(_, __, context) {
      // user provided by passport
      // console.log("querying for current user");
      return context.user;
    },
    users: (_, __, { pubsub }) => {
      // console.log("resolving users:", { subscribers: pubsub.subscribers });
      if (!pubsub.subscribers) return [];
      return User.find({
        _id: { $in: Object.keys(pubsub.subscribers) },
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
    logout(_, __, { user, pubsub, ws}) {
      if (user._id !== ws.userId
          || pubsub.subscribers[user._id] === undefined
          || pubsub.subscribers[user._id].every(s =>
            s.ws !== ws) ) return "not ok";

      setTimeout(() => {
        pubsub.logoutUser({user, ws});
      }, 0);
      return "ok";
    }
  },
  Subscription: {
    userLoggedEvent: {
      subscribe: (_, __, { pubsub, ws }) => {
        return pubsub.asyncIterator("userLoggedEvent");
      },
      resolve: async (payload) => {
        const user = await User.findById(payload);
        // payload.userLoggedEvent.user = payload.user;
        delete payload._id;
        payload.user = {
          _id: user._id,
          username: user.username,
          loggedIn: payload.loggedIn,
        };
        payload.id = user._id;
        return payload;
      },
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
