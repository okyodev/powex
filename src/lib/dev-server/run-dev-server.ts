import express from "express";
import {
  Project,
  ProjectAppFile,
  ProjectAppFileId,
} from "../../interfaces/project.interfaces";
import { renderViewsRootDev } from "./render-views-root-dev";
import { generateBundleDev } from "./generate-bundle-dev";
import { Chunk } from "webpack";
import { renderDocument } from "../render/render-document";
import { generateManifest } from "../manifest/generate-manifest";
import { getWebpackDev } from "./get-webpack-dev";
import { getWebpackDevConfig } from "./get-webpack-dev-config";

import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

interface RunDevServerOptions {
  project: Project;
}

export const runDevServer = async ({ project }: RunDevServerOptions) => {
  const app = express();

  // render view root
  const renderViewsRoot = await renderViewsRootDev(project);

  // generate initial bundle
  const viewChunks = await generateBundleDev(project, renderViewsRoot);

  // render documents
  const documentsGenerated = Object.values(viewChunks).map((chunk) => {
    return renderDocument({
      chunk,
      project,
      outdir: project.powexDevPath,
    });
  });

  await Promise.all(documentsGenerated);

  // generate manifest
  await generateManifest(project, {
    writeFile: true,
    outdir: project.powexDevPath,
    environment: "development",
  });

  // get webpack compile for the middlewares
  const webpackConfig = getWebpackDevConfig(project, renderViewsRoot);
  const webpack = getWebpackDev(webpackConfig);

  app.use(
    webpackDevMiddleware(webpack, {
      writeToDisk: true,
      stats: "minimal",
    })
  );

  app.use(
    webpackHotMiddleware(webpack, {
      log: false,
    })
  );

  app.listen(8080, () => {
    console.log("Running server on 8080");
  });
};
