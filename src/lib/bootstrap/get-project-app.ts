import {
  PROJECT_APP_FILES_EXTENSIONS,
  PROJECT_APP_FILES_PATH,
} from "../../constants/project.constants";
import { ProjectApp } from "../../interfaces/project.interfaces";
import { resolveFileExtension } from "../../utils/resolve-file-extension";
import path from "node:path";

export const getProjectAppFiles = async (
  projectPath: string
): Promise<ProjectApp> => {
  // get path of the files, if this files not exist
  // should return null
  const [documentPath, layoutPath, popupPath, sidePanelPath] =
    await Promise.all([
      resolveFileExtension(
        path.join(projectPath, PROJECT_APP_FILES_PATH.DOCUMENT),
        PROJECT_APP_FILES_EXTENSIONS.DOCUMENT
      ),
      resolveFileExtension(
        path.join(projectPath, PROJECT_APP_FILES_PATH.LAYOUT),
        PROJECT_APP_FILES_EXTENSIONS.LAYOUT
      ),
      resolveFileExtension(
        path.join(projectPath, PROJECT_APP_FILES_PATH.POPUP),
        PROJECT_APP_FILES_EXTENSIONS.POPUP
      ),
      resolveFileExtension(
        path.join(projectPath, PROJECT_APP_FILES_PATH.SIDE_PANEL),
        PROJECT_APP_FILES_EXTENSIONS.SIDE_PANEL
      ),
    ]);

  if (documentPath === null || layoutPath === null) {
    throw new Error("Document and layout are required files!");
  }

  let projectApp: ProjectApp = {
    DOCUMENT: {
      id: "DOCUMENT",
      path: documentPath,
      type: "DOCUMENT",
    },
    LAYOUT: {
      id: "LAYOUT",
      path: layoutPath,
      type: "LAYOUT",
    },
  };

  if (popupPath !== null) {
    projectApp["POPUP"] = {
      id: "POPUP",
      path: popupPath,
      type: "VIEW",
    };
  }

  if (sidePanelPath !== null) {
    projectApp["SIDE_PANEL"] = {
      id: "SIDE_PANEL",
      path: sidePanelPath,
      type: "VIEW",
    };
  }

  return projectApp;
};
