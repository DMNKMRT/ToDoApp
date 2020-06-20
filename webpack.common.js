const webpack = require("webpack");
const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
      mode === "production" ? "[id].[contenthash:8].chunk.js" : "[id].chunk.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename:
        mode === "production"
          ? "[name].[contenthash:8].bundle.css"
          : "[name].bundle.css",
      chunkFilename:
        mode === "production"
          ? "[id].[contenthash:8].chunk.css"
          : "[id].chunk.css",
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
    new CopyWebpackPlugin({
      patterns: [{ context: "public/", from: "static/*", flatten: true }],
    }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(process.env.API_URL),
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
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: mode !== "production",
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: mode !== "production",
            },
          },
          {
            loader: "css-loader",
            options: { modules: true },
          },
        ],
      },
    ],
  },
});
