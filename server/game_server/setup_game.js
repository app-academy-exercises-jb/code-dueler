const setupGame = pubsub => game => {
  const endGame = (player) => {
    const finishGame = () => {
      console.log("finishing game")
      game.users = {};
      game.status = "over";
      pubsub.games.inGame[game.p1.player._id] = false;
      game.p2 && (pubsub.games.inGame[game.p2.player._id] = false);
      pubsub.publish("gameEvent", game);
      game.Game.findOneAndUpdate({_id: game._id}, { $set: {status: "over"}})
        // __TODO__ change these console logs to something useful
        .then(res => {
          console.log("finished game")
        })
        .catch(err => {
          console.log(err);
        });
    };
    // this function should only be called by one of the two players
    if (player._id !== game.p1.player._id
      && (!game.p2 || player._id !== game.p2.player._id)) return;
      
    setTimeout(() => {
      const{ p1, p2, _id } = game;
      // check if both p1 and p2 are still connected 2.5s after a DC
      if (
        pubsub.subscribers[p1.player._id] !== undefined ||
        (!p2 || pubsub.subscribers[p2.player._id] !== undefined)
        ) {
        const found = pubsub.subscribers[player._id];
        if (found === undefined) {
          finishGame();
        } else if (found.every((connection) => 
          connection.ws.gameId !== _id)) {
            // finish game if player is connected, 
            // but not to game screen
            finishGame();
        } else {
          console.log("not finishing after all:", {found})
        }
      }
    }, 1500);
  };

  const initializeGame = () => {
    if (game.initialized === true) return;
    game.initialized = true;
    game.status = "started"
    pubsub.games.inGame[game.p1.player._id] = true;
    pubsub.games.inGame[game.p2.player._id] = true;
    pubsub.games.pendingInvites[game.p2.player._id] = false;
    pubsub.games.pendingInvites[game.p2.player._id] = false;
    setTimeout(() => {
      pubsub.publish("gameEvent", game);
    }, 0);
  };

  const findSpectator = spectator => {
    if (game.spectatorsKey[spectator._id] !== undefined) {
      console.log("found spectator");
      return true;
    } else if (game.spectatorsKey[spectator._id] === 0) {
      console.log("CRITICAL ERROR");
      return false;
    } 
    console.log("did not find spectator");
    return false;
  }

  const handleSpectator = action => spectator => {
    if (action === "add") {
      if (findSpectator(spectator)) {
        game.spectatorsKey[spectator._id] += 1;
        game.users[spectator._id] += 1
      } else {
        game.spectators.push(spectator);
        game.connections += 1;
        game.spectatorsKey[spectator._id] = 1;
        game.users[spectator._id] = 1;
        pubsub.games.inGame[spectator._id] = true;
        pubsub.publish("gameEvent", game);
        game.Game.findOneAndUpdate({_id: game._id}, { $push: { spectators: spectator._id }})
          .then(() => {
            console.log("added spectator")
          })
          .catch(err => {
            console.log({err})
            console.log("failed to add spectator")
          });
      }
    } else if (action === "remove") {
      if (findSpectator(spectator)) {
        console.log("found spectator, removing");
        game.spectatorsKey[spectator._id] -= 1;
        game.users[spectator._id] -= 1
      } 
      if (game.spectatorsKey[spectator._id] === 0) {
        const idx = game.spectators.findIndex(s => s._id === spectator._id);
        if (idx !== -1) {
          game.spectators.splice(idx, 1);
        }
        console.log("lowering connections in handleSpectator")
        game.connections -= 1;
        delete game.spectatorsKey[spectator._id];
        delete game.users[spectator._id];
        pubsub.games.inGame[spectator._id] = false;
        pubsub.publish("gameEvent", game);
        game.Game.findOneAndUpdate({_id: game._id}, { $pull: { spectators: spectator._id }})
          .then(() => {
            console.log("added spectator")
          })
          .catch(err => {
            console.log({err})
            console.log("failed to add spectator")
          });
      }
    }
  }

  game.endGame = endGame;
  game.initializeGame = initializeGame;
  game.addSpectator = handleSpectator("add");
  game.removeSpectator = handleSpectator("remove");
}

module.exports = setupGame;
