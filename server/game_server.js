const finishGame = (pubsub, game) =>
  pubsub.publish("gameEvent", {
    ...game,
    status: "over",
  });

const endGame = (pubsub) => (input, player) =>
  setTimeout(() => {
    const game = ({ p1, p2, spectators, gameId } = input);

    if (
      pubsub.subscribers[p1._id] !== undefined &&
      pubsub.subscribers[p2._id] !== undefined
    ) {
      const found = pubsub.subscribers[player._id];
      if (found === undefined) {
        finishGame(pubsub, game);
      } else if (found.every((connection) => connection.ws.gameId !== gameId)) {
        finishGame(pubsub, game);
      }
    }
  }, 2500);

const ensureUserDetail = (user) => {
  if (user.charCount === undefined) {
    const details = {
      lastSubmittedResult: "",
      charCount: 0,
      lineCount: 0,
      currentCode: "",
    };

    return {
      player: { ...user },
      ...details,
    };
  }
};

const handleGames = (pubsub) => ({ gameId, p1, p2, initializeGame }) => {
  pubsub.updateSubscribers = (action, players) => {
    players.forEach((p) => {
      const game = pubsub.games[gameId];
      if (action === "add") {
        pubsub.subscribers[p._id].forEach((c) => (c.gameId = gameId));
      } else if (action === "remove") {
        game.connections -= 1;
        if (p._id === game.p1._id || p._id === game.p2._id) {
          game.endGame(game, p);
        }
        delete pubsub.subscribers[p._id].gameId;
      }
    });
  };

  const game = {
    p1: ensureUserDetail(p1),
    p2: ensureUserDetail(p2),
    gameId,
    users: {
      [p1._id]: 1,
      [p2._id]: 1,
    },
    spectators: [],
    status: "initializing",
    connections: 0,
    initializeGame,
    endGame: endGame(pubsub),
  };

  if (pubsub.games === undefined) {
    pubsub.games = { [gameId]: game };
  } else {
    pubsub.games[gameId] = game;
  }

  pubsub.updateSubscribers("add", [p1, p2]);
};

module.exports = handleGames;
