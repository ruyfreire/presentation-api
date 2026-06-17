import * as Sentry from '@sentry/nestjs'

Sentry.init({
  dsn: 'https://26376601cdf4bc90e0e861a91b853661@o4511582003134464.ingest.us.sentry.io/4511582606131200',
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
})
