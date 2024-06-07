import fs from "node:fs";
import path from "node:path";
import { getProjectPath } from "./get-project-path";
import { POWEX_PROJECT_DIRECTORY_NAME } from "../constants/powex.constants";

export const bootstrapApp = async () => {
  const projectPath = getProjectPath();
  const projectPowerDirPath = path.join(
    projectPath,
    `/${POWEX_PROJECT_DIRECTORY_NAME}`
  );

  if (!fs.existsSync(projectPowerDirPath)) {
    await fs.promises.mkdir(projectPowerDirPath);
  }
};
