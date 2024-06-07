#! /usr/bin/env node
import { program } from "commander";
import { getProjectPath } from "./lib/get-project-path";
import { loadConfig } from "./lib/load-config";
import { generateManifest } from "./lib/generate-manifest";
import { renderApp } from "./lib/render-app";

import fs from "node:fs";
import path from "node:path";
import { bootstrapApp } from "./lib/bootstrap";

program
  .name("powex-cli")
  .description("React framework to web extensions!")
  .version("0.1.0");

program
  .command("build")
  .description("build a Powex project")
  .action(async () => {
    await bootstrapApp();
    const projectPath = getProjectPath();
    const config = loadConfig(projectPath);
    const renderViewsResult = await renderApp(config);

    const manifest = generateManifest({
      config,
      renderViewsResult,
    });


    // temporal -------------------------------------------------------
    // save manifest
    const manifestOutputPath = path.join(
      path.resolve(projectPath, config.outdir as string),
      "/manifest.json"
    );

    await fs.promises.writeFile(
      manifestOutputPath,
      JSON.stringify(manifest, null, 2)
    );
  });

program.parse();
