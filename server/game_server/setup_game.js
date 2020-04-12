const ensureUserDetail = (user) => {
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
};

const setupGame = pubsub => game => {
  const endGame = (player) => {
    const finishGame = () => {
      game.users = {};
      pubsub.games.inGame[game.p1.player._id] = false;
      pubsub.games.inGame[game.p2.player._id] = false;
      pubsub.publish("gameEvent", {
        ...game,
        status: "over",
      });
      console.log({games: pubsub.games})
      console.log({subs: pubsub.subscribers})
    };
    // this function should only be called by one of the two players
    if (player._id !== game.p1.player._id
      && player._id !== game.p2.player._id) return;

    setTimeout(() => {
      const{ p1, p2, gameId } = game;
      // check if both p1 and p2 are still connected 2.5s after a DC
      if (
        pubsub.subscribers[p1.player._id] !== undefined ||
        pubsub.subscribers[p2.player._id] !== undefined
        ) {
        const found = pubsub.subscribers[player._id];
        if (found === undefined) {
          finishGame();
        } else if (found.every((connection) => 
          connection.ws.gameId !== gameId)) {
            // finish game if player is connected, 
            // but not to game screen
            finishGame();
        }
      }
    }, 1500);
  };

  const initializeGame = () => {
    if (game.initialized === true) return;
    game.initialized = true;
    setTimeout(() => {
      pubsub.publish("gameEvent", game);
      pubsub.games.inGame[game.p1.player._id] = true;
      pubsub.games.inGame[game.p2.player._id] = true;
      pubsub.games.pendingInvites[game.p2.player._id] = false;
      pubsub.games.pendingInvites[game.p2.player._id] = false;
    }, 0);
  };

  const findSpectator = spectator => {
    if (game.spectatorsKey[spectator._id] !== undefined) {
      console.log("found spectator")
      return true;
    } else if (game.spectatorsKey[spectator._id] === 0) {
      console.log("CRITICAL ERROR")
      return false;
    } 
    console.log("did not find spectator")
    return false;
  }

  const handleSpectator = action => spectator => {
    if (action === "add") {
      if (findSpectator(spectator)) {
        game.spectatorsKey[spectator._id] += 1;
        game.users[spectator._id] += 1
      } else {
        game.spectators.push(spectator);
        game.spectatorsKey[spectator._id] = 1;
        game.users[spectator._id] = 1;
        pubsub.games.inGame[spectator._id] = true;
      }
    } else if (action === "remove") {
      if (findSpectator(spectator)) {
        game.spectatorsKey[spectator._id] -= 1;
        game.users[spectator._id] -= 1
      } 
      if (game.spectatorsKey[spectator._id] === 0) {
        const idx = game.spectators.findIndex(s => s._id === spectator._id);
        if (idx !== -1) {
          game.spectators.splice(idx, 1);
        }
        delete game.spectatorsKey[spectator._id];
        delete game.users[spectator._id];
        pubsub.games.inGame[spectator._id] = false;
      }
    }
  }

  game.p1 = ensureUserDetail(game.p1);
  game.p2 = ensureUserDetail(game.p2);
  game.endGame = endGame;
  game.initializeGame = initializeGame;
  game.addSpectator = handleSpectator("add");
  game.removeSpectator = handleSpectator("remove");
}

module.exports = setupGame;
