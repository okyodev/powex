import { join } from "node:path";
import { mkdir, rmdir, exists } from "fs-extra";
import { ProjectConfig, ProjectEnvironment } from "./project.types";

import {
  PROJECT_CONFIG_FILE_NAME,
  PROJECT_DEFAULT_CONFIG,
  PROJECT_INTERNAL_DIRECTORY_NAME,
} from "./project.constants";

import { View } from "../view/view.module";
import { File } from "../file/file.module";
import { Script } from "../script/script.module";

export class Project {
  path: string;
  environment: ProjectEnvironment;

  constructor(environment: ProjectEnvironment) {
    // Get the project path
    this.environment = environment;
    this.path = process.cwd();
  }

  async getConfig(): Promise<null | ProjectConfig> {
    const configPath = join(this.path, PROJECT_CONFIG_FILE_NAME);
    const configFile = await File.resolve(configPath);

    if (!configFile) {
      return null;
    }

    const config = configFile.require() as ProjectConfig;
    return {
      ...PROJECT_DEFAULT_CONFIG,
      ...config,
    };
  }

  async setupInternalDirectory() {
    try {
      const internalDirectoryPath = join(
        this.path,
        PROJECT_INTERNAL_DIRECTORY_NAME
      );

      if (await exists(internalDirectoryPath)) {
        await rmdir(internalDirectoryPath, { recursive: true });
      }

      await mkdir(internalDirectoryPath);
      return true;
    } catch (error) {
      console.error("Error creating the internal directory", error);
      return false;
    }
  }

  async build() {
    const config = await this.getConfig();

    if (!config) {
      console.error("The project config file not exist");
      return;
    }

    const internalDirectoryCreated = await this.setupInternalDirectory();

    if (!internalDirectoryCreated) {
      console.error("The internal directory not created");
      return;
    }

    const views = await View.scan(this);
    console.log(views);

    for (const view of views) {
      await view.build();
    }

    // Get the views
    // get the scripts

    // Get the config
    // Get the powex config for the project
    // ...
  }
}
