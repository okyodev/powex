import path from "node:path";
import fsa from "fs-extra";
import { AppViewRootTemplate } from "../../templates/app-view-root.template";
import { transformTemplate } from "../../utils/transform-template";
import { APP_VIEW_ROOT_SUFFIX } from "../../constants/render.constants";
import { generateBundle } from "./generate-bundle";

import {
  Project,
  ProjectApp,
  ProjectAppFile,
} from "../../interfaces/project.interfaces";
import { Chunk } from "webpack";
import { renderDocument } from "./renderDocument";

// render unique the views
export const renderView = async (
  project: Project,
  appView: ProjectAppFile
): Promise<Chunk> => {
  if (appView.type !== "VIEW") {
    throw new Error("the app file should be a VIEW");
  }
  const appViewBundleName = appView.id.toLowerCase();

  // create view root file
  const appViewRootContent = transformTemplate(AppViewRootTemplate, {
    layout_path: (project.app.LAYOUT?.path as string).replace(/\\/g, "/"),
    view_path: appView.path.replace(/\\/g, "/"),
  });

  const appViewRootPath = path.join(
    project.powerPath,
    `${appViewBundleName}-${APP_VIEW_ROOT_SUFFIX}`
  );
  console.log(appViewRootPath);
  await fsa.writeFile(appViewRootPath, appViewRootContent);

  // generate bundle
  const bundleStats = await generateBundle({
    entry: {
      [appViewBundleName]: appViewRootPath,
    },
    output: {
      path: path.join(project.powerPath, appViewBundleName),
    },
  });

  const bundleChunk = bundleStats.compilation.namedChunks.get(
    appViewBundleName
  ) as Chunk;

  // generate index.html
  await renderDocument(
    project,
    project.app.DOCUMENT as ProjectAppFile,
    bundleChunk
  );

  // copy .power directory to outdir folder
  await fsa.copy(
    path.join(project.powerPath, appViewBundleName),
    path.join(project.outdirPath, `${appViewBundleName}`)
  );

  return bundleChunk;
};
