import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { TypeContext } from './types.ts';

function filterPublicApi(items: any[]) {
  return items.filter((item) => item.privacy === 'public');
}

function sanitizeDescription(description: string) {
  // Fix links to other elements
  description = description.replace(/#\/elements\//gu, '/elements/');
  // Fix links to properties (e.g. #property-dataProvider to #dataprovider)
  description = description.replace(/#property-([a-zA-Z]+)/gu, (_, name) => `#${name.toLowerCase()}`);

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
  mdContent += `---\n\n`;

  // Description
  if (element.description) {
    mdContent += `## Description\n\n`;
    mdContent += `${sanitizeDescription(element.description)}\n\n`;
  }

  // Properties
  mdContent += `## Properties\n\n`;
  const publicProperties = filterPublicApi(element.properties);
  if (publicProperties.length > 0) {
    publicProperties.forEach((prop: any) => {
      const propertyType = typeContext.getMemberType(prop.name);
      mdContent += `### ${prop.name}\n\n`;
      mdContent += `**Type:** \`${propertyType}\`\n\n`;
      mdContent += `${sanitizeDescription(prop.description)}\n\n`;
      mdContent += renderRelatedTypes(typeContext, propertyType);
    });
  } else {
    mdContent += `No public properties.\n\n`;
  }

  // Methods
  mdContent += `## Methods\n\n`;
  const publicMethods = filterPublicApi(element.methods);
  if (publicMethods.length > 0) {
    publicMethods.forEach((method: any) => {
      const methodType = typeContext.getMemberType(method.name);
      mdContent += `### ${method.name}\n\n`;
      mdContent += `**Type:** \`${methodType}\`\n\n`;
      mdContent += `${sanitizeDescription(method.description)}\n\n`;
    });
  } else {
    mdContent += `No public methods.\n\n`;
  }

  // Events
  mdContent += `## Events\n\n`;
  if (element.events && element.events.length > 0) {
    // Custom events
    element.events.forEach((event: any) => {
      const eventType = typeContext.findEventType(event.name);
      const eventTypeString = eventType ? `[${eventType.name}](#${eventType.name.toLowerCase()})` : '`CustomEvent`';
      mdContent += `### ${event.name}\n\n`;
      mdContent += `**Type:** ${eventTypeString}\n\n`;
      mdContent += `${sanitizeDescription(event.description)}\n\n`;
    });

    // Property change events
    const notifyingProperties = filterPublicApi(element.properties).filter(
      (prop) => prop.metadata?.polymer?.notify === true,
    );
    notifyingProperties.forEach((prop: any) => {
      const eventName = `${prop.name}-changed`;
      const eventType = typeContext.findEventType(eventName);
      const eventTypeString = eventType ? `[${eventType.name}](#${eventType.name.toLowerCase()})` : '`CustomEvent`';
      mdContent += `### ${eventName}\n\n`;
      mdContent += `**Type:** ${eventTypeString}\n\n`;
      mdContent += `Fired when the \`${prop.name}\` property changes.\n\n`;
    });
  } else {
    mdContent += `No public events.\n\n`;
  }

  // Related types
  const relatedTypes = typeContext.getRelatedTypes();
  if (relatedTypes.length > 0) {
    mdContent += `## Related Types\n\n`;
    relatedTypes.forEach((type) => {
      mdContent += `### ${type.name}\n\n`;
      mdContent += '```ts\n';
      mdContent += `${type.declarationText.trim()}\n`;
      mdContent += '```\n\n';
    });
    mdContent += '\n';
  }

  return mdContent;
}

function build() {
  const schemaFilePath = process.argv[2];
  if (!schemaFilePath) {
    // eslint-disable-next-line no-console
    console.error('Usage: node api-docs/build.ts <path_to_schema_file>');
    process.exit(1);
  }

  const absoluteSchemaPath = resolve(schemaFilePath);
  let schema;
  try {
    const schemaFileContent = readFileSync(absoluteSchemaPath, 'utf-8');
    schema = JSON.parse(schemaFileContent);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error reading or parsing schema file ${absoluteSchemaPath}:`, error);
    process.exit(1);
  }

  const docsPath = resolve(process.cwd(), 'api-docs', 'src', 'content', 'docs', 'elements');
  if (!existsSync(docsPath)) {
    try {
      mkdirSync(docsPath, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${docsPath}:`, error);
      process.exit(1);
    }
  }

  const plainTextPath = resolve(process.cwd(), 'api-docs', 'public', 'elements');
  if (!existsSync(plainTextPath)) {
    try {
      mkdirSync(plainTextPath, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${plainTextPath}:`, error);
      process.exit(1);
    }
  }

  const publicElements = filterPublicApi(schema.elements);
  publicElements.forEach((element: any) => {
    const docFile = join(docsPath, `${element.tagname}.md`);
    const plainTextFile = join(plainTextPath, `${element.tagname}.txt`);
    const mdContent = renderElement(element);

    try {
      writeFileSync(docFile, mdContent, 'utf-8');
      writeFileSync(plainTextFile, mdContent, 'utf-8');
      // eslint-disable-next-line no-console
      console.log(`Generated: ${docFile}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error writing markdown file ${docFile}:`, error);
    }
  });
  // eslint-disable-next-line no-console
  console.log('Markdown generation complete.');
}

build();
