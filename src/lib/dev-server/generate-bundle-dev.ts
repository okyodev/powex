import {
  Project,
  ProjectAppFileViewRoot,
} from "../../interfaces/project.interfaces";
import { getWebpackDev } from "./get-webpack-dev";
import { getWebpackDevConfig } from "./get-webpack-dev-config";
import { Chunk, Stats } from "webpack";

export const generateBundleDev = async (
  project: Project,
  viewsRoot: ProjectAppFileViewRoot[]
) => {
  const webpackConfig = getWebpackDevConfig(project, viewsRoot);
  const webpack = getWebpackDev(webpackConfig);

  const stats = await new Promise<Stats>((resolve, reject) => {
    webpack.run((err, stats) => {
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

  const viewChunks = viewsRoot.reduce<Record<string, Chunk>>((prev, acc) => {
    const chunk = stats.compilation.namedChunks.get(acc.bundleName);
    if (chunk) {
      prev[acc.bundleName] = chunk;
    }

    return prev;
  }, {});

  return viewChunks;
};
