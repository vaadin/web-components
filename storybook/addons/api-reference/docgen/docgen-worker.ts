import { dirname, resolve } from 'node:path';
import { logger } from 'storybook/internal/node-logger';
import type { DocgenMiddleware, DocgenPayload } from 'storybook/internal/types';
import { updateArgTypes } from './arg-types.ts';
import { readDocsIds, rewriteElementLinks } from './links.ts';
import { findElement } from './manifest.ts';

export interface ApiReferenceOptions {
  storiesDir: string;
}

interface ManifestEntry {
  manifestPath: string;
  declaration: { tagName: string };
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
