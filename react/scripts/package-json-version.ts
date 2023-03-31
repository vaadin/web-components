import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname, relative, resolve, sep } from 'node:path';
import type { PackageJson } from 'type-fest';
import { rootDir } from './utils/config.js';

console.log('Updating Vaadin web components versions in "package.json"...');

const packageJsonPath = resolve(rootDir, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson;
// Increase major version number by 22 to get components version
const [major, ...rest] = (packageJson.version || '').split('.');
const componentsVersion = [22 + Number(major), ...rest].join('.');

Object.keys(packageJson.dependencies!).forEach((name) => {
  if (!name.startsWith('@vaadin/')) {
    return;
  }

  packageJson.dependencies![name] = componentsVersion;
});

await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

// Update version metadata in the sources

const versionSourceFile = 'src/utils/createComponent.ts';
console.log(`Updating version metadata in "${versionSourceFile}"...`);
const versionSourcePath = resolve(rootDir, versionSourceFile);
const versionSource = await readFile(versionSourcePath, 'utf8');
const newVersionSource = versionSource.replace(
  /version:.+,/g,
  `version: /* updated-by-script */ '${packageJson.version}',`,
);

await writeFile(versionSourcePath, newVersionSource, 'utf8');
