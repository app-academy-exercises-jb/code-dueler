const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  graphqlHTTP = require("express-graphql"),
  expressPlayground = require("graphql-playground-middleware-express").default,
  passport = require("passport"),
  jwt = require("jsonwebtoken"),
  morgan = require("morgan"),
  cors = require("cors"),
  { SubscriptionServer } = require("subscriptions-transport-ws"),
  { execute, subscribe } = require("graphql"),
  { ApolloServer } = require("apollo-server-express"),
  { pubsub } = require("./subscriptions");
require("dotenv").config();
require("./models");

const { schema, resolvers, typeDefs } = require("./schema"),
  { graphqlLogger, passportAuthenticate } = require("./middlewares"),
  mongoURI = process.env.MONGO_URI,
  http = require("http"),
  https = require("https"),
  fs = require("fs");

require("./config/passport")(passport);
app.use(passport.initialize());

const server = new ApolloServer({
  resolvers,
  typeDefs,
  schema,
  context: ({ req }) => {
    return {
      user: req.user,
      pubsub,
    };
  },
});

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.log(`Could not connect to MongoDB: ${err}`));

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:3000" }));
} else if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.PRODUCTION_URI }));
}

app.use(morgan("dev"));

app.use("/graphql", passportAuthenticate(passport));

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: false,
});

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static("../client/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    );
  });
}

const port = process.env.PORT || 5000;

app.listen = function () {
  let server;

  if (process.env.NODE_ENV === "production") {
    server = https.createServer(
      {
        key: fs.readFileSync(
          "/etc/letsencrypt/live/jorgebarreto.dev/privkey.pem"
        ),
        cert: fs.readFileSync(
          "/etc/letsencrypt/live/jorgebarreto.dev/fullchain.pem"
        ),
      },
      this
    );
  } else {
    server = http.createServer(this);
  }
  

  new SubscriptionServer(
    {
      schema,
      execute,
      subscribe,
      keepAlive: 29000,
      onOperation: (message, params, ws) => {
        return { ...params, test: "test" };
      },
      onConnect: (connectionParams, ws, context) => {
        // console.log("connecting:", pubsub.subscribers)
        // the following line should actually verify that the user passport found
        // is the same as found in connectionParams.authToken
        if (!connectionParams.authToken) {
          console.log("connection refused");
          return false;
        } else {
          const user = jwt.verify(
            connectionParams.authToken.replace("Bearer ", ""),
            process.env.SECRET_OR_KEY
          );

          if (!user._id) return false;
          console.log(`${user._id} connected to the websocket`);
          user.ws = ws;
          // mark the socket object with the appropriate ID so we can remove it on DC
          ws.userId = user._id;

          // save connections to keep track of online users
          // we access pubsub from the resolvers
          if (pubsub.subscribers[user._id] === undefined) {
            pubsub.subscribers[user._id] = [user];
            pubsub.publishUserLoggedEvent(user, true);
          } else {
            pubsub.subscribers[user._id].push(user);
          }
          

          return {
            pubsub,
            user,
            ws,
          };
        }
      },
      onDisconnect: (ws, context) => {
        if (ws.userId === undefined) return;
        // console.log("disconnecting:", pubsub.subscribers)
        console.log(`${ws.userId} disconnected from the websocket`);

        const userIdx = pubsub.subscribers[ws.userId].findIndex(
          (s) => s.ws === ws
        );
        const user = pubsub.subscribers[ws.userId][userIdx];

        pubsub.subscribers[ws.userId].splice(userIdx, 1);

        if (user.ws.gameId) {
          pubsub.updateSubscribers("remove", [user], user.ws.gameId);
        }

        if (pubsub.subscribers[ws.userId].length === 0) {
          delete pubsub.subscribers[ws.userId];
          pubsub.publishUserLoggedEvent(user, false);
        }
      },
    },
    {
      server,
      path: "/graphql",
    }
  );

  return server.listen.apply(server, arguments);
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
