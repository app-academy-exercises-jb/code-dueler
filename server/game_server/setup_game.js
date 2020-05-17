const mongoose = require('mongoose');

const setupPlayer = (user, player) => {
  let newPlayer = {
    lastSubmittedResult: '',
    charCount: 0,
    lineCount: 0,
    currentCode: '',
    player: user,
    // ready: true,
  };
  newPlayer.player.pId = player._id.toString();
  return newPlayer;
};

const setupGame = pubsub => game => {
  const endGame = (player) => {
    const finishGame = async () => {
      console.log("finishing game")
      // Object.keys(game.users).forEach(user => {
      //   pubsub.publishUserLoggedEvent({_id: user}, Boolean(pubsub.subscribers[user]));
      // });
      game.users = {};
      game.status = "over";
      
      //__TODO__ sometimes we'll have to delete as follows, but not always
      // delete game.users[user._id];
      pubsub.games.inGame[player._id] = false;
      
      pubsub.publish("gameEvent", game);
      pubsub.publishUserLoggedEvent(player, Boolean(pubsub.subscribers[player._id]));

      await game.Game.findOneAndUpdate({_id: game._id}, { $set: {status: "over"}})
        // __TODO__ change these console logs to something useful
        .then(res => {
          console.log("finished game")
        })
        .catch(err => {
          console.log(err);
        });
    };
    // this function should only be called by one of the two players
    // if (player._id !== game.p1.player._id
    //   && (!game.p2 || player._id !== game.p2.player._id)) return;
      
    setTimeout(() => {
      const{ p1, p2, _id } = game;
      // check if both p1 and p2 are still connected .2s after a DC
      if (
        (p1 && pubsub.subscribers[p1.player._id] !== undefined) ||
        (p2 && pubsub.subscribers[p2.player._id] !== undefined)
        ) {
        const found = pubsub.subscribers[player._id];
        if (found === undefined) {
          finishGame();
        } else if (found.every(ws => 
          ws.gameId !== _id)) {
            // finish game if player is connected, 
            // but not to game screen
            finishGame();
        } else {
          console.log("not finishing after all:", {found})
        }
      }
    }, 200);
  };

  const initializeGame = () => {
    if (game.initialized === true) return;
    game.initialized = true;
    game.status = "started"
    pubsub.games.inGame[game.p1.player._id] = game._id;
    pubsub.games.inGame[game.p2.player._id] = game._id;
    pubsub.games.pendingInvites[game.p2.player._id] = false;
    pubsub.games.pendingInvites[game.p2.player._id] = false;
    setTimeout(() => {
      pubsub.publish("gameEvent", game);
    }, 0);
  };

  const findSpectator = spectator => {
    if (game.spectatorsKey[spectator._id] !== undefined) {
      return true;
    } else if (game.spectatorsKey[spectator._id] === 0) {
      console.log("CRITICAL ERROR");
      return false;
    } 
    console.log("did not find spectator");
    return false;
  }

  const findPlayer = player => {
    if ((game.p1 && game.p1.player._id === player._id)
        || (game.p2 && game.p2.player._id === player._id)) {
      return true;
    } else {
      console.log("did not find player");
      return false;
    }
  }

  const findUser = userClass => user => {
    if (userClass === "spectator") {
      return findSpectator(user);
    } else if (userClass === "player") {
      return findPlayer(user);
    }
  }

  const handleAction = async (userClass, action, user) => {
    console.log(`${action}ing ${userClass}: ${user.username}`);

    let find = findUser(userClass),
      isSpectator = userClass === "spectator",
      Player = mongoose.model('Player');;

    if (action === "add") {
      if (find(user)) {
        console.log(`found ${userClass}, adding`);
        if (isSpectator) {
          game.spectatorsKey[user._id] += 1;
        } else {
          throw 'players should not be added when they are already players';
        }
        game.users[user._id] = user.ws;
      } else {
        if (isSpectator) {
          game.spectators.push(user);
          game.spectatorsKey[user._id] = 1;
        } else {
          // if no p1, add it. else if no p2, add it. else, throw error
          let player = new Player({
            user: user._id
          });
          if (!Boolean(game.p1)) {
            console.log("adding p1")
            game.p1 = setupPlayer(user, player);
            await player.save();
            await game.Game.findOneAndUpdate({_id: game._id}, { $set: { p1: player }});
          } else if (!Boolean(game.p2)) {
            console.log("adding p2")
            game.p2 = setupPlayer(user, player);
            await player.save();
            await game.Game.findOneAndUpdate({_id: game._id}, { $set: { p2: player }});
          } else {
            console.log('can\'t add player when already full')
            throw "can't add player when already full"
          }
        }

        game.connections += 1;
        game.users[user._id] = user.ws;
        pubsub.games.inGame[user._id] = game._id;

        pubsub.publish("gameEvent", game);
        pubsub.publishUserLoggedEvent(user, Boolean(pubsub.subscribers[user._id]));

        isSpectator && await game.Game.findOneAndUpdate({_id: game._id}, { $push: { spectators: user._id }})
          .then(() => {
            console.log("added spectator")
          })
          .catch(err => {
            console.log({err})
            console.log("failed to add spectator")
          });
      }
    } else if (action === "remove") {
      if (find(user)) {
        console.log(`found ${userClass}, removing`);
        if (isSpectator) {
          game.spectatorsKey[user._id] -= 1;
          // game.users[user._id] -= 1;

          if (game.spectatorsKey[user._id] === 0) {
            const idx = game.spectators.findIndex(s => s._id === user._id);
            if (idx !== -1) {
              game.spectators.splice(idx, 1);
            }

            delete game.spectatorsKey[user._id];
            delete game.users[user._id];
            pubsub.games.inGame[user._id] = false;

            await game.Game.findOneAndUpdate({_id: game._id}, { $pull: { spectators: user._id }})
              .then(() => {
                console.log("removed spectator")
              })
              .catch(err => {
                console.log({err})
                console.log("failed to remove spectator")
              });
          }
        } else {
          if (game.status === "ongoing"
              || (game.status === "initializing"
              && game.connections < 2)) {
            game.endGame(user);
          } else if (game.status === "initializing") {
            let playerKey = user._id === (game.p1 && game.p1.player._id)
              ? 'p1' : 'p2';
            
            delete game[playerKey];
            delete game.users[user._id];
            pubsub.games.inGame[user._id] = false;

            console.log({inGame: pubsub.games.inGame})

            if (playerKey === 'p1' && Boolean(game.p2)) {
              // if we're removing p1 but have a p2, switch em so we always have a p1
              // and make sure p1 is always ready
              let p2 = await Player
                .findOneAndUpdate(
                  { _id: game.p2.player.pId },
                  { $set: { ready: true }},
                  { new: true })
                .catch(err => console.log(err));

              await game.Game.findOneAndUpdate({_id: game._id}, { $set: { 
                [playerKey]: p2,
                p2: null
              }}).catch(err => console.log(err));

              game.p1 = game.p2;
              game.p1.ready = true;
              game.p2 = null;
            } else {
              game.Game.findOneAndUpdate({_id: game._id}, { $set: { [playerKey]: null } })
                .catch(err => console.log(err));
            }
          } else {
            throw `can't remove user from game with status: ${game.status}`;
          }
        }

        game.connections -= 1;
        
        pubsub.publish("gameEvent", game);
        pubsub.publishUserLoggedEvent(user, Boolean(pubsub.subscribers[user._id]));

        
      } else {
        throw `can't remove ${userClass} which is not in game`
      }
    }
  }

  game.endGame = endGame;
  game.initializeGame = initializeGame;
  game.addSpectator = user => handleAction("spectator", "add", user);
  game.removeSpectator = user => handleAction("spectator", "remove", user);
  game.addPlayer = user => handleAction("player", "add", user);
  game.removePlayer = user => handleAction("player", "remove", user);
}

module.exports = setupGame;
