const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const PLAIN_WEB_TYPES_FILE = 'web-types.json';
const LIT_WEB_TYPES_FILE = 'web-types.lit.json';

const blacklistedPackages = [
  /^vaadin-/,
  /^component-base/,
  /^field-base/,
  /^field-highlighter/,
  /^icons/,
  /^input-container/,
  /^lit-renderer/,
  /^polymer-legacy-adapter/,
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

function mapType(typeString) {
  const sanitizedTypeString = (typeString || '').replace(/[!()]/g, '');
  const types = sanitizedTypeString.split('|');
  return types.map((type) => type.trim());
}

function createPlainElementDefinition(elementAnalysis) {
  const attributes = elementAnalysis.attributes.map((attribute) => ({
    name: attribute.name,
    description: attribute.description,
    value: {
      type: mapType(attribute.type),
    },
  }));
  const properties = elementAnalysis.properties
    .filter((prop) => prop.privacy === 'public')
    .map((prop) => ({
      name: prop.name,
      description: prop.description,
      value: {
        type: mapType(prop.type),
      },
    }));
  const events = elementAnalysis.events.map((event) => ({
    name: event.name,
    description: event.description,
  }));

  return {
    name: elementAnalysis.tagname,
    description: elementAnalysis.description,
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
        elements: packageElements.map(createPlainElementDefinition),
      },
    },
  };
}

function createLitElementDefinition(elementAnalysis) {
  const booleanAttributes = elementAnalysis.attributes
    .filter((attr) => attr.type.includes('boolean'))
    .map((prop) => ({
      name: `?${prop.name}`,
      description: prop.description,
      value: {
        // Type checking does not work with template tagged literals
        // Since this Lit binding should use an expression, just declare it as such
        kind: 'expression',
      },
    }));
  const propertyAttributes = elementAnalysis.properties
    .filter((prop) => prop.privacy === 'public')
    .map((prop) => ({
      name: `.${prop.name}`,
      description: prop.description,
      value: {
        // Type checking does not work with template tagged literals
        // Since this Lit binding should use an expression, just declare it as such
        kind: 'expression',
      },
    }));
  const eventAttributes = elementAnalysis.events.map((event) => ({
    name: `@${event.name}`,
    description: event.description,
  }));

  return {
    name: elementAnalysis.tagname,
    description: elementAnalysis.description,
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
        elements: packageElements.map(createLitElementDefinition),
      },
    },
  };
}

function buildWebTypes() {
  const packages = getRelevantPackages();
  const analysis = loadAnalysis();

  packages.forEach((packageName) => {
    const packageJson = JSON.parse(fs.readFileSync(`./packages/${packageName}/package.json`, 'utf8'));
    const packageElements = analysis.elements
      .filter((el) => el.path.startsWith(`packages/${packageName}`))
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
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    fs.writeFileSync(`./packages/${packageName}/package.json`, JSON.stringify(packageJson, null, 2), 'utf8');
  });
}

buildWebTypes();
