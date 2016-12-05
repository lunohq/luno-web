if (process.env.NODE_ENV === 'local') {
  require('./local')
} else {
  require('./release')
}
