import gql from "graphql-tag"

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
    }
    loggedIn
  }
}
`;
