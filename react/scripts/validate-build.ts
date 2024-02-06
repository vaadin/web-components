import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const packagesDir = resolve(rootDir, 'packages');
const componentsPackage = 'react-components';

/**
 * This function validates that the generated TypeScript definition file for a component
 * does not include properties that are inherited from a parent class or interface.
 *
 * It reads the content of the component's generated d.ts file, and checks for the presence of
 * certain properties that are expected to be inherited.
 *
 * If any of these properties are found in the file, the function throws an error.
 *
 * @throws {Error} If the generated file contains any of the inherited properties.
 */
async function validateInheritedProperties() {
  const checkboxPath = resolve(packagesDir, componentsPackage, 'generated', 'Checkbox.d.ts');

  const typeDefinitionContent = await readFile(checkboxPath, 'utf8');

  // Expect the generated file not to contain definitions for properties that are inherited.
  const inheritedProperties = [
    'className', // From 'HTMLAttributes'
    'onClick', // From 'DOMAttributes'
    'theme', // From 'ThemePropertyMixinClass'
    'indeterminate', // From 'CheckboxMixin'
  ];

  for (const property of inheritedProperties) {
    if (typeDefinitionContent.includes(`${property}:`) || typeDefinitionContent.includes(`${property}?:`)) {
      throw new Error(`The generated type definition file contains inherited property "${property}".`);
    }
  }
}

/**
 * Validates that the generated directory exists.
 */
async function hasGeneratedDir() {
  [componentsPackage].forEach((packageName) => {
    if (!existsSync(resolve(packagesDir, packageName, 'generated'))) {
      throw new Error(`The generated directory does not exist. Run "npm run build" to generate it.`);
    }
  });
}

/**
 * Validates that the package has css dir.
 */
async function hasNoCssDir() {
  if (!existsSync(resolve(packagesDir, componentsPackage, 'css'))) {
    throw new Error(`The css directory does not exist in the components package.`);
  }
}

/**
 * Validates that TS definition files have been copied (build:code:copy-dts has been run)
 */
async function hasCopiedDts() {
  if (!existsSync(resolve(packagesDir, componentsPackage, 'renderers', 'grid.d.ts'))) {
    throw new Error(`The renderers/grid.d.ts file does not exist.`);
  }
}

await Promise.all([validateInheritedProperties(), hasGeneratedDir(), hasNoCssDir(), hasCopiedDts()]);
