import { ProjectConfig, ProjectEnvironment } from "./project.types";

export const PROJECT_ENVIRONMENT: Record<
  Uppercase<ProjectEnvironment>,
  ProjectEnvironment
> = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};

export const PROJECT_INTERNAL_DIRECTORY_NAME = ".powex";
export const PROJECT_INTERNAL_OUTPUT_DIRECTORY_NAME_BY_ENVIRONMENT: Record<
  ProjectEnvironment,
  `${string}/${ProjectEnvironment}`
> = {
  development: `./${PROJECT_INTERNAL_DIRECTORY_NAME}/development`,
  production: `./${PROJECT_INTERNAL_DIRECTORY_NAME}/production`,
};

export const PROJECT_CONFIG_FILE_NAME = "powex.config.[js,ts]";
export const PROJECT_APP_DIRECTORY_NAME = "src/app";

export const PROJECT_DEFAULT_CONFIG: ProjectConfig = {
  name: "Powex",
  description: "Extension generated with Powex",
  version: "1.0.0",
};
