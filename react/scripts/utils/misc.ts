import { glob } from 'glob';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import type { GenericJsContribution } from '../types/schema.js';
import { elementsWithMissingEntrypoint, elementToClassNamingConventionViolations } from './settings.js';

export function camelCase(str: string): string {
  // CamelCase join
  return str
    .split('-')
    .map((part) => part[0].toUpperCase() + part.substring(1))
    .join('');
}

const prefixPattern = /vaadin/gi;

export function stripPrefix(str: string): string {
  return str.replaceAll(prefixPattern, '');
}

/**
 * Converts the given `vaadin-element-name` to `ElementName` class name
 * by following naming conventions and known exceptions.
 *
 * @param elementName The dash separated custom element name.
 *
 * @returns The camel case class name without Vaadin prefix.
 */
export function convertElementNameToClassName(elementName: string): string {
  if (elementToClassNamingConventionViolations.has(elementName)) {
    return elementToClassNamingConventionViolations.get(elementName)!;
  }

  const conventionalClassName = stripPrefix(camelCase(elementName));
  return conventionalClassName;
}

export function search(elementName: string, dir: string): string | undefined {
  if (elementsWithMissingEntrypoint.has(elementName)) {
    dir = join(dir, 'src');
  }

  // Only the package root: `src/<tag>.js` modules are not public entrypoints.
  const path = join(dir, `${elementName}.js`);
  return statSync(path, { throwIfNoEntry: false })?.isFile() ? path : undefined;
}

export function createImportPath(link: string, local: boolean): string {
  let updatedLink = link;

  if (!updatedLink.startsWith('.') && local) {
    updatedLink = `./${updatedLink}`;
  }

  return updatedLink.replace('.ts', '.js').replaceAll('\\', '/');
}

export type NamedGenericJsContribution = GenericJsContribution & { name: string };

export function pickNamedEvents(
  events: GenericJsContribution[] | undefined,
  logger: () => void,
): readonly NamedGenericJsContribution[] | undefined {
  return events?.filter((e): e is NamedGenericJsContribution => {
    if (!e.name) {
      logger();
      return false;
    }

    return true;
  });
}

const collator = new Intl.Collator('en');

/**
 * Lists the top-level `src/*.ts(x)` module names, sorted.
 * Skips `.d.ts` files and the `generated`, `utils` and `renderers` directories.
 */
export async function listModuleNames(srcDir: string): Promise<string[]> {
  const files = await glob('*.{ts,tsx}', { cwd: srcDir, nodir: true, ignore: '*.d.ts' });
  return files.map((file) => file.replace(/\.tsx?$/, '')).sort(collator.compare);
}
