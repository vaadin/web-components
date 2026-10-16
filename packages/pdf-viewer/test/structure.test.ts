import { expect } from '@vaadin/chai-plugins';
import { getAccessibilityTree, resetMouse, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, isChrome, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
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

    // Only Chromium exposes its accessibility tree to the tests.
    (isChrome ? describe : describe.skip)('accessibility tree', () => {
      let tree: Awaited<ReturnType<typeof getAccessibilityTree>>;

      beforeEach(async () => {
        tree = await getAccessibilityTree();
      });

      function getNames(role: string) {
        return tree!.filter((node) => node.role === role).map((node) => node.name);
      }

      it('should name headings with their text', () => {
        const headings = tree!.filter((node) => node.role === 'heading');
        expect(headings.map((node) => [node.name, node.properties.level])).to.deep.include.members([
          ['Tagged document', 1],
        ]);
        headings.forEach((heading) => expect(heading.name).to.not.be.empty);
      });

      it('should name table header and data cells with their text', () => {
        expect(getNames('columnheader').map((name) => name.trim())).to.deep.equal(['Name', 'Value']);
        expect(getNames('cell')).to.have.lengthOf(4);
        getNames('cell').forEach((name) => expect(name).to.not.be.empty);
      });

      it('should only have rows in tables and row groups', () => {
        const containers = ['table', 'rowgroup'];
        tree!.forEach((node, index) => {
          if (containers.includes(node.role)) {
            const children = tree!.slice(index + 1).filter((child) => child.depth === node.depth + 1);
            const end = tree!.findIndex((other, i) => i > index && other.depth <= node.depth);
            const ownChildren = end === -1 ? children : children.filter((child) => tree!.indexOf(child) < end);
            ownChildren.forEach((child) => expect(['row', 'rowgroup', 'caption']).to.include(child.role));
          }
        });
      });

      it('should expose list items with their text', () => {
        const index = tree!.findIndex((node) => node.role === 'list');
        const items = tree!.filter((node, i) => i > index && node.role === 'listitem');
        expect(items).to.have.lengthOf(2);
        items.forEach((item) => {
          const start = tree!.indexOf(item);
          const end = tree!.findIndex((node, i) => i > start && node.depth <= item.depth);
          const text = tree!
            .slice(start + 1, end === -1 ? undefined : end)
            .filter((node) => node.role === 'StaticText')
            .map((node) => node.name)
            .join('');
          expect(text.trim()).to.not.be.empty;
        });
      });
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

  describe('marked content', () => {
    const text = 'BT /F1 24 Tf 72 700 Td (Marked text) Tj ET';
    let urls: string[] = [];

    afterEach(async () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls = [];
      await resetMouse();
    });

    async function getTextPosition(content: string, rotate: number) {
      const url = createPdf([{ content, rotate }]);
      urls.push(url);
      const idle = nextRenderIdle(viewer);
      viewer.src = url;
      await idle;
      const page = viewer.shadowRoot!.querySelector('[part="page"]')!.getBoundingClientRect();
      const span = [...viewer.shadowRoot!.querySelectorAll('.text-layer span:not(.markedContent)')].find(
        (element) => element.textContent === 'Marked text',
      )!;
      const rect = span.getBoundingClientRect();
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
      await getTextPosition(`/P << /MCID 0 >> BDC ${text} EMC`, 0);
      const span = [...viewer.shadowRoot!.querySelectorAll('.text-layer span:not(.markedContent)')].find(
        (element) => element.textContent === 'Marked text',
      )!;
      const rect = span.getBoundingClientRect();
      const y = Math.round(rect.top + rect.height / 2);
      await sendMouse({ type: 'move', position: [Math.round(rect.left) + 1, y] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [Math.round(rect.right) - 1, y] });
      await sendMouse({ type: 'up' });
      expect(window.getSelection()!.toString()).to.include('Marked tex');
    });
  });
});
