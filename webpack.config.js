'use strict';

const path = require('path');
const webpack = require('webpack');
const decompress = require('decompress');
const nodeExternals = require('webpack-node-externals');
const BabiliPlugin = require('babili-webpack-plugin');

const chromeTarball = path.join(__dirname, 'chrome/chrome-headless-lambda-linux-x64.tar.gz');
const webpackDir = path.join(__dirname, '.webpack');

function ExtractTarballPlugin (archive, to) {
  return {
    apply: (compiler) => {
      compiler.plugin('emit', (compilation, callback) => {
        decompress(path.resolve(archive), path.resolve(to))
          .then(() => callback())
          .catch(error => console.error('Unable to extract archive ', archive, to, error.stack))
      });
    },
  };
}

module.exports = {
  entry: './src/index.ts',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: 'index.js'
  },
  target: 'node',
  externals: [nodeExternals({
    whitelist: ['bluebird']
  })],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
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
    // new BabiliPlugin(),
    new ExtractTarballPlugin(chromeTarball, webpackDir),
  ]
};
