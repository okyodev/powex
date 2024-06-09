import path from "node:path";
import fsa from "fs-extra";
import { generateBundle } from "./generate-bundle";
import { Project, ProjectAppFile } from "../../interfaces/project.interfaces";
import { Chunk } from "webpack";
import { _renderDocument, renderDocument } from "./renderDocument";
import { generateViewRoot } from "./generate-view-root";

// render unique the views
export const renderView = async (
  project: Project,
  appView: ProjectAppFile
): Promise<Chunk> => {
  if (appView.type !== "VIEW") {
    throw new Error("the app file should be a VIEW");
  }

  const { bundleName: appViewBundleName, path: appViewRootPath } =
    await generateViewRoot(appView, project);

  // generate bundle
  const bundleStats = await generateBundle({
    entry: {
      [appViewBundleName]: appViewRootPath,
    },
    output: {
      path: path.join(project.powexPath, appViewBundleName),
    },
  });

  const bundleChunk = bundleStats.compilation.namedChunks.get(
    appViewBundleName
  ) as Chunk;

  await renderDocument({
    project,
    chunk: bundleChunk,
    outdir: path.join(project.powexPath, appViewBundleName),
  });

  // copy .powex directory to outdir folder
  await fsa.copy(
    path.join(project.powexPath, appViewBundleName),
    path.join(project.outdirPath, `${appViewBundleName}`)
  );

  return bundleChunk;
};
