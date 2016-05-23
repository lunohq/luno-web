'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const base = require('./base')

const local = {
  // Use hot reloading in local development
  entry: {
    app: [
      path.join(process.cwd(), 'client/index.js'),
      'webpack-hot-middleware/client',
    ],
    vendor: ['react', 'react-dom', 'react-relay', 'react-router', 'react-router-relay'],
  },
  // Don't use hashes for better performance
  output: {
    filename: '[name].js',
  },
  scssLoaders: [
    'isomorphic-style-loader',
    `css-loader?${JSON.stringify({
      sourceMap: true,
      modules: true,
      localIdentName: '[name]_[local]_[hash:base64:3]',
      minimize: false,
    })}`,
    'postcss-loader?parser=postcss-scss',
  ],
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Luno',
      template: './client/index.html',
      mobile: true,
      inject: true,
      favicon: './client/assets/favicon.ico'
    }),
    new webpack.DefinePlugin({
      __SENTRY_DSN__: JSON.stringify('https://f440b668d21b4853852a183f7ecd7710@app.getsentry.com/75742'),
      __MIXPANEL_TOKEN__: JSON.stringify('3aee37e9cb8f8f6afc3b52cd5a0c3457'),
    }),
  ],
  devtool: 'eval',
}

module.exports = base(local)
