import { DEFAULT_PROJECT_CONFIG } from "./project.constants";
import {
  Manifest,
  ManifestEnvironment,
} from "../interfaces/manifest.interfaces";

export const DEFAULT_MANIFEST: Manifest = {
  manifest_version: 3,
  name: DEFAULT_PROJECT_CONFIG.name,
  version: DEFAULT_PROJECT_CONFIG.version || "0.1.0",
  description: DEFAULT_PROJECT_CONFIG.description,
};

// todo:
// automate the output paths in an automated way through
// chunks or another convention to prevent this hardcode :v

export const MANIFEST_RENDER_OUTPUT_APP_FILES: Record<
  ManifestEnvironment,
  {
    popup: string;
    sidePanel: string;
  }
> = {
  development: {
    popup: "./popup.html",
    sidePanel: "./side_panel.html",
  },
  production: {
    popup: "./popup/popup.html",
    sidePanel: "./side_panel/side_panel.html",
  },
};
