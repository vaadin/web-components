import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { TypeContext } from './types.ts';

function sortByName(items: any[]) {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

function sanitizeDescription(description: string = '') {
  // Fix links to other elements
  description = description.replace(/#\/elements\//gu, '/elements/');
  // Fix links to properties (e.g. #property-dataProvider to #dataprovider)
  description = description.replace(/#property-([a-zA-Z]+)/gu, (_, name) => `#${name.toLowerCase()}`);
  // Fix links to methods (e.g. #method-updateConfiguration to #updateconfiguration)
  description = description.replace(/#method-([a-zA-Z]+)/gu, (_, name) => `#${name.toLowerCase()}`);

  return description;
}

function renderRelatedTypes(typeContext: TypeContext, typeString: string) {
  const relatedTypes = typeContext.findRelatedTypes(typeString);

  if (relatedTypes.length > 0) {
    const typeNames = relatedTypes.map((type) => `[${type.name}](#${type.name.toLowerCase()})`).join(', ');
    return `See also: ${typeNames}\n\n`;
  }

  return '';
}

function renderElement(element: any) {
  const typeContext = new TypeContext(element);

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

  // Properties
  const properties = sortByName(element.properties);
  if (properties.length > 0) {
    mdContent += `## Properties\n\n`;

    properties.forEach((prop: any) => {
      const propertyType = typeContext.getMemberType(prop.name);
      mdContent += `### ${prop.name}\n\n`;
      mdContent += `**Type:** \`${propertyType}\`\n\n`;
      mdContent += `${sanitizeDescription(prop.description)}\n\n`;
      mdContent += renderRelatedTypes(typeContext, propertyType);
    });
  }

  // Methods
  const methods = sortByName(element.methods);
  if (methods.length > 0) {
    mdContent += `## Methods\n\n`;

    methods.forEach((method: any) => {
      const methodType = typeContext.getMemberType(method.name);
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
      const methodType = typeContext.getMemberType(method.name);
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
      const eventType = typeContext.findEventType(event.name);
      const eventTypeString = eventType ? `[${eventType.name}](#${eventType.name.toLowerCase()})` : '`CustomEvent`';
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

function generate() {
  const schemaFilePath = process.argv[2];
  if (!schemaFilePath) {
    console.error('Usage: node generate.ts <path_to_schema_file>');
    process.exit(1);
  }

  const absoluteSchemaPath = resolve(schemaFilePath);
  let manifest;
  try {
    const schemaFileContent = readFileSync(absoluteSchemaPath, 'utf-8');
    manifest = JSON.parse(schemaFileContent);
  } catch (error) {
    console.error(`Error reading or parsing schema file ${absoluteSchemaPath}:`, error);
    process.exit(1);
  }

  const docsPath = resolve(process.cwd(), 'content', 'elements');
  if (!existsSync(docsPath)) {
    try {
      mkdirSync(docsPath, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${docsPath}:`, error);
      process.exit(1);
    }
  }

  // Extract public elements from CEM modules
  const elements: any[] = [];
  for (const mod of manifest.modules) {
    for (const decl of mod.declarations || []) {
      if (!decl.tagName || !decl.customElement) continue;

      const members = decl.members || [];
      elements.push({
        name: decl.name,
        tagname: decl.tagName,
        description: decl.description || '',
        path: mod.path,
        properties: members.filter((m: any) => m.kind === 'field'),
        methods: members.filter((m: any) => m.kind === 'method' && !m.static),
        staticMethods: members.filter((m: any) => m.kind === 'method' && m.static),
        events: decl.events || [],
        privacy: 'public',
      });
    }
  }

  sortByName(elements).forEach((element: any) => {
    const docFile = join(docsPath, `${element.tagname}.md`);
    const mdContent = renderElement(element);

    try {
      writeFileSync(docFile, mdContent, 'utf-8');

      console.log(`Generated: ${docFile}`);
    } catch (error) {
      console.error(`Error writing markdown file ${docFile}:`, error);
    }
  });

  console.log('Markdown generation complete.');
}

generate();
