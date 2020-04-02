const mongoose = require('mongoose');

const User = mongoose.model('User');

const typeDefs = `
  type User {
    _id: ID!
    username: String!
  }
  extend type Query {
    me: User
  }
  extend type Mutation {
    signup(username: String!, password: String!): UserCredentials!
    login(username: String!, password: String!): UserCredentials!
  }
  type UserCredentials {
    _id: ID!
    username: String!
    token: String
    loggedIn: Boolean
  }
`;

const resolvers = {
  Query: {
    me(_, __, context) {
      // user provided by passport
      return context.user;
    }
  },
  Mutation: {
    signup(_, { username, password }) {
      return User.signup(username, password);
    },
    login(_, { username, password }) {
      return User.login(username, password);
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
};
