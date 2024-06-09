
import { DEFAULT_PROJECT_CONFIG } from "./project.constants";
import { Manifest } from "../interfaces/manifest.interfaces";

export const DEFAULT_MANIFEST: Manifest = {
  manifest_version: 3,
  name: DEFAULT_PROJECT_CONFIG.name,
  version: DEFAULT_PROJECT_CONFIG.version || "0.1.0",
  description: DEFAULT_PROJECT_CONFIG.description,
};
