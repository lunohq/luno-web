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

const common = {
  entry: {
    app: [
      path.join(process.cwd(), 'client/index.js'),
    ],
    vendor: ['react', 'react-dom', 'react-relay', 'react-router', 'react-router-relay'],
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
}

const dev = {
  plugins: plugins.concat([
    new HtmlWebpackPlugin({
      title: 'Luno',
      template: './client/index.html',
      mobile: true,
      inject: true,
      favicon: './client/assets/favicon.ico'
    }),
    // TODO update these values
    new webpack.DefinePlugin({
      __SENTRY_DSN__: JSON.stringify('https://f440b668d21b4853852a183f7ecd7710@app.getsentry.com/75742'),
      __MIXPANEL_TOKEN__: JSON.stringify('3aee37e9cb8f8f6afc3b52cd5a0c3457'),
    }),
    new CopyWebpackPlugin([
      { from: 'client/.well-known', to: '.well-known' },
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

const prod = {
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
    // TODO update these values
    new webpack.DefinePlugin({
      __SENTRY_DSN__: JSON.stringify('https://f440b668d21b4853852a183f7ecd7710@app.getsentry.com/75742'),
      __MIXPANEL_TOKEN__: JSON.stringify('3aee37e9cb8f8f6afc3b52cd5a0c3457'),
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

module.exports = (() => {
  let bundle
  if (process.env.NODE_ENV === 'production') {
    bundle = prod
  } else {
    bundle = dev
  }
  return base(Object.assign({}, common, bundle))
})()
