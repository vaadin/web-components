import type { ClassDeclaration, CustomElement, Declaration, Package } from 'custom-elements-manifest/schema';
import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { logger } from 'storybook/internal/node-logger';
import type { DocgenMiddleware, DocgenPayload, StrictArgTypes, StrictInputType } from 'storybook/internal/types';
import type { TypeContext } from '../../../../api-docs/types.ts';
import { readDocsIds, rewriteElementLinks } from './links.ts';

export interface ApiReferenceOptions {
  storiesDir: string;
}

interface ManifestEntry {
  manifestPath: string;
  declaration: { tagName: string };
}

// Schema 1.0.0 declares `CustomElementDeclaration` without the `CustomElement` fields
type ElementDeclaration = ClassDeclaration & CustomElement;

interface TableType {
  summary: string;
  detail?: string;
}

interface ArgTypeContext {
  tagName: string;
  typeContext: TypeContext;
  fixLinks(markdown: string): string;
}

const manifestCache = new Map<string, { mtimeMs: number; modules: Package['modules'] }>();

function readManifestModules(manifestFile: string): Package['modules'] {
  const { mtimeMs } = statSync(manifestFile);
  let manifest = manifestCache.get(manifestFile);
  if (manifest?.mtimeMs !== mtimeMs) {
    manifest = { mtimeMs, modules: JSON.parse(readFileSync(manifestFile, 'utf8')).modules };
    manifestCache.set(manifestFile, manifest);
  }
  return manifest.modules;
}

function isElement(decl: Declaration, tagName: string): decl is ElementDeclaration {
  return 'customElement' in decl && 'tagName' in decl && decl.tagName === tagName;
}

/** Reads the declaration from the file, as the one of the payload also has inherited members. */
function findElement(manifestFile: string, tagName: string): { declaration: ElementDeclaration; path: string } {
  for (const module of readManifestModules(manifestFile)) {
    const declaration = module.declarations?.find((decl) => isElement(decl, tagName));
    if (declaration) {
      return { declaration, path: module.path };
    }
  }
  throw new Error(`no module declares <${tagName}> in ${manifestFile}`);
}

function propertyType(typeContext: TypeContext, name: string): TableType {
  const summary = typeContext.getMemberType(name);
  const related = typeContext.findRelatedTypes(summary);
  const detail = related.map((type) => type.declarationText.trim()).join('\n\n');
  return detail ? { summary, detail } : { summary };
}

function eventType(typeContext: TypeContext, name: string): TableType | undefined {
  const type = typeContext.findEventType(name);
  return type ? { summary: type.name, detail: type.declarationText.trim() } : undefined;
}

function tableType(argType: StrictInputType, typeContext: TypeContext): TableType | undefined {
  switch (argType.table?.category) {
    case 'properties':
      return propertyType(typeContext, argType.name);
    case 'methods':
      return { summary: typeContext.getMemberType(argType.name) };
    case 'events':
      return eventType(typeContext, argType.name);
    default:
      // Attributes, slots, CSS parts and CSS properties have no TypeScript type
      return undefined;
  }
}

function updateArgType(argType: StrictInputType, { tagName, typeContext, fixLinks }: ArgTypeContext): StrictInputType {
  let type: TableType | undefined;
  try {
    type = tableType(argType, typeContext);
  } catch (error) {
    logger.debug(`No TypeScript type for <${tagName}> ${argType.name}: ${String(error)}`);
  }
  return {
    ...argType,
    description: argType.description && fixLinks(argType.description),
    table: type ? { ...argType.table, type: { ...argType.table?.type, ...type } } : argType.table,
  };
}

function updateArgTypes(argTypes: StrictArgTypes, context: ArgTypeContext): StrictArgTypes {
  return Object.fromEntries(Object.entries(argTypes).map(([key, argType]) => [key, updateArgType(argType, context)]));
}

async function renderApiReference(
  payload: DocgenPayload,
  manifestEntry: ManifestEntry,
  storiesDir: string,
): Promise<Partial<DocgenPayload>> {
  // Imported on first use, as a module that fails to load at worker start stops all docgen
  const [{ renderApiSections, sanitizeDescription, toElement }, { TypeContext }] = await Promise.all([
    import('../../../../api-docs/render.ts'),
    import('../../../../api-docs/types.ts'),
  ]);

  const { tagName } = manifestEntry.declaration;
  const manifestFile = resolve(manifestEntry.manifestPath);
  const { declaration, path } = findElement(manifestFile, tagName);
  const element = toElement(declaration, path);
  // Module paths are relative to the manifest directory, which also holds tsconfig.json
  const typeContext = new TypeContext(element, { rootDir: dirname(manifestFile) });

  const links = { tag: tagName, docsIds: readDocsIds(storiesDir) };
  const fixLinks = (markdown: string) => rewriteElementLinks(sanitizeDescription(markdown), links);

  return {
    apiDescription: rewriteElementLinks(renderApiSections(element, typeContext), links),
    argTypes: updateArgTypes(payload.argTypes ?? {}, { tagName, typeContext, fixLinks }),
    description: payload.description && fixLinks(payload.description),
  };
}

/** Adds the api-docs API reference and TypeScript types to the docgen payload of the web components framework. */
export function createDocgenProvider({ storiesDir }: ApiReferenceOptions): DocgenMiddleware {
  return (next) => async (input) => {
    const payload = await next(input);
    const manifestEntry = payload?.customElementsManifest as ManifestEntry | undefined;
    if (!payload || !manifestEntry) {
      // Not a web component, or the framework found no declaration
      return payload;
    }
    try {
      return { ...payload, ...(await renderApiReference(payload, manifestEntry, storiesDir)) };
    } catch (error) {
      // A thrown error turns the payload into an error payload, so keep the framework docs
      logger.warn(`Failed to render the API reference of <${manifestEntry.declaration.tagName}>: ${String(error)}`);
      return payload;
    }
  };
}
