import { resolve, join } from "node:path";
import {
  Stats,
  HotModuleReplacementPlugin,
  webpack,
  Compiler,
  Configuration,
  Chunk,
} from "webpack";

import { BundlerOptions } from "./bundler.types";
import { BUNDLER_HMR_CLIENT_ENTRY } from "./bundler.constants";

import { File } from "../file/file.module";
import { Project } from "../project/project.module";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";

export class Bundler {
  compiler: Compiler;
  project: Project;

  constructor(project: Project, options: BundlerOptions) {
    this.project = project;

    const isProduction = project.environment === "production";
    const modules = this.resolveModules();
    const entry = this.resolveEntries(options.entry);

    // add the HMR client to the entry
    const configuration: Configuration = {
      entry: entry,
      output: options.output,
      target: options.target,
      mode: isProduction ? "production" : "development",
      devtool: isProduction ? false : "cheap-module-source-map",
      plugins: [
        ...(!isProduction
          ? [new HotModuleReplacementPlugin(), new ReactRefreshPlugin()]
          : []),

        new MiniCssExtractPlugin(),
        ...(options.plugins || []),
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
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        modules: modules,
      },
      resolveLoader: {
        modules: modules,
      },
    };

    this.compiler = webpack(configuration);
  }

  resolveEntries(entry: BundlerOptions["entry"]): BundlerOptions["entry"] {
    let result: Record<string, string | string[]> = {};

    const isProduction = this.project.environment === "production";

    for (const keyEntry in entry) {
      result[keyEntry] = [
        ...(isProduction ? [] : [BUNDLER_HMR_CLIENT_ENTRY]),
        ...(Array.isArray(entry[keyEntry])
          ? entry[keyEntry]
          : [entry[keyEntry]]),
      ].flat();
    }

    return result;
  }

  resolveModules(): [string, "node_modules"] {
    const projectNodeModulesPath = join(this.project.path, "node_modules");
    const cliNodeModulesPath = resolve(__dirname, "../../../node_modules");

    const allNodeModulesPaths = [
      cliNodeModulesPath,
      projectNodeModulesPath,
    ].join(process.platform === "win32" ? ";" : ":");

    // Set the NODE_PATH environment variable
    process.env.NODE_PATH = allNodeModulesPaths;

    // Reload the node module paths
    require("module").Module._initPaths();
    return [cliNodeModulesPath, "node_modules"];
  }

  async run(): Promise<File[]> {
    try {
      const stats = await new Promise<Stats>((ok, reject) => {
        this.compiler.run((err, stats) => {
          if (err || stats?.hasErrors()) {
            console.log("A error happened, err", err);
            console.log("A error happened, STATS ", stats?.toJson().errors);

            return reject({
              err: err || null,
              stats: stats?.toJson().errors || null,
            });
          }

          if (stats === undefined) {
            return reject({
              err: null,
              stats: "Stats response not exist",
            });
          }

          return ok(stats);
        });
      });

      const chunks: Chunk[] = [...stats.compilation.chunks];
      const files: File[] = [];

      if (!stats.compilation.outputOptions.path) {
        return [];
      }

      for (const chunk of chunks) {
        for (const file of chunk.files) {
          files.push(
            new File(join(stats.compilation.outputOptions.path, file))
          );
        }
      }

      return files;
    } catch (error) {
      console.error("Error running the bundler", error);
      return [];
    }
  }

  server(): void {
    // Run the dev server
  }
}
