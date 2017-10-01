const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const context = path.resolve(__dirname, '.');

const babelrc = {
  presets: [
    ['env', { modules: false }],
    'react'
  ],
  cacheDirectory: true
};

module.exports = ({ production = false, locale = 'en' } = {}) => ({
  context,
  entry: './client/index.js',
  output: {
    path: path.resolve(context, `./dist/${locale}`),
    filename: 'index_bundle.js'
  },
  resolve: {
    alias: {
      i18n: path.resolve(context, `./client/locales/${locale}.json`)
    }
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: babelrc
      },
      {
        test: /\.json$/,
        include: path.resolve(context, './client/locales'),
        use: [{ loader: 'babel-loader', options: babelrc }, { loader: 'i18n' }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    ...(production ? [ new UglifyJSPlugin() ] : [])
  ],
  resolveLoader: {
    modules: ['node_modules', path.resolve(context, './loaders')]
  }
});
