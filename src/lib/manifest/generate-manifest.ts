import fsa from "fs-extra";
import path from "node:path";
import {
  DEFAULT_MANIFEST,
  MANIFEST_RENDER_OUTPUT_APP_FILES,
} from "../../constants/manifest.constants";
import { Project } from "../../interfaces/project.interfaces";
import { ManifestEnvironment } from "../../interfaces/manifest.interfaces";

interface GenerateManifestOptions {
  writeFile?: boolean;
  outdir?: string;
  environment?: ManifestEnvironment;
}

export const generateManifest = async (
  project: Project,
  options?: GenerateManifestOptions
) => {
  const _options: Required<GenerateManifestOptions> = {
    writeFile: true,
    outdir: project.outdirPath,
    environment: "production",
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
      default_popup:
        MANIFEST_RENDER_OUTPUT_APP_FILES[_options.environment].popup,
    };
  }

  if (project.app.SIDE_PANEL?.id) {
    // add permissions
    if (Array.isArray(manifest.permissions)) {
      manifest.permissions.push("sidePanel");
    } else {
      manifest.permissions = ["sidePanel"];
    }

    manifest.side_panel = {
      ...manifest.side_panel,
      default_path:
        MANIFEST_RENDER_OUTPUT_APP_FILES[_options.environment].sidePanel,
    };
  }

  if (_options.writeFile) {
    const manifestOutputPath = path.join(_options.outdir, "/manifest.json");
    await fsa.writeFile(manifestOutputPath, JSON.stringify(manifest));
  }

  return manifest;
};
