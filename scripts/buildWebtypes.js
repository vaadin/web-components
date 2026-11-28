import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  getElements,
  INTERNAL_PACKAGES,
  listPackages,
  packageDir,
  readManifest,
  readPackageJson,
} from '../manifest/lib/cem-helpers.ts';
import { createLitWebTypes, createPlainWebTypes } from '../manifest/lib/web-types.ts';

const PLAIN_WEB_TYPES_FILE = 'web-types.json';
const LIT_WEB_TYPES_FILE = 'web-types.lit.json';

/**
 * Lists the packages with public custom elements, which get web-types.
 * @return {{ dir: string, elements: object[] }[]}
 */
function getWebTypesPackages() {
  return listPackages()
    .filter((dir) => !INTERNAL_PACKAGES.has(dir))
    .map((dir) => {
      const manifest = readManifest(dir);
      return { dir, elements: manifest ? getElements(manifest) : [] };
    })
    .filter(({ elements }) => elements.length > 0);
}

/**
 * Creates web-types definitions for all relevant packages exposing
 * web-components. Only public components are considered.
 * The definitions are split into two files, one containing  "plain" types
 * for the web-component, including attributes, properties and
 * events. The other file contains lit-specific bindings, to bind regular
 * properties, boolean properties, and events, through their respective lit
 * attribute syntax.
 */
function buildWebTypes() {
  getWebTypesPackages().forEach(({ dir, elements }) => {
    const packageJson = readPackageJson(dir);

    const plainWebTypes = createPlainWebTypes(packageJson, elements);
    const plainWebTypesJson = JSON.stringify(plainWebTypes, null, 2);
    fs.writeFileSync(path.join(packageDir(dir), PLAIN_WEB_TYPES_FILE), plainWebTypesJson, 'utf8');

    const litWebTypes = createLitWebTypes(packageJson, elements);
    const litWebTypesJson = JSON.stringify(litWebTypes, null, 2);
    fs.writeFileSync(path.join(packageDir(dir), LIT_WEB_TYPES_FILE), litWebTypesJson, 'utf8');
  });
}

/**
 * Updates all relevant packages' package.json files to reference the
 * generated web-types JSON files, and to include them for publishing.
 * This is not run by default. Instead, it can be run on demand when adding
 * new packages, and the resulting changes can be committed to the repo.
 * To run this command specify the --modify-packages parameter on the
 * command line.
 */
function modifyPackageJson() {
  getWebTypesPackages().forEach(({ dir }) => {
    const packageJson = readPackageJson(dir);
    // Add web types definitions to published files
    if (!packageJson.files.includes(PLAIN_WEB_TYPES_FILE)) {
      packageJson.files.push(PLAIN_WEB_TYPES_FILE);
    }
    if (!packageJson.files.includes(LIT_WEB_TYPES_FILE)) {
      packageJson.files.push(LIT_WEB_TYPES_FILE);
    }
    // Add field for declaring web-types
    packageJson['web-types'] = [PLAIN_WEB_TYPES_FILE, LIT_WEB_TYPES_FILE];

    const fileContent = JSON.stringify(packageJson, null, 2) + os.EOL;
    fs.writeFileSync(path.join(packageDir(dir), 'package.json'), fileContent, 'utf8');
  });
}

if (process.argv.includes('--modify-packages')) {
  // Modify packages command
  modifyPackageJson();
} else {
  // Run web types generation as default command
  buildWebTypes();
}
