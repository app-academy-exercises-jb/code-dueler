import gql from "graphql-tag";

export const USER_CREDENTIALS_DATA = gql`
  fragment UserCredentialsData on UserCredentials {
    _id
    username
    token
    loggedIn
  }
`;