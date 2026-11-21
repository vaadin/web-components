import { dirname, resolve } from 'node:path';
import { logger } from 'storybook/internal/node-logger';
import type { DocgenMiddleware, DocgenPayload } from 'storybook/internal/types';
import type { ManifestEvent, ManifestMember } from '../../../../api-docs/types.ts';
import { updateArgTypes } from './arg-types.ts';
import { readDocsIds, rewriteElementLinks } from './links.ts';

export interface ApiReferenceOptions {
  storiesDir: string;
}

interface ManifestEntry {
  manifestPath: string;
  declaration: { tagName: string; members?: ManifestMember[]; events?: ManifestEvent[] };
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

  const { declaration } = manifestEntry;
  const { tagName } = declaration;
  const element = toElement(declaration);
  // The module paths of the type references are relative to the manifest directory, which also holds tsconfig.json
  const typeContext = new TypeContext({ rootDir: dirname(resolve(manifestEntry.manifestPath)) });

  const links = { tag: tagName, docsIds: readDocsIds(storiesDir) };
  const fixLinks = (markdown: string) => rewriteElementLinks(sanitizeDescription(markdown), links);

  return {
    apiDescription: rewriteElementLinks(renderApiSections(element, typeContext), links),
    argTypes: updateArgTypes(payload.argTypes ?? {}, {
      typeContext,
      members: declaration.members ?? [],
      events: declaration.events ?? [],
      fixLinks,
    }),
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
