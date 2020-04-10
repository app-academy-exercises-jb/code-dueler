import gql from "graphql-tag";
import { USER_CREDENTIALS_DATA, GAME_USER_DETAILS } from "./fragments";

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
  mutation AddMessage($author: ID!, $body: String!, $channelId: String) {
    addMessage(author: $author, body: $body, channelId: $channelId) {
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
  mutation DeclineInvite($inviter: ID!) {
    declineInvitation(inviter: $inviter) {
      inviter {
        _id
        username
      }
      status
    }
  }
`;

export const UPDATE_GAME_LAST_SUBMITTED = gql`
  mutation UpdateGameUserLastSubmitted(
    $player: ID!
    $lastSubmittedResult: String!
    $gameId: String!
  ) {
    updateGameUserLastSubmitted(
      player: $player
      gameId: $gameId
      lastSubmittedResult: $lastSubmittedResult
    ) {
      ...GameUserDetails
    }
  }
  ${GAME_USER_DETAILS}
`;

export const UPDATE_GAME_USER_CODE = gql`
  mutation UpdateGameUserCurrentCode(
    $charCount: Int!
    $lineCount: Int!
    $currentCode: String!
    $gameId: String!
    $player: ID!
  ) {
    updateGameUserCurrentCode(
      charCount: $charCount
      lineCount: $lineCount
      currentCode: $currentCode
      gameId: $gameId
      player: $player
    ) {
      ...GameUserDetails
    }
  }
  ${GAME_USER_DETAILS}
`;

export const UPDATE_GAME_USER_STATUS = gql`
  mutation UpdateGameUserStatus(
    $player: ID!
    $status: String!
    $gameId: String!
  ) {
    updateGameUserStatus(player: $player, status: $status, gameId: $gameId) {
      ...GameUserDetails
    }
  }
  ${GAME_USER_DETAILS}
`;
