import fsa from "fs-extra";
import nodePath from "node:path";
import { generateBundle } from "../lib/render/generate-bundle";
import { Chunk } from "webpack";

export const getBundleExternalCode = async (path: string, outdir: string) => {
  if (!(await fsa.exists(path))) {
    throw new Error(`The code with the path (${path}) don't exist`);
  }

  const filename: string | undefined = path.split("\\").at(-1)?.split(".")[0];

  if (!filename) {
    throw new Error("the path should be a path of a file");
  }

  const bundleStats = await generateBundle({
    entry: {
      [filename]: path,
    },
    output: {
      path: outdir,
      libraryTarget: "umd",
    },
    target: "node",
  });

  const bundleChunk: Chunk = bundleStats.compilation.namedChunks.get(
    filename
  ) as Chunk;

  const outputBundleFile = nodePath.join(outdir, [...bundleChunk.files][0]);

  return await import(outputBundleFile);
};
