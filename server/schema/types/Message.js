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
        (_, __, context) => context.pubsub.asyncIterator("messageAdded"),
        (payload, _, { user, pubsub, ws }) => {
          if (ws.gameId === undefined && payload.channelId === "global") {
            return true;
          }

          const game = pubsub.games[payload.channelId];

          if (
            game &&
            game.gameId === ws.gameId &&
            (game.users[user._id] || game.spectators[user._id])
          ) {
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
