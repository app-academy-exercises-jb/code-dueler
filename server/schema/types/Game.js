const mongoose = require("mongoose"),
  Queue = require("bull"),
  jobQueue = new Queue('code-review', process.env.REDIS_URI);
const { withFilter } = require("apollo-server-express");

const Game = mongoose.model('Game');

const typeDefs = `
  extend type Query {
    queryGameInfo(gameId: String!): GameInfoResponse!
    games: [GameLog]
  }
  extend type Mutation {
    hostGame(challenge: String!, language: String!): ID
    handleGame(gameId: String!, action: String!): String!
    joinGame(player: ID, gameId: ID): String!
    leaveGame(player: ID!, gameId: String!): String!
    kickPlayer(player: ID!, action: String!): String!
    updateGameUserCurrentCode(
      player: ID!,
      charCount: Int!,
      lineCount: Int!,
      currentCode: String!,
      gameId: String!
    ): GameUser!
    updateGameUserStatus(
      player: ID!,
      ready: Boolean!,
      gameId: ID!
    ): GameUser!
    submitCode(code: String!): String
  }
  extend type Subscription {
    gameEvent(gameId: String!): GameUpdate!
    gameLoggedEvent: GameLog!
  }
  type GameUpdate {
    _id: ID!
    p1: GameUser
    p2: GameUser
    spectators: [User]
    status: String!
    winner: String
    connections: Int
  }
  type GameUser {
    player: User!
    lastSubmittedResult: String
    charCount: Int
    lineCount: Int
    currentCode: String
    ready: Boolean
  }
  type GameInfoResponse {
    gameExists: Boolean!
    gameStatus: String
    isInGame: Boolean!
    isSpectator: Boolean!
    challenge: String
    body: String
    language: String
    fnName: String
    fnArgs: String
  }
  type GameLog {
    _id: ID!
    host: String!
    challenge: String!
    language: String!
    connections: Int!
    status: String!
  }
`;

const resolvers = {
  Query: {
    queryGameInfo: (_, { gameId }, { user, pubsub, ws }) => {
      let game = pubsub.games[gameId];
      let userInGame = Boolean(game && game.users[user._id]);

      return {
        gameExists: Boolean(game),
        gameStatus: (userInGame
          ? (game.users[user._id] === ws
            ? game.status
            : "wrong ws")
          : "not ok"),
        isInGame: Boolean(ws.gameId || pubsub.games.inGame[user._id]),
        isSpectator: Boolean(game && game.spectatorsKey[user._id]),
        challenge: game && game.challenge,
        body: game && game.challengeBody,
        language: game && game.language,
        fnName: game && game.fnName,
        fnArgs: game && game.fnArgs
      }
    },
    games: (_, __, { pubsub }) => {
      let games = Object.assign({}, pubsub.games);
      delete games.inGame;

      return Object.keys(games).map(g => {
        let game = pubsub.games[g];
        return {
          _id: game._id,
          host: (game.p1 && game.p1.player.username) || 'None',
          challenge: game.challenge || "FizzBuzz",
          language: game.language,
          connections: game.connections,
          status: game.status
        }
      })
    }
  },
  Mutation: {
    submitCode: async (_, { code }, { user, pubsub, ws }) => {
      let game = pubsub.games[ws.gameId];
      if (game === undefined
          || ws.processing === true
          || !game.isPlayer(user)) return "not ok";
      
      ws.processing = true;
      const submission = await jobQueue
        .add('submitCode', {
          code,
          challenge: game.challenge,
          language: game.language
        })
        .then(async job => {
          let j = await job
            .finished()
            .then(data => {            
              let player = game.getPlayer(user);
              if (player === "not ok") return player;

              if (data.passed === true) {
                game.status = "over";
                game.winner = player;
              }
              console.log({data});
              
              game.updateGameUser(user, {
                lastSubmittedResult: JSON.stringify(data)
              });      
              game.Game.findOneAndUpdate({_id: game._id}, { $set: { [player]: game[player] } })
                .catch(error => console.log("unable to update game:", {error}));
              ws.processing = false;
        
              return "ok";
            });
          return j;
        })
        .catch(err => {
          console.log("error processing job",{err});
          ws.processing = false;
          return "not ok";
        });

      return submission;
    },
    hostGame: (_, { challenge, language }, { user, pubsub, ws}) => {
      if (ws.userId !== user._id
          || !pubsub.subscribers[user._id]
          || Boolean(pubsub.games.inGame[user._id])) return null;

      return Game.start(challenge, language || 'javascript', user, ws, pubsub);
    },
    handleGame: (_, { gameId, action }, { user, pubsub, ws }) => {
      const game = pubsub.games[gameId];
      if (user.ws !== ws) {
        console.log('mismatched ws, exiting');
        return "not ok";
      }

      let inPlayers = !Boolean(game.spectatorsKey[user._id])
        && Boolean(game.users[user._id]),
        inSpectators = Boolean(game.spectatorsKey[user._id]);

      switch (action) {
        case "spectate":
          console.log("spectating game;")
          if (!inSpectators) game.addSpectator(user);
          if (inPlayers) game.removePlayer(user); 
          break;
        case "play":
          console.log("playing game");
          if (!inPlayers) game.addPlayer(user);
          if (inSpectators) game.removeSpectator(user);
          break;
        case "start":
          if (user._id !== (game.p1 && game.p1.player._id)
            || !Boolean(game.p2 && game.p2.ready) ) return "not ok";
          console.log("starting game");
          game.startGame();
          break;
        default:
          throw 'unknown action in handleGame';
      }

      ws.gameId = gameId;
      pubsub.games.inGame[user._id] = gameId;
      game.users[user._id] = ws;
      return "ok";
    },
    joinGame: async (_, { player: playerId, gameId }, { user, pubsub, ws }) => {
      if ((playerId === undefined && gameId === undefined)
        || pubsub.subscribers[user._id] === undefined) {
          console.log({playerId, gameId, subbed: Boolean(pubsub.subscribers[user._id])})
          return "not ok: ";
        }

      if (gameId === undefined) {
        // we're joining a game via reference to a player
        const inGameWS = pubsub.subscribers[playerId].findIndex(subWs => subWs.gameId);
        if (inGameWS === -1) return "not ok: referenced player not found in game";
        
        gameId = pubsub.subscribers[playerId][inGameWS].gameId;
      }
      
      const game = pubsub.games[gameId];
      
      if (game === undefined) return "not ok: game not found";
      if (game.status === "over") return "not ok: game over";
      if (Boolean(game.users[user._id])) return "not ok: duplicate user";
      if (Boolean(pubsub.games.inGame[user._id])) return `not ok: user already in game`;

      ws.gameId = gameId;

      console.log("joining game")
      if (!(Boolean(game.p1) && Boolean(game.p2))
        && !Boolean(game.users[user._id])) {
        await game.addPlayer(user);
      } else if (game.p1.player._id !== user._id
          && game.p2 && game.p2.player._id !== user._id) {
        await game.addSpectator(user);
      } else {
        console.log("didn't join, was already in game")
      }
      return gameId;
    },
    leaveGame: (_, {player: _id, gameId}, { user, pubsub, ws }) => {
      const game = pubsub.games[gameId];

      if (!game) return "not ok";

      console.log(`${user.username} leaving game`);
      delete ws.gameId;
      delete ws.p1;

      if (game.users[_id] === undefined || 
          user._id !== _id) {
        console.log({inGame: pubsub.games.inGame})
        console.log('not ok:', {game})
        return "not ok";
      }

      if (game.spectatorsKey[_id]) {
        console.log('removing self from spectators')
        game.removeSpectator(user);
      } else if ((game.p1 && game.p1.player._id === _id)
          || (game.p2 && game.p2.player._id === _id)) {
        console.log('removing self from players')
        game.removePlayer(user);
      }

      return "ok";
    },
    kickPlayer: (_, {player: _id, action}, {pubsub, ws, user}) => {
      const game = pubsub.games[ws.gameId];
      if (game === undefined
        || game.p1 && game.p1.player._id !== user._id
        || ws.userId !== user._id
        || _id === user._id
        || !Boolean(game.users[_id])) return "not ok";

      let username = game.users[_id].username;
      if (action === "boot") {
        Boolean(game.spectatorsKey[_id])
          ? game.removeSpectator({_id, username })
          : game.removePlayer({ _id, username });
        
      } else if (action === "spectate") {
        if (game.p2 && game.p2.player._id !== _id) return "not ok";
        game.addSpectator({_id, username });
        game.removePlayer({ _id, username });
      }
      
      return "ok";
    },
    updateGameUserCurrentCode: (_, input, { user, pubsub, ws }) => {
      const { player: _id, gameId } = input;
      const game = pubsub.games[gameId];

      if (game === undefined
        || _id !== user._id
        || ws.gameId !== gameId) return false;

      // these were only necessary to verify the input
      delete input.player, delete input.gameId;

      let playerKey = game.updateGameUser(user, input);

      return game[playerKey];
    },
    updateGameUserStatus: (_, { player: _id, ready, gameId }, {user, pubsub, ws}) => {
      const game = pubsub.games[gameId];

      if (game === undefined
          || _id !== user._id
          || ws.gameId !== gameId) {
        return false
      };

      let playerKey = game.updateGameUser(user, {
        ready
      });
      
      return game[playerKey];
    },
  },
  Subscription: {
    gameEvent: {
      subscribe: withFilter(
        (_, __, { pubsub, ws, user }, { variableValues: { gameId } }) => {
          let game = pubsub.games[ws.gameId];

          setTimeout(() => {
            pubsub.publish('gameEvent', game);
          }, 10);

          console.log("subscribing to game event")
          return pubsub.asyncIterator("gameEvent");
        },
        ({ _id }, _, { user, pubsub, ws }) => {
          return (
            _id === ws.gameId 
            && user._id === ws.userId
            && pubsub.games[_id].users[user._id] === ws
          );
        }
      ),
      resolve: payload => {
        return payload;
      }
    },
    gameLoggedEvent: {
      subscribe: (_,__,{pubsub}) => {
        return pubsub.asyncIterator("gameLoggedEvent")
      },
      resolve: (payload, _, { pubsub }) => {
        return payload;
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
