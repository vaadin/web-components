import { glob } from 'glob';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { generate } from './generator.js';
import { generatedDir, nodeModulesDir, packageDir, rootDir, srcDir } from './utils/config.js';
import { camelCase, listModuleNames } from './utils/misc.js';
import type { PackageJson } from './utils/package-json.js';

const packageJsonPath = resolve(packageDir, 'package.json');

async function readPackageJson(): Promise<PackageJson> {
  return JSON.parse(await readFile(packageJsonPath, 'utf8'));
}

/**
 * Exposes Lumo utility styles as CSS modules for backwards compatibility.
 * File names and paths match the previous `css/lumo/*.module.css` paths.
 */
async function generateCss() {
  const themePackage = resolve(rootDir, 'packages/vaadin-lumo-styles');
  const utilitiesSourceDir = resolve(themePackage, 'src/utilities');
  const outputDir = resolve(packageDir, 'css/lumo');
  const utilitiesOutputDir = resolve(outputDir, 'utilities');
  const toModuleName = (file: string) => `${camelCase(basename(file, '.css'))}.module.css`;

  await mkdir(utilitiesOutputDir, { recursive: true });

  const files = (await readdir(utilitiesSourceDir)).filter((file) => file.endsWith('.css'));
  await Promise.all(
    files.map((file) => copyFile(resolve(utilitiesSourceDir, file), resolve(utilitiesOutputDir, toModuleName(file)))),
  );

  const entryPointCss = (await readFile(resolve(themePackage, 'utility.css'), 'utf8')).replace(
    /@import\s+['"]([^'"]+)['"];/g,
    (_match, path: string) => `@import './utilities/${toModuleName(path)}';`,
  );
  await writeFile(resolve(outputDir, 'Utility.module.css'), entryPointCss, 'utf8');
}

/** Writes `src/generated/version.ts`, which `createComponent.ts` reports in `window.Vaadin.registrations`. */
async function generateVersion() {
  const { version = '0.0.0' } = await readPackageJson();
  await writeFile(resolve(generatedDir, 'version.ts'), `export const version = '${version}';\n`, 'utf8');
}

/** Emits unbundled JS, declarations and source maps from `src/` into the package root with `tsc`. */
function emit() {
  execFileSync(process.execPath, [resolve(nodeModulesDir, 'typescript/bin/tsc'), '-p', 'tsconfig.build.json'], {
    cwd: packageDir,
    stdio: 'inherit',
  });
}

// `css/` is listed one level deep on purpose: the `css/lumo/utilities/*` modules are
// published but not exported, which keeps the exports map identical to the previous one.
async function listOutputFiles(dir: string, pattern = '**/*'): Promise<string[]> {
  const outDir = resolve(packageDir, dir);
  if (!existsSync(outDir)) {
    return [];
  }

  const files = await glob(pattern, { cwd: outDir, posix: true, nodir: true });
  return files.map((file) => `./${dir}/${file}`);
}

async function updateExports() {
  const packageJson = await readPackageJson();
  const collator = new Intl.Collator('en', { sensitivity: 'base' });
  const moduleNames = await listModuleNames(srcDir);
  const sortedEntries = (paths: string[]) =>
    Object.fromEntries([...paths].sort(collator.compare).map((path) => [path, path]));

  const [cssFiles, utilsFiles, renderersFiles] = await Promise.all([
    listOutputFiles('css', '*/*'),
    listOutputFiles('utils'),
    listOutputFiles('renderers'),
  ]);

  packageJson.exports = {
    '.': {
      types: './index.d.ts',
      default: './index.js',
    },
    './package.json': './package.json',
    ...Object.fromEntries(
      moduleNames
        .map((name) => [`./${name}.js`, { types: `./${name}.d.ts`, default: `./${name}.js` }] as const)
        .sort(([a], [b]) => collator.compare(a, b)),
    ),
    // Extensionless compatibility aliases. The order matters: the earlier
    // `.js` entries have higher priority than the ones without extension.
    ...Object.fromEntries(
      moduleNames.map((name) => [`./${name}`, `./${name}.js`] as const).sort(([a], [b]) => collator.compare(a, b)),
    ),
    ...sortedEntries(cssFiles),
    ...sortedEntries(utilsFiles),
    ...sortedEntries(renderersFiles),
  };

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
}

/** Removes the generated sources and the build output, so that renamed or deleted sources do not linger. */
async function clean() {
  const outputs = await glob(['*.{js,d.ts,map}', 'generated', 'utils', 'renderers', 'css', 'src/generated'], {
    cwd: packageDir,
  });
  await Promise.all(outputs.map((output) => rm(resolve(packageDir, output), { recursive: true, force: true })));
}

// Usage: tsx build.ts [--clean]
await clean();
if (!process.argv.includes('--clean')) {
  await generate();
  if (basename(packageDir) === 'react-components') {
    await Promise.all([generateCss(), generateVersion()]);
  }
  emit();
  await updateExports();
}
