import { Manifest } from "../manifest/manifest.types";

export type ProjectEnvironment = "development" | "production";

export interface ProjectConfig {
  name: string;
  description: string;
  version: `${number}.${number}.${number}`;

  // The icons will be generated.
  overrideManifest?: Partial<
    Omit<
      Manifest,
      "manifest_version" | "name" | "description" | "version" | "icons"
    >
  >;
}
