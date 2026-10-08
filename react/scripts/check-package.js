// Usage: node react/scripts/check-package.js <package dir>
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? '.');
const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
const errors = [];

const leaves = (value) => (typeof value === 'string' ? [value] : Object.values(value ?? {}).flatMap(leaves));
const exportKeys = Object.keys(pkg.exports ?? {}).filter((key) => !key.includes('*'));
for (const key of exportKeys) {
  for (const target of leaves(pkg.exports[key])) {
    if (!existsSync(join(dir, target))) errors.push(`exports["${key}"] -> ${target}: missing`);
  }
}

if (!existsSync(join(dir, 'index.js'))) errors.push('index.js: missing');

const specifierPattern = /(?:\bfrom|\bimport)\s*\(?\s*['"](\.\.?\/[^'"]+)['"]/gu;
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
    .replace(/[.+^${}()|[\]\\]/gu, '\\$&')
    .replace(/\*\*\/|\*\*|\*|\?/gu, (m) => ({ '**/': '(?:.*/)?', '**': '.*', '*': '[^/]*', '?': '[^/]' })[m]);
  return new RegExp(`^${source}(?:/.*)?$`, 'u');
};
const included = [...(pkg.files ?? []), 'package.json', 'README.md', 'LICENSE'].map(toRegExp);
const [{ files: packed }] = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: dir, encoding: 'utf8' }),
);
for (const { path } of packed) {
  if (!included.some((regExp) => regExp.test(path))) errors.push(`packed file not matched by "files": ${path}`);
}

if (errors.length > 0) {
  console.error(`FAIL ${pkg.name}\n${errors.map((error) => `  ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(`OK ${pkg.name} (${exportKeys.length} exports, ${packed.length} files)`);
