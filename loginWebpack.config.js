const path = require('path');

module.exports = {
  entry: {
    'loginBundle.js': [
      path.join(__dirname, 'client/login/client.js'),
    ]
  },
  output: {
    filename: '[name]',
    path: path.join(__dirname, '/hosted'),
  },
  module:{
      rules:[{
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
      }]
  },
};