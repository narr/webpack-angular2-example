const helpers = require('./helpers');
const WebpackMd5Hash = require('webpack-md5-hash');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const ENTRY_ORDER = ['polyfills', 'vendor', 'main'];

module.exports = {
  metadata: {
    ENV: ENV
  },
  devtool: 'source-map',
  context: helpers.root('src'), // for entry and output path
  entry: {
    'polyfills': './polyfills.ts',
    'vendor': './vendor.ts',
    'main': './main.browser.ts'
  },
  output: {
    path: helpers.root('dist'),
    filename: 'js/[name].bundle.js?[chunkhash]',
    chunkFilename: 'js/[name].chunk.js?[chunkhash]'
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: helpers.root('src')
  },
  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loaders: ['tslint']
      }
    ],
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['css', 'postcss', 'sass']
      },
      {
        test: /\.(ico|jpe?g|png|gif|svg|json)$/i,
        loaders: [
          'file?name=[path][name].[ext]?[hash]'
        ]
      },
      {
        test: /\.html$/,
        exclude: [helpers.root('src/index.html')],
        loaders: ['raw']
      },
      {
        test: /\.ts$/,
        loaders: ['ts']
      }
    ]
  },
  postcss: () => [autoprefixer({ browsers: 'last 3 versions' })],
  tslint: {
    emitErrors: false,
    failOnHint: false
  },
  plugins: [
    new WebpackMd5Hash(),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      },
      'ENV': JSON.stringify(ENV),
      'HMR': false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: helpers.reverse(ENTRY_ORDER),
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // https://github.com/kangax/html-minifier#options-quick-reference
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true
      },
      template: helpers.root('src/index.html'),
      chunksSortMode: helpers.packageSort(ENTRY_ORDER)
    }),

    // https://github.com/webpack/docs/wiki/optimization#deduplication
    new webpack.optimize.DedupePlugin(),

    // https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // https://github.com/mishoo/UglifyJS2
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        keep_fnames: true
      },
      // beautify: true,
      // comments: false
      compress: {
        drop_console: true
      }
    })
    // function failOnError() {
    //   this.plugin('done', stats => {
    //     if (stats.compilation.errors && stats.compilation.errors.length) {
    //       // console.log(stats.compilation.errors);
    //       console.log(stats.compilation.errors[0].toString());
    //       process.exit(1);
    //     }
    //   });
    // }
  ]
};
