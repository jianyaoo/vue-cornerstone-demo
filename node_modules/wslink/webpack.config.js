var path = require('path');

module.exports = {
  context: path.resolve(__dirname),
  entry: ['./src/index.js'],
  output: {
    filename: 'wslink.js',
    path: path.resolve(__dirname, 'dist'),
    library: "wslink",
    libraryTarget: "umd"
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
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
};
