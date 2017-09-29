/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  SECRET_KEY: process.env.SECRET_KEY || 'your-secret-goes-here',

  COOKIE_NAME: process.env.COOKIE_NAME || '_your_sess_name',
  COOKIE_MAX_AGE: 60 * 60 * 24 * 14, // 14 days

  DBURL: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  // Redis
  REDIS_TTL: process.env.REDIS_TTL || 260,
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,

  // Rtc websocket port
  WS_PORT: process.env.WS_PORT || 8181,

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  // Maps
  GMAPS_API_KEY: process.env.GMAPS_API_KEY || '',

  // Authentication
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '000000000000',
      secret:
        process.env.FACEBOOK_APP_SECRET || '0000000000010101101010101001010101',
      callback:
        process.env.FACEBOOK_CB_URL ||
        'http://localhost:3000/api/user/auth/facebook/callback',
    },
  },
};
