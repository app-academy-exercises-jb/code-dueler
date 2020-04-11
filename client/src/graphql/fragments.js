import gql from "graphql-tag";

export const USER_CREDENTIALS_DATA = gql`
  fragment UserCredentialsData on UserCredentials {
    _id
    username
    token
    loggedIn
  }
`;

export const GAME_USER_DETAILS = gql`
  fragment GameUserDetails on GameUser {
    player {
      _id
      username
    }
    lastSubmittedResult
    charCount
    lineCount
    currentCode
  }
`;
