export const IsNullOrWhitespace = (string: string): boolean => {
  if (!string) return true;
  return !/\S/g.test(string);
}