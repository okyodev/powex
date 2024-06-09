import { Configuration, Stats } from "webpack";
import { webpackAsync } from "../../utils/webpack-async";

import MiniCssExtractPlugin from "mini-css-extract-plugin";

interface GenerateOptionsBundle
  extends Pick<Configuration, "entry" | "output" | "target" | "plugins"> {}

export const generateBundle = (
  options: GenerateOptionsBundle
): Promise<Stats> => {
  // todo: use env or option to set
  // mode on development, also have differents
  // configs on http-equiv="Content-Security-Policy"
  // based on the mode.

  const stats = webpackAsync({
    entry: options.entry,
    output: options.output,
    target: options.target,
    plugins: [new MiniCssExtractPlugin(), ...(options?.plugins || [])],
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
    },
  });

  return stats;
};
