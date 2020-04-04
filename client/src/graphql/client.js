import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
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

  const httpLink = new HttpLink({
    uri: "http://localhost:5000/graphql",
  });

  const subscriptionClient = new SubscriptionClient('ws://localhost:5000/graphql', {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('token')
    },
    connectionCallback: err => {
      console.log(err)
    }
  });
  const wsLink = new WebSocketLink(subscriptionClient);

  links.push(
    authLink, //authLink must be first, as it sets necessary auth headers
    httpLink,
    errorLink,
    wsLink,
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

  if (localStorage.getItem("token")) {
    await client.query({ query: CURRENT_USER }).then(({ data }) => {
     
      if (!data || !data.me) client.resetStore();
    });
  }

  return client;
};

export default createClient;
