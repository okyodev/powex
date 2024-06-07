import fs from "node:fs";
import path from "node:path";
import { Config } from "../interfaces/config.interfaces";
import { RenderViewsResult } from "../interfaces/view.interfaces";
import { getViewPath } from "./get-view-path";
import { renderViewApp } from "./render-view-app";
import { getProjectPath } from "./get-project-path";
import { DEFAULT_CONFIG } from "../constants/config.contants";

export const renderApp = async (config: Config): Promise<RenderViewsResult> => {
  const [layoutPath, popupPath, sidePanelPath] = await Promise.all([
    getViewPath("LAYOUT"),
    getViewPath("POPUP"),
    getViewPath("SIDE_PANEL"),
  ]);

  if (layoutPath === null) {
    throw "The layout on App should be exist.";
  }

  // create directory for the extension
  const projectPath = getProjectPath();
  const renderViewOutputDirPath = path.resolve(
    projectPath,
    config.outdir as string
  );

  // on case of this exist remove it
  if (fs.existsSync(renderViewOutputDirPath)) {
    await fs.promises.rm(renderViewOutputDirPath, {
      recursive: true,
    });
  }

  await fs.promises.mkdir(renderViewOutputDirPath);

  let renderViewsResult: RenderViewsResult = {
    popup: false,
    sidePanel: false,
  };

  if (popupPath !== null) {
    await renderViewApp("POPUP", {
      renderViewPath: popupPath,
      layoutPath: layoutPath,
      config: config,
      outdir: renderViewOutputDirPath,
    });

    renderViewsResult.popup = true;
  }

  if (sidePanelPath !== null) {
    await renderViewApp("SIDE_PANEL", {
      renderViewPath: sidePanelPath,
      layoutPath: layoutPath,
      config,
      outdir: renderViewOutputDirPath,
    });

    renderViewsResult.sidePanel = true;
  }

  return renderViewsResult;
};
