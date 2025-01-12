import { PROJECT_APP_DIRECTORY_NAME } from "../project/project.constants";
import { ViewId } from "./view.types";

export const VIEW_LAYOUT_FILE_NAME = "layout";
export const VIEW_POPUP_ID: ViewId = "popup";
export const VIEW_SIDEPANEL_ID: ViewId = "sidepanel";

export const VIEW_REACT_ROOT_COMPONENT_TEMPLATE = /*js*/ `import React from "react";
import { createRoot } from "react-dom/client";
import Layout from "%layout_path%"
import View from "%base_path%"

const App = () => {
  return (
    <Layout>
      <View />
    </Layout>
  )
}

// render component
const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);`;
