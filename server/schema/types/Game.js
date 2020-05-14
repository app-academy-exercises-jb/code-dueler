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
      status: String!,
      gameId: String!
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
      return {
        gameExists: Boolean(pubsub.games[gameId]),
        gameStatus: pubsub.games[gameId] && pubsub.games[gameId].status,
        isInGame: Boolean(ws.gameId || pubsub.games.inGame[user._id]),
        isSpectator: Boolean(pubsub.games[gameId] && pubsub.games[gameId].spectatorsKey[user._id])
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
      ws.gameId = gameId;

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

      return "ok";
    },
    joinGame: (_, { player: playerId, gameId }, { user, pubsub, ws }) => {
      if ((playerId === undefined && gameId === undefined)
        || pubsub.subscribers[user._id] === undefined) return "not ok";
      
      if (gameId === undefined) {
        const inGameWS = pubsub.subscribers[playerId].findIndex(p => p.ws && p.ws.gameId);
        if (inGameWS === -1) return "not ok";

        gameId = pubsub.subscribers[playerId][inGameWS].ws.gameId;
      }

      const game = pubsub.games[gameId];
      ws.gameId = gameId;

      console.log("joining game")
      if (!(Boolean(game.p1) && Boolean(game.p2))) {
        game.addPlayer(user);
      } else {
        game.addSpectator(user);
      }
      return gameId;
    },
    leaveGame: (_, {player: _id, gameId}, { user, pubsub, ws }) => {
      const game = pubsub.games[gameId];

      console.log("leaving game");
      delete ws.gameId;
      delete ws.p1;
      pubsub.games.inGame[_id] = false;

      if (!game || 
        game.users[_id] === undefined || 
        user._id !== _id) {
          // console.log({game})
          // pubsub.publishUserLoggedEvent(spectator, Boolean(pubsub.subscribers[spectator._id]));
          console.log('not ok')
          return "not ok";
        }

      if (game.spectatorsKey[_id]) {
        game.removeSpectator({ _id });
      } else if ((game.p1 && game.p1.player._id === _id)
          || (game.p2 && game.p2.player._id === _id)) {
        game.removePlayer({ _id })
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
