export interface WebpackDevConfig {
  entry: {
    [key: string]: string[];
  };
  output: {
    path: string;
  };
}
