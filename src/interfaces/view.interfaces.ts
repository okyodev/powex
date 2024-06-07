export type RenderView = "POPUP" | "SIDE_PANEL";
export type ViewExtensions = "js" | "jsx" | "ts" | "tsx";
export type View = "POPUP" | "SIDE_PANEL" | "LAYOUT" | "DOCUMENT";

export interface RenderViewsResult {
  popup: boolean;
  sidePanel: boolean;
}
