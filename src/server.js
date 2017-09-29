import http from 'http';
// TODO implement HTTPS
import bluebird from 'bluebird';
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import createDataLoaders from 'data/dataloader';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import PrettyError from 'pretty-error';
import createApolloClient, { wsClient } from './core/createApolloClient';
import configureWebsocketClient from './core/configureWebsocketClient';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';

import { client } from './redis';
import router from './router';
import models from './data/models';
import schema from './data/schema';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import config from './config';

import expressConfig from './express';

// setup
global.Promise = bluebird;

const app = express();
const httpServer = http.createServer(app);

if (!__DEV__) {
  // TODO: setup
  // eslint-disable-next-line
  console.warn('\n\nYou must setup SSL/TLS before going into production\n\n');
}

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
expressConfig(app, config);

//
// Register API middleware
// -----------------------------------------------------------------------------
const graphqlMiddleware = graphqlExpress(request => ({
  schema,
  rootValue: { request },
  debug: __DEV__,
  context: {
    request,
    user: request.user,
    loaders: createDataLoaders(request),
  },
  formatError: error => {
    if (__DEV__) {
      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        path: error.path,
      };
    }
    return {
      message: error.message,
    };
  },
}));

app.use('/graphql', bodyParser.json(), graphqlMiddleware);

/* GraphiQL */
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
      context: {
        request: req,
        user: req.user,
        loaders: createDataLoaders(req),
      },
    });

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
      apolloClient,
    });

    const initialState = {
      user: req.user || null,
    };

    const store = configureStore(initialState, {
      cookie: req.headers.cookie,
      apolloClient,
      fetch,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
      history: null,
    });

    configureWebsocketClient(store, wsClient);

    // store.dispatch(
    //   setRuntimeVariable({
    //     name: 'initialNow',
    //     value: Date.now(),
    //   }),
    // );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
      // Apollo Client for use with react-apollo
      client: apolloClient,
    };

    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };

    const rootComponent = (
      <App context={context} store={store}>
        {route.component}
      </App>
    );
    await getDataFromTree(rootComponent);
    // this is here because of Apollo redux APOLLO_QUERY_STOP action
    await Promise.delay(0);
    data.children = await ReactDOM.renderToString(rootComponent);
    data.styles = [{ id: 'css', cssText: [...css].join('') }];

    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);

    // Furthermore invoked actions will be ignored, client will not receive them!
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Serializing store...');
    }
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    httpServer.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });

    // TODO: implement https
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  if (client.connected) {
    client.quit();
  }

  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
