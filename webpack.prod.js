const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const common = require("./webpack.common.js");

module.exports = () =>
  merge(common("production"), {
    mode: "production",
    devtool: "source-map",
  });
