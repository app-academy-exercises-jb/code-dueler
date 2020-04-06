const mongoose = require('mongoose');
const { pubsub } = require('../../subscriptions');

const Message = mongoose.model('Message');

const typeDefs = `
  type Message {
    _id: ID!
    author: User
    body: String!
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
      return Message.find({});
    },
    message(_, { _id }) {
      return Message.findById(_id);
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
