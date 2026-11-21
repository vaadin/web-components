import { type ManifestType, TypeContext } from './types.ts';

export function sortByName<T extends { name: string }>(items: T[]): T[] {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export function sanitizeDescription(description: string = ''): string {
  // Fix links to other elements
  description = description.replace(/#\/elements\//gu, '/elements/');
  // Fix links to properties (e.g. #property-dataProvider to #dataprovider)
  description = description.replace(/#property-([a-zA-Z]+)/gu, (_, name) => `#${name.toLowerCase()}`);
  // Fix links to methods (e.g. #method-updateConfiguration to #updateconfiguration)
  description = description.replace(/#method-([a-zA-Z]+)/gu, (_, name) => `#${name.toLowerCase()}`);

  return description;
}

function renderRelatedTypes(typeContext: TypeContext, type: ManifestType | undefined) {
  const relatedTypes = typeContext.findRelatedTypes(type);

  if (relatedTypes.length > 0) {
    const typeNames = relatedTypes.map((type) => `[${type.name}](#${type.name.toLowerCase()})`).join(', ');
    return `See also: ${typeNames}\n\n`;
  }

  return '';
}

/** Creates the element schema used by the renderer from a CEM class declaration and its module path. */
export function toElement(decl: any, path: string): any {
  const members = decl.members || [];
  return {
    name: decl.name,
    tagname: decl.tagName,
    description: decl.description || '',
    path,
    properties: members.filter((m: any) => m.kind === 'field'),
    methods: members.filter((m: any) => m.kind === 'method' && !m.static),
    staticMethods: members.filter((m: any) => m.kind === 'method' && m.static),
    events: decl.events || [],
  };
}

/** Renders the Properties, Methods, Static Methods, Events and Types sections of an element. */
export function renderApiSections(element: any, typeContext: TypeContext): string {
  let mdContent = '';

  // Properties
  const properties = sortByName(element.properties);
  if (properties.length > 0) {
    mdContent += `## Properties\n\n`;

    properties.forEach((prop: any) => {
      mdContent += `### ${prop.name}\n\n`;
      mdContent += `**Type:** \`${typeContext.getMemberType(prop)}\`\n\n`;
      mdContent += `${sanitizeDescription(prop.description)}\n\n`;
      mdContent += renderRelatedTypes(typeContext, prop.type);
    });
  }

  // Methods
  const methods = sortByName(element.methods);
  if (methods.length > 0) {
    mdContent += `## Methods\n\n`;

    methods.forEach((method: any) => {
      const methodType = typeContext.getMemberType(method);
      mdContent += `### ${method.name}\n\n`;
      mdContent += `**Type:** \`${methodType}\`\n\n`;
      mdContent += `${sanitizeDescription(method.description)}\n\n`;
    });
  }

  // Static methods
  const staticMethods = sortByName(element.staticMethods);
  if (staticMethods.length > 0) {
    mdContent += `## Static Methods\n\n`;

    staticMethods.forEach((method: any) => {
      const methodType = typeContext.getMemberType(method);
      mdContent += `### ${method.name}\n\n`;
      mdContent += `**Type:** \`${methodType}\`\n\n`;
      mdContent += `${sanitizeDescription(method.description)}\n\n`;
    });
  }

  // Events
  if (element.events && element.events.length > 0) {
    mdContent += `## Events\n\n`;

    // Custom events
    sortByName(element.events).forEach((event: any) => {
      const eventType = typeContext.findEventType(event);
      const eventTypeString = eventType
        ? `[${eventType.name}](#${eventType.name.toLowerCase()})`
        : `\`${event.type?.text ?? 'CustomEvent'}\``;
      mdContent += `### ${event.name}\n\n`;
      mdContent += `**Type:** ${eventTypeString}\n\n`;
      mdContent += `${sanitizeDescription(event.description)}\n\n`;
    });
  }

  // Related types
  const relatedTypes = typeContext.getRelatedTypes();
  if (relatedTypes.length > 0) {
    mdContent += `## Types\n\n`;
    sortByName(relatedTypes).forEach((type) => {
      mdContent += `### ${type.name}\n\n`;
      mdContent += '```ts\n';
      mdContent += `${type.declarationText.trim()}\n`;
      mdContent += '```\n\n';
    });
    mdContent += '\n';
  }

  return mdContent;
}

/** Renders the Markdown page of an element: front matter, description and API sections. */
export function renderElement(element: any): string {
  const typeContext = new TypeContext();

  let mdContent = '';

  // Front matter
  mdContent += `---\n`;
  mdContent += `title: ${element.name}\n`;
  mdContent += `description: ${element.name}\n`;
  mdContent += `element: ${element.tagname}\n`;
  mdContent += `---\n\n`;

  // Description
  if (element.description) {
    mdContent += `## Description\n\n`;
    mdContent += `${sanitizeDescription(element.description)}\n\n`;
  }

  mdContent += renderApiSections(element, typeContext);

  return mdContent;
}
