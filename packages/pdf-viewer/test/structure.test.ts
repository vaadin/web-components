import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { loadDocument, nextRenderIdle } from './helpers.js';

describe('tagged PDF structure', () => {
  let viewer: PdfViewer;

  function getTree() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('.struct-tree');
  }

  function getOwnedText(element: Element) {
    return [element, ...element.querySelectorAll('[aria-owns]')]
      .filter((owner) => owner.hasAttribute('aria-owns'))
      .flatMap((owner) => owner.getAttribute('aria-owns')!.split(' '))
      .map((id) => viewer.shadowRoot!.getElementById(id)?.textContent)
      .join('');
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 800px"></vaadin-pdf-viewer>');
    await nextRender();
  });

  it('should not add a structure for an untagged PDF', async () => {
    const idle = nextRenderIdle(viewer);
    await loadDocument(viewer, 'multi-page.pdf');
    await idle;
    expect(getTree()).to.be.null;
  });

  describe('tagged', () => {
    beforeEach(async () => {
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'tagged.pdf');
      await idle;
    });

    it('should expose headings with their level', () => {
      const headings = [...getTree()!.querySelectorAll('[role="heading"]')];
      const levels = headings.map((heading) => heading.getAttribute('aria-level'));
      expect(levels).to.include('1');
      expect(levels).to.include('2');
      const h1 = headings.find((heading) => heading.getAttribute('aria-level') === '1')!;
      expect(getOwnedText(h1)).to.equal('Tagged document');
    });

    it('should expose the list and its items', () => {
      const list = getTree()!.querySelector('[role="list"]')!;
      expect(list.querySelectorAll('[role="listitem"]')).to.have.lengthOf(2);
    });

    it('should expose the table with header and data cells', () => {
      const table = getTree()!.querySelector('[role="table"]')!;
      expect(table.querySelectorAll('[role="row"]').length).to.be.at.least(3);
      expect(table.querySelectorAll('[role="columnheader"]')).to.have.lengthOf(2);
      expect(table.querySelectorAll('[role="cell"]')).to.have.lengthOf(4);
    });

    it('should expose the alternative text of figures', () => {
      const figure = getTree()!.querySelector('[role="figure"]')!;
      expect(figure.getAttribute('aria-label')).to.equal('A blue square');
    });

    it('should reference text layer elements that exist', () => {
      const ids = [...getTree()!.querySelectorAll('[aria-owns]')].flatMap((element) =>
        element.getAttribute('aria-owns')!.split(' '),
      );
      expect(ids.length).to.be.greaterThan(0);
      ids.forEach((id) => {
        expect(viewer.shadowRoot!.getElementById(id), id).to.be.ok;
      });
    });
  });
});
