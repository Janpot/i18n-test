const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, '../dist/en'),
    filename: 'index_bundle.js'
  },
  resolve: {
    alias: {
      i18n: path.resolve(__dirname, '../client/locales/en.json')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.json$/,
        include: path.resolve(__dirname, '../client/locales'),
        use: [ { loader: 'babel-loader' }, { loader: 'i18n' } ]
      }
    ]
  },
  plugins: [
    // new UglifyJSPlugin(), // enable for tree-shaking
    HtmlWebpackPluginConfig
  ],
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../loaders')]
  }
};
