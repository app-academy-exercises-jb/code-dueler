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

  pubsub.publishUserLoggedEvent = publishUserLoggedEvent;
  pubsub.updateSubscribersGameId = updateSubscribersGameId;
};

module.exports = presenceUtils;
