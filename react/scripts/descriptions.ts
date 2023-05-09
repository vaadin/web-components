import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { HtmlElement as SchemaHTMLElement, JSONSchemaForWebTypes } from '../types/schema.js';
import { nodeModulesDir } from './utils/config.js';
import filterEmptyItems from './utils/filterEmptyItems.js';
import { descriptionOverrides } from './utils/settings.js';

export type SchemaElementWithPackage = readonly [packageName: string, element: SchemaHTMLElement];

export async function loadDescriptions(): Promise<ReadonlyArray<JSONSchemaForWebTypes>> {
  const webComponentsDir = resolve(nodeModulesDir, '@vaadin');
  const dirs = await readdir(webComponentsDir);

  const schemas = await Promise.all(
    dirs.map(async (dir) => {
      try {
        const contents = await readFile(resolve(webComponentsDir, dir, 'web-types.json'), 'utf8');
        const parsedSchema = JSON.parse(contents) as JSONSchemaForWebTypes;
        const overrides = descriptionOverrides.get(parsedSchema.name) || {};
        return {
          ...parsedSchema,
          ...overrides,
        };
      } catch (_) {
        // ignore file that doesn't exist
        return undefined;
      }
    }),
  );

  return filterEmptyItems(schemas);
}

export function* extractElementsFromDescriptions(
  descriptions: readonly JSONSchemaForWebTypes[],
): Generator<SchemaElementWithPackage, void> {
  for (const { contributions, name } of descriptions) {
    for (const element of contributions?.html?.elements ?? []) {
      yield [name, element];
    }
  }
}
