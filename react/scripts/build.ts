import { basename, dirname, extname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build, type Plugin } from 'esbuild';
import { glob } from 'glob';
import type { PackageJson } from 'type-fest';
import { packageURL, srcURL, generatedURL } from './utils/config.js';

const packageJson: PackageJson = await readFile(new URL('package.json', packageURL), 'utf8').then(JSON.parse);

const fixImports: Plugin = {
  name: 'add-imports',
  setup(build) {
    build.onResolve({ filter: /\.\.?\/(?:utils|renderers)/ }, (args) => {
      return { path: `./${basename(dirname(args.path))}/${basename(args.path)}`, external: true };
    });

    // TODO: remove when https://github.com/evanw/esbuild/issues/1433 is resolved
    build.onLoad({ filter: /src[\/\\][A-Za-z_-]+\.tsx?$/u }, async ({ path }) => {
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

    // TODO: remove when https://github.com/evanw/esbuild/issues/1433 is resolved
    build.onLoad({ filter: /src[\/\\]generated[\/\\][A-Za-z_-]+\.ts$/u }, async ({ path }) => {
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
    .map(fileURLToPath);
}

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

const [componentEntryPoints, utilsEntryPoints] = await Promise.all([
  detectEntryPoints(['*.{ts,tsx}']),
  detectEntryPoints(['utils/*.{ts,tsx}', 'renderers/*.{ts,tsx}']),
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
    entryPoints: utilsEntryPoints,
  }),
]);
