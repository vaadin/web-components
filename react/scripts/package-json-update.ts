import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname, relative, resolve, sep } from 'node:path';
import type { PackageJson } from 'type-fest';
import { rootDir, srcDir } from './utils/config.js';
import fromAsync from './utils/fromAsync.js';
import { fswalk } from './utils/fswalk.js';

const packageJsonPath = resolve(rootDir, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

const exports: Record<string, PackageJson.Exports> = {
  './package.json': './package.json',
};

type PlainExportsEntry = readonly [entrypoint: string, path: string];
type ConditionalExportsEntry = readonly [entrypoint: string, exportConditions: Partial<PackageJson.ExportConditions>];
type ExportsEntry = PlainExportsEntry | ConditionalExportsEntry;

const collator = new Intl.Collator('en', { sensitivity: 'base' });
function compareExportsPaths([entrypointA]: ExportsEntry, [entrypointB]: ExportsEntry) {
  return collator.compare(entrypointA, entrypointB);
}

const moduleNames = await fromAsync(fswalk(srcDir), async ([path]) => {
  return basename(path, extname(path));
});

Object.assign(
  exports,
  Object.fromEntries(
    moduleNames
      .map(
        (moduleName) =>
          [
            `./${moduleName}.js`,
            { types: `./${moduleName}.d.ts`, default: `./${moduleName}.js` },
          ] as ConditionalExportsEntry,
      )
      .sort(compareExportsPaths),
  ),
);

// Add extensionless compatibility export aliases. NOTE: the order
// is important, the earlier entries with .js have higher priority
// and are preferred over the ones without the extension.
Object.assign(
  exports,
  Object.fromEntries(
    moduleNames
      .map((moduleName) => [`./${moduleName}`, `./${moduleName}.js`] as PlainExportsEntry)
      .sort(compareExportsPaths),
  ),
);

// Add css file entries
const outCssDir = resolve(rootDir, 'css');
Object.assign(
  exports,
  Object.fromEntries(
    (
      await fromAsync(fswalk(outCssDir, { recursive: true }), async ([path]) => {
        const cssPath = relative(outCssDir, path).replaceAll(sep, '/');

        return [`./css/${cssPath}`, `./css/${cssPath}`] as PlainExportsEntry;
      })
    ).sort(compareExportsPaths),
  ),
);

packageJson['exports'] = exports;

await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
