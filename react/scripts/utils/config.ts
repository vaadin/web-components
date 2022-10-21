import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const rootDir = resolve(__dirname, '../..');
export const srcDir = resolve(rootDir, 'src');
export const generatedDir = resolve(srcDir, 'generated');
export const utilsDir = resolve(srcDir, 'utils');
export const nodeModulesDir = resolve(rootDir, 'node_modules');
export const typesDir = resolve(rootDir, 'types');

await Promise.all([mkdir(generatedDir, { recursive: true }), mkdir(typesDir, { recursive: true })]);
