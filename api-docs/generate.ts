import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { getElementEntries } from '../manifest/lib/cem-helpers.js';
import { renderElement, sortByName, toElement } from './render.ts';

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

  const elements = getElementEntries(manifest).map(({ declaration, path }) => toElement(declaration, path));

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
