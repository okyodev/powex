import { join } from "node:path";
import { Manifest as ManifestPayload } from "./manifest.types";
import { DEFAULT_MANIFEST_PAYLOAD } from "./manifest.constants";

import { Project } from "../project/project.module";
import { ProjectConfig } from "../project/project.types";
import { PROJECT_INTERNAL_OUTPUT_DIRECTORY_NAME_BY_ENVIRONMENT } from "../project/project.constants";
import { File } from "../file/file.module";

export class Manifest {
  project: Project;
  payload: ManifestPayload;

  constructor(project: Project, projectConfig: ProjectConfig) {
    this.project = project;
    this.payload = {
      ...DEFAULT_MANIFEST_PAYLOAD,
      name: projectConfig.name,
      description: projectConfig.description,
      version: projectConfig.version || DEFAULT_MANIFEST_PAYLOAD.version,
      ...projectConfig.overrideManifest,
    };
  }

  add(aggregator: (curr: ManifestPayload) => ManifestPayload): Manifest {
    this.payload = aggregator(this.payload);
    return this;
  }

  get path(): string {
    return join(
      this.project.path,
      PROJECT_INTERNAL_OUTPUT_DIRECTORY_NAME_BY_ENVIRONMENT[
        this.project.environment
      ],
      "manifest.json"
    );
  }

  async create(): Promise<File | null> {
    const manifestFile = File.write(this.path, JSON.stringify(this.payload));
    return manifestFile;
  }
}
