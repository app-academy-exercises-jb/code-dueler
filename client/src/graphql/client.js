import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from 'apollo-link';
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from "apollo-link-error";
import { CURRENT_USER } from "./queries";
import gql from "graphql-tag";
import { typeDefs, resolvers } from "./resolvers";
import { setContext } from "apollo-link-context";

const createClient = async () => {
  const cache = new InMemoryCache({ dataIdFromObject: (object) => object._id });

  const links = [];

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        console.group(
          "\x1b[31m%s\x1b[0m",
          "[GraphQL error] ",
          "Message: ",
          message
        );
        console.log("Location: ", locations);
        console.log("Path: ", path);
        console.log("Extensions: ", extensions);
        console.groupEnd();
      });
    }
    if (networkError)
      console.log("\x1b[31m%s\x1b[0m", "[Network error]:", networkError);
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: localStorage.getItem("token"),
      },
    };
  });

  let httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URI || "http://localhost:5000/graphql",
    credentials: 'same-origin',
  });

  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WS_URI || 'ws://localhost:5000/graphql',
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => ({
        authToken: localStorage.getItem('token')
      }),
    },
  });

  // this middleware captures the authorization header on behalf of
  // the SubscriptionServer's onOperation callback
  wsLink.subscriptionClient.use([
    {
      applyMiddleware(options, next) {
        const context = options.getContext();
        options.authorization = context.headers.authorization;
        next();
      }
    }
  ]);

  httpLink = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === 'OperationDefinition' && 
          (def.operation === 'subscription'
            || (def.operation === 'mutation' 
              && def.name.value !== 'LogIn'
              && def.name.value !== 'SignUp')
            || (def.operation === 'query' 
              && (def.name.value === "InGameInfo" 
                || def.name.value === "Messages"
                || def.name.value === "CurrentUser"))
          )
      )
    },
    wsLink,
    httpLink
  );

  links.push(
    authLink, // authLink must be first, as it sets necessary auth headers
    errorLink, // every object in this array must be an ApolloLink
    httpLink,
    );
  const link = links.reduce((acc,l) => acc.concat(l));

  const client = new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers,
  });

  if (process.env.NODE_ENV === "development") {
    window.client = client;
    window.gql = gql;
    window.CURRENT_USER = CURRENT_USER;
  }

  client.onResetStore(() => {
    localStorage.clear();
  });

  client.onClearStore(() => {
    localStorage.clear();
  });

  if (localStorage.getItem("token")) {
    await client.query({ query: CURRENT_USER }).then(({ data }) => {
     
      if (!data || !data.me) client.resetStore();
    });
  }

  client.subscriptionClient = wsLink.subscriptionClient;

  return client;
};

export default createClient;
