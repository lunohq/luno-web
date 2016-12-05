if (process.env.NODE_ENV === 'local') {
  module.exports = require('./configureStore.dev.js')
} else {
  module.exports = require('./configureStore.prod.js')
}
