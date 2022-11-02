import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { nodeModulesDir, rootDir } from './utils/config.js';
import { ElementNameMissingError } from './utils/errors.js';
import { camelCase, filterEmptyItems, search, stripPrefix } from './utils/misc.js';

const descriptions = await loadDescriptions();
const packageJsonPath = resolve(rootDir, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

const exports: Record<string, Record<string, string>> = {
  './index.js': {
    default: './dist/index.js',
  },
};

const collator = new Intl.Collator('en', { sensitivity: 'base' });

type ExportsRecord = readonly [exportsPath: string, filePath: string];

filterEmptyItems(
  await Promise.all(
    Array.from(extractElementsFromDescriptions(descriptions), async ([packageName, element]) => {
      if (!element.name) {
        throw new ElementNameMissingError(packageName);
      }

      if (!(await search([`${element.name}.js`], resolve(nodeModulesDir, packageName)))) {
        return;
      }

      const moduleName = stripPrefix(camelCase(element.name));
      const exportPath = `./${moduleName}.js`;
      const filePath = `./dist/${moduleName}.js`;

      return [exportPath, filePath] as ExportsRecord;
    }),
  ),
)
  .sort(([pathA], [pathB]) => collator.compare(pathA, pathB))
  .forEach(([exportsPath, filePath]) => {
    exports[exportsPath] = {
      default: filePath,
    };
  });

packageJson['exports'] = exports;

await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
