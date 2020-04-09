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
      }
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
      gameId
    }
  }
`;

export const ON_GAME = gql`
  subscription onGame($gameId: String!) {
    gameEvent(gameId: $gameId) {
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
      gameId
    }
  }
  ${GAME_USER_DETAILS}
`;
