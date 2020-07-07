export const IsNullOrWhitespace = (string: string): boolean => {
  if (typeof string === 'undefined' || string == null) return true;
  return !/\S/g.test(string);
}