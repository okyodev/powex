export const transformTemplate = (
  template: string,
  values: Record<string, string>
): string => {
  return template.replace(/%\w+%/g, (match, p1): string => {
    const key = match.substring(1, match.length - 1);
    return values[key] || "";
  });
};
