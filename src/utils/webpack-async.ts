import path from "node:path";
import { Configuration, Stats, webpack } from "webpack";

export const webpackAsync = async (configuration: Configuration) => {
  const projectNodeModulesPath = path.resolve(process.cwd(), "node_modules");
  const cliNodeModulesPath = path.resolve(__dirname, "../../node_modules");

  const allNodeModulesPaths = [cliNodeModulesPath, projectNodeModulesPath].join(
    process.platform === "win32" ? ";" : ":"
  );

  process.env.NODE_PATH = allNodeModulesPaths;

  require("module").Module._initPaths();

  const _configuration: Configuration = {
    ...configuration,
    resolve: {
      ...configuration.resolve,
      modules: [cliNodeModulesPath, "node_modules"],
    },
    resolveLoader: {
      ...configuration.resolveLoader,
      modules: [cliNodeModulesPath, "node_modules"],
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
