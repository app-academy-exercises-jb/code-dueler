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

// handleGames is a factory function to imbue pubsub with ease-of-use,
// game-related functions. The functions we define within it are 
// properly scoped to use pubsub publish methods.
const handleGames = (pubsub) => {
  const publishUserLoggedEvent = (user, loggedIn) => {
    setTimeout(() => {
      pubsub.publish("userLoggedEvent", {
        _id: user._id,
        loggedIn,
      });
    }, 100);
  };

  const updateSubscribers = (action, players, gameId) => {
    const game = pubsub.games[gameId];
    if (game === undefined || game.p1 === undefined || game.p2 === undefined) return;
    players.forEach((p) => {
      if (action === "add") {
        game.connections += 1;
        pubsub.subscribers[p._id].forEach((c) => (c.gameId = gameId));
      } else if (action === "remove") {
        game.connections -= 1;
        if (p._id === game.p1.player._id || p._id === game.p2.player._id) {
          // pubsub.games.inGame[_id] = false;
          console.log("ending game from subs")
          game.endGame(p);
        }
        delete pubsub.subscribers[p._id].gameId;
      }
    });
  };
  
  // setupGame is a factory function which imbues a newly created
  // game with useful functions.
  const setupGame = game => {
    const endGame = (player) => {
      const finishGame = () => {
        game.users = {};
        pubsub.games.inGame[game.p1.player._id] = false;
        pubsub.games.inGame[game.p1.player._id] = false;
        pubsub.publish("gameEvent", {
          ...game,
          status: "over",
        });
      };
      // this function should only be called by one of the two players
      if (player._id !== game.p1.player._id
        && player._id !== game.p2.player._id) return;

      setTimeout(() => {
        const{ p1, p2, spectators, gameId } = game;
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

    game.p1 = ensureUserDetail(game.p1);
    game.p2 = ensureUserDetail(game.p2);
    game.endGame = endGame;
    game.initializeGame = initializeGame;
  }

  const handleGame = ({ gameId, p1, p2 }) => {
    const game = {
      p1,
      p2,
      gameId,
      users: {
        [p1._id]: 1,
        [p2._id]: 1,
      },
      spectators: [],
      status: "initializing",
      connections: 0,
    };

    setupGame(game);
    pubsub.games[gameId] = game;
  };

  const handleInvite = (user, action, doc) => {
    if (action === "inviting") {
      let invitable = true, 
        result = {};
      
      if (doc.inviter._id === doc.invitee._id) {
        invitable = false;
        result = {
          status: "rejected",
          reason: "One-player mode coming soon :)"
        }
      } else if (pubsub.games.pendingInvites[user._id]) {
        invitable = false;
        result = {
          status: "rejected",
          reason: "That player's already been challenged by someone else!"
        }
      } else if (pubsub.games.inGame[user._id]) {
        invitable = false;
        result = {
          status: "rejected",
          reason: "That player's already in another game!"
        }
      } else {
        pubsub.games.pendingInvites[user._id] = true;
      }

      if (invitable) {
        pubsub.publish("invitationEvent", doc);
      } else {
        console.log("publishing rejection...")
        console.log({pending: pubsub.games.inGame})
        // don't forget to check for the following type of publish in the filter
        Object.assign(doc, result);
        pubsub.publish("invitationEvent", doc);
      }

    } else if (action === "accepted") {
      if (pubsub.games.inGame[user._id] !== true) {
        pubsub.games.pendingInvites[doc.invitee._id] = false;
        pubsub.publish("invitationEvent", doc);
      }
    } else if (action === "declined") {
      pubsub.games.pendingInvites[doc.invitee._id] = false;
      pubsub.publish("invitationEvent", doc);
    }
  };


  pubsub.handleGame = handleGame;
  pubsub.publishUserLoggedEvent = publishUserLoggedEvent;
  pubsub.updateSubscribers = updateSubscribers;
  pubsub.handleInvite = handleInvite;
  pubsub.subscribers = {};
  pubsub.games = {};
  pubsub.games.inGame = {};
  pubsub.games.pendingInvites = {};
}

module.exports = handleGames;
