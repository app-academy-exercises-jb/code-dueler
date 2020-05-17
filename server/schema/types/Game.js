const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const Game = mongoose.model('Game');

const typeDefs = `
  extend type Query {
    queryGameInfo(gameId: String!): GameInfoResponse!
  }
  extend type Mutation {
    hostGame(challenge: String!): ID
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
  }
  extend type Subscription {
    gameEvent(gameId: String!): GameUpdate!
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
  }
`;

const getPlayer = (game, user) => {
  if (game.p1.player._id === user._id) {
    return "p1";
  } else if (game.p2.player._id === user._id) {
    return "p2";
  }
};

const generatePublishGameUpdate = ({pubsub, ws, gameId, player, _id, game, input, user}) => {
  const gameUser = Object.assign(
    {...game[player]},
    { ...input },
    {player: user}
  ),
  publishGameUpdate = gameUser => {
    if (ws.gameId === gameId && player !== undefined && _id === ws.userId) {
      Object.assign(game, { [player]: { ...gameUser } });
      pubsub.publish("gameEvent", game);
    }
  };

  return [gameUser, publishGameUpdate];
}

const resolvers = {
  Query: {
    queryGameInfo: (_, { gameId }, { user, pubsub, ws }) => {
      let game = pubsub.games[gameId];


      let userInGame = Boolean(game && game.users[user._id]);
      // console.log({userInGame: game && game.users[user._id]})
      console.log({isOk: game && game.users[user._id] === ws })

      return {
        gameExists: Boolean(game),
        gameStatus: (userInGame
          ? (game.users[user._id] === ws
            ? game.status
            : "wrong ws")
          : "not ok"),
        isInGame: Boolean(ws.gameId || pubsub.games.inGame[user._id]),
        isSpectator: Boolean(game && game.spectatorsKey[user._id])
      }
    }
  },
  Mutation: {
    hostGame: (_, { challenge }, { user, pubsub, ws}) => {
      if (ws.userId !== user._id
          || !pubsub.subscribers[user._id]) return null;

      return Game.start(challenge, user, ws, pubsub);
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

      
      if (action === "spectate") {
        console.log("spectating game")
        if (!inSpectators) game.addSpectator(user);
        if (inPlayers) game.removePlayer(user); 
      } else if (action === "play") {
        console.log("playing game")
        if (!inPlayers) game.addPlayer(user);
        if (inSpectators) game.removeSpectator(user);
      } else {
        throw 'unknown action in handleGame'
      }

      ws.gameId = gameId;
      pubsub.games.inGame[user._id] = gameId;
      game.users[user._id] = ws;
      console.log({gameState: game, inGame: pubsub.games.inGame})
      return "ok";
    },
    joinGame: async (_, { player: playerId, gameId }, { user, pubsub, ws }) => {
      if ((playerId === undefined && gameId === undefined)
        || pubsub.subscribers[user._id] === undefined) return "not ok: ";

      if (gameId === undefined) {
        // we're joining a game via reference to a player
        const inGameWS = pubsub.subscribers[playerId].findIndex(subWs => subWs.gameId);
        if (inGameWS === -1) return "not ok: referenced player not found in game";
        
        gameId = pubsub.subscribers[playerId][inGameWS].gameId;
      }
      
      const game = pubsub.games[gameId];
      
      if (game === undefined) return "not ok: game not found";
      if (Boolean(game.users[user._id])) return "not ok: duplicate user";
      
      
      ws.gameId = gameId;

      console.log("joining game")
      if (!(Boolean(game.p1) && Boolean(game.p2))
        && !Boolean(game.spectatorsKey[user._id])) {
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

      console.log("leaving game");
      delete ws.gameId;
      delete ws.p1;

      if (game.users[_id] === undefined || 
          user._id !== _id) {
        console.log('not ok:', {game})
        return "not ok";
      }

      if (game.spectatorsKey[_id]) {
        console.log('removing self from spectators')
        game.removeSpectator({ _id });
      } else if ((game.p1 && game.p1.player._id === _id)
          || (game.p2 && game.p2.player._id === _id)) {
        console.log('removing self from players')
        game.removePlayer({ _id })
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

      if (action === "boot") {
        Boolean(game.spectatorsKey[_id])
          ? game.removeSpectator({_id})
          : game.removePlayer({_id});
        
      } else if (action === "spectate") {
        if (game.p2 && game.p2.player._id !== _id) return "not ok";
        game.addSpectator({_id});
        game.removePlayer({_id});
      }
      
      return "ok";
    },
    updateGameUserLastSubmitted: (_, input, { user, pubsub, ws }) => {
      const { player: _id, lastSubmittedResult, gameId } = input;

      const game = pubsub.games[gameId];
      
      const player = getPlayer(game, user);

      const parsedResult = JSON.parse(lastSubmittedResult);
      if (parsedResult.passed === true) {
        game.status = "over";
        game.winner = player;
      }
      
      const [gameUser, publishGameUpdate] = generatePublishGameUpdate({
        pubsub, ws, gameId, player, _id, game, input, user
      });
    
      publishGameUpdate(gameUser);
      game.Game.findOneAndUpdate({_id: game._id}, { $set: { [player]: gameUser } })
        .then(res => console.log("game updated"))
        .catch(error => console.log("unable to update game:", {error}));

      return gameUser;
    },
    updateGameUserCurrentCode: (_, input, { user, pubsub, ws }) => {
      const { player: _id, gameId } = input;

      const game = pubsub.games[gameId];

      if (game === undefined) return false;

      game.status = "started";

      const player = getPlayer(game, user);

      const [gameUser, publishGameUpdate] = generatePublishGameUpdate({
        pubsub, ws, gameId, player, _id, game, input, user
      });

      publishGameUpdate(gameUser);
      return gameUser;
    },
    updateGameUserStatus: (_, { player: _id, ready, gameId }, {user, pubsub, ws}) => {
      const game = pubsub.games[gameId];

      if (game === undefined) return false;

      const player = getPlayer(game, user);

      const [gameUser, publishGameUpdate] = generatePublishGameUpdate({
        pubsub, ws, gameId, player, _id, game, input: { ready }, user
      });

      publishGameUpdate(gameUser);
      return gameUser;
    },
  },
  Subscription: {
    gameEvent: {
      subscribe: withFilter(
        (_, __, { pubsub, ws, user }, { variableValues: { gameId } }) => {
          if (ws.gameId === undefined && user._id === ws.userId) {
            // reconnected to a stale game, update subscribers
            ws.gameId = gameId;
          }
          
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
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
