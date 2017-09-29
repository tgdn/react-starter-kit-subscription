/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { getUser, signInViaFacebook } from './data/controllers/user';
// import { User, UserLogin, UserClaim, UserProfile } from './data/models';

export default (app, config) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((u, done) => {
    const fooBar = async () => {
      // const user = await getUser(u.id);
      // done(null, user);
      done(new Error('Not implemented'));
    };

    fooBar().catch(done);
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: config.auth.facebook.id,
        clientSecret: config.auth.facebook.secret,
        callbackURL: config.auth.facebook.callback,
        profileFields: [
          'id',
          'first_name',
          'last_name',
          'email',
          'picture.width(100).height(100)',
          'gender',
          'link',
          'locale',
          'timezone',
          'verified',
          'education',
        ],
        passReqToCallback: true,
        enableProof: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        const fooBar = async () => {
          // const user = await signInViaFacebook(profile);
          // done(null, user);
          throw new Error('Not configured');
        };

        fooBar().catch(done);
      },
    ),
  );

  app.get(
    '/login/facebook',
    passport.authenticate('facebook', {
      authType: 'rerequest',
      scope: ['email', 'user_education_history'],
    }),
  );

  // signout user
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // callback route from Facebook
  app.get(
    '/api/user/auth/facebook/callback',
    passport.authenticate('facebook', {
      session: true,
      failureRedirect: '/signIn/failed',
    }),
    (req, res) => {
      res.redirect('/');
    },
    (err, req, res) => {
      if (req.user) {
        res.redirect('/');
      } else {
        res.status(400);
        res.send({
          error: {
            message: err.message,
          },
        });
      }
    },
  );
};
