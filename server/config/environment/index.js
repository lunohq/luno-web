import _ from 'lodash'

const config = {
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 3000,
  token: {
    secret: process.env.TOKEN_SECRET,
  },
  winston: {
    logger: {
      console: {
        level: process.env.WINSTON_LOGGER_CONSOLE_LEVEL || 'info',
        depth: parseInt(process.env.WINSTON_LOGGER_CONSOLE_DEPTH, 10) || 3,
        prettyPrint: parseInt(process.env.WINSTON_LOGGER_CONSOLE_PRETTY_PRINT, 10) === 1 || true,
      },
    },
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
    slashCommandToken: process.env.SLACK_SLASH_COMMAND_TOKEN,
  },
  ssl: process.env.FORCE_SSL || false,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  mixpanel: {
    token: process.env.MIXPANEL_TOKEN,
  },
  dashboardUrl: process.env.DASHBOARD_URL,
  features: {
    replies: parseInt(process.env.FEATURE_FLAGS_REPLIES, 10) === 1 || false,
  },
  files: {
    bucket: process.env.FILES_BUCKET,
    acl: process.env.FILES_ACL || 'bucket-owner-full-control',
    functionArn: process.env.FILES_FUNCTION_ARN || 'luno-upload-file',
  },
}

export default _.merge(config, require(`./${config.env}`).default)
