import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { toId } from 'storybook/internal/csf';

/** Maps the `component` tag of each story file to the id of its docs page. */
export function readDocsIds(storiesDir: string): Map<string, string> {
  const docsIds = new Map<string, string>();
  for (const file of readdirSync(storiesDir).filter((name) => name.endsWith('.stories.js'))) {
    const source = readFileSync(join(storiesDir, file), 'utf8');
    const title = /\btitle:\s*'([^']+)'/u.exec(source);
    // The meta component follows the title, other `component` keys belong to subcomponents
    const component = title && /\bcomponent:\s*'([^']+)'/u.exec(source.slice(title.index));
    if (title && component) {
      docsIds.set(component[1], toId(title[1], 'docs'));
    }
  }
  return docsIds;
}

const ELEMENT_LINK = /\[([^\]]*)\]\(\/elements\/([a-z0-9-]+)(#[\w-]+)?\)/gu;

/** Rewrites the `/elements/<tag>#anchor` links that the api-docs `sanitizeDescription` creates. */
export function rewriteElementLinks(
  markdown: string,
  { tag, docsIds }: { tag: string; docsIds: Map<string, string> },
): string {
  return markdown.replace(ELEMENT_LINK, (_, text: string, target: string, anchor: string = '') => {
    if (target === tag) {
      return anchor ? `[${text}](${anchor})` : text;
    }
    const docsId = docsIds.get(target);
    return docsId ? `[${text}](?path=/docs/${docsId}${anchor})` : text;
  });
}
