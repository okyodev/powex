import { Assets } from "../interfaces/assets.interfaces";

export const transformAssetsToElements = (
  assets: Assets
): Record<keyof Assets, string[]> => {
  return {
    scripts: assets.scripts.map((asset) => {
      const filename = asset.split("/").at(-1) || "";
      return `<script type="module" crossorigin src="./${filename}"></script>`;
    }),
    stylesheets: assets.stylesheets.map((asset) => {
      const filename = asset.split("/").at(-1) || "";
      return `<link rel="stylesheet" crossorigin href="./${filename}">`;
    }),
  };
};
