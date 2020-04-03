import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from 'apollo-link';
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { onError } from "apollo-link-error";
import { typeDefs, resolvers } from './resolvers';

const createClient = () => {
  const cache = new InMemoryCache({
      dataIdFromObject: object => object._id
  });
  const links = [];

  const errorLink = onError(({
      networkError,
      graphQLErrors
  }) => {
      if (graphQLErrors) {
          graphQLErrors.forEach(({
              message,
              locations,
              path,
              extensions
          }) => {
              console.group("\x1b[31m%s\x1b[0m", "[GraphQL error] ", "Message: ", message);
              console.log("Location: ", locations);
              console.log("Path: ", path);
              console.log("Extensions: ", extensions)
              console.groupEnd();
          });
      }
      if (networkError) console.log("\x1b[31m%s\x1b[0m", "[Network error]:", networkError);
  });
  const httpLink = new HttpLink({
      uri: 'http://localhost:5000/graphql',
      headers: {
          authorization: localStorage.getItem('token')
      }
  });

  const subscriptionClient = new SubscriptionClient('ws://localhost:5000/graphql', {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('token')
    }
  });
  const wsLink = new WebSocketLink(subscriptionClient);

  links.push(wsLink);
  links.push(httpLink);
  links.push(errorLink);

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from(links), 
    typeDefs,
    resolvers
  });

  return client;
};

export default createClient;
