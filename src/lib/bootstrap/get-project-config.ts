import fs from "node:fs";
import { resolve } from "node:path";
import { DEFAULT_PROJECT_CONFIG } from "../../constants/project.constants";
import { ProjectConfig } from "../../interfaces/project.interfaces";

export const getProjectConfig = (projectPath: string): ProjectConfig => {
  const projectConfigFilePath = resolve(projectPath, "./powex.config.js");

  if (!fs.existsSync(projectConfigFilePath)) {
    throw new Error("The file powex.config.js not exist");
  }

  const projectConfig = require(projectConfigFilePath) as ProjectConfig;

  return {
    ...DEFAULT_PROJECT_CONFIG,
    ...projectConfig,
  };
};
