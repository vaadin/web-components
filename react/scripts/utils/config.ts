import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
export const rootDir = resolve(__dirname, '../..');
const packagesDir = cwd;
export const packageDir = resolve(packagesDir, packagesDir);
export const srcDir = resolve(packageDir, 'src');
export const generatedDir = resolve(srcDir, 'generated');
export const utilsDir = resolve(srcDir, 'utils');
export const nodeModulesDir = resolve(rootDir, 'node_modules');
export const typesDir = resolve(rootDir, 'types');

export const rootURL = pathToFileURL(`${rootDir}/`);
export const packageURL = pathToFileURL(`${packageDir}/`);
export const srcURL = pathToFileURL(`${srcDir}/`);
export const generatedURL = pathToFileURL(`${generatedDir}/`);

await Promise.all([mkdir(generatedDir, { recursive: true }), mkdir(typesDir, { recursive: true })]);
