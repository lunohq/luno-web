'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const base = require('./base')

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[chunkhash].js'),
]

const cdn = 'https://d21ennydsbmq0y.cloudfront.net'

const common = {
  entry: {
    app: [
      path.join(process.cwd(), 'client/index.js'),
    ],
    vendor: ['react', 'react-dom', 'react-relay', 'react-router', 'react-router-relay'],
  },
}

const development = {
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: path.resolve(process.cwd(), 'build/development'),
    publicPath: `${cdn}/development/`,
  },
  plugins: plugins.concat([
    new HtmlWebpackPlugin({
      title: 'Luno',
      template: './client/index.html',
      mobile: true,
      inject: true,
      favicon: './client/assets/favicon.ico',
    }),
    new webpack.DefinePlugin({
      __ENABLE_SENTRY__: true,
      __SENTRY_DSN__: JSON.stringify('https://0c2c66c2cd8b46f09fcfe7315fa57cd7@app.getsentry.com/61527'),
      __MIXPANEL_TOKEN__: JSON.stringify('9c41cd75afb094fdfa50e3e829f4bad3')
    }),
    new CopyWebpackPlugin([
      { from: 'client/.well-known', to: '.well-known' }
    ]),
  ]),
  scssLoaders: [
    'isomorphic-style-loader',
    `css-loader?${JSON.stringify({
      sourceMap: true,
      modules: true,
      localIdentName: '[name]_[local]_[hash:base64:3]',
      minimize: false,
    })}`,
    'postcss-loader?parser=postcss-scss'
  ],
}

const production = {
  output: {
    path: path.resolve(process.cwd(), 'build/production'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: `${cdn}/production/`,
  },
  plugins: plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Luno',
      template: 'client/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
      mobile: true,
      favicon: 'client/assets/favicon.ico'
    }),
    new webpack.DefinePlugin({
      __ENABLE_SENTRY__: true,
      __SENTRY_DSN__: JSON.stringify('https://e797ece0159c474ea264041392b714f7@app.getsentry.com/75750'),
      __MIXPANEL_TOKEN__: JSON.stringify('b339f301bbea524831d42bc9abc0fceb'),
    }),
  ]),
  scssLoaders: [
    'isomorphic-style-loader',
    `css-loader?${JSON.stringify({
      sourceMap: false,
      modules: true,
      localIdentName: '[hash:base64:3]',
      minimize: true,
    })}`,
    'postcss-loader?parser=postcss-scss'
  ],
}

const bundles = {
  development,
  production,
}

module.exports = (() => base(Object.assign({}, common, bundles[process.env.NODE_ENV])))()
