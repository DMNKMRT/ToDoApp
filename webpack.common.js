const webpack = require("webpack");
const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = (mode) => ({
  entry: ["./public/index.js", "./public/index.css"],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename:
      mode === "production"
        ? "[name].[contenthash:8].bundle.js"
        : "[name].bundle.js",
    chunkFilename:
      mode === "production" ? "[id].[contenthash:8].js" : "[id].js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename:
        mode === "production" ? "[name].[contenthash:8].css" : "[name].css",
      chunkFilename:
        mode === "production" ? "[id].[contenthash:8].css" : "[id].css",
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html.ejs",
      inject: "head",
      scriptLoading: "defer",
      title: process.env.TITLE || "ToDo-App",
      meta: {
        description: process.env.DESCRIPTION,
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CompressionPlugin({
      filename: "[path].br[query]",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
    }),
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 9 },
    }),
    new CompressionPlugin({
      filename: "[path].zz[query]",
      algorithm: "deflate",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 9 },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.woff2?$/,
        use: [
          {
            loader: "file-loader",
            options: { name: "[contenthash:8].[ext]" },
          },
        ],
      },
    ],
  },
});
