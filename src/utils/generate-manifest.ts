import { DEFAULT_MANIFEST } from "../constants/manifest.constants";
import { Config } from "../interfaces/config.interfaces";
import { Manifest } from "../interfaces/manifest.interfaces";
import fs from "node:fs";
import { RenderViewsResult } from "../interfaces/view.interfaces";

interface GenerateManifestOptions {
  config: Config;
  renderViewsResult: RenderViewsResult;
}

export const generateManifest = ({
  config,
  renderViewsResult,
}: GenerateManifestOptions) => {
  let manifest = {
    ...DEFAULT_MANIFEST,
    name: config.name,
    description: config.description,
    version: config.version || DEFAULT_MANIFEST.version,
  };

  if (renderViewsResult.popup) {
    manifest.action = {
      ...manifest.action,
      default_popup: "./popup/popup.html",
    };
  }

  if (renderViewsResult.sidePanel) {
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

  return manifest;
};
