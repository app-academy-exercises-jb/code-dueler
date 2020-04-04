import gql from 'graphql-tag'
// import { CURRENT_USER } from './queries';

export const typeDefs = gql `
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const resolvers = {
  Query: {
    isLoggedIn: () => {
      return !!localStorage.getItem("token")
    }
  }
};