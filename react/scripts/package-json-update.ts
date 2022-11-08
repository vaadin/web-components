import { readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { nodeModulesDir, rootDir } from './utils/config.js';
import { ElementNameMissingError } from './utils/errors.js';
import { fswalk } from './utils/fswalk.js';
import { camelCase, filterEmptyItems, search, stripPrefix } from './utils/misc.js';

const descriptions = await loadDescriptions();
const packageJsonPath = resolve(rootDir, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

const exports: Record<string, Record<string, string>> = {
  '.': {
    types: './dist/index.d.ts',
    default: './dist/index.js',
  },
  './index.js': {
    types: './dist/index.d.ts',
    default: './dist/index.js',
  },
};

const collator = new Intl.Collator('en', { sensitivity: 'base' });

type ExportsRecord = readonly [exportsPath: string, typesPath: string, filePath: string];

filterEmptyItems(
  await Promise.all(
    Array.from(extractElementsFromDescriptions(descriptions), async ([packageName, element]) => {
      if (!element.name) {
        throw new ElementNameMissingError(packageName);
      }

      if (!(await search(element.name, resolve(nodeModulesDir, packageName)))) {
        return;
      }

      const moduleName = stripPrefix(camelCase(element.name));
      const exportPath = `./${moduleName}.js`;
      const filePath = `./dist/${moduleName}.js`;
      const typesPath = `./dist/${moduleName}.d.ts`;

      return [exportPath, typesPath, filePath] as ExportsRecord;
    }),
  ),
)
  .sort(([pathA], [pathB]) => collator.compare(pathA, pathB))
  .forEach(([exportsPath, typesPath, filePath]) => {
    exports[exportsPath] = {
      types: typesPath,
      default: filePath,
    };
  });

// Add css file entries
const cssDistDir = resolve(rootDir, 'dist', 'css');
for await (const [path, entry] of fswalk(cssDistDir, {recursive: true})) {
  const cssPath = relative(cssDistDir, path).split(sep).join('/');
  exports[`./css/${cssPath}`] = {
    default: `./dist/css/${cssPath}`,
  };
}

packageJson['exports'] = exports;

await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
