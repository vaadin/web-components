import '../../pdf-viewer/test/enable-feature-flag.js';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { findByQuerySelector } from '../../../react/test/utils/findByQuerySelector.js';
import { Button } from '../../react-components/src/Button.js';
import {
  PdfViewer,
  type PdfViewerDocumentLoadEvent,
  type PdfViewerFindResultEvent,
  type PdfViewerPageChangedEvent,
} from '../src/PdfViewer.js';

describe('PdfViewer', () => {
  // Loading pdf.js and its worker takes longer than the default timeouts.
  const TIMEOUT = 10000;

  const src = new URL('../../pdf-viewer/test/fixtures/multi-page.pdf', import.meta.url).href;

  it(
    'should fire onDocumentLoad with the page count',
    async () => {
      const loads: Array<PdfViewerDocumentLoadEvent['detail']> = [];
      await render(
        <PdfViewer
          src={src}
          onDocumentLoad={(event) => {
            expectTypeOf(event).toEqualTypeOf<PdfViewerDocumentLoadEvent>();
            loads.push(event.detail);
          }}
        />,
      );

      await vi.waitFor(() => expect(loads).to.have.length(1), { timeout: TIMEOUT });
      expect(loads[0].pageCount).to.equal(6);
    },
    TIMEOUT,
  );

  it(
    'should fire onPageChanged when the page changes',
    async () => {
      const pages: number[] = [];
      let loaded = false;
      const result = await render(<PdfViewer src={src} onDocumentLoad={() => (loaded = true)} />);
      await vi.waitFor(() => expect(loaded).to.be.true, { timeout: TIMEOUT });

      await result.rerender(
        <PdfViewer
          src={src}
          page={3}
          onPageChanged={(event) => {
            expectTypeOf(event).toEqualTypeOf<PdfViewerPageChangedEvent>();
            pages.push(event.detail.value);
          }}
        />,
      );

      await vi.waitFor(() => expect(pages).to.include(3), { timeout: TIMEOUT });
    },
    TIMEOUT,
  );

  it(
    'should fire onFindResult with the number of matches',
    async () => {
      const results: Array<PdfViewerFindResultEvent['detail']> = [];
      let loaded = false;
      await render(
        <PdfViewer
          src={src}
          onDocumentLoad={() => (loaded = true)}
          onFindResult={(event) => {
            expectTypeOf(event).toEqualTypeOf<PdfViewerFindResultEvent>();
            results.push(event.detail);
          }}
        />,
      );
      await vi.waitFor(() => expect(loaded).to.be.true, { timeout: TIMEOUT });

      const viewer = await findByQuerySelector('vaadin-pdf-viewer');
      viewer.find('Page');

      await vi.waitFor(() => expect(results).to.have.length(1), { timeout: TIMEOUT });
      expect(results[0].query).to.equal('Page');
      expect(results[0].matchCount).to.be.above(0);
    },
    TIMEOUT,
  );

  it(
    'should render a button with slot toolbar-actions in the action group',
    async () => {
      let loaded = false;
      await render(
        <PdfViewer src={src} onDocumentLoad={() => (loaded = true)}>
          <Button slot="toolbar-actions">Approve</Button>
        </PdfViewer>,
      );
      await vi.waitFor(() => expect(loaded).to.be.true, { timeout: TIMEOUT });

      const viewer = await findByQuerySelector('vaadin-pdf-viewer');
      const button = await findByQuerySelector('vaadin-button[slot="toolbar-actions"]', viewer);
      const actions = viewer.shadowRoot!.querySelector('[part="toolbar-group"].actions')!;
      expect(button).to.have.text('Approve');
      expect(actions.contains(button.assignedSlot)).to.be.true;
      expect(button.checkVisibility()).to.be.true;
    },
    TIMEOUT,
  );
});
