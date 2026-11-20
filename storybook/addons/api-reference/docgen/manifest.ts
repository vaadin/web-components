import { readFileSync, statSync } from 'node:fs';
import { type ElementEntry, getElementEntries } from '../../../../manifest/lib/cem-helpers.js';

const manifestCache = new Map<string, { mtimeMs: number; elements: ElementEntry[] }>();

function readElements(manifestFile: string): ElementEntry[] {
  const { mtimeMs } = statSync(manifestFile);
  let cached = manifestCache.get(manifestFile);
  if (cached?.mtimeMs !== mtimeMs) {
    cached = { mtimeMs, elements: getElementEntries(JSON.parse(readFileSync(manifestFile, 'utf8'))) };
    manifestCache.set(manifestFile, cached);
  }
  return cached.elements;
}

/** Reads the path of the declaring module, which the payload does not have. */
// TODO: Use the payload when `customElementsManifest` gets the module path, see storybookjs/storybook#36728
export function findElement(manifestFile: string, tagName: string): ElementEntry {
  const entry = readElements(manifestFile).find(({ declaration }) => declaration.tagName === tagName);
  if (!entry) {
    throw new Error(`no module declares <${tagName}> in ${manifestFile}`);
  }
  return entry;
}
