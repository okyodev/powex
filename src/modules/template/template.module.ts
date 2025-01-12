export class Template {
  static parse<T extends Record<string, string>>(
    template: string,
    values: T
  ): string {
    return template.replace(/%\w+%/g, (match): string => {
      const key = match.substring(1, match.length - 1);
      return values[key] || match;
    });
  }
}
