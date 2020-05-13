const presenceUtils = pubsub => {
  const publishUserLoggedEvent = (user, loggedIn) => {
    setTimeout(() => {
      pubsub.publish("userLoggedEvent", {
        _id: user._id,
        loggedIn,
      });
    }, 100);
  };

  const updateSubscribersGameId = (action, players, gameId) => {
    const game = pubsub.games[gameId];
    if (game === undefined || game.p1 === undefined || game.p2 === undefined) return;
    players.forEach((p) => {
      if (action === "add") {
        game.connections += 1;
        pubsub.subscribers[p._id].forEach((c) => (c.gameId = gameId));
      } else if (action === "remove") {
        game.connections -= 1;
        if (p._id === game.p1.player._id || p._id === game.p2.player._id) {
          console.log("ending game from subs")
          game.endGame(p);
        }
        delete pubsub.subscribers[p._id].gameId;
      }
    });
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

    pubsub.subscribers[ws.userId].splice(userIdx, 1);

    // user.ws === ws, as per above findIndex
    if (user.ws.gameId) {
      pubsub.updateSubscribersGameId("remove", [user], user.ws.gameId);
    }

    if (pubsub.subscribers[ws.userId].length === 0) {
      pubsub.subscribers[ws.userId].push({username: ws.username})
      pubsub.publishUserLoggedEvent(user, false);
      delete pubsub.subscribers[ws.userId];
    }
  }

  const logoutUser = ({user}) => {
    // if (!pubsub.subscribers[user._id]) return;
    pubsub.subscribers[user._id].forEach(sub => {
      if (sub.ws.gameId) {
        pubsub.updateSubscribersGameId("remove", [sub], sub.ws.gameId);
      }
    });

    pubsub.publishUserLoggedEvent(user, false);
    delete pubsub.subscribers[user._id];
  }

  const loginUser = user => {

  }

  pubsub.publishUserLoggedEvent = publishUserLoggedEvent;
  pubsub.updateSubscribersGameId = updateSubscribersGameId;
  pubsub.addWs = addWs;
  pubsub.removeWs = removeWs;
  pubsub.loginUser = loginUser;
  pubsub.logoutUser = logoutUser;
};

module.exports = presenceUtils;
