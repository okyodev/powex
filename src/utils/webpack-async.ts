import path from "node:path";
import { Configuration, Stats, webpack } from "webpack";

const NODE_MODULES_PATH = path.resolve(__dirname, "../../node_modules");
process.env.NODE_PATH = NODE_MODULES_PATH;
require("module").Module._initPaths();

export const webpackAsync = async (configuration: Configuration) => {
  const _configuration: Configuration = {
    ...configuration,
    resolve: {
      ...configuration.resolve,
      modules: [NODE_MODULES_PATH, "node_modules"],
    },
    resolveLoader: {
      ...configuration.resolveLoader,
      modules: [NODE_MODULES_PATH, "node_modules"],
    },
  };
  const _webpack = webpack(_configuration);

  const result = await new Promise<Stats>((resolve, reject) => {
    _webpack.run((err, stats) => {
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

      return resolve(stats);
    });
  });

  return result;
};
