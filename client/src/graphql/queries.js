import gql from "graphql-tag";

export const CURRENT_USER = gql`
  query CurrentUser {
    me {
      _id
      username
      inGame
      inLobby
    }
  }
`;

export const IS_LOGGED_IN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

export const GET_ONLINE_USERS = gql`
  query Users {
    users {
      _id
      username
      loggedIn
      inGame
      inLobby
    }
  }
`;

export const GET_ONLINE_GAMES = gql`
  query Games {
    games {
      _id
      host
      challenge
      connections
      status
    }
  }
`;

export const GET_MESSAGES = gql`
  query Messages($channelId: String!, $offset: Int!) {
    messages(channelId: $channelId, offset: $offset) {
      _id
      author {
        _id
        username
      }
      body
      createdAt
    }
  }
`;

export const IN_GAME_INFO = gql`
  query InGameInfo($gameId: String!) {
    queryGameInfo(gameId: $gameId) {
      gameExists
      gameStatus
      isInGame
      isSpectator
      challenge
      body
    }
  }
`;
