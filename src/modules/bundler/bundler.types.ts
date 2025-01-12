import { Configuration } from "webpack";

export interface BundlerOptions
  extends Omit<Pick<Configuration, "output" | "target" | "plugins">, "entry"> {
  entry: Record<string, string | string[]>;
}
