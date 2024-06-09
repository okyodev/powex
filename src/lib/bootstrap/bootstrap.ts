import fs from "node:fs";
import fsa from "fs-extra";
import path from "node:path";

import { getProjectPath } from "./get-project-path";
import { getProjectConfig } from "./get-project-config";
import { getProjectAppFiles } from "./get-project-app";

import {
  POWEX_EXTENSION_DEV_DIRECTORY_NAME,
  POWEX_PROJECT_DIRECTORY_NAME,
} from "../../constants/powex.constants";

import { Project, ProjectConfig } from "../../interfaces/project.interfaces";

/**
 * @deprecated
 */
export const bootstrapApp = async () => {
  const projectPath = getProjectPath();
  const projectPowexDirPath = path.join(
    projectPath,
    `/${POWEX_PROJECT_DIRECTORY_NAME}`
  );

  if (!fs.existsSync(projectPowexDirPath)) {
    await fs.promises.mkdir(projectPowexDirPath);
  }
};

export interface BootstrapOptions {
  writeFile?: boolean;
}

export const bootstrap = async (
  options?: BootstrapOptions
): Promise<Project> => {
  // create /.powex directory if not exist
  const projectPath = getProjectPath();
  const projectPowexPath = path.join(
    projectPath,
    `/${POWEX_PROJECT_DIRECTORY_NAME}`
  );

  if (!(await fsa.exists(projectPowexPath))) {
    await fsa.mkdir(projectPowexPath);
  }

  // setup dev directory
  const projectDevPath = path.join(
    projectPowexPath,
    POWEX_EXTENSION_DEV_DIRECTORY_NAME
  );

  if (!(await fsa.exists(projectDevPath))) {
    await fsa.mkdir(projectDevPath);
  } else {
    await fsa.rm(projectDevPath, {
      force: true,
      recursive: true,
    });

    await fsa.mkdir(projectDevPath);
  }

  // load file configuration
  const projectConfig: ProjectConfig = await getProjectConfig(projectPath);

  // get outdir based on the config
  const projectOutdirPath = path.resolve(
    projectPath,
    projectConfig.outdir as string
  );

  // get app files
  const projectApp = await getProjectAppFiles(projectPath);

  const project = {
    powexPath: projectPowexPath,
    powexDevPath: projectDevPath,
    outdirPath: projectOutdirPath,
    path: projectPath,
    config: projectConfig,
    app: projectApp,
  };

  if (options?.writeFile) {
    try {
      await fsa.writeFile(
        path.join(projectPowexPath, "/app-context.json"),
        JSON.stringify(project)
      );
    } catch (error) {
      throw new Error("Error generating app file");
    }
  }

  return project;
};
