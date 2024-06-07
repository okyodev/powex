import { VIEW_PATH } from "../constants/view.constants";
import { View, ViewExtensions } from "../interfaces/view.interfaces";
import { getProjectPath } from "./get-project-path";
import nodePath from "node:path";
import fsa from "fs-extra";
import { getValidPath } from "./get-valid-path";

export const getViewPath = async (view: View): Promise<string | null> => {
  const projectPath = getProjectPath();
  const viewExtensions: ViewExtensions[] = ["js", "jsx", "ts", "tsx"];

  const viewPath = await getValidPath(
    nodePath.join(projectPath, VIEW_PATH[view]),
    viewExtensions
  );

  return viewPath;
};
