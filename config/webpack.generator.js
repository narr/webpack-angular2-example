const helpers = require('./helpers');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const ENV = process.env.NODE_ENV = process.env.ENV = 'ng-html';
const IS_FOR_GITHUB_PAGE = helpers.hasProcessFlag('-my-ghp');
const BASE_URL = IS_FOR_GITHUB_PAGE ? '/webpack-angular2-example/' : '/';
const ROOT_PATH = helpers.root('src');
const ICON_PATH = /icon/;

module.exports = {
  context: ROOT_PATH,
  entry: './ng-html-generator',
  output: {
    publicPath: BASE_URL,
    path: helpers.root('temp/ng-html'),
    filename: 'generator.bundle.js'
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
      HMR: false,
      PROJECT_PATH: JSON.stringify(helpers.root()), // for ng-html
      BASE_URL: JSON.stringify(BASE_URL) // for ng-html
    })
  ],
  target: 'node',
  externals: [
    // https://github.com/liady/webpack-node-externals
    nodeExternals({})
  ],
};
