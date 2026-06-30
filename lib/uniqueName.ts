/** Generate a unique `base-N` key not present in the given object. */
export function uniqueName(base: string, obj: Record<string, unknown>): string {
  let i = 1;
  let name = `${base}-${i}`;
  while (name in obj) name = `${base}-${++i}`;
  return name;
}
