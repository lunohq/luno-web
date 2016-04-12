import _ from 'lodash';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  token: {
    secret: process.env.TOKEN_SECRET,
  },
  cookie: {
    key: process.env.COOKIE_KEY || 'atv1',
    maxAge: process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 24 * 365,
    secret: process.env.COOKIE_SECRET,
  },
  graphql: {
    port: 8000
  },
  slack: {
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
  },
};

export default _.merge(config, require(`./${config.env}`).default);
