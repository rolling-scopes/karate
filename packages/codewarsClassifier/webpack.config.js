'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: path.join(__dirname , '../../tsconfig.webpack.json'),
          transpileOnly: true
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CopyWebpackPlugin([
        { from: './key.pem', to: '.' },
    // new BabiliPlugin(),
    ])
  ]
};
