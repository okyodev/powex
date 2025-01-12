#! /usr/bin/env node
import { program } from "commander";

// build
import { bootstrap } from "./lib/bootstrap/bootstrap";
import { render } from "./lib/render/render";
import { generateManifest } from "./lib/manifest/generate-manifest";

// dev
import { runDevServer } from "./lib/dev-server/run-dev-server";

// NEW VERSION
import { Project } from "./modules/project/project.module";

program
  .name("powex-cli")
  .description("React framework to web extensions!")
  .version("0.1.1");

program
  .command("build")
  .description("build a powex project")
  .action(async () => {
    const project = new Project("production");
    project.build();
  });

program
  .command("dev")
  .description("start server development of a Powex project")
  .action(async () => {
    const project = new Project("development");
    project.server();
  });

program
  .command("legacy-build")
  .description("We recommend se build instead")
  .action(async () => {
    const project = await bootstrap({
      writeFile: true,
    });

    await render(project);

    await generateManifest(project, {
      writeFile: true,
    });
  });

program
  .command("legacy-dev")
  .description("Legacy start server development of a Powex project")
  .action(async () => {
    const project = await bootstrap({
      writeFile: true,
    });

    await runDevServer({
      project,
    });
  });

program.parse();
