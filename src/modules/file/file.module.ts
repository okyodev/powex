import nodePath from "node:path";
import fs from "node:fs";
import fsa from "fs-extra";

import { BundlerOptions } from "../bundler/bundler.types";
import { Bundler } from "../bundler/bundler.module";

export class File {
  path: string;
  filename: string;
  extension: string;

  constructor(path: string) {
    this.path = path;
    this.extension = nodePath.extname(path).replace(".", "");
    this.filename = nodePath.basename(path, `.${this.extension}`);
  }

  relativePath(from: string): string {
    const relativePath = nodePath.relative(from, this.path);
    if (relativePath === `${this.filename}.${this.extension}`)
      return `./${this.filename}.${this.extension}`;

    return relativePath;
  }

  async exist(): Promise<boolean> {
    return fs.existsSync(this.path);
  }

  require(): unknown {
    return require(this.path);
  }

  import(): Promise<unknown> {
    return import(this.path);
  }

  static async resolve(path: string): Promise<File | null> {
    const DynamicExtRegex = /\[.*\]$/;
    const ext = DynamicExtRegex.exec(path);

    if (!ext) return null;

    const extensions = ext[0]
      .replace(/\[|\]/g, "")
      .split(",")
      .map((ext) => ext.trim());
    const pathWithoutExt = path.replace(DynamicExtRegex, "");

    const fileExistTasks = extensions.map((extension) => {
      const file = new File(pathWithoutExt + extension);
      return file.exist();
    });

    const fileExistResults = await Promise.all(fileExistTasks);
    const fileExistIndex = fileExistResults.findIndex((exist) => exist);

    if (fileExistIndex === -1) return null;

    return new File(pathWithoutExt + extensions[fileExistIndex]);
  }

  static async write(path: string, content: string): Promise<File | null> {
    try {
      await fsa.writeFile(path, content);
      return new File(path);
    } catch (error) {
      console.error(`Error writing the file (${path})`, error);
      return null;
    }
  }
}
