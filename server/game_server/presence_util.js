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
      pubsub.subscribers[user._id] = [ws];
      pubsub.publishUserLoggedEvent(user, true);
    } else {
      pubsub.subscribers[user._id].push(ws);
    }

    let gameId = pubsub.games.inGame[user._id],
        game = pubsub.games[gameId],
        oldWs = game && game.users[user._id];

    // user is in game, rescue ws
    if (Boolean(gameId) && game
        && Boolean(oldWs)
        && !pubsub.subscribers[user._id].includes(oldWs)) {
      console.log("switching ws");
      game.users[user._id] = ws;
      ws.gameId = game._id;
      game.connections++;
    }
  };

  const removeWs = ws => {
    if (ws.gameId) {
      let game = pubsub.games[ws.gameId];
      if (game.spectatorsKey[ws.userId]) {
        game.removeSpectator({_id: ws.userId, username: ws.username});
      } else {
        game.removePlayer({_id: ws.userId, username: ws.username});
      }
    }

    if (!pubsub.subscribers[ws.userId]) return;

    const userIdx = pubsub.subscribers[ws.userId].findIndex(
      subWs => subWs === ws
    );

    if (userIdx === -1) throw "tried to remove nonexistent WS"
    
    const oldWs = pubsub.subscribers[ws.userId][userIdx],
      user = {
        username: oldWs.username,
        _id: oldWs.userId,
      };


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
