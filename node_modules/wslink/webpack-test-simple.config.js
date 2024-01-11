var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const entry = path.join(__dirname, './test/simple.js');

module.exports = {
  context: path.resolve(__dirname),
  entry,
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, '../tests/simple/www'),
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../tests/simple/www'),
  },
  module: {
    rules: [
      { test: entry, loader: 'expose-loader', options: { exposes: ['app']}  },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ]
};
