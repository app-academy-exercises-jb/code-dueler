const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  graphqlHTTP = require('express-graphql'),
  expressPlayground = require('graphql-playground-middleware-express').default,
  passport = require('passport'),
  morgan = require('morgan')
  cors = require('cors'),
  require ('./models'),
  { schema, resolvers } = require('./schema'),
  { graphqlLogger, passportAuthenticate } = require('./middlewares'),
  db = require('./config/keys').mongoURI;

require('./config/passport')(passport);
app.use(passport.initialize());

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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
  passportAuthenticate(passport),
  graphqlLogger(true),
  graphqlHTTP({
    schema,
    rootValue: resolvers
  })
);

app.get('/playground', expressPlayground({ endpoint: "/graphql" }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
