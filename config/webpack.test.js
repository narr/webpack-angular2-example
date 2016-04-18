const helpers = require('./helpers');
const webpack = require('webpack');
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = {
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
        loaders: ['css', 'sass']
      },
      {
        test: /\.(ico|jpe?g|png|gif|svg|json)$/i,
        loaders: [
          'file?name=[name].[ext]?[hash]'
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
    ],
    postLoaders: [
      // https://github.com/deepsweet/istanbul-instrumenter-loader
      {
        test: /\.ts$/,
        loaders: ['istanbul-instrumenter'],
        include: helpers.root('src'),
        exclude: [
          /\.(e2e|spec)\.ts$/
        ]
      }
    ]
  },
  tslint: {
    emitErrors: false,
    failOnHint: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      },
      'ENV': JSON.stringify(ENV),
      'HMR': false,
    }),
  ],
};
