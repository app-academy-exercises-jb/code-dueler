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
  { ApolloServer } = require('apollo-server-express');
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
  context: async ({ req }) => {
    return { user: req.user }
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

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe
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
