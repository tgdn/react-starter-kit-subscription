import ApolloClient, { createNetworkInterface } from 'apollo-client';
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    // Additional fetch options like `credentials` or `headers`
    credentials: 'include',
  },
});

const wsClient = new SubscriptionClient(`ws://localhost:8181/wgraphql`, {
  reconnect: true,
  connectionParams: {},
});

export { wsClient };

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  queryDeduplication: true,
  reduxRootSelector: state => state.apollo,
});

export default function createApolloClient() {
  return client;
}
