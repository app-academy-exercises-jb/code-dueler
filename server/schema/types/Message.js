const mongoose = require('mongoose');
const Message = mongoose.model('Message');

const typeDefs = `
  scalar Date
  type Message {
    _id: ID!
    author: User
    body: String!
    createdAt: Date!
  }
  extend type Query {
    messages: [Message]
    message(_id: ID!): Message
  }
  extend type Mutation {
    addMessage(author: ID!, body: String!): MessageUpdateResponse!
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
    messages(_, __, context) {
      return Message.find({}).populate('author');
    },
    message(_, { _id }) {
      return Message.findById(_id).populate('author');
    }
  },
  Mutation: {
    addMessage(_, { author, body }, { user, pubsub }) {
      return Message.post(author, body, user, pubsub);
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (_, __, context) => {
        return context.pubsub.asyncIterator('messageAdded');
      },
      resolve: payload => {
        return payload;
      },
    },
  },
};

module.exports = {
  typeDefs,
  resolvers
};

// subscribe: withFilter(
//   (_, __, context) => context.pubsub.asyncIterator('messageAdded'),
//   (payload, _, {user, pubsub}) => {
//     if (payload.channelId === "global") return true;
//     const game = pubsub.games[payload.gameId];
//     if (game && (game.users[user._id] || game.spectators[user._id])) {
//       return true;
//     }
//     return false;
//   },
// ),