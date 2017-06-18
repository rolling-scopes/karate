'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: 'handler.js'
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
            configFileName: 'tsconfig.webpack.json'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.IgnorePlugin(/\.(css|html|json|md|txt)$/),
    new BabiliPlugin(),
  ]
};
