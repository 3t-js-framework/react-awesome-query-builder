var webpack = require("webpack");
var path = require("path");

module.exports = {
  devtool: "source-map",
  entry: "./index",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  resolveLoader: {
    modulesDirectories: ["node_modules"]
  },
  resolve: {
    extensions: ["", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.scss$/,
        loader: "style!css!sass"
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /^query-builder-lib/,
      function(data) {
        const suffix = data.request.substring(
          "query-builder-lib".length
        );
        data.request = path.resolve(__dirname, "../modules/" + suffix);
      }
    )
  ]
};
