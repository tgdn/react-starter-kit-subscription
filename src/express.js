import path from 'path';
import express from 'express';
import passport from 'passport';
import compress from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';

import redisConfig from './redis';
import passportConfig from './passport';

export default (app, config) => {
  app.use(compress());

  if (__DEV__) {
    app.enable('trust proxy');
  }

  // data from html forms
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // read cookies (before sessions)
  app.use(cookieParser());

  // Sessions with Redis
  redisConfig(app, config);

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  // configure passport
  passportConfig(app, config);

  // static files
  app.use(express.static(path.resolve(__dirname, 'public')));
};
