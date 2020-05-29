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

export const LOGOUT_USER = gql`
  mutation LogOut {
    logout
  }
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

export const KICK_PLAYER = gql`
  mutation KickPlayer($player: ID!, $action: String!) {
    kickPlayer(player: $player, action: $action)
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
      reason
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
    $ready: Boolean!
    $gameId: ID!
  ) {
    updateGameUserStatus(player: $player, ready: $ready, gameId: $gameId) {
      ...GameUserDetails
    }
  }
  ${GAME_USER_DETAILS}
`;

export const LEAVE_GAME = gql `
  mutation LeaveGame($player: ID!, $gameId: String!) {
    leaveGame(player: $player, gameId: $gameId)
  }
`;

export const HANDLE_GAME = gql`
  mutation HandleGame($gameId: String!, $action: String!) {
    handleGame(gameId: $gameId, action: $action)
  }
`;

export const JOIN_GAME = gql`
  mutation JoinGame($player: ID, $gameId: ID) {
    joinGame(player: $player, gameId: $gameId)
  }
`;

export const HOST_GAME = gql`
  mutation HostGame($challenge: String!, $language: String!) {
    hostGame(challenge: $challenge, language: $language)
  }
`;

export const SUBMIT_CODE = gql`
  mutation SubmitCode($code: String!) {
    submitCode(code: $code)
  }
`;

export const ADD_QUESTION = gql`
  mutation AddQuestion {
    addQuestion
  }
`;
