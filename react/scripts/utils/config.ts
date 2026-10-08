import { basename, dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Monorepo root. Scripts run from the package directory.
export const rootDir = resolve(__dirname, '../../..');
export const packageDir = process.cwd();

// The build removes `*.js` and `*.d.ts` from the package directory, so refuse any other directory.
if (dirname(packageDir) !== resolve(rootDir, 'packages') || !basename(packageDir).startsWith('react-components')) {
  throw new Error(
    `Run this script from a React package directory (packages/react-components*), not from ${relative(rootDir, packageDir) || '.'}`,
  );
}
export const srcDir = resolve(packageDir, 'src');
export const generatedDir = resolve(srcDir, 'generated');
export const utilsDir = resolve(srcDir, 'utils');
export const nodeModulesDir = resolve(rootDir, 'node_modules');
export const typesDir = resolve(rootDir, 'react/scripts/types');

export const packageURL = pathToFileURL(`${packageDir}/`);
export const srcURL = pathToFileURL(`${srcDir}/`);
export const generatedURL = pathToFileURL(`${generatedDir}/`);
