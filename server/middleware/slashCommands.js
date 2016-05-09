import bodyParser from 'body-parser'

/**
 * Use botkit to setup slash commands.
 *
 * @param {Object} app express app
 * @param {Object} botkit botkit instance
 */
export default function (app, botkit) {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  botkit.createWebhookEndpoints(app)
}
