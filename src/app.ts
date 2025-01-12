#! /usr/bin/env node
import { program } from "commander";
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

program.parse();
