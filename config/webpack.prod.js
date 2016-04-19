const helpers = require('./helpers');
const rimraf = require('rimraf');
const WebpackMd5Hash = require('webpack-md5-hash');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const ENTRY_ORDER = ['polyfills', 'vendor', 'main'];
const IS_FOR_GITHUB_PAGE = helpers.hasProcessFlag('-my-ghp');
const GITHUB_PAGE_PATH = '/webpack-angular2-example/';
const BASE_URL = IS_FOR_GITHUB_PAGE ? GITHUB_PAGE_PATH : '/';
const OUTPUT_PATH = IS_FOR_GITHUB_PAGE ? helpers.root('gh-pages') : helpers.root('dist');

rimraf.sync(OUTPUT_PATH);

module.exports = {
  metadata: {
    ENV: ENV,
    baseUrl: BASE_URL
  },
  devtool: 'source-map',
  context: helpers.root('src'), // for entry and output path
  entry: {
    'polyfills': './polyfills.ts',
    'vendor': './vendor.ts',
    'main': './main.browser.ts'
  },
  output: {
    publicPath: BASE_URL,
    path: OUTPUT_PATH,
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
        include: [helpers.root('src/index.scss')],
        loader: ExtractTextPlugin.extract(['css?sourceMap', 'postcss', 'sass?sourceMap'])
      },
      {
        test: /\.scss$/,
        exclude: [helpers.root('src/index.scss')],
        loaders: ['css', 'postcss', 'sass']
      },
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
    new ExtractTextPlugin('css/[name].bundle.css?[contenthash]'),
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
