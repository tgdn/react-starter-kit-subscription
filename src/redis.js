import redis from 'redis';
import bluebird from 'bluebird';
import expressSession from 'express-session';
import connectRedis from 'connect-redis';
import config from './config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({
  port: config.REDIS_PORT,
  host: config.REDIS_HOST,
});
client.on('error', err => {
  console.error(err);
  process.exit(1); // should exit now
});

const session = expressSession({
  store: new (connectRedis(expressSession))({
    client,
  }),
  resave: false,
  saveUninitialized: true,
  secret: config.SECRET_KEY,
  name: config.COOKIE_NAME,
  secure: !__DEV__,
  maxAge: config.COOKIE_MAX_AGE,
});

export { client, session };

export default app => {
  app.use(session);
};
