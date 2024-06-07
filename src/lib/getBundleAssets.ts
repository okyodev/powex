import { Metafile } from "esbuild";
import { Assets } from "../interfaces/assets.interfaces";

export const getBundleAssets = (metadata: Metafile): Assets => {
  return Object.keys(metadata.outputs).reduce<Assets>(
    (acc, output) => {
      const fileName = output.split("/").at(-1) || "";
      const mimetype = fileName.split(".").at(-1) || "";

      if (mimetype === "js") {
        acc.scripts.push(output);
        return acc;
      }

      if (mimetype === "css") {
        acc.stylesheets.push(output);
        return acc;
      }

      return acc;
    },
    {
      scripts: [],
      stylesheets: [],
    }
  );
};
