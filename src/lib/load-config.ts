import fs from "node:fs";
import { resolve } from "node:path";
import { DEFAULT_CONFIG } from "../constants/config.contants";
import { Config } from "../interfaces/config.interfaces";

export const loadConfig = (path: string): Config => {
  const fileConfigPath = resolve(path, "./powex.config.js");

  if (!fs.existsSync(fileConfigPath)) {
    return DEFAULT_CONFIG;
  }

  const fileConfig = require(fileConfigPath) as Config;

  return {
    ...DEFAULT_CONFIG,
    ...fileConfig,
  };
};
