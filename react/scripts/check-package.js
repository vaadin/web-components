// Checks the built React packages: every `exports` target, `index.js` specifier and relative
// import in the emitted files exists, and every `exports` target is covered by `files`.
// Usage: node react/scripts/check-package.js
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packagesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../packages');
const packageNames = ['react-components', 'react-components-pro'].filter((name) =>
  existsSync(join(packagesDir, name, 'package.json')),
);

const toRegExp = (pattern) => {
  const source = pattern
    .replace(/^\.?\//u, '')
    .replace(/\/$/u, '')
    .replace(/[.+^${}()|[\]\\]/gu, String.raw`\$&`)
    .replace(/\*\*\/|\*\*|\*|\?/gu, (m) => ({ '**/': '(?:.*/)?', '**': '.*', '*': '[^/]*', '?': '[^/]' })[m]);
  return new RegExp(`^${source}(?:/.*)?$`, 'u');
};

const leaves = (value) => (typeof value === 'string' ? [value] : Object.values(value ?? {}).flatMap(leaves));
const specifierPattern = /\b(?:from|import)\s*(?:\(\s*)?['"](\.\.?\/[^'"]+)['"]/gu;

function checkPackage(name) {
  const dir = join(packagesDir, name);
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const errors = [];

  const exportKeys = Object.keys(pkg.exports ?? {}).filter((key) => !key.includes('*'));
  if (exportKeys.length === 0) errors.push('exports: empty');
  const published = [...(pkg.files ?? []), 'package.json', 'README.md', 'LICENSE'].map(toRegExp);
  for (const key of exportKeys) {
    for (const target of leaves(pkg.exports[key])) {
      if (!existsSync(join(dir, target))) errors.push(`exports["${key}"] -> ${target}: missing`);
      const path = target.replace(/^\.\//u, '');
      if (!published.some((regExp) => regExp.test(path))) errors.push(`exports["${key}"] -> ${target}: not in "files"`);
    }
  }

  if (!existsSync(join(dir, 'index.js'))) errors.push('index.js: missing');

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

  if (errors.length > 0) {
    const list = errors.map((error) => `  ${error}`).join('\n');
    console.error(`FAIL ${name}\n${list}`);
    return false;
  }
  console.log(`OK ${name} (${exportKeys.length} exports, ${files.length} emitted files)`);
  return true;
}

if (!packageNames.every(checkPackage)) {
  process.exit(1);
}
