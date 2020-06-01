const setupGameServer = require("./game_server");
let pubsub;

if (process.env.DOCKERIZED === 'true') {
  console.log("redis pubsub initializing")
  const { RedisPubSub } = require('graphql-redis-subscriptions');
  pubsub = new RedisPubSub({
    connection: {
      host: process.env.REDIS_HOST,
      port: 6379
    }
  });
} else {
  console.log("in-memory pubsub initializing")
  const { PubSub } = require('graphql-subscriptions');
  pubsub = new PubSub();
}

setupGameServer(pubsub);

module.exports = { pubsub };
