const presenceUtils = pubsub => {
  const publishUserLoggedEvent = (user, loggedIn) => {
    console.log(`logging ${user.username || user._id} \
      ${loggedIn === true ? 'in' : loggedIn === false ? 'out' : 'ERROR'} \
    `);
    setTimeout(() => {
      pubsub.publish("userLoggedEvent", {
        _id: user._id,
        loggedIn,
      });
    }, 100);
  };

  const addWs = ({ws, user}) => {
    console.log(`${user._id} connected to the websocket`);

    user.ws = ws;
    // mark the socket object with the appropriate ID so we can remove it on DC
    ws.userId = user._id;
    ws.username = user.username;

    if (pubsub.subscribers[user._id] === undefined) {
      pubsub.subscribers[user._id] = [user];
      pubsub.publishUserLoggedEvent(user, true);
    } else {
      pubsub.subscribers[user._id].push(user);
    }
  };

  const removeWs = ws => {
    // __TODO__ if ws has a gameId, it needs to leaveGame
    if (ws.invited) {
      pubsub.games.pendingInvites[ws.userId] = false;
    }

    if (!pubsub.subscribers[ws.userId]) return;

    const userIdx = pubsub.subscribers[ws.userId].findIndex(
      (s) => s.ws === ws
    );
    const user = pubsub.subscribers[ws.userId][userIdx];

    //__TODO__ should throw errors against userIdx being -1

    pubsub.subscribers[ws.userId].splice(userIdx, 1);

    if (pubsub.subscribers[ws.userId].length === 0) {
      pubsub.subscribers[ws.userId].push({username: ws.username})
      pubsub.publishUserLoggedEvent(user, false);
      delete pubsub.subscribers[ws.userId];
    }
  }

  const logoutUser = ({user}) => {
    pubsub.publishUserLoggedEvent(user, false);
    delete pubsub.subscribers[user._id];
  }

  const loginUser = user => {

  }

  pubsub.publishUserLoggedEvent = publishUserLoggedEvent;
  pubsub.addWs = addWs;
  pubsub.removeWs = removeWs;
  pubsub.loginUser = loginUser;
  pubsub.logoutUser = logoutUser;
};

module.exports = presenceUtils;
