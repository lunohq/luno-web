'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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

module.exports = {
  entry: {
    app: [
      path.join(__dirname, '../client/index.js')
    ],
    vendor: ['react', 'react-dom', 'react-relay', 'react-router', 'react-router-relay']
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      loaders: [
        'isomorphic-style-loader',
        `css-loader?${JSON.stringify({
          sourceMap: false,
          modules: true,
          minimize: true,
          localIdentName: '[hash:base64:4]',
        })}`,
        'postcss-loader?parser=postcss-scss',
      ]
    }, {
      test: /\.(png|jpg|jpeg|ico|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000&name=assets/[hash].[ext]'
    }]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Luno',
      template: './client/index.html',
      mobile: true,
      inject: false,
      favicon: './client/assets/favicon.ico'
    }),
    new webpack.DefinePlugin({
      __SENTRY_DSN__: JSON.stringify(process.env.SENTRY_PUBLIC_DSN),
      __MIXPANEL_TOKEN__: JSON.stringify(process.env.MIXPANEL_TOKEN),
      'process.env': {
        // Useful to reduce the size of client-side libraries, eg. react
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new CopyWebpackPlugin([
      { from: '../client/.well-known', to: '.well-known' },
    ]),
  ],
  postcss(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
};

