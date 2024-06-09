export interface ProjectConfig {
  name: string;
  description?: string;
  version?: string;
  outdir?: string;
}

export type ProjectAppFileId = "DOCUMENT" | "LAYOUT" | "SIDE_PANEL" | "POPUP";

export type ProjectAppFileType =
  | "VIEW"
  | "LAYOUT"
  | "DOCUMENT"
  | "INJECTABLE_SCRIPT";

export interface ProjectAppFile {
  id: ProjectAppFileId;
  type: ProjectAppFileType;
  path: string;
}

export type ProjectApp = Partial<Record<ProjectAppFileId, ProjectAppFile>>;

export interface Project {
  powexPath: string;
  outdirPath: string;
  path: string;
  config: ProjectConfig;
  app: ProjectApp;
}
