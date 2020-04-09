import gql from "graphql-tag";

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
  subscription onGame {
    gameEvent {
      p1 {
        _id
        username
      }
      p2 {
        _id
        username
      }
      spectators {
        _id
        username
      }
      status
      gameId
    }
  }
`;
