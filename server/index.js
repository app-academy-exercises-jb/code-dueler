const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  graphqlHTTP = require('express-graphql'),
  expressPlayground = require('graphql-playground-middleware-express').default,
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  morgan = require('morgan'),
  cors = require('cors'),
  { SubscriptionServer } = require('subscriptions-transport-ws'),
  { execute, subscribe } = require('graphql'),
  { ApolloServer } = require('apollo-server-express'),
  { pubsub } = require('./subscriptions');
  require('dotenv').config();
  require ('./models');

const { schema, resolvers, typeDefs } = require('./schema'),
  { graphqlLogger, passportAuthenticate } = require('./middlewares'),
  mongoURI = process.env.MONGO_URI,
  http = require('http');
  
require('./config/passport')(passport);
app.use(passport.initialize());

const server = new ApolloServer({
  resolvers,
  typeDefs,
  schema,
  context: ({ req }) => {
    return {
      user: req.user, 
      pubsub
    }
  }
});

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log("Connected to MongoDb"))
  .catch(err => console.log(`Could not connect to MongoDB: ${err}`));

if (process.env.NODE_ENV !== 'production')  {
  app.use(cors({ origin: 'http://localhost:3000' }));
} else if (process.env.NODE_ENV === 'production')  {
  app.use(cors({ origin: process.env.PRODUCTION_URI }));
}

app.use(morgan("dev"));

app.use(
  "/graphql",
  passportAuthenticate(passport)
);

server.applyMiddleware({ 
  app,
  path: "/graphql",
  cors: false
});

app.get('/playground', expressPlayground({ endpoint: "/graphql" }));

const port = process.env.PORT || 5000;

app.listen = function() {
  const server = http.createServer(this);

  new SubscriptionServer(
    {
      schema,
      execute,
      subscribe,
      keepAlive: 29000,
      onConnect: (connectionParams, ws, context) => {
        // the following line should actually verify that the user passport found
        // is the same as found in connectionParams.authToken
        if (!connectionParams.authToken) {
          return false;
        } else {
          const user = jwt.verify(
            connectionParams.authToken.replace('Bearer ', ''),
            process.env.SECRET_OR_KEY
          );

          console.log(`${user._id} connected to the websocket`);

          // save connections to keep track of online users
          // we access pubsub from the resolvers
          if (pubsub.subscribers === undefined) {
            pubsub.subscribers = {
              [user._id]: user
            }
          } else {
            if (pubsub.subscribers[user._id] === undefined) {
              pubsub.subscribers[user._id] = user;

              pubsub.publish('userLoggedEvent', {
                _id: user._id,
                loggedIn: true
              });
            }
          }
          // mark the socket object with the appropriate ID so we can remove it on DC
          ws.userId = user._id;

          return {
            pubsub
          }
        }
      },
      onDisconnect: (ws, context) => {
        console.log(`${ws.userId} disconnected from the websocket`);
        delete pubsub.subscribers[ws.userId];
        pubsub.publish('userLoggedEvent', {
          _id: ws.userId,
          loggedIn: false
        });
      },
    },
    {
      server,
      path: '/graphql'
    }
  );

  return server.listen.apply(server, arguments);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
