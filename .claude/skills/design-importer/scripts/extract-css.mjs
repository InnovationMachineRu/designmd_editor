#!/usr/bin/env node
// Extract token candidates from a CSS file (or a folder of .css files).
// Usage: node extract-css.mjs <path-to-css-or-folder>
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const input = process.argv[2] || "./input";

function cssFiles(p) {
  const s = statSync(p);
  if (s.isFile()) return extname(p) === ".css" ? [p] : [];
  return readdirSync(p)
    .filter((f) => extname(f) === ".css")
    .map((f) => join(p, f));
}

const files = cssFiles(input);
if (files.length === 0) {
  console.error(JSON.stringify({ error: `No .css found at ${input}` }));
  process.exit(1);
}

const text = files.map((f) => readFileSync(f, "utf8")).join("\n");

const uniq = (arr) => [...new Set(arr)];
const matchAll = (re) => uniq([...text.matchAll(re)].map((m) => m[0].trim()));

const customProps = uniq(
  [...text.matchAll(/--[\w-]+\s*:\s*([^;]+);/g)].map((m) => m[0].trim())
);
const colors = uniq([
  ...matchAll(/#[0-9a-fA-F]{3,8}\b/g),
  ...matchAll(/rgba?\([^)]*\)/g),
  ...matchAll(/hsla?\([^)]*\)/g),
  ...matchAll(/oklch\([^)]*\)/g),
]);
const fontFamilies = uniq(
  [...text.matchAll(/font-family\s*:\s*([^;]+);/gi)].map((m) => m[1].trim())
);
const radii = uniq(
  [...text.matchAll(/border-radius\s*:\s*([^;]+);/gi)].map((m) => m[1].trim())
);
const spacing = uniq([
  ...[...text.matchAll(/(?:padding|margin|gap)\s*:\s*([^;]+);/gi)].map((m) => m[1].trim()),
]);

console.log(
  JSON.stringify(
    {
      files,
      customProps: customProps.slice(0, 60),
      colors: colors.slice(0, 60),
      fontFamilies: fontFamilies.slice(0, 20),
      radii: radii.slice(0, 20),
      spacing: spacing.slice(0, 40),
    },
    null,
    2
  )
);
