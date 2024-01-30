import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { PackageJson } from 'type-fest';
import { packageDir, rootDir } from './utils/config.js';

console.log('Updating Vaadin web components versions in "package.json"...');

const workspacePackageJsonPath = resolve(rootDir, 'package.json');
const workspacePackageJson = JSON.parse(await readFile(workspacePackageJsonPath, 'utf8')) as PackageJson;
// Web components version should be the same as the version of the react-components package:
const componentsVersion = workspacePackageJson.version;
console.log(`Using "${componentsVersion}" as the version for web components.`);

const packageJsonPath = resolve(packageDir, 'package.json');

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson;

Object.keys(packageJson.dependencies!).forEach((name) => {
  if (!name.startsWith('@vaadin/')) {
    return;
  }

  packageJson.version = componentsVersion;
  packageJson.dependencies![name] = componentsVersion;
});

await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

// Update version metadata in the sources

const versionSourceFile = resolve(packageDir, 'src/utils/createComponent.ts');
if (existsSync(versionSourceFile)) {
  console.log(`Updating version metadata in "${versionSourceFile}"...`);
  const versionSourcePath = resolve(rootDir, versionSourceFile);
  const versionSource = await readFile(versionSourcePath, 'utf8');
  const newVersionSource = versionSource.replace(
    /version:.+,/g,
    `version: /* updated-by-script */ '${componentsVersion}',`,
  );

  await writeFile(versionSourcePath, newVersionSource, 'utf8');
}
