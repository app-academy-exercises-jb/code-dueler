const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

let http;
if (process.env.NODE_ENV === 'development') {
  http = require('http');
} else {
  http = require('https');
}

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
    updateGameUserLastSubmitted(
      player: ID!,
      lastSubmittedResult: String!,
      gameId: String!
    ): GameUser!
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
    challenge: String!
    body: String!
  }
  type GameLog {
    _id: ID!
    host: String!
    challenge: String!
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
        challenge: game.challenge,
        body: game.challengeBody
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
          connections: game.connections,
          status: game.status
        }
      })
    }
  },
  Mutation: {
    submitCode: (_, { code }, { user, pubsub, ws }) => {
      let game = pubsub.games[ws.gameId];
      if (game === undefined
          || ws.processing === true) return "not ok";
        
      let data = JSON.stringify({
          code,
          challenge: game.challenge,
          language: game.language
      });

      let req = http.request(process.env.CODE_JDG_URI, {
        method: 'POST',
        port: 5005,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
        }
      }, res => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            
            let player = game.p1.player._id === user._id ? "p1" : "p2";
            if (parsedData.passed === true) {
              game.status = "over";
              game.winner = player;
            }

            game.updateGameUser(user, {
              lastSubmittedResult: rawData
            });
            
            game.Game.findOneAndUpdate({_id: game._id}, { $set: { [player]: game[player] } })
              .catch(error => console.log("unable to update game:", {error}));

            ws.processing = false;

            return "ok";
          } catch (e) {
            console.error("error", e.message);
            return "not ok";
          }
        });

      }).on('error', e => {
        console.log("error in submit code:", {e});
        ws.processing = false;
      })

      console.log("hello")
      ws.processing = true;

      req.write(data);
      req.end();
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
    updateGameUserLastSubmitted: (_, input, { user, pubsub, ws }) => {
      // const { player: _id, lastSubmittedResult, gameId } = input;

      // const game = pubsub.games[gameId];
      
      // const player = getPlayerKey(game, user);

      // const parsedResult = JSON.parse(lastSubmittedResult);
      // if (parsedResult.passed === true) {
      //   game.status = "over";
      //   game.winner = player;
      // }
      
      // const [gameUser, publishGameUpdate] = generatePublishGameUpdate({
      //   pubsub, ws, gameId, player, _id, game, input, user
      // });
    
      // publishGameUpdate(gameUser);
      // game.Game.findOneAndUpdate({_id: game._id}, { $set: { [player]: gameUser } })
      //   .then(res => console.log("game updated"))
      //   .catch(error => console.log("unable to update game:", {error}));

      // return gameUser;
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
        ({ p1, p2, _id }, _, { user, pubsub, ws }) => {
          return (
            user._id === ws.userId &&
            ((p1 && p1.player._id === user._id) ||
            (p2 && p2.player._id === user._id) ||
            pubsub.games[_id].spectatorsKey[user._id] !== undefined)
          );
        }
      ),
      resolve: payload => {
        // console.log("gameEvent:", {payload});
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
