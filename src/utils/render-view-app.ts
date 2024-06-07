import path from "node:path";
import fs from "node:fs";
import fsa from "fs-extra";

import { RenderView } from "../interfaces/view.interfaces";
import { renderViewIndexTemplate } from "../templates/render-view-index.template";
import { getProjectPath } from "./get-project-path";
import { transformTemplate } from "./transform-template";
import { packageCode } from "./package-code";
import { POWEX_PROJECT_DIRECTORY_NAME } from "../constants/powex.constants";
import { getValidPath } from "./get-valid-path";
import { documentDefaultTemplate } from "../templates/document-default.template";
import { getExternalCode } from "./get-external-code";
import { asyncEval } from "./async-eval";
import { getBundleAssets } from "./getBundleAssets";
import { transformAssetsToElements } from "./transformAssetsToElements";
import { Config } from "../interfaces/config.interfaces";

interface RenderViewAppOptions {
  renderViewPath: string;
  layoutPath: string;
  config: Config;
  outdir: string;
}

export const renderViewApp = async (
  renderView: RenderView,
  { layoutPath, renderViewPath, config, outdir }: RenderViewAppOptions
) => {
  const projectPath = getProjectPath();

  const renderViewOutputPath = path.join(
    projectPath,
    `/${POWEX_PROJECT_DIRECTORY_NAME}/${renderView.toLocaleLowerCase()}`
  );

  const renderViewIndexContent = transformTemplate(renderViewIndexTemplate, {
    layout_path: layoutPath.replace(/\\/g, "/"),
    render_view_path: renderViewPath.replace(/\\/g, "/"),
  });

  const renderViewIndexPath = renderViewOutputPath + "-index.jsx";

  await fs.promises.writeFile(renderViewIndexPath, renderViewIndexContent);

  const bundleRenderViewMetadata = await packageCode({
    paths: [renderViewIndexPath],
    outdir: renderViewOutputPath,
    platform: "browser",
    format: "iife",
  });

  const documentHTMLAssets = getBundleAssets(bundleRenderViewMetadata);
  const documentHTMLElements = transformAssetsToElements(documentHTMLAssets);

  const documentHTMLPath = await getValidPath(
    path.resolve(projectPath, "./src/app/_document.ts"),
    ["ts", "js"]
  );

  const documentHTMLTemplate = !documentHTMLPath
    ? documentDefaultTemplate
    : (await asyncEval(await getExternalCode(documentHTMLPath))).default();

  const documentHTMLContent = transformTemplate(documentHTMLTemplate, {
    name: config.name,
    scripts: documentHTMLElements.scripts.join("\n") || "",
    stylesheets: documentHTMLElements.stylesheets?.join("\n") || "",
  });

  const documentHTMLFilePath = path.join(
    renderViewOutputPath,
    `/${renderView.toLocaleLowerCase()}.html`
  );

  await fs.promises.writeFile(documentHTMLFilePath, documentHTMLContent);

  // copy folder and paste on the outdir folder
  await fsa.copy(
    renderViewOutputPath,
    path.join(outdir, `/${renderView.toLocaleLowerCase()}`)
  );

  return documentHTMLContent;
};
