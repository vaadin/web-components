import { buildDir, nodeModulesDir, packages } from './config.js';
import { execPromisified } from './utils.js';
import { resolve, dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

async function analyzePackage(packageName: string) {
  const packageDir = resolve(nodeModulesDir, packageName);
  try {
    await execPromisified(
      `npx --no -c 'wca --discoverNodeModules=true --format=json --outDir=${buildDir}'`,
      {
        cwd: packageDir,
      }
    );
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(`Package ${packageName} is not found in the directory: ${packageDir}`);
    } else {
      throw e;
    }
  }
}

await mkdir(buildDir, { recursive: true });
await Promise.all(packages.map(analyzePackage));
