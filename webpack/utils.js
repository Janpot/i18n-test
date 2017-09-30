const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

function createConfigForLocale (locale) {
  return merge(common, {
    output: {
      path: path.resolve(__dirname, `../dist/${locale}`)
    },
    resolve: {
      alias: {
        i18n: path.resolve(__dirname, `../client/locales/${locale}.json`)
      }
    }
  });
}

module.exports = {
  createConfigForLocale
};
