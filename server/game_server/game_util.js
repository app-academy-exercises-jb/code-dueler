const _setupGame = require('./setup_game');

const gameUtil = pubsub => {
  // setupGame is a factory function which imbues a newly created
  // game with useful functions.
  const setupGame = _setupGame(pubsub);

  const handleGame = ({ gameId, p1, p2 }) => {
    setupGame(game);
    pubsub.games[gameId] = game;
  };

  const initGame = ({Game, game, user, ws, p1}) => {
    // setup useful in-memory variables to make find operations O(1)
    const details = {
      spectatorsKey: {},
      connections: 1,
      users: {
        [user._id]: ws,
      }
    };

    // the objects contained inside game have no setters, so we have to manually copy values
    // or mongoose objects are just weird -- idk?
    const inMemGame = {
      spectators: [],
      status: game.status,
      _id: game._id,
      p1: {
        lastSubmittedResult: '',
        charCount: 0,
        lineCount: 0,
        currentCode: '',
        player: user,
        ready: true,
      },
      Game,
    };

    // imbue in-memory game object with useful functions
    Object.assign(inMemGame, details);
    setupGame(inMemGame);

    // save a local copy of the game object
    pubsub.games[game._id] = inMemGame;

    // persist local list of inGame players, and their relevant games
    pubsub.games.inGame[user._id] = inMemGame._id.toString();

    // remember that this ws client object is inGame
    ws.gameId = inMemGame._id.toString();

    // tell everyone the user entered the lobby
    pubsub.publishUserLoggedEvent(user, true);
  }

  pubsub.initGame = initGame;
  pubsub.handleGame = handleGame;
}

module.exports = gameUtil;
