const mongoose = require('mongoose');
const pubsub = require('../../subscriptions');

// console.log("pubusub:", pubsub)
// const Message = mongoose.model('Message');

// setTimeout(() => {
//   console.log("publishing")
//   pubsub.publish('messageAdded', "hello!")
// }, 7000);

const typeDefs = `
  type Message {
    _id: ID!
    body: String
  }
`;

const resolvers = {
  Subscription: {
    messageAdded: {
      resolve: (payload) => {
        console.log("payload: ", payload);
        return payload;
      },
      subscribe: () => {
        console.log("subbed");
        return pubsub.asyncIterator('messageAdded');
      }
    },
  }
};

const subscriptions = {
  messageAdded: {
    resolve: (payload) => {
      console.lod("payload: ", payload);
      return payload;
    },
    subscribe: ({ body }) => {
      console.log("subbed");
      return pubsub.asyncIterator('message_added');
    }
  }
};

module.exports = {
  typeDefs,
  resolvers,
  subscriptions
};
