import { join, resolve } from "node:path";
import { mkdir, rm, exists, copy } from "fs-extra";
import express from "express";

import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import { ProjectConfig, ProjectEnvironment } from "./project.types";
import {
  PROJECT_CONFIG_FILE_NAME,
  PROJECT_DEFAULT_CONFIG,
  PROJECT_INTERNAL_DIRECTORY_NAME,
  PROJECT_INTERNAL_OUTPUT_DIRECTORY_NAME_BY_ENVIRONMENT,
  PROJECT_OUTPUT_DIRECTORY_NAME,
} from "./project.constants";

import { View } from "../view/view.module";
import { File } from "../file/file.module";
import { Bundler } from "../bundler/bundler.module";
import { Manifest } from "../manifest/manifest.module";

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
        await rm(internalDirectoryPath, { recursive: true });
      }

      await mkdir(internalDirectoryPath);
      return true;
    } catch (error) {
      console.error("Error creating the internal directory", error);
      return false;
    }
  }

  async build(): Promise<Bundler | null> {
    const config = await this.getConfig();

    if (!config) {
      console.error("The project config file not exist");
      return null;
    }

    const internalDirectoryCreated = await this.setupInternalDirectory();

    if (!internalDirectoryCreated) {
      console.error("The internal directory not created");
      return null;
    }

    const views = await View.scan(this);

    // Create the bundler
    const projectInternalBuildOutput = join(
      this.path,
      PROJECT_INTERNAL_OUTPUT_DIRECTORY_NAME_BY_ENVIRONMENT[this.environment]
    );

    const bundlerEntry: Record<string, string | string[]> = {};

    for (const view of views) {
      const viewBuildFile = await view.build();
      if (!viewBuildFile) continue;

      bundlerEntry[view.id] = viewBuildFile.path;
    }

    // Create the bundle
    const bundler = new Bundler(this, {
      entry: bundlerEntry,
      output: {
        path: projectInternalBuildOutput,
      },
    });

    const bundlerResultFiles = await bundler.run();

    // Create the manifest...
    const manifest = new Manifest(this, config);

    for (const view of views) {
      const viewBundlerFiles = bundlerResultFiles.filter((file) => {
        return file.filename === view.id;
      });

      if (viewBundlerFiles.length === 0) {
        console.error("The bundler files not found for the view", view.id);
        continue;
      }

      const viewDocument = await view.createDocumentFile(viewBundlerFiles);
      if (!viewDocument) {
        continue;
      }

      const viewDocumentRelativePath = viewDocument.relativePath(
        projectInternalBuildOutput
      );

      if (view.id === "popup") {
        manifest.add((curr) => {
          return {
            ...curr,
            action: {
              ...curr.action,
              default_popup: viewDocumentRelativePath,
            },
          };
        });
      }

      if (view.id === "sidepanel") {
        manifest.add((curr) => {
          const permissions = Array.isArray(curr.permissions)
            ? curr.permissions
            : [];
          permissions.push("sidePanel");

          return {
            ...curr,
            permissions,
            side_panel: {
              ...curr.side_panel,
              default_path: viewDocumentRelativePath,
            },
          };
        });
      }
    }

    const manifestFile = await manifest.create();

    if (!manifestFile) {
      console.error("Error creating the manifest file");
      return null;
    }

    // Copy the internal build dir to the outdir project
    const outputPath = resolve(
      this.path,
      config.outdir || PROJECT_OUTPUT_DIRECTORY_NAME
    );

    try {
      if (await exists(outputPath)) {
        await rm(outputPath, { recursive: true });
      }

      await copy(projectInternalBuildOutput, outputPath);
      return bundler;
    } catch (error) {
      return null;
    }
  }

  async server() {
    const bundler = await this.build();
    if (!bundler) {
      console.error("Error building the project");
      return;
    }

    const app = express();

    // To add customs stats use - plugins
    // https://stackoverflow.com/questions/61930130/how-to-hide-webpack-dev-server-log

    app.use(
      webpackDevMiddleware(bundler.compiler, {
        writeToDisk: true,
        stats: "minimal",
      })
    );

    // Edit the HMR queries to edit the overlay (create custom overlay) - overlayStyles
    // https://github.com/webpack-contrib/webpack-hot-middleware#documentation
    //
    // const HMR_CLIENT_ENTRY =
    // "webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr";

    app.use(
      webpackHotMiddleware(bundler.compiler, {
        log: false,
      })
    );

    app.listen(8080, () => {
      console.log("Running server on 8080");
    });
  }
}
