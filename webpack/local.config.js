'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      path.join(__dirname, '../client/index.js'),
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server'
    ],
    vendor: ['react', 'react-dom', 'react-relay', 'react-router', 'react-router-relay']
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js'
  },
  devtool: 'eval',
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
          sourceMap: true,
          modules: true,
          localIdentName: '[name]_[local]_[hash:base64:3]',
          minimize: false,
        })}`,
        'postcss-loader?parser=postcss-scss',
      ]
    }, {
      test: /\.(png|jpg|jpeg|ico|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000&name=assets/[hash].[ext]'
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Luno',
      template: './client/index.html',
      mobile: true,
      inject: false,
      favicon: './client/assets/favicon.ico'
    }),
    new webpack.DefinePlugin({
      __SENTRY_DSN__: JSON.stringify('https://f440b668d21b4853852a183f7ecd7710@app.getsentry.com/75742'),
      __MIXPANEL_TOKEN__: JSON.stringify('3aee37e9cb8f8f6afc3b52cd5a0c3457'),
    }),
  ],
  postcss(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
};

