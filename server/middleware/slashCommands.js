import bodyParser from 'body-parser'

/**
 * Use botkit to setup slash commands.
 *
 * @param {Object} app express app
 * @param {Object} converse converse instance
 */
export default function (app, converse) {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  converse.createWebhookEndpoints(app)
}
