import path from "node:path";
import fsa from "fs-extra";

import { Chunk } from "webpack";
import { Project, ProjectAppFile } from "../../interfaces/project.interfaces";
import { getBundleExternalCode } from "../../utils/get-bundle-external-code";
import { transformTemplate } from "../../utils/transform-template";

interface RenderDocumentOptions {
  project: Project;
  chunk: Chunk;
  outdir: string;
}

export const renderDocument = async ({
  project,
  chunk,
  outdir,
}: RenderDocumentOptions) => {
  const appDocument = project.app.DOCUMENT;

  if (appDocument === undefined) {
    throw new Error("_document is required");
  }

  if (appDocument.type !== "DOCUMENT") {
    throw new Error("the app file should be a DOCUMENT");
  }

  // get document
  const getDocTemplate = (
    await getBundleExternalCode(
      project.app.DOCUMENT?.path || "",
      path.join(project.powexPath, "document")
    )
  ).default as () => string;

  const docTemplate = getDocTemplate();

  const docAssets = [...chunk.files].reduce<{
    scripts: string[];
    stylesheets: string[];
  }>(
    (prev, filename) => {
      const extension = filename.split(".").at(-1);

      if (extension === "js") {
        prev.scripts.push(
          `<script type="module" crossorigin src="./${filename}"></script>`
        );
        return prev;
      }

      if (extension === "css") {
        prev.stylesheets.push(
          `<link rel="stylesheet" crossorigin href="./${filename}">`
        );
        return prev;
      }

      return prev;
    },
    {
      scripts: [],
      stylesheets: [],
    }
  );

  // content
  const docContent = transformTemplate(docTemplate, {
    name: project.config.name,
    scripts: docAssets.scripts.join("\n") || "",
    stylesheets: docAssets.stylesheets.join("\n") || "",
  });

  await fsa.writeFile(
    path.join(outdir, `${chunk.name || "index"}.html`),
    docContent
  );
};


/**
 * @deprecated "use renderDocument instead"
 */
export const _renderDocument = async (
  project: Project,
  appDocument: ProjectAppFile,
  chunk: Chunk
) => {
  if (appDocument.type !== "DOCUMENT") {
    throw new Error("the app file should be a DOCUMENT");
  }

  // get document
  const getDocTemplate = (
    await getBundleExternalCode(
      project.app.DOCUMENT?.path || "",
      path.join(project.powexPath, "document")
    )
  ).default as () => string;

  const docTemplate = getDocTemplate();

  const docAssets = [...chunk.files].reduce<{
    scripts: string[];
    stylesheets: string[];
  }>(
    (prev, filename) => {
      const extension = filename.split(".").at(-1);

      if (extension === "js") {
        prev.scripts.push(
          `<script type="module" crossorigin src="./${filename}"></script>`
        );
        return prev;
      }

      if (extension === "css") {
        prev.stylesheets.push(
          `<link rel="stylesheet" crossorigin href="./${filename}">`
        );
        return prev;
      }

      return prev;
    },
    {
      scripts: [],
      stylesheets: [],
    }
  );

  // content
  const docContent = transformTemplate(docTemplate, {
    name: project.config.name,
    scripts: docAssets.scripts.join("\n") || "",
    stylesheets: docAssets.stylesheets.join("\n") || "",
  });

  await fsa.writeFile(
    path.join(
      project.powexPath,
      chunk.name || "",
      `${chunk.name || "index"}.html`
    ),
    docContent
  );
};
