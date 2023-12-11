import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const generated = new URL('generated/', root);

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
  const typeDefinitionContent = await readFile(new URL('Checkbox.d.ts', generated), 'utf8');

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

await Promise.all([validateInheritedProperties()]);
