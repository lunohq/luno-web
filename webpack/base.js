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
  plugins: options.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]),
  postcss(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
  resolve: {
    root: [
      path.resolve(process.cwd(), 'node_modules'),
    ],
    alias: {
      c: path.resolve(process.cwd(), 'client', 'components'),
      u: path.resolve(process.cwd(), 'client', 'utils'),
      m: path.resolve(process.cwd(), 'client', 'mutations'),
      s: path.resolve(process.cwd(), 'client', 'styles'),
      r: path.resolve(process.cwd(), 'client'),
    },
  },
  devtool: options.devtool,
  stats: false,
  progress: true,
})
