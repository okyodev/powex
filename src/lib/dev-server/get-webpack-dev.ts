import path from "node:path";
import { HotModuleReplacementPlugin, Configuration, webpack } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { WebpackDevConfig } from "../../interfaces/dev.interfaces";

export const getWebpackDev = (config: WebpackDevConfig) => {
  const projectNodeModulesPath = path.resolve(process.cwd(), "node_modules");
  const cliNodeModulesPath = path.resolve(__dirname, "../../../node_modules");

  const allNodeModulesPaths = [cliNodeModulesPath, projectNodeModulesPath].join(
    process.platform === "win32" ? ";" : ":"
  );

  process.env.NODE_PATH = allNodeModulesPaths;
  require("module").Module._initPaths();

  const webpackConfiguration: Configuration = {
    entry: config.entry,
    output: config.output,
    mode: "development",
    devtool: "cheap-module-source-map",
    plugins: [
      new HotModuleReplacementPlugin(),
      new ReactRefreshPlugin(),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /.[tj]sx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-proposal-class-properties"],
            presets: [
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
              "@babel/preset-typescript",
            ],
          },
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
          exclude: /node_modules/,
        },
        {
          test: /\.jpe?g|png$/,
          exclude: /node_modules/,
          type: "asset/resource",
        },
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".jsx", "..."],
      modules: [cliNodeModulesPath, "node_modules"],
    },
    resolveLoader: {
      modules: [cliNodeModulesPath, "node_modules"],
    },
  };

  return webpack(webpackConfiguration);
};
