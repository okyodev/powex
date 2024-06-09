import { WebpackDevConfig } from "../../interfaces/dev.interfaces";
import {
  Project,
  ProjectAppFile,
  ProjectAppFileViewRoot,
} from "../../interfaces/project.interfaces";

const HMR_CLIENT_ENTRY =
  "webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr";

const getEntryByAppViewAndRoot = (
  appView: ProjectAppFile,
  appViewsRoot: ProjectAppFileViewRoot[]
): string[] => {
  const bundlePopupName = appView.id.toLowerCase();
  const viewRoot = appViewsRoot.find((viewRoot) => {
    return viewRoot.bundleName === bundlePopupName;
  });

  if (viewRoot === undefined) {
    throw new Error(`View root for  ${appView.id} not is generated`);
  }
  return [HMR_CLIENT_ENTRY, viewRoot.path];
};

export const getWebpackDevConfig = (
  project: Project,
  viewsRoot: ProjectAppFileViewRoot[]
): WebpackDevConfig => {
  let entry: {
    [key: string]: string[];
  } = {};

  if (project.app.POPUP?.id) {
    const bundlePopupName = project.app.POPUP?.id.toLowerCase();
    entry[bundlePopupName] = getEntryByAppViewAndRoot(
      project.app.POPUP,
      viewsRoot
    );
  }

  if (project.app.SIDE_PANEL?.id) {
    const bundlePopupName = project.app.SIDE_PANEL?.id.toLowerCase();
    entry[bundlePopupName] = getEntryByAppViewAndRoot(
      project.app.SIDE_PANEL,
      viewsRoot
    );
  }

  return {
    entry,
    output: {
      path: project.powexDevPath,
    },
  };
};
