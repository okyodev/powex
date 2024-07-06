import { Project } from "../../interfaces/project.interfaces";
import fsa from "fs-extra";
import { renderView } from "./render-view";
import { Chunk } from "webpack";

export const render = async (project: Project) => {
  // create outdir path, if exist remove the previus one!
  if (await fsa.exists(project.outdirPath)) {
    await fsa.rm(project.outdirPath, {
      recursive: true,
    });
  }

  await fsa.mkdir(project.outdirPath);

  let appViewsRendered: Promise<Chunk>[] = [];

  if (project.app.POPUP?.id) {
    appViewsRendered.push(renderView(project, project.app.POPUP));
  }

  if (project.app.SIDE_PANEL?.id) {
    appViewsRendered.push(renderView(project, project.app.SIDE_PANEL));
  }

  await Promise.all(appViewsRendered);
};
