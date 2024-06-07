import fs from "node:fs";
import esbuild from "esbuild";
import postcss from "esbuild-postcss";

type Format = "iife" | "cjs" | "esm";
type Platform = "node" | "browser" | "neutral";

interface PackageCodeOptions {
  paths: string[];
  outdir: string;
  format?: Format;
  platform?: Platform;
}

export const packageCode = async ({
  paths,
  outdir,
  format = "iife",
  platform = "browser",
}: PackageCodeOptions) => {
  // todo: add more files
  const result = await esbuild.build({
    entryPoints: paths,
    loader: {
      ".png": "file",
      ".jpg": "file",
    },
    assetNames: "assets/[name]-[hash]",
    entryNames: "[dir]/[name]",
    bundle: true,
    allowOverwrite: true,
    jsx: "automatic",
    metafile: true,
    outdir, 
    plugins: [postcss()],
    platform,
    format,
  });

  return result.metafile;
};
