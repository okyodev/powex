import { View } from "../interfaces/view.interfaces";

export const POPUP_PATH = "/src/app/popup.tsx";
export const SIDE_PANEL_PATH = "/src/app/side-panel.tsx";
export const LAYOUT_PATH = "/src/app/layout.tsx";
export const DOCUMENT_PATH = "/src/app/document.ts";

export const VIEW_PATH: Record<View, string> = {
  POPUP: POPUP_PATH,
  SIDE_PANEL: SIDE_PANEL_PATH,
  LAYOUT: LAYOUT_PATH,
  DOCUMENT: DOCUMENT_PATH,
};
