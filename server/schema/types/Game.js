const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const typeDefs = `
  extend type Mutation {
    spectateGame(player: ID!): String!
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
    p1: GameUser!
    p2: GameUser!
    spectators: [User]
    status: String!
    gameId: String!
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
  Mutation: {
    spectateGame: (_, { player: _id }, { user, pubsub, ws }) => {
      if (_id === undefined) return "not ok";

      if (pubsub.subscribers[_id] === undefined) return "not ok";

      const inGameWS = pubsub.subscribers[_id].findIndex(p => p.ws && p.ws.gameId);

      if (inGameWS === -1) return "not ok";

      const gameId = pubsub.subscribers[_id][inGameWS].ws.gameId;
      const game = pubsub.games[gameId];

      ws.gameId = gameId;
      pubsub.updateSubscribersGameId("add", [user], gameId);
      game.addSpectator(user);
      return gameId;
    },
    leaveGame: (_, {player: _id, gameId}, { user, pubsub, ws }) => {
      //please leave game.
      const game = pubsub.games[gameId];
      

      console.log("deleting game id");
      delete ws.gameId;
      pubsub.games.inGame[_id] = false;

      if (!game || 
        game.users[_id] === undefined || 
        user._id !== _id) return "ok";

      if (game.spectatorsKey[_id]) {
        game.removeSpectator({ _id });
      } else {
        game.endGame({_id});
      }

      game.connections -= 1;

      return "ok";
    },
    updateGameUserLastSubmitted: (_, input, { user, pubsub, ws }) => {
      const { player: _id, lastSubmittedResult, gameId } = input;

      const game = pubsub.games[gameId];
      game.status = "ongoing";
      
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
      return gameUser;
    },
    updateGameUserCurrentCode: (_, input, { user, pubsub, ws }) => {
      const { player: _id, gameId } = input;

      const game = pubsub.games[gameId];

      if (game === undefined) return false;

      game.status = "ongoing";

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
            console.log("found stale game")
            ws.gameId = gameId;
            pubsub.updateSubscribersGameId("add", [user], gameId);
          }

          const game = pubsub.games[ws.gameId];

          if (game.connections === 2 ) {
            game.initializeGame();
          }

          console.log("subscribing to game event")
          return pubsub.asyncIterator("gameEvent");
        },
        ({ p1, p2, gameId }, _, { user, pubsub, ws }) => {
          return (
            user._id === ws.userId &&
            (p1.player._id === user._id ||
            p2.player._id === user._id ||
            pubsub.games[gameId].spectatorsKey[user._id] !== undefined)
          );
        }
      ),
      resolve: payload => payload
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
