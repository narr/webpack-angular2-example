const helpers = require('./helpers');
const WebpackMd5Hash = require('webpack-md5-hash');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('--hot');
const HASH = HMR ? 'hash' : 'chunkhash';
const md5Hash = HMR ? f => f : new WebpackMd5Hash();
const ENTRY_ORDER = ['polyfills', 'vendor', 'main'];

module.exports = {
  // custom data for index.html
  metadata: {
    ENV: ENV
  },

  // http://webpack.github.io/docs/configuration.html#devtool
  // https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  devtool: 'source-map',

  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'main': './src/main.browser.ts'
  },

  // http://webpack.github.io/docs/configuration.html#output
  output: {
    // Cannot use [chunkhash] for HMR
    filename: `[name].bundle.js?[${HASH}]`,
    chunkFilename: `[name].chunk.js?[${HASH}]`
  },

  // http://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: helpers.root('src')
  },

  // http://webpack.github.io/docs/configuration.html#module
  module: {
    preLoaders: [
      // https://github.com/wbuchwalter/tslint-loader
      {
        test: /\.ts$/,
        loaders: ['tslint']
      }
    ],
    loaders: [
      // https://github.com/jtangelder/sass-loader
      // https://github.com/postcss/postcss-loader
      // https://github.com/webpack/css-loader
      {
        test: /\.scss$/,
        loaders: ['css', 'postcss', 'sass']
      },
      // https://github.com/webpack/file-loader
      {
        test: /\.(ico|jpe?g|png|gif|svg|json)$/i,
        loaders: [
          'file?name=[name].[ext]?[hash]'
        ]
      },
      // https://github.com/webpack/raw-loader
      {
        test: /\.html$/,
        exclude: [helpers.root('src/index.html')],
        loaders: ['raw']
      },
      // https://github.com/TypeStrong/ts-loader
      {
        test: /\.ts$/,
        loaders: ['ts']
      }
    ]
  },
  postcss: () => [autoprefixer({ browsers: 'last 3 versions' })],

  plugins: [
    // https://www.npmjs.com/package/webpack-md5-hash
    // https://github.com/webpack/webpack/issues/1315
    md5Hash,

    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      },
      'ENV': JSON.stringify(ENV),
      'HMR': HMR
    }),

    // https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    // https://github.com/webpack/docs/wiki/optimization#multi-page-app
    new webpack.optimize.CommonsChunkPlugin({
      name: helpers.reverse(ENTRY_ORDER),
      minChunks: Infinity
    }),

    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: helpers.root('src/index.html'),
      chunksSortMode: helpers.packageSort(ENTRY_ORDER)
    })
  ]
};
