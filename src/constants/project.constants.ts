import { ProjectConfig } from "../interfaces/project.interfaces";

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  name: "powex extension",
  description: "powered extension by Powex",
  version: "0.1.0",
  outdir: "./dist",
};

export const PROJECT_APP_FILES_PATH = {
  POPUP: "/src/app/popup.tsx",
  SIDE_PANEL: "/src/app/side-panel.tsx",
  LAYOUT: "/src/app/layout.tsx",
  DOCUMENT: "/src/app/_document.ts",
};

export const PROJECT_APP_FILES_EXTENSIONS = {
  DOCUMENT: ["js", "ts"],
  LAYOUT: ["js", "ts", "jsx", "tsx"],
  SIDE_PANEL: ["js", "ts", "jsx", "tsx"],
  POPUP: ["js", "ts", "jsx", "tsx"],
};
