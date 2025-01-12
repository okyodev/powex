import { Project } from "../project/project.module";


/*
  Todo: Script
  
  A script is a abstraction of "content-scripts" in the manifest.json file.
  the script should be have the next format.

  ```
  export const config = {
    matches: [...],
    world: "..."
    run: "...",
  }

  const Script = async () => {
    ...
  }

  export default Script;
  ```

  To create a script just create a new file in `app/scripts/*.[ts/js]`

  ! This is just for content-scripts, not background-scripts.
  ! The background script should `app/background.[ts/js]` file, on my opinion.
  ! also, maybe, a Background class in the `background.module.ts` file.
  
 */

export class Script {
  static async scan(project: Project) {
    console.log("Scanning scripts");
  }
}
