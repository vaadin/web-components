const path = require('path');
const fs = require('fs');

const analysis = require('../analysis.json');

// TODO: Gather actual packages
const packages = ['date-picker'];

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
      type: mapType(attribute.type)
    }
  }));
  const properties = elementAnalysis.properties
    .filter((prop) => prop.privacy === 'public')
    .map((prop) => ({
      name: prop.name,
      description: prop.description,
      value: {
        type: mapType(prop.type)
      }
    }));
  const events = elementAnalysis.events.map((event) => ({
    name: event.name,
    description: event.description
  }));

  return {
    name: elementAnalysis.tagname,
    description: elementAnalysis.description,
    attributes,
    js: {
      properties,
      events
    }
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
        elements: packageElements.map(createPlainElementDefinition)
      }
    }
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
        kind: 'expression'
      }
    }));
  const propertyAttributes = elementAnalysis.properties
    .filter((prop) => prop.privacy === 'public')
    .map((prop) => ({
      name: `.${prop.name}`,
      description: prop.description,
      value: {
        // Type checking does not work with template tagged literals
        // Since this Lit binding should use an expression, just declare it as such
        kind: 'expression'
      }
    }));
  const eventAttributes = elementAnalysis.events.map((event) => ({
    name: `@${event.name}`,
    description: event.description
  }));

  return {
    name: elementAnalysis.tagname,
    description: elementAnalysis.description,
    // Declare as extension to plain web type, this also means we don't have to
    // repeat the same stuff from the plain web-types.json again
    extension: true,
    // IntelliJ does not understand Lit template syntax, so
    // effectively everything has to be declared as attribute
    attributes: [...booleanAttributes, ...propertyAttributes, ...eventAttributes]
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
        'node-packages': ['lit']
      }
    },
    contributions: {
      html: {
        elements: packageElements.map(createLitElementDefinition)
      }
    }
  };
}

packages.forEach((packageName) => {
  const packageJson = require(`../packages/${packageName}/package.json`);
  const packageElements = analysis.elements
    .filter((el) => el.path.startsWith(`packages/${packageName}`))
    .filter((el) => el.privacy === 'public');

  const plainWebTypes = createPlainWebTypes(packageJson, packageElements);
  const plainWebTypesJson = JSON.stringify(plainWebTypes, null, 2);
  fs.writeFileSync(path.join('..', 'packages', packageName, 'web-types.json'), plainWebTypesJson, 'utf8');

  const litWebTypes = createLitWebTypes(packageJson, packageElements);
  const litWebTypesJson = JSON.stringify(litWebTypes, null, 2);
  fs.writeFileSync(path.join('..', 'packages', packageName, 'web-types.lit.json'), litWebTypesJson, 'utf8');
});
