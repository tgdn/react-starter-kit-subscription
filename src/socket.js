import http from 'http';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import createDataLoaders from 'data/dataloader';
import config from './config';
import { client } from './redis';
import schema from './data/schema';

let server; // eslint-disable-line
const cookieKey = config.COOKIE_NAME;

if (!__DEV__) {
  console.warn('SETUP TLS FOR PRODUCTION IN WEBSOCKET'); // eslint-disable-line
}

if (!server) {
  server = http.createServer((req, res) => {
    res.writeHead(400);
    res.end();
  });

  server.listen(config.WS_PORT, () => {
    console.info(
      `Websocket server is running at http://localhost:${config.WS_PORT}/`,
    );

    SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        onOperation: async (msg, params, socket) =>
          new Promise(resolve => {
            const query = params.query;
            if (query && query.length > 2000) {
              throw new Error('Query too long');
            }

            /* get session and log user in */
            if (socket.upgradeReq) {
              let session = {};
              const cookies = cookie.parse(socket.upgradeReq.headers.cookie);
              const sessionID = cookieParser.signedCookie(
                cookies[cookieKey],
                config.SECRET_KEY,
              );

              const baseContext = {
                context: {
                  user: null,
                  loaders: createDataLoaders({}),
                },
              };

              const paramsWithFulfilledBaseContext = {
                ...params,
                ...baseContext,
              };

              // resolve early
              if (!sessionID) {
                resolve(paramsWithFulfilledBaseContext);
                return;
              }

              // get session from redis
              client.get(`sess:${sessionID}`, (err, sessionJSON) => {
                if (err) {
                  console.error(err);
                  throw new Error('Failed to fetch session from store');
                }
                if (sessionJSON) {
                  session = JSON.parse(sessionJSON);
                }
                const { passport: { user = null } = {} } = session;

                resolve({
                  ...paramsWithFulfilledBaseContext,
                  context: {
                    ...paramsWithFulfilledBaseContext.context,
                    user,
                  },
                });
              });
            }
          }),
      },
      {
        server,
        path: '/wgraphql',
      },
    );
  });
}

export default server;
