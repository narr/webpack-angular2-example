const helpers = require('./helpers');
const rimraf = require('rimraf');
const Sprite = require('sprite-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const IS_FOR_GITHUB_PAGE = helpers.hasProcessFlag('-my-ghp');
const GITHUB_PAGE_PATH = '/webpack-angular2-example/';
const BASE_URL = IS_FOR_GITHUB_PAGE ? GITHUB_PAGE_PATH : '/';
const ROOT_PATH = helpers.root('src');

const INDEX_SCSS_PATH = helpers.root('src/index.scss');
const FONT_AWESOME_SCSS_PATH = helpers.root('node_modules/font-awesome/scss/font-awesome.scss');
const ENTRY_ORDER = ['polyfills', 'vendor', 'main'];

const OUTPUT_PATH = IS_FOR_GITHUB_PAGE ? helpers.root('gh-pages') : helpers.root('dist');
const INDEX_PATH = helpers.root('src/index.html');
const ICON_PATH = /icon/;
const SPRITE_SRC_PATH = helpers.root('src/assets/icon/sprite');
const SPRITE_TARGET_PATH = helpers.root('temp/icon/sprite');

rimraf.sync(helpers.root('temp'));
rimraf.sync(OUTPUT_PATH);

module.exports = {
  metadata: {
    ENV: ENV,
    baseUrl: BASE_URL
  },
  devtool: 'source-map',
  context: ROOT_PATH, // for entry and output path
  entry: {
    polyfills: [
      './polyfills.ts'
    ],
    vendor: [
      FONT_AWESOME_SCSS_PATH,
      './vendor.ts'
    ],
    main: [
      INDEX_SCSS_PATH,
      './main.browser.ts'
    ]
  },
  output: {
    publicPath: BASE_URL,
    path: OUTPUT_PATH,
    filename: 'js/[name].bundle.js?[chunkhash]',
    chunkFilename: 'js/[name].chunk.js?[chunkhash]'
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: ROOT_PATH
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
        include: [
          FONT_AWESOME_SCSS_PATH,
          INDEX_SCSS_PATH
        ],
        loader: ExtractTextPlugin.extract(['css?sourceMap', 'postcss', 'resolve-url', 'sass?sourceMap'])
      },
      {
        test: /\.scss$/,
        exclude: [
          FONT_AWESOME_SCSS_PATH,
          INDEX_SCSS_PATH
        ],
        loaders: ['css', 'postcss', 'sass']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: [
          ICON_PATH
        ],
        loaders: [
          'file?name=assets/icon/[name].[ext]?[hash]'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: [
          ICON_PATH,
          /node_modules\/font-awesome/
        ],
        loaders: [
          'file?name=assets/img/[name].[ext]?[hash]'
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
        exclude: [INDEX_PATH],
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
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(ENV),
        NODE_ENV: JSON.stringify(ENV)
      },
      ENV: JSON.stringify(ENV),
      HMR: false
    }),
    new ExtractTextPlugin('css/[name].bundle.css?[contenthash]'),
    new WebpackMd5Hash(),
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
      template: INDEX_PATH,
      chunksSortMode: helpers.packageSort(ENTRY_ORDER)
    }),
    new Sprite({
      source: SPRITE_SRC_PATH,
      imgPath: SPRITE_TARGET_PATH,
      cssPath: SPRITE_TARGET_PATH,
      prefix: 'ic',
      spriteName: 'ics',
      processor: 'scss',
      bundleMode: 'multiple'
    }),
    new CopyWebpackPlugin(
      [
        { from: '../temp/icon/sprite/*.png', to: 'assets/icon', flatten: true }
      ],
      {
        ignore: [
          '.DS_Store'
        ]
      }
    ),

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
