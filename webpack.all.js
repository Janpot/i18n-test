const config = require('./webpack.config.js');

module.exports = env => ([
  'en',
  'nl'
].map(locale => config(Object.assign({ locale }, env))));
