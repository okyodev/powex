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
import { Bundler } from "../bundler/bundler.module";

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

  async build(): Promise<File | null> {
    const rootComponentFile = await this.createReactRootComponent();
    return rootComponentFile;
  }

  async createDocumentFile(files: File[]): Promise<File | null> {
    const config = await this.project.getConfig();
    if (!config) return null;

    const documentFilePath = join(
      this.project.path,
      PROJECT_INTERNAL_OUTPUT_DIRECTORY_NAME_BY_ENVIRONMENT[
        this.project.environment
      ],
      `${this.id}.html`
    );

    const documentTemplate = await this.getDocumentTemplate();
    if (documentTemplate === null) return null;

    const assetsHTMLTags: {
      scripts: string[];
      stylesheets: string[];
    } = files.reduce<{
      scripts: string[];
      stylesheets: string[];
    }>(
      (acc, file) => {
        const fileRelativePath = file.relativePath(
          join(
            this.project.path,
            PROJECT_INTERNAL_OUTPUT_DIRECTORY_NAME_BY_ENVIRONMENT[
              this.project.environment
            ]
          )
        );

        if (file.extension === "js") {
          acc.scripts.push(
            `<script type="module" crossorigin src="${fileRelativePath}"></script>`
          );
        }

        if (file.extension === "css") {
          acc.stylesheets.push(
            `<link rel="stylesheet" href="${fileRelativePath}" />`
          );
        }

        return acc;
      },
      {
        scripts: [],
        stylesheets: [],
      }
    );

    const documentContent = Template.parse<{
      name: string;
      scripts: string;
      stylesheets: string;
    }>(documentTemplate, {
      name: config.name,
      scripts: assetsHTMLTags.scripts.join("\n"),
      stylesheets: assetsHTMLTags.stylesheets.join("\n"),
    });

    const documentFile = await File.write(documentFilePath, documentContent);
    return documentFile;
  }

  async getDocumentTemplate(): Promise<string | null> {
    const documentTemplatePath = join(
      this.project.path,
      PROJECT_APP_DIRECTORY_NAME,
      "_document.[js,ts]"
    );

    const file = await File.resolve(documentTemplatePath);
    if (!file || !(await file.exist())) return null;

    const documentBundleTemplatePath = join(
      this.project.path,
      PROJECT_INTERNAL_DIRECTORY_NAME
    );

    const bundler = new Bundler(this.project, {
      entry: {
        [`${file.filename}-${this.id}`]: file.path,
      },
      output: {
        path: documentBundleTemplatePath,
        libraryTarget: "umd",
      },
      target: "node",
    });

    const bundleResultFiles = await bundler.run();
    const documentBundleFile = bundleResultFiles[0];
    const documentTemplate = (
      (await documentBundleFile.import()) as {
        default: () => string;
      }
    ).default();

    return documentTemplate;
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
