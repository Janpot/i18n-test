const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function createConfigForLocale (locale) {
  const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body'
  });

  return merge(common, {
    output: {
      path: path.resolve(__dirname, `../dist/${locale}`)
    },
    resolve: {
      alias: {
        i18n: path.resolve(__dirname, `../client/locales/${locale}.json`)
      }
    },
    plugins: [
      HtmlWebpackPluginConfig
    ]
  });
}

module.exports = {
  createConfigForLocale
};
