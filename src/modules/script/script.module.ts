import { Project } from "../project/project.module";

export class Script {
  static async scan(project: Project) {
    console.log("Scanning scripts");
  }
}
