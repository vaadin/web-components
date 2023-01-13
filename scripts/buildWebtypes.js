const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

const PLAIN_WEB_TYPES_FILE = 'web-types.json';
const LIT_WEB_TYPES_FILE = 'web-types.lit.json';

const API_DOCS_BASE_PATH = 'https://cdn.vaadin.com/vaadin-web-components';

const blacklistedPackages = [
  /^vaadin-/u,
  /^component-base/u,
  /^field-base/u,
  /^field-highlighter/u,
  /^icons/u,
  /^input-container/u,
  /^lit-renderer/u,
  /^polymer-legacy-adapter/u,
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
  const output = execSync('./node_modules/.bin/lerna ls --json --loglevel silent');
  const allPackages = JSON.parse(output.toString()).map((project) => project.name.replace('@vaadin/', ''));
  return allPackages.filter((pkg) => !blacklistedPackages.some((blacklistedPackage) => pkg.match(blacklistedPackage)));
}

function loadAnalysis() {
  const analysisPath = path.resolve('./analysis.json');
  try {
    return JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
  } catch (e) {
    throw new Error(
      `Could not read output of the Polymer Analyzer from: ${analysisPath}. Make sure to run the Polymer Analyzer before generating web-types.`,
    );
  }
}

/**
 * Maps a type string such as `'boolean | null | undefined'` into an array of type
 * strings, such as `['boolean', 'null', 'undefined']`
 * @param typeString
 * @returns {string[]}
 */
function mapType(typeString) {
  const sanitizedTypeString = (typeString || '').replace(/[!()]/gu, '');
  const types = sanitizedTypeString.split('|');
  return types.map((type) => type.trim());
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

function camelize(text) {
  return text.replace(/-./gu, (x) => x[1].toUpperCase());
}

function isWritablePrimitiveAttribute(elementAnalysis, attribute) {
  // Attributes do not have metadata, so we need to look at the corresponding
  // property
  const propertyName = camelize(attribute.name);
  const matchingProperty = elementAnalysis.properties.find((property) => property.name === propertyName);
  // If we can not find the property, just include the attribute rather than exclude
  if (!matchingProperty) {
    return true;
  }
  const isWritable = !matchingProperty.metadata.polymer.readOnly;
  const hasPrimitiveType =
    !matchingProperty.metadata.polymer.attributeType ||
    ['String', 'Number', 'Boolean'].includes(matchingProperty.metadata.polymer.attributeType);

  return isWritable && hasPrimitiveType;
}

function getPublicWritableProperties(elementAnalysis) {
  return elementAnalysis.properties
    .filter((prop) => prop.privacy === 'public')
    .filter((prop) => !prop.metadata.polymer.readOnly);
}

function createPlainElementDefinition(packageJson, elementAnalysis) {
  const attributes = [...elementAnalysis.attributes, ...additionalAttributes]
    .filter((attribute) => isWritablePrimitiveAttribute(elementAnalysis, attribute))
    .map((attribute) => ({
      name: attribute.name,
      description: transformDescription(packageJson, attribute.description),
      value: {
        type: mapType(attribute.type),
      },
    }));
  const properties = getPublicWritableProperties(elementAnalysis).map((prop) => ({
    name: prop.name,
    description: transformDescription(packageJson, prop.description),
    value: {
      type: mapType(prop.type),
    },
  }));
  const events = elementAnalysis.events.map((event) => ({
    name: event.name,
    description: transformDescription(packageJson, event.description),
  }));

  return {
    name: elementAnalysis.tagname,
    description: transformDescription(packageJson, elementAnalysis.description),
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
        elements: packageElements.map((elementAnalysis) => createPlainElementDefinition(packageJson, elementAnalysis)),
      },
    },
  };
}

function createLitElementDefinition(packageJson, elementAnalysis) {
  const publicProperties = getPublicWritableProperties(elementAnalysis);
  const booleanAttributes = publicProperties
    .filter((prop) => prop.type.includes('boolean'))
    .map((prop) => ({
      name: `?${prop.name}`,
      description: transformDescription(packageJson, prop.description),
      value: {
        // Type checking does not work with template tagged literals
        // Since this Lit binding should use an expression, just declare it as such
        kind: 'expression',
      },
    }));
  const propertyAttributes = publicProperties
    .filter((prop) => !prop.type.includes('boolean'))
    .map((prop) => ({
      name: `.${prop.name}`,
      description: transformDescription(packageJson, prop.description),
      value: {
        // Type checking does not work with template tagged literals
        // Since this Lit binding should use an expression, just declare it as such
        kind: 'expression',
      },
    }));
  const eventAttributes = elementAnalysis.events.map((event) => ({
    name: `@${event.name}`,
    description: transformDescription(packageJson, event.description),
    value: {
      // Type checking does not work with template tagged literals
      // Since this Lit binding should use an expression, just declare it as such
      kind: 'expression',
    },
  }));

  return {
    name: elementAnalysis.tagname,
    description: transformDescription(packageJson, elementAnalysis.description),
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
        elements: packageElements.map((elementAnalysis) => createLitElementDefinition(packageJson, elementAnalysis)),
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
  const analysis = loadAnalysis();

  packages.forEach((packageName) => {
    const packageJson = JSON.parse(fs.readFileSync(`./packages/${packageName}/package.json`, 'utf8'));
    const packageElements = analysis.elements
      .filter((el) => el.path.startsWith(`packages/${packageName}/`))
      .filter((el) => el.privacy === 'public');

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
