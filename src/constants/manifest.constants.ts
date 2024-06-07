
import { DEFAULT_CONFIG } from "./config.contants";
import { Manifest } from "../interfaces/manifest.interfaces";

export const DEFAULT_MANIFEST: Manifest = {
  manifest_version: 3,
  name: DEFAULT_CONFIG.name,
  version: DEFAULT_CONFIG.version || "0.1.0",
  description: DEFAULT_CONFIG.description,
};
