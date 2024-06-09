import {
  Project,
  ProjectAppFileId,
  ProjectAppFileViewRoot,
} from "../../interfaces/project.interfaces";
import { generateViewRoot } from "../render/generate-view-root";

export const renderViewsRootDev = async (project: Project) => {
  let viewRootGenerated: Promise<ProjectAppFileViewRoot>[] = [];

  if (project.app.POPUP?.id) {
    viewRootGenerated.push(generateViewRoot(project.app.POPUP, project));
  }

  if (project.app.SIDE_PANEL?.id) {
    viewRootGenerated.push(generateViewRoot(project.app.SIDE_PANEL, project));
  }

  return await Promise.all(viewRootGenerated);
};
