import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  byName,
  getElements,
  INTERNAL_PACKAGES,
  listPackages,
  packageDir,
  readManifest,
  readPackageJson,
} from '../manifest/lib/cem-helpers.js';

const PLAIN_WEB_TYPES_FILE = 'web-types.json';
const LIT_WEB_TYPES_FILE = 'web-types.lit.json';

const API_DOCS_BASE_PATH = 'https://cdn.vaadin.com/vaadin-web-components';

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

const byItemName = (a, b) => byName(a.name, b.name);

/**
 * The `deprecated` flag or message of a manifest item for its web-types entry.
 * @param {{ deprecated?: boolean | string }} item
 * @return {{ deprecated?: boolean | string }}
 */
const deprecation = (item) => (item.deprecated ? { deprecated: item.deprecated } : {});

/**
 * The `default` of a manifest item for its web-types entry, the source text of the value.
 * @param {{ default?: string }} item
 * @return {{ default?: string }}
 */
const defaultValue = (item) => (item.default === undefined ? {} : { default: item.default });

/**
 * Maps a type such as `'boolean | null | undefined'` into an array of type
 * strings, such as `['boolean', 'null', 'undefined']`
 * @param {{ text: string }} [type] - The type object
 * @returns {string[]}
 */
function mapType(type) {
  const typeString = type?.text ?? '';
  // Closure's `function(X): Y` needs a space between `function` and `X` after
  // the parens are stripped, so rewrite `(` as a space. `!` (non-null) and `)`
  // are dropped; consecutive spaces from the rewrite are collapsed.
  const sanitizedTypeString = typeString.replace(/[!)]/gu, '').replace(/\(/gu, ' ').replace(/ {2,}/gu, ' ');
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
 * Gets the writable field members from a CEM element declaration.
 * The CEM config already filters out the private and protected members.
 * @param {object} elementDeclaration - The element declaration from CEM
 * @returns {object[]}
 */
function getPublicWritableProperties(elementDeclaration) {
  return (elementDeclaration.members || []).filter((member) => member.kind === 'field' && !member.readonly);
}

function createPlainElementDefinition(packageJson, elementDeclaration) {
  // The manifest keeps only attributes with primitive types that are not
  // read-only. Untyped ones come from `observedAttributes`, e.g. `class` on
  // `<vaadin-icon>`, and are not listed.
  const attributes = (elementDeclaration.attributes || [])
    .filter((attribute) => attribute.type)
    .sort(byItemName)
    .map((attribute) => ({
      name: attribute.name,
      description: transformDescription(packageJson, attribute.description || ''),
      value: {
        type: mapType(attribute.type),
      },
      ...defaultValue(attribute),
      ...deprecation(attribute),
    }));

  const properties = getPublicWritableProperties(elementDeclaration)
    .sort(byItemName)
    .map((prop) => ({
      name: prop.name,
      description: transformDescription(packageJson, prop.description || ''),
      value: {
        type: mapType(prop.type),
      },
      ...defaultValue(prop),
      ...deprecation(prop),
    }));

  const events = (elementDeclaration.events || []).sort(byItemName).map((event) => ({
    name: event.name,
    description: transformDescription(packageJson, event.description || ''),
    ...deprecation(event),
  }));

  return {
    name: elementDeclaration.tagName,
    description: transformDescription(packageJson, elementDeclaration.description || ''),
    ...deprecation(elementDeclaration),
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
  function toLitAttribute(name, item) {
    return {
      name,
      description: transformDescription(packageJson, item.description || ''),
      // Type checking does not work with template tagged literals.
      // Since this Lit binding should use an expression, just declare it as such.
      value: { kind: 'expression' },
      ...deprecation(item),
    };
  }

  const publicProperties = getPublicWritableProperties(elementDeclaration);
  const propertyBindings = publicProperties.sort(byItemName).map((prop) => {
    const prefix = mapType(prop.type).includes('boolean') ? '?' : '.';
    return toLitAttribute(`${prefix}${prop.name}`, prop);
  });

  const eventBindings = (elementDeclaration.events || [])
    .sort(byItemName)
    .map((event) => toLitAttribute(`@${event.name}`, event));

  return {
    name: elementDeclaration.tagName,
    description: transformDescription(packageJson, elementDeclaration.description || ''),
    // Declare as extension to plain web type, this also means we don't have to
    // repeat the same stuff from the plain web-types.json again
    extension: true,
    // IntelliJ does not understand Lit template syntax, so
    // effectively everything has to be declared as attribute
    attributes: [...propertyBindings, ...eventBindings],
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
