import gql from 'graphql-tag'
import { CURRENT_USER } from './queries';

export const typeDefs = gql `
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const resolvers = {
  Query: {
    isLoggedIn: () => {
      console.log('isLoggedIn resolver called', localStorage.getItem('token'));
      return !!localStorage.getItem("token")
    }
  }
};