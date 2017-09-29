import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import config from './config';

let pubsub; // eslint-disable-line

pubsub = new RedisPubSub({
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    retry_strategy: options => Math.max(options.attempt * 100, 3000),
  },
});

export default pubsub;
