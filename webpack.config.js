const utils = require('./webpack/utils');

module.exports = [
  utils.createConfigForLocale('en'),
  utils.createConfigForLocale('nl')
];
