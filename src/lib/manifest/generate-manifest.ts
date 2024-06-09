import fsa from "fs-extra";
import path from "node:path";
import { DEFAULT_MANIFEST } from "../../constants/manifest.constants";
import { Project } from "../../interfaces/project.interfaces";

interface GenerateManifestOptions {
  writeFile: boolean;
}

export const generateManifest = async (
  project: Project,
  options?: GenerateManifestOptions
) => {
  const _options: GenerateManifestOptions = {
    writeFile: true,
    ...(options || {}),
  };

  let manifest = {
    ...DEFAULT_MANIFEST,
    name: project.config.name,
    description: project.config.description,
    version: project.config.version || DEFAULT_MANIFEST.version,
  };

  if (project.app.POPUP?.id) {
    manifest.action = {
      ...manifest.action,
      default_popup: "./popup/popup.html",
    };
  }

  if (project.app.POPUP?.id) {
    // add permissions
    if (Array.isArray(manifest.permissions)) {
      manifest.permissions.push("sidePanel");
    } else {
      manifest.permissions = ["sidePanel"];
    }

    manifest.side_panel = {
      ...manifest.side_panel,
      default_path: "./side_panel/side_panel.html",
    };
  }

  if (_options.writeFile) {
    const manifestOutputPath = path.join(project.outdirPath, "/manifest.json");
    await fsa.writeFile(manifestOutputPath, JSON.stringify(manifest));
  }

  return manifest;
};
