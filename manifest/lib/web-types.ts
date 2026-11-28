/**
 * Functions that build the plain and the Lit web-types of a package from the
 * element declarations of its custom elements manifest.
 */
import type { CustomElementField, Type } from 'custom-elements-manifest';
import { byName, type ElementDeclaration, type PackageJson } from './cem-helpers.ts';
import type { WebTypes, WebTypesAttribute, WebTypesElement, WebTypesItem } from './web-types-schema.ts';

const API_DOCS_BASE_PATH = 'https://cdn.vaadin.com/vaadin-web-components';

const byItemName = (a: { name: string }, b: { name: string }): number => byName(a.name, b.name);

/**
 * The `deprecated` flag or message of a manifest item for its web-types entry.
 */
const deprecation = (item: { deprecated?: boolean | string }): { deprecated?: boolean | string } =>
  item.deprecated ? { deprecated: item.deprecated } : {};

/**
 * The `default` of a manifest item for its web-types entry, the source text of the value.
 */
const defaultValue = (item: { default?: string }): { default?: string } =>
  item.default === undefined ? {} : { default: item.default };

/**
 * Maps a type such as `'boolean | null | undefined'` into an array of type
 * strings, such as `['boolean', 'null', 'undefined']`
 */
function mapType(type?: Type): string[] {
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
 */
function transformDescription(packageJson: PackageJson, description: string): string {
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
 */
function getPublicWritableProperties(elementDeclaration: ElementDeclaration): CustomElementField[] {
  return (elementDeclaration.members || []).filter(
    (member): member is CustomElementField => member.kind === 'field' && !member.readonly,
  );
}

function createPlainElementDefinition(
  packageJson: PackageJson,
  elementDeclaration: ElementDeclaration,
): WebTypesElement {
  // The manifest keeps only attributes with primitive types that are not
  // read-only. Untyped ones come from `observedAttributes`, e.g. `class` on
  // `<vaadin-icon>`, and are not listed.
  const attributes: WebTypesAttribute[] = (elementDeclaration.attributes || [])
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

  const properties: WebTypesAttribute[] = getPublicWritableProperties(elementDeclaration)
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

  const events: WebTypesItem[] = (elementDeclaration.events || []).sort(byItemName).map((event) => ({
    name: event.name,
    description: transformDescription(packageJson, event.description || ''),
    ...deprecation(event),
  }));

  return {
    name: elementDeclaration.tagName!,
    description: transformDescription(packageJson, elementDeclaration.description || ''),
    ...deprecation(elementDeclaration),
    attributes,
    js: {
      properties,
      events,
    },
  };
}

/**
 * Creates the plain web-types of a package, with the attributes, properties
 * and events of each element.
 * @param packageElements the element declarations of the package manifest
 */
export function createPlainWebTypes(packageJson: PackageJson, packageElements: ElementDeclaration[]): WebTypes {
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

function createLitElementDefinition(packageJson: PackageJson, elementDeclaration: ElementDeclaration): WebTypesElement {
  function toLitAttribute(
    name: string,
    item: { description?: string; deprecated?: boolean | string },
  ): WebTypesAttribute {
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
    name: elementDeclaration.tagName!,
    description: transformDescription(packageJson, elementDeclaration.description || ''),
    // Declare as extension to plain web type, this also means we don't have to
    // repeat the same stuff from the plain web-types.json again
    extension: true,
    // IntelliJ does not understand Lit template syntax, so
    // effectively everything has to be declared as attribute
    attributes: [...propertyBindings, ...eventBindings],
  };
}

/**
 * Creates the Lit web-types of a package, which declare the property, boolean
 * property and event bindings of each element as attributes.
 * @param packageElements the element declarations of the package manifest
 */
export function createLitWebTypes(packageJson: PackageJson, packageElements: ElementDeclaration[]): WebTypes {
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
