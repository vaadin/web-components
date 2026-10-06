import { oneEvent } from '@vaadin/testing-helpers';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';

export type Fixture =
  'encrypted.pdf' | 'invalid.pdf' | 'links.pdf' | 'multi-page.pdf' | 'outline.pdf' | 'standard-font.pdf' | 'tagged.pdf';

export function fixtureUrl(name: Fixture): string {
  return new URL(`./fixtures/${name}`, import.meta.url).href;
}

/**
 * Sets the `src` of the viewer and waits until the document has loaded.
 */
export async function loadDocument(viewer: PdfViewer, name: Fixture): Promise<void> {
  const loaded = oneEvent(viewer, 'document-load');
  viewer.src = fixtureUrl(name);
  await loaded;
}

/**
 * Waits until the viewer has finished rendering the pages it currently shows.
 */
export async function nextRenderIdle(viewer: PdfViewer): Promise<void> {
  await oneEvent(viewer, 'render-idle');
}
