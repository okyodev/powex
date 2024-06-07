import fs from "node:fs";
import nodePath from "node:path";
import { packageCode } from "./package-code";
import { POWEX_PROJECT_DIRECTORY_NAME } from "../constants/powex.constants";
import { getProjectPath } from "./get-project-path";

export const getExternalCode = async (path: string): Promise<string> => {
  if (!fs.existsSync(path)) {
    throw `The code with the path (${path}) don't exist`;
  }

  const metafile = await packageCode({
    paths: [path],
    outdir: `./${POWEX_PROJECT_DIRECTORY_NAME}`,
    format: "cjs",
    platform: "node",
  });

  const outputFilePath = nodePath.join(
    getProjectPath(),
    Object.entries(metafile.outputs)[0][0]
  );

  const code = await fs.promises.readFile(outputFilePath, {
    encoding: "utf-8",
  });

  return code;
};
