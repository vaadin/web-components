import { build, type Plugin } from 'esbuild';
import { glob } from 'glob';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from './generator.js';
import { generatedURL, nodeModulesDir, packageDir, packageURL, rootDir, srcDir, srcURL } from './utils/config.js';
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

const fixImports: Plugin = {
  name: 'add-imports',
  setup(build) {
    build.onResolve({ filter: /\.\.?\/(?:utils|renderers)/ }, (args) => {
      return { path: `./${basename(dirname(args.path))}/${basename(args.path)}`, external: true };
    });

    // Workaround for https://github.com/evanw/esbuild/issues/1433
    build.onLoad({ filter: /src[/\\][A-Za-z_-]+\.tsx?$/ }, async ({ path }) => {
      const result = basename(path, extname(path));
      const [contents, generatedContents] = await Promise.all([
        readFile(path, 'utf8'),
        readFile(new URL(`${result}.ts`, generatedURL), 'utf8'),
      ]);

      const exportAllLine = generatedContents.split('\n').find((line) => line.startsWith('export *')) ?? '';

      return {
        contents: `${exportAllLine}\n${contents}`,
        loader: 'tsx',
      };
    });

    // Workaround for https://github.com/evanw/esbuild/issues/1433
    build.onLoad({ filter: /src[/\\]generated[/\\][A-Za-z_-]+\.ts$/ }, async ({ path }) => {
      return {
        contents: (await readFile(path, 'utf8'))
          .split('\n')
          .filter((line) => !line.startsWith('export *'))
          .join('\n'),
        loader: 'tsx',
      };
    });
  },
};

async function detectEntryPoints(patterns: string[], ignore: string[] = []) {
  return (
    await glob(patterns, {
      cwd: fileURLToPath(srcURL),
      ignore: ['**/*.d.ts', ...ignore],
    })
  )
    .map((file) => new URL(file, srcURL))
    .map((url) => fileURLToPath(url));
}

async function bundle() {
  const packageJson = await readPackageJson();

  const commonOptions = {
    define: {
      __VERSION__: `'${packageJson.version ?? '0.0.0'}'`,
    },
    format: 'esm',
    minify: true,
    outdir: fileURLToPath(packageURL),
    sourcemap: 'linked',
    sourcesContent: true,
    target: 'es2021',
    tsconfig: fileURLToPath(new URL('./tsconfig.build.json', packageURL)),
  } as const;

  const [componentEntryPoints, utilsEntryPoints, renderersEntryPoints] = await Promise.all([
    detectEntryPoints(['*.{ts,tsx}']),
    detectEntryPoints(['utils/*.{ts,tsx}']),
    detectEntryPoints(['renderers/*.{ts,tsx}']),
  ]);

  await Promise.all([
    build({
      ...commonOptions,
      bundle: true,
      entryPoints: componentEntryPoints,
      packages: 'external',
      plugins: [fixImports],
    }),
    build({
      ...commonOptions,
      outdir: join(commonOptions.outdir, 'utils'),
      entryPoints: utilsEntryPoints,
    }),
    build({
      ...commonOptions,
      outdir: join(commonOptions.outdir, 'renderers'),
      entryPoints: renderersEntryPoints,
    }),
  ]);
}

function emitDeclarations() {
  execFileSync(process.execPath, [resolve(nodeModulesDir, 'typescript/bin/tsc'), '-p', 'tsconfig.build.json'], {
    cwd: packageDir,
    stdio: 'inherit',
  });
}

/** Copies the type-only `.d.ts` files from `src/`, which `tsc` does not emit. */
async function copyDts() {
  const files = await glob('**/*.d.ts', { cwd: srcDir });
  await Promise.all(
    files.map(async (file) => {
      const dest = resolve(packageDir, file);
      await mkdir(dirname(dest), { recursive: true });
      await copyFile(resolve(srcDir, file), dest);
    }),
  );
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

/** Removes previous build output so that renamed or deleted sources do not linger in the package. */
async function clean() {
  const outputs = await glob(['*.{js,d.ts,map}', 'generated', 'utils', 'renderers', 'css'], { cwd: packageDir });
  await Promise.all(outputs.map((output) => rm(resolve(packageDir, output), { recursive: true, force: true })));
}

await clean();
await generate();
if (basename(packageDir) === 'react-components') {
  await generateCss();
}
await bundle();
emitDeclarations();
await copyDts();
await updateExports();
