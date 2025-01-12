import { join } from "node:path";

import {
  VIEW_POPUP_ID,
  VIEW_SIDEPANEL_ID,
  VIEW_LAYOUT_FILE_NAME,
  VIEW_REACT_ROOT_COMPONENT_TEMPLATE,
} from "./view.constants";

import { ViewId } from "./view.types";

import { Project } from "../project/project.module";
import {
  PROJECT_APP_DIRECTORY_NAME,
  PROJECT_INTERNAL_DIRECTORY_NAME,
  PROJECT_INTERNAL_OUTPUT_DIRECTORY_NAME_BY_ENVIRONMENT,
} from "../project/project.constants";

import { File } from "../file/file.module";

import { Template } from "../template/template.module";

export class View {
  project: Project;

  id: ViewId;

  constructor(project: Project, id: ViewId) {
    this.project = project;
    this.id = id;
  }

  async createReactRootComponent(): Promise<File | null> {
    const baseComponentFile = await this.getReactBaseComponentFile();
    const layoutComponentFile = await this.getReactLayoutComponentFile();

    if (!baseComponentFile || !layoutComponentFile) return null;

    const rootComponentPath = join(
      this.project.path,
      PROJECT_INTERNAL_DIRECTORY_NAME,
      `${this.id}-root.jsx`
    );

    const rootComponentContent = Template.parse(
      VIEW_REACT_ROOT_COMPONENT_TEMPLATE,
      {
        layout_path: layoutComponentFile.path.replace(/\\/g, "/"),
        base_path: baseComponentFile.path.replace(/\\/g, "/"),
      }
    );

    const rootComponentFile = await File.write(
      rootComponentPath,
      rootComponentContent
    );

    return rootComponentFile;
  }

  async getReactBaseComponentFile(): Promise<File | null> {
    const baseComponentPath = join(
      this.project.path,
      PROJECT_APP_DIRECTORY_NAME,
      `${this.id}.[jsx,tsx,js,ts]`
    );

    const file = await File.resolve(baseComponentPath);
    if (!file || !(await file.exist())) return null;

    return file;
  }

  async getReactLayoutComponentFile(): Promise<File | null> {
    const layoutComponentPath = join(
      this.project.path,
      PROJECT_APP_DIRECTORY_NAME,
      `${VIEW_LAYOUT_FILE_NAME}.[jsx,tsx,js,ts]`
    );

    const file = await File.resolve(layoutComponentPath);
    if (!file || !(await file.exist())) return null;

    return file;
  }

  async build() {
    const rootComponentFile = await this.createReactRootComponent();
    console.log(rootComponentFile);
  }

  static async scan(project: Project): Promise<View[]> {
    const allViews = [
      new View(project, VIEW_POPUP_ID),
      new View(project, VIEW_SIDEPANEL_ID),
    ];

    let views: View[] = [];

    for (const view of allViews) {
      const componentBaseFile = await view.getReactBaseComponentFile();
      if (componentBaseFile) views.push(view);
    }

    return views;
  }
}
