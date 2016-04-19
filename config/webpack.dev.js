const helpers = require('./helpers');
const WebpackMd5Hash = require('webpack-md5-hash');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('--hot');
const HASH = HMR ? 'hash' : 'chunkhash';
const md5Hash = HMR ? f => f : new WebpackMd5Hash();
const ENTRY_ORDER = ['polyfills', 'vendor', 'main'];
const BASE_URL = '/';

module.exports = {
  // custom data for index.html
  metadata: {
    ENV: ENV,
    baseUrl: BASE_URL
  },

  // http://webpack.github.io/docs/configuration.html#devtool
  // https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  devtool: 'source-map',

  // for entry and output path
  context: helpers.root('src'),

  entry: {
    'polyfills': './polyfills.ts',
    'vendor': './vendor.ts',
    'main': './main.browser.ts'
  },

  // http://webpack.github.io/docs/configuration.html#output
  output: {
    publicPath: BASE_URL,
    // Cannot use [chunkhash] for HMR
    filename: `js/[name].bundle.js?[${HASH}]`,
    chunkFilename: `js/[name].chunk.js?[${HASH}]`
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
      {
        test: /\.scss$/,
        include: [helpers.root('src/index.scss')],
        loader: ExtractTextPlugin.extract(['css?sourceMap', 'postcss', 'sass?sourceMap'])
      },
      // https://github.com/jtangelder/sass-loader
      // https://github.com/postcss/postcss-loader
      // https://github.com/webpack/css-loader
      {
        test: /\.scss$/,
        exclude: [helpers.root('src/index.scss')],
        loaders: ['css', 'postcss', 'sass'] // no need sourceMap
      },
      // https://github.com/webpack/file-loader
      {
        test: /\.(ico|jpe?g|png|gif|svg|json)$/i,
        loaders: [
          'file?name=[path][name].[ext]?[hash]'
        ]
      },
      {
        test: /\.(otf|woff|woff2|ttf|eot|svg)(\?.*?)?$/i,
        loaders: [
          'file?name=assets/font/[name].[ext]?[hash]'
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

    // https://github.com/webpack/extract-text-webpack-plugin
    new ExtractTextPlugin('css/[name].bundle.css?[contenthash]'),

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
