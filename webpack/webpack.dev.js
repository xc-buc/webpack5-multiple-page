const { default: merge } = require("webpack-merge")
const webpackCommon = require('./webpack.common')
const path = require('path')

module.exports = merge(webpackCommon, {
  mode: 'development',
  output: {
    filename: 'js/[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
  },
});

