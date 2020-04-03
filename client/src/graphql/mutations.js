import gql from 'graphql-tag';
import { USER_CREDENTIALS_DATA, BOOK_DATA } from './fragments';

export const LOGIN_USER = gql `
  mutation LogIn($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...UserCredentialsData
    }
  }
  ${USER_CREDENTIALS_DATA}
`;

export const SIGNUP_USER = gql `
  mutation SignUp($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      ...UserCredentialsData
    }
  }
  ${USER_CREDENTIALS_DATA}
`;