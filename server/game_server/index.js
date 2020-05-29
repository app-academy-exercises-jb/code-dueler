const messageUtil = require('./message_util'),
  presenceUtil = require('./presence_util'),
  gameUtil = require('./game_util'),
  invitationUtil = require('./invitation_util');

// setupGameServer is a factory function to imbue pubsub with ease-of-use,
// game-related functions. The functions we define within it are 
// properly scoped to use pubsub publish methods.
const setupGameServer = (pubsub) => {
  pubsub.subscribers = {};
  pubsub.games = {};
  pubsub.games.inGame = {};
  // pubsub.games.pendingInvites = {};

  messageUtil(pubsub);
  presenceUtil(pubsub);
  gameUtil(pubsub);
  invitationUtil(pubsub);
}

module.exports = setupGameServer;
