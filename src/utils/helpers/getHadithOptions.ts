export function getHadithOptions<T extends Record<string, unknown>>(
  obj: T,
): Array<keyof T> {
  return Object.keys(obj);
}
