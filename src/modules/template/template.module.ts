export class Template {
  static parse(template: string, values: Record<string, string>): string {
    return template.replace(/%\w+%/g, (match): string => {
      const key = match.substring(1, match.length - 1);
      return values[key] || match;
    });
  }
}
