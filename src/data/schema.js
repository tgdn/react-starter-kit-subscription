import { makeExecutableSchema } from 'graphql-tools';
import { withFilter } from 'graphql-subscriptions';
// import findIndex from 'lodash/findIndex';

import PubSub from '../pubsub';
import rootSchema from './schema.graphql';

/* queries */
import messagesQuery from './queries/conversations';

/* mutations */
import { postMessageMutation } from './mutations/postMessage';

const rootResolvers = {
  // User: {
  //   email: (user, _, { user: currentUser }) =>
  //     currentUser && currentUser.id.toString() === user.id.toString()
  //       ? user.email
  //       : null,
  // },

  Query: {
    messages: messagesQuery,
  },

  Mutation: {
    postMessage: postMessageMutation,
  },

  Subscription: {
    messageCreated: {
      subscribe: () => PubSub.asyncIterator('messageCreated'),
      // Below handle filtering
      // subscribe: withFilter(
      //   () => PubSub.asyncIterator('messageCreated'),
      //   ({ messageCreated }, args, { user } = {}) => {
      //     if (user) {
      //       const index = findIndex(
      //         messageCreated.recipients,
      //         recipient => recipient.to.toString() === user.id.toString(), // am I part of the message?
      //       );
      //       return index !== -1;
      //     }
      //     throw new Error('User is not authenticated');
      //   },
      // ),
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: rootResolvers,
});

export default schema;
