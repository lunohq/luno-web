'use strict'

const path = require('path')
const webpack = require('webpack')

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({
    path: path.resolve(process.cwd(), 'build'),
  }, options.output),
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loaders: options.scssLoaders,
    }, {
      test: /\.(png|jpg|jpeg|ico|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000&name=assets/[name].[hash].[ext]'
    }],
  },
  plugins: options.plugins,
  postcss(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
  devtool: options.devtool,
  stats: false,
  progress: true,
})