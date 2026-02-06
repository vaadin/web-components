import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PLAIN_WEB_TYPES_FILE = 'web-types.json';
const LIT_WEB_TYPES_FILE = 'web-types.lit.json';

const API_DOCS_BASE_PATH = 'https://cdn.vaadin.com/vaadin-web-components';

const blacklistedPackages = [
  /^vaadin-/u,
  /^a11y-base/u,
  /^component-base/u,
  /^field-base/u,
  /^field-highlighter/u,
  /^icons/u,
  /^input-container/u,
  /^lit-renderer/u,
  /^aura/u,
];

// Additional attributes that will be added to all components
const additionalAttributes = [
  // Theme attribute is not properly declared at the moment
  {
    name: 'theme',
    description: 'The theme variants to apply to the component.',
    type: 'string | null | undefined',
  },
];

/**
 * Get packages using lerna, excluding blacklisted packages
 */
function getRelevantPackages() {
  const pathToLerna = path.normalize('./node_modules/.bin/lerna');
  const output = execSync(`${pathToLerna} ls --json --loglevel silent`); // NOSONAR
  const allPackages = JSON.parse(output.toString()).map((project) => project.name.replace('@vaadin/', ''));
  return allPackages.filter((pkg) => !blacklistedPackages.some((blacklistedPackage) => pkg.match(blacklistedPackage)));
}

/**
 * Loads the custom-elements.json manifest for a specific package.
 * @param {string} packageName - The package name (e.g., 'button')
 * @returns {object|null} - The manifest object, or null if not found
 */
function loadCustomElementsManifest(packageName) {
  const manifestPath = path.resolve(`./packages/${packageName}/custom-elements.json`);
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (_) {
    return null; // Package may not have a manifest
  }
}

/**
 * Extracts custom element class declarations from a CEM manifest.
 * @param {object} manifest - The custom-elements.json manifest
 * @returns {object[]} - Array of element declarations with tagName
 */
function getElementsFromManifest(manifest) {
  const elements = [];
  for (const module of manifest.modules) {
    for (const declaration of module.declarations || []) {
      if (declaration.kind === 'class' && declaration.tagName) {
        elements.push(declaration);
      }
    }
  }
  return elements;
}

/**
 * Extracts the type string from a CEM type object or string.
 * CEM uses `{ text: "boolean" }` format, while older formats use plain strings.
 * @param {object|string} type - The type object or string
 * @returns {string} - The type string
 */
function getTypeText(type) {
  if (!type) return '';
  return typeof type === 'object' ? type.text || '' : type;
}

/**
 * Maps a type string such as `'boolean | null | undefined'` into an array of type
 * strings, such as `['boolean', 'null', 'undefined']`
 * @param {object|string} type - The type object or string
 * @returns {string[]}
 */
function mapType(type) {
  const typeString = getTypeText(type);
  const sanitizedTypeString = typeString.replace(/[!()]/gu, '');
  const types = sanitizedTypeString.split('|');
  return types.map((t) => t.trim());
}

/**
 * Transforms a description text of an element, attribute, property, event to:
 * - make relative docs links point to the absolute documentation URL
 * @param packageJson
 * @param description
 * @returns {*}
 */
function transformDescription(packageJson, description) {
  // Transform relative documentation links to absolute ones
  description = description.replace(
    /\(#\/elements\/(.*)\)/gu, // Matches "(#/elements/$1)"
    `(${API_DOCS_BASE_PATH}/${packageJson.version}/#/elements/$1)`,
  );
  // Remove multiple newlines between subsequent code examples,
  // The IntelliJ markdown renderer will otherwise collapse
  // both examples into one
  description = description.replace(/```(\n)+```/gu, '```\n```');

  return description;
}

/**
 * Checks if an attribute is a writable primitive attribute.
 * In CEM, attributes are already filtered to public ones, and we check for primitive types.
 * @param {object} attribute - The attribute object
 * @returns {boolean}
 */
function isWritablePrimitiveAttribute(attribute) {
  const typeText = getTypeText(attribute.type);

  // Check if attribute has a primitive type (string, number, boolean)
  // Non-primitive types like functions, objects, arrays should not be HTML attributes
  const primitiveTypePattern =
    /^(string|number|boolean|null|undefined)(\s*\|\s*(string|number|boolean|null|undefined))*$/iu;
  return primitiveTypePattern.test(typeText);
}

/**
 * Gets public writable field members from a CEM element declaration.
 * CEM already filters to public members based on config, and fields with
 * an `attribute` property are reactive properties.
 * @param {object} elementDeclaration - The element declaration from CEM
 * @returns {object[]}
 */
function getPublicWritableProperties(elementDeclaration) {
  const members = elementDeclaration.members || [];
  return members.filter((member) => member.kind === 'field' && member.privacy === 'public');
}

function createPlainElementDefinition(packageJson, elementDeclaration) {
  const elementAttributes = elementDeclaration.attributes || [];
  const attributes = [...elementAttributes, ...additionalAttributes]
    .filter((attribute) => isWritablePrimitiveAttribute(attribute))
    .map((attribute) => ({
      name: attribute.name,
      description: transformDescription(packageJson, attribute.description || ''),
      value: {
        type: mapType(attribute.type),
      },
    }));
  const properties = getPublicWritableProperties(elementDeclaration).map((prop) => ({
    name: prop.name,
    description: transformDescription(packageJson, prop.description || ''),
    value: {
      type: mapType(prop.type),
    },
  }));
  const elementEvents = elementDeclaration.events || [];
  const events = elementEvents.map((event) => ({
    name: event.name,
    description: transformDescription(packageJson, event.description || ''),
  }));

  return {
    name: elementDeclaration.tagName,
    description: transformDescription(packageJson, elementDeclaration.description || ''),
    attributes,
    js: {
      properties,
      events,
    },
  };
}

function createPlainWebTypes(packageJson, packageElements) {
  return {
    $schema: 'https://json.schemastore.org/web-types',
    name: packageJson.name,
    version: packageJson.version,
    'description-markup': 'markdown',
    contributions: {
      html: {
        elements: packageElements.map((elementDeclaration) =>
          createPlainElementDefinition(packageJson, elementDeclaration),
        ),
      },
    },
  };
}

function createLitElementDefinition(packageJson, elementDeclaration) {
  const publicProperties = getPublicWritableProperties(elementDeclaration);
  const booleanAttributes = publicProperties
    .filter((prop) => getTypeText(prop.type).includes('boolean'))
    .map((prop) => ({
      name: `?${prop.name}`,
      description: transformDescription(packageJson, prop.description || ''),
      value: {
        // Type checking does not work with template tagged literals
        // Since this Lit binding should use an expression, just declare it as such
        kind: 'expression',
      },
    }));
  const propertyAttributes = publicProperties
    .filter((prop) => !getTypeText(prop.type).includes('boolean'))
    .map((prop) => ({
      name: `.${prop.name}`,
      description: transformDescription(packageJson, prop.description || ''),
      value: {
        // Type checking does not work with template tagged literals
        // Since this Lit binding should use an expression, just declare it as such
        kind: 'expression',
      },
    }));
  const elementEvents = elementDeclaration.events || [];
  const eventAttributes = elementEvents.map((event) => ({
    name: `@${event.name}`,
    description: transformDescription(packageJson, event.description || ''),
    value: {
      // Type checking does not work with template tagged literals
      // Since this Lit binding should use an expression, just declare it as such
      kind: 'expression',
    },
  }));

  return {
    name: elementDeclaration.tagName,
    description: transformDescription(packageJson, elementDeclaration.description || ''),
    // Declare as extension to plain web type, this also means we don't have to
    // repeat the same stuff from the plain web-types.json again
    extension: true,
    // IntelliJ does not understand Lit template syntax, so
    // effectively everything has to be declared as attribute
    attributes: [...booleanAttributes, ...propertyAttributes, ...eventAttributes],
  };
}

function createLitWebTypes(packageJson, packageElements) {
  return {
    $schema: 'https://json.schemastore.org/web-types',
    name: packageJson.name,
    version: packageJson.version,
    'description-markup': 'markdown',
    framework: 'lit',
    'framework-config': {
      'enable-when': {
        'node-packages': ['lit'],
      },
    },
    contributions: {
      html: {
        elements: packageElements.map((elementDeclaration) =>
          createLitElementDefinition(packageJson, elementDeclaration),
        ),
      },
    },
  };
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
  const packages = getRelevantPackages();

  packages.forEach((packageName) => {
    const manifest = loadCustomElementsManifest(packageName);
    if (!manifest) {
      console.warn(`No custom-elements.json found for package: ${packageName}`);
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(`./packages/${packageName}/package.json`, 'utf8'));
    const packageElements = getElementsFromManifest(manifest);

    const plainWebTypes = createPlainWebTypes(packageJson, packageElements);
    const plainWebTypesJson = JSON.stringify(plainWebTypes, null, 2);
    fs.writeFileSync(path.join('.', 'packages', packageName, PLAIN_WEB_TYPES_FILE), plainWebTypesJson, 'utf8');

    const litWebTypes = createLitWebTypes(packageJson, packageElements);
    const litWebTypesJson = JSON.stringify(litWebTypes, null, 2);
    fs.writeFileSync(path.join('.', 'packages', packageName, LIT_WEB_TYPES_FILE), litWebTypesJson, 'utf8');
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
  const packages = getRelevantPackages();

  packages.forEach((packageName) => {
    const packageJson = JSON.parse(fs.readFileSync(`./packages/${packageName}/package.json`, 'utf8'));
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
    fs.writeFileSync(`./packages/${packageName}/package.json`, fileContent, 'utf8');
  });
}

if (process.argv.includes('--modify-packages')) {
  // Modify packages command
  modifyPackageJson();
} else {
  // Run web types generation as default command
  buildWebTypes();
}
