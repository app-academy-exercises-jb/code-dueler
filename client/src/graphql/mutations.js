import gql from "graphql-tag";
import { USER_CREDENTIALS_DATA } from "./fragments";

export const LOGIN_USER = gql`
  mutation LogIn($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...UserCredentialsData
    }
  }
  ${USER_CREDENTIALS_DATA}
`;

export const SIGNUP_USER = gql`
  mutation SignUp($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      ...UserCredentialsData
    }
  }
  ${USER_CREDENTIALS_DATA}
`;

export const ADD_MESSAGE = gql`
  mutation AddMessage($author: ID!, $body: String!) {
    addMessage(author: $author, body: $body) {
      success
      message
      messages {
        _id
        author {
          _id
          username
        }
        body
      }
    }
  }
`;

export const INVITE_PLAYER = gql`
  mutation InvitePlayer($invitee: ID!) {
    invitePlayer(invitee: $invitee) {
      inviter {
        _id
        username
      }
      invitee {
        _id
        username
      }
      status
    }
  }
`;

export const ACCEPT_INVITE = gql`
  mutation AcceptInvite($inviter: ID!) {
    acceptInvitation(inviter: $inviter) {
      inviter {
        _id
        username
      }
      status
    }
  }
`;

export const DECLINE_INVITE = gql`
  mutation Decline_Invite($inviter: ID!) {
    declineInvitation(inviter: $inviter) {
      inviter {
        _id
        username
      }
      status
    }
  }
`;
