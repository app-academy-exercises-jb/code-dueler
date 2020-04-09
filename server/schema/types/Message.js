const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const { withFilter } = require("apollo-server-express");

const typeDefs = `
  scalar Date
  type Message {
    _id: ID!
    author: User
    body: String!
    createdAt: Date!
    channelId: String!
  }
  extend type Query {
    messages(channelId: String!): [Message]
    message(_id: ID!): Message
  }
  extend type Mutation {
    addMessage(author: ID!, body: String!, channelId: String): MessageUpdateResponse!
  }
  extend type Subscription {
    messageAdded: Message
  }
  type MessageUpdateResponse {
    success: Boolean!
    message: String
    messages: [Message]
  }
`;

const resolvers = {
  Query: {
    messages(_, { channelId }, context) {
      return Message.find({
        channelId,
      }).populate("author");
    },
    message(_, { _id }) {
      return Message.findById(_id).populate("author");
    },
  },
  Mutation: {
    addMessage(_, { author, body, channelId }, { user, pubsub }) {
      return Message.post({ author, body, user, channelId, pubsub });
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
<<<<<<< HEAD
        (_, __, context) => context.pubsub.asyncIterator("messageAdded"),
        (payload, _, { user, pubsub, ws }) => {
=======
        (_, __, context) => context.pubsub.asyncIterator('messageAdded'),
        (payload, _, {user, pubsub, ws}) => {

>>>>>>> ed078ea271ea64ce88aad6d69db9f3656a4e62dd
          if (ws.gameId === undefined && payload.channelId === "global") {
            return true;
          }

<<<<<<< HEAD
          const game = pubsub.games && pubsub.games[payload.channelId];

          if (
            game &&
            game.gameId === ws.gameId &&
            (game.p1._id === user._id ||
              game.p2._id === user._id ||
              game.spectators[user._id])
          ) {
=======
          const game = pubsub.games[payload.channelId];

          if (game && 
            game.gameId === ws.gameId && 
            (game.users[user._id] || game.spectators[user._id])) {
>>>>>>> ed078ea271ea64ce88aad6d69db9f3656a4e62dd
            return true;
          }
          return false;
        }
      ),
      resolve: (payload) => {
        console.log("resolving message payload");
        return payload;
      },
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
