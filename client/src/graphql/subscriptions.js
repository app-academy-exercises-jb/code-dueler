import gql from "graphql-tag";
import { GAME_USER_DETAILS } from "./fragments";

export const ON_MESSAGE_ADDED = gql`
  subscription onMessageAdded {
    messageAdded {
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

export const USER_LOGGED_EVENT = gql`
  subscription userUpdates {
    userLoggedEvent {
      user {
        _id
        username
        loggedIn
        inGame
        inLobby
      }
    }
  }
`;

export const GAME_LOGGED_EVENT = gql`
  subscription gameUpdates {
    gameLoggedEvent {
      _id
      host
      challenge
      language
      connections
      status
    }
  }
`;

export const ON_INVITATION = gql`
  subscription onInvitation {
    invitationEvent {
      inviter {
        _id
        username
      }
      invitee {
        _id
        username
      }
      status
      reason
      gameId
    }
  }
`;

export const ON_GAME = gql`
  subscription onGame($gameId: String!) {
    gameEvent(gameId: $gameId) {
      _id
      p1 {
        ...GameUserDetails
      }
      p2 {
        ...GameUserDetails
      }
      spectators {
        _id
        username
      }
      status
      connections
      winner
    }
  }
  ${GAME_USER_DETAILS}
`;
