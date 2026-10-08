// Usage: node react/scripts/check-package.js packages/<package>
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Only packages of this repo can be checked, so the argument is reduced to a package name.
const packagesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../packages');
const dir = join(packagesDir, basename(process.argv[2] ?? ''));
const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
const errors = [];

const leaves = (value) => (typeof value === 'string' ? [value] : Object.values(value ?? {}).flatMap(leaves));
const exportKeys = Object.keys(pkg.exports ?? {}).filter((key) => !key.includes('*'));
if (exportKeys.length === 0) errors.push('exports: empty');
for (const key of exportKeys) {
  for (const target of leaves(pkg.exports[key])) {
    if (!existsSync(join(dir, target))) errors.push(`exports["${key}"] -> ${target}: missing`);
  }
}

if (!existsSync(join(dir, 'index.js'))) errors.push('index.js: missing');

const specifierPattern = /\b(?:from|import)\s*(?:\(\s*)?['"](\.\.?\/[^'"]+)['"]/gu;
const files = [
  ...readdirSync(dir).filter((file) => /\.(js|d\.ts)$/u.test(file)),
  ...['generated', 'utils', 'renderers']
    .filter((sub) => existsSync(join(dir, sub)))
    .flatMap((sub) => readdirSync(join(dir, sub), { recursive: true }).map((file) => join(sub, file)))
    .filter((file) => /\.(js|d\.ts)$/u.test(file)),
];
for (const file of files) {
  for (const [, specifier] of readFileSync(join(dir, file), 'utf8').matchAll(specifierPattern)) {
    const target = resolve(dir, dirname(file), specifier);
    // A `.d.ts` file may reference `./X.js`, which resolves to `./X.d.ts`.
    const found = existsSync(target) || (file.endsWith('.d.ts') && existsSync(target.replace(/\.js$/u, '.d.ts')));
    if (!found) errors.push(`${file}: '${specifier}' not found`);
  }
}

const toRegExp = (pattern) => {
  const source = pattern
    .replace(/^\.?\//u, '')
    .replace(/\/$/u, '')
    .replace(/[.+^${}()|[\]\\]/gu, String.raw`\$&`)
    .replace(/\*\*\/|\*\*|\*|\?/gu, (m) => ({ '**/': '(?:.*/)?', '**': '.*', '*': '[^/]*', '?': '[^/]' })[m]);
  return new RegExp(`^${source}(?:/.*)?$`, 'u');
};
const included = [...(pkg.files ?? []), 'package.json', 'README.md', 'LICENSE'].map(toRegExp);
const [{ files: packed }] = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: dir, encoding: 'utf8' }),
);
const packedPaths = new Set(packed.map(({ path }) => path));
for (const path of packedPaths) {
  if (!included.some((regExp) => regExp.test(path))) errors.push(`packed file not matched by "files": ${path}`);
}
for (const key of exportKeys) {
  for (const target of leaves(pkg.exports[key])) {
    if (!packedPaths.has(target.replace(/^\.\//u, ''))) errors.push(`exports["${key}"] -> ${target}: not packed`);
  }
}

if (errors.length > 0) {
  const list = errors.map((error) => `  ${error}`).join('\n');
  console.error(`FAIL ${pkg.name}\n${list}`);
  process.exit(1);
}
console.log(`OK ${pkg.name} (${exportKeys.length} exports, ${packed.length} files)`);
