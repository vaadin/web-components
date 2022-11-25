import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import type { SetRequired } from 'type-fest';
import ts, {
  type Node,
  type SourceFile,
  type Statement,
  type TransformationContext,
  type TransformerFactory,
} from 'typescript';
import type { GenericJsContribution } from '../../types/schema.js';
import { fswalk, type WalkOptions } from './fswalk.js';
import { elementsWithMissingEntrypoint } from './settings.js';

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

export async function search(elementName: string, dir: string, options?: SearchOptions): Promise<string | undefined> {
  if (elementsWithMissingEntrypoint.has(elementName)) {
    dir = join(dir, 'src');
  }

  const fileName = `${elementName}.js`;
  for await (const [path, entry] of fswalk(dir, options)) {
    if (entry.name === fileName) {
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

export function template<T>(
  code: string,
  selector: (statements: readonly Statement[]) => T,
  transformers?: ReadonlyArray<TransformerFactory<SourceFile>>,
): T {
  let sourceFile = ts.createSourceFile(`f.tsx`, code, ts.ScriptTarget.Latest, false);

  if (transformers) {
    sourceFile = ts.transform<SourceFile>(sourceFile, transformers as Array<TransformerFactory<SourceFile>>)
      .transformed[0];
  }

  return selector(sourceFile.statements);
}

export function transform<T extends Node>(transformer: (node: Node) => Node | undefined): TransformerFactory<T> {
  return (context: TransformationContext) => (root: T) => {
    const visitor = (node: Node): Node | undefined => ts.visitEachChild(transformer(node), visitor, context);
    return ts.visitNode(root, visitor);
  };
}

export type NamedGenericJsContribution = SetRequired<GenericJsContribution, 'name'>;

export function pickNamedEvents(
  events: GenericJsContribution[] | undefined,
  logger: () => void,
): readonly NamedGenericJsContribution[] | undefined {
  return events?.filter((e) => {
    if (!e.name) {
      logger();
      return false;
    }

    return true;
  }) as readonly NamedGenericJsContribution[] | undefined;
}
