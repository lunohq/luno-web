if (process.env.NODE_ENV === 'local') {
  module.exports = require('./Root.dev')
} else {
  module.exports = require('./Root.prod')
}
