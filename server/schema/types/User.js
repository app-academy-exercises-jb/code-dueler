const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const User = mongoose.model("User");

const typeDefs = `
  type User {
    _id: ID!
    username: String!
    loggedIn: Boolean
    inGame: Boolean
    inLobby: Boolean
  }
  extend type Query {
    me: User
    users: [User]
  }
  extend type Mutation {
    signup(username: String!, password: String!): UserCredentials!
    login(username: String!, password: String!): UserCredentials!
    logout: String!
  }
  extend type Subscription {
    userLoggedEvent: UserUpdate!
  }
  type UserCredentials {
    _id: ID!
    username: String!
    token: String
    loggedIn: Boolean
  }
  type UserUpdate {
    user: User!
  }
`;

const gameLobbyResolver = (pubsub, user) => {
  let game = pubsub.games[pubsub.games.inGame[user._id]],
    inGame = Boolean(pubsub.games.inGame[user._id]);

  user.inGame = inGame;
  user.inLobby = inGame && game && game.status === "initializing";
}

const resolvers = {
  Query: {
    me(_, __, { user: doc, pubsub,}) {
      // user provided by passport
      if (doc === undefined) return;

      let user = { 
        _id: doc._id.toString(),
        username: doc.username
      };
      
      gameLobbyResolver(pubsub, user);
      // console.log('fetching me:', {user});
      return user;
    },
    users: async (_, __, { pubsub }) => {
      if (!pubsub.subscribers) return [];
      return (await User.find({
        _id: { $in: Object.keys(pubsub.subscribers) },
      })).map(user => {
        user.loggedIn = true;
        gameLobbyResolver(pubsub, user);
        return user;
      });
    },
  },
  Mutation: {
    signup(_, { username, password }) {
      return User.signup(username, password);
    },
    login(_, { username, password }) {
      return User.login(username, password);
    },
    logout(_, __, { user, pubsub, ws}) {
      if (user._id !== ws.userId
          || pubsub.subscribers[user._id] === undefined
          || pubsub.subscribers[user._id].every(subWs =>
            subWs !== ws) ) {
        return "not ok";
      }

      console.log("logging out", user.username)
      setTimeout(() => {
        pubsub.logoutUser({user, ws});
      }, 0);
      return "ok";
    }
  },
  Subscription: {
    userLoggedEvent: {
      subscribe: (_, __, { pubsub }) => {
        console.log("subscribing to user events")
        return pubsub.asyncIterator("userLoggedEvent");
      },
      resolve: async (payload, _, { pubsub }) => {
        const user = await User.findById(payload);

        payload.user = {
          _id: payload._id,
          username: user.username,
          loggedIn: payload.loggedIn,
        };
        
        gameLobbyResolver(pubsub, payload.user);

        return payload;
      },
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
