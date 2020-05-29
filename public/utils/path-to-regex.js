export default function pathToRegex(path) {
  const regex = /:([^/]+)/g;
  let pattern = path;

  pattern = pattern.replace(regex, "([^/]+)");
  pattern = `^${pattern}/?$`;
  pattern = pattern.replace("//", "/");

  const matches = Array.from(path.matchAll(regex), m => m[1]);

  return { pattern: pattern, params: matches };
}
