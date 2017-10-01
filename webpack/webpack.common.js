const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const context = path.resolve(__dirname, '..');

module.exports = {
  context,
  entry: './client/index.js',
  output: {
    path: path.resolve(context, './dist/en'),
    filename: 'index_bundle.js'
  },
  resolve: {
    alias: {
      i18n: path.resolve(context, './client/locales/en.json')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.json$/,
        include: path.resolve(context, './client/locales'),
        use: [ { loader: 'babel-loader' }, { loader: 'i18n' } ]
      }
    ]
  },
  plugins: [
    // new UglifyJSPlugin(), // enable for tree-shaking
  ],
  resolveLoader: {
    modules: ['node_modules', path.resolve(context, './loaders')]
  }
};
