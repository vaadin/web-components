import { access, constants } from 'node:fs/promises';
import ts, { type SourceFile, type Statement } from 'typescript';
import type { WalkOptions } from './fswalk.js';
import { fswalk } from './fswalk.js';

export function camelCase(str: string) {
  // CamelCase join
  return str
    .split('-')
    .map((part) => part[0].toUpperCase() + part.substring(1))
    .join('');
}

const prefixPattern = /vaadin/gi;

export function stripPrefix(str: string) {
  return str.replaceAll(prefixPattern, '');
}

export function createSourceFile(statements: readonly Statement[], fileName: string): SourceFile {
  const sourceFile = ts.createSourceFile(fileName, '', ts.ScriptTarget.ES2019, undefined, ts.ScriptKind.TS);
  return ts.factory.updateSourceFile(sourceFile, statements);
}

export async function exists(file: string): Promise<boolean> {
  try {
    await access(file, constants.R_OK);
    return true;
  } catch (_) {
    return false;
  }
}

export type SearchOptions = WalkOptions;

export async function search(name: string, dir: string, options?: SearchOptions): Promise<string | undefined> {
  for await (const [path] of fswalk(dir, options)) {
    if (path.endsWith(`${name}.js`)) {
      return path;
    }
  }
}

export function hasOverrideKey([overrideKey]: readonly string[]) {
  return overrideKey === '--override';
}

export function createImportPath(link: string, local: boolean) {
  let updatedLink = link;

  if (!updatedLink.startsWith('.') && local) {
    updatedLink = `./${updatedLink}`;
  }

  return updatedLink.replace('.ts', '.js').replaceAll('\\', '/');
}

export function filterEmptyItems<I>(arr: Array<I | undefined>): I[];
export function filterEmptyItems<I>(arr: ReadonlyArray<I | undefined>): readonly I[];
export function filterEmptyItems(arr: ReadonlyArray<unknown | undefined>): readonly unknown[] {
  return arr.filter(Boolean);
}
