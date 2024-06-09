import path from "node:path";
import fsa from "fs-extra";
import { APP_VIEW_ROOT_SUFFIX } from "../../constants/render.constants";
import {
  Project,
  ProjectAppFile,
  ProjectAppFileViewRoot,
} from "../../interfaces/project.interfaces";
import { appViewRootTemplate } from "../../templates/app-view-root.template";
import { transformTemplate } from "../../utils/transform-template";

export const generateViewRoot = async (
  appView: ProjectAppFile,
  project: Project
): Promise<ProjectAppFileViewRoot> => {
  const appViewBundleName = appView.id.toLowerCase();

  const appViewRootContent = transformTemplate(appViewRootTemplate, {
    layout_path: (project.app.LAYOUT?.path as string).replace(/\\/g, "/"),
    view_path: appView.path.replace(/\\/g, "/"),
  });

  const appViewRootPath = path.join(
    project.powexPath,
    `${appViewBundleName}-${APP_VIEW_ROOT_SUFFIX}`
  );

  await fsa.writeFile(appViewRootPath, appViewRootContent);

  return {
    bundleName: appViewBundleName,
    path: appViewRootPath,
    view: appView,
  };
};
