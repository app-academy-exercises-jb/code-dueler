const _setupGame = require('./setup_game');

const gameUtil = pubsub => {
  // setupGame is a factory function which imbues a newly created
  // game with useful functions.
  const setupGame = _setupGame(pubsub);

  const handleGame = ({ gameId, p1, p2 }) => {
    const game = {
      p1,
      p2,
      gameId,
      users: {
        [p1._id]: 1,
        [p2._id]: 1,
      },
      spectators: {},
      status: "initializing",
      connections: 0,
    };

    setupGame(game);
    pubsub.games[gameId] = game;
  };


  pubsub.handleGame = handleGame;
}

module.exports = gameUtil;
