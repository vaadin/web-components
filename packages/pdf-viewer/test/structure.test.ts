import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import { createStructTreeElement, type PdfViewerStructTreeNode } from '../src/pdf-viewer-structure-layer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, loadDocument, nextRenderIdle } from './helpers.js';

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

    it('should expose the alternative text of figures as an image', () => {
      const figure = getTree()!.querySelector('[role="figure"]')!;
      expect(figure.querySelector('[role="img"]')!.getAttribute('aria-label')).to.equal('A blue square');
    });

    it('should not expose tagged links as a second link next to the link element', () => {
      expect(getTree()!.querySelector('[role="link"]')).to.be.null;
      const links = [...viewer.shadowRoot!.querySelectorAll('a.link')];
      expect(links).to.have.lengthOf(1);
      expect(links[0].getAttribute('aria-label')).to.equal('Vaadin website (opens in a new tab)');
    });

    it('should set the language of text in another language', () => {
      const swedish = getTree()!.querySelector('[lang="sv"]')!;
      expect(getOwnedText(swedish)).to.equal('Hej världen');
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

    it('should keep the structure in the page with the text layer', () => {
      const page = viewer.shadowRoot!.querySelector('[part="page"]')!;
      expect(getTree()!.parentElement).to.equal(page);
      expect(getTree()!.nextElementSibling).to.equal(page.querySelector('.text-layer'));
    });
  });

  describe('marked content', () => {
    const text = 'BT /F1 24 Tf 72 700 Td (Marked text) Tj ET';
    let urls: string[] = [];

    afterEach(async () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls = [];
      await resetMouse();
    });

    async function load(content: string, rotate = 0) {
      const url = createPdf([{ content, rotate }]);
      urls.push(url);
      const idle = nextRenderIdle(viewer);
      viewer.src = url;
      await idle;
    }

    function getSpan() {
      return [...viewer.shadowRoot!.querySelectorAll('.text-layer span:not(.markedContent)')].find(
        (element) => element.textContent === 'Marked text',
      )!;
    }

    async function getTextPosition(content: string, rotate: number) {
      await load(content, rotate);
      const page = viewer.shadowRoot!.querySelector('[part="page"]')!.getBoundingClientRect();
      const rect = getSpan().getBoundingClientRect();
      return {
        left: (rect.left - page.left) / page.width,
        top: (rect.top - page.top) / page.height,
        width: rect.width / page.width,
        height: rect.height / page.height,
      };
    }

    [0, 90].forEach((rotate) => {
      [1, 2].forEach((zoom) => {
        it(`should place marked content like other text with rotation ${rotate} and zoom ${zoom}`, async () => {
          viewer.zoom = zoom;
          const plain = await getTextPosition(text, rotate);
          const marked = await getTextPosition(`/P << /MCID 0 >> BDC ${text} EMC`, rotate);
          expect(viewer.shadowRoot!.querySelector('.text-layer .markedContent')).to.be.ok;
          Object.entries(plain).forEach(([key, value]) => {
            expect(marked[key as keyof typeof marked], key).to.be.closeTo(value, 0.001);
          });
        });
      });
    });

    it('should allow selecting marked content with the pointer', async () => {
      await load(`/P << /MCID 0 >> BDC ${text} EMC`);
      const rect = getSpan().getBoundingClientRect();
      const y = Math.round(rect.top + rect.height / 2);
      await sendMouse({ type: 'move', position: [Math.round(rect.left) + 1, y] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [Math.round(rect.right) - 1, y] });
      await sendMouse({ type: 'up' });
      expect(window.getSelection()!.toString()).to.include('Marked tex');
    });

    it('should hide artifacts from assistive technology', async () => {
      await load(`/Artifact BMC ${text} EMC`);
      expect(getSpan().closest('[aria-hidden="true"]')).to.be.ok;
    });

    it('should expose the text of an untagged page in content order', async () => {
      await load(
        'BT /F1 24 Tf 72 700 Td (First) Tj ET BT /F1 24 Tf 72 400 Td (Third) Tj ET BT /F1 24 Tf 72 550 Td (Second) Tj ET',
      );
      const spans = [...viewer.shadowRoot!.querySelectorAll('.text-layer span')];
      expect(spans.map((span) => span.textContent)).to.deep.equal(['First', 'Third', 'Second']);
      expect(getTree()).to.be.null;
    });
  });

  describe('roles', () => {
    function create(children: PdfViewerStructTreeNode[]) {
      return createStructTreeElement({ role: 'Root', children })!;
    }

    it('should expose a table of contents as a list', () => {
      const tree = create([
        {
          role: 'TOC',
          children: [
            { role: 'TOCI', children: [{ type: 'content', id: 'a' }] },
            { role: 'TOCI', children: [{ type: 'content', id: 'b' }] },
          ],
        },
      ]);
      const list = tree.querySelector('[role="list"]')!;
      expect(list.querySelectorAll('[role="listitem"]')).to.have.lengthOf(2);
    });

    it('should expose the cells that span rows and columns', () => {
      const tree = create([
        {
          role: 'Table',
          children: [
            {
              role: 'TR',
              children: [{ role: 'TD', rowSpan: 2, colSpan: 3, children: [{ type: 'content', id: 'a' }] }],
            },
          ],
        },
      ]);
      const cell = tree.querySelector('[role="cell"]')!;
      expect(cell.getAttribute('aria-rowspan')).to.equal('2');
      expect(cell.getAttribute('aria-colspan')).to.equal('3');
    });

    it('should expose the headers of the rows of a table body as row headers', () => {
      const tree = create([
        {
          role: 'Table',
          children: [
            {
              role: 'TBody',
              children: [{ role: 'TR', children: [{ role: 'TH', children: [{ type: 'content', id: 'a' }] }] }],
            },
          ],
        },
      ]);
      expect(tree.querySelector('[role="rowheader"]')).to.be.ok;
    });

    it('should not name a paragraph with its alternative text', () => {
      const tree = create([{ role: 'P', alt: 'Note', children: [{ type: 'content', id: 'a' }] }]);
      const paragraph = tree.querySelector('[role="paragraph"]')!;
      expect(paragraph.hasAttribute('aria-label')).to.be.false;
      expect(paragraph.getAttribute('aria-description')).to.equal('Note');
    });

    it('should not own the annotations of links', () => {
      const tree = create([
        {
          role: 'Link',
          children: [
            { type: 'content', id: 'p3R_mc0' },
            { type: 'annotation', id: 'pdfjs_internal_id_5R' },
          ],
        },
      ]);
      const owned = [...tree.querySelectorAll('[aria-owns]')].map((element) => element.getAttribute('aria-owns'));
      expect(owned).to.deep.equal(['p3R_mc0']);
    });

    it('should not own elements by an id that is not one of marked content', () => {
      const tree = create([
        {
          role: 'P',
          children: [
            { type: 'content', id: 'p3R_mc0' },
            { type: 'content', id: 'p12R1_mc7' },
            { type: 'content', id: 'p3R_mcx content pages thumbnails' },
          ],
        },
      ]);
      const owned = [...tree.querySelectorAll('[aria-owns]')].map((element) => element.getAttribute('aria-owns'));
      expect(owned).to.deep.equal(['p3R_mc0', 'p12R1_mc7']);
    });
  });
});
