import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFPageProxy } from 'pdfjs-dist';
import { type PdfViewerStructTreeNode, PdfViewerStructureLayer } from '../src/pdf-viewer-structure-layer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, failTextOnce, fixtureUrl, getPdfPagePrototype, loadAndRender, nextRenderIdle } from './helpers.js';

describe('structure', () => {
  let viewer: PdfViewer;

  let url: string | undefined;

  function getTree() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('.struct-tree');
  }

  function getLink() {
    return viewer.shadowRoot!.querySelector<HTMLAnchorElement>('a.link')!;
  }

  function getPage(pageNumber: number) {
    return viewer.shadowRoot!.querySelectorAll('[part~="page"]')[pageNumber - 1];
  }

  async function stubStructTrees(
    getTree: (pageNumber: number) => PdfViewerStructTreeNode | Promise<PdfViewerStructTreeNode>,
  ) {
    const prototype = await getPdfPagePrototype();
    function fakeGetStructTree(this: PDFPageProxy) {
      return Promise.resolve(getTree(this.pageNumber));
    }
    return sinon
      .stub(prototype, 'getStructTree')
      .callsFake(fakeGetStructTree as unknown as PDFPageProxy['getStructTree']);
  }

  function getOwnedText(element: Element): string {
    return [element, ...element.querySelectorAll('[aria-owns]')]
      .flatMap((owner) => (owner.getAttribute('aria-owns') ?? '').split(' ').filter(Boolean))
      .map((id) => viewer.shadowRoot!.getElementById(id)!)
      .map((owned) => (owned.closest('.text-layer') ? owned.textContent : getOwnedText(owned)))
      .join('')
      .trim();
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 800px"></vaadin-pdf-viewer>');
    await nextRender();
  });

  afterEach(() => {
    sinon.restore();
    if (url) {
      URL.revokeObjectURL(url);
      url = undefined;
    }
  });

  it('should not add a structure for an untagged PDF', async () => {
    await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    expect(getTree()).to.be.null;
  });

  it('should show a page with a broken structure as untagged', async () => {
    await stubStructTrees(() => Promise.reject(new Error('Broken structure')));
    const warn = sinon.stub(console, 'warn');
    await loadAndRender(viewer, fixtureUrl('tagged.pdf'));
    expect(getTree()).to.be.null;
    expect(viewer.shadowRoot!.querySelector('.text-layer')).to.be.ok;
    // The link is read in the flow of the text, as on an untagged page.
    expect(viewer.shadowRoot!.querySelector(`.text-layer [aria-owns~="${getLink().id}"]`)).to.be.ok;
    expect(warn).to.be.not.called;
  });

  it('should keep the links of a page whose structure fails to render', async () => {
    await stubStructTrees(() => Promise.resolve({ role: 'Root', children: [null] } as never));
    await loadAndRender(viewer, fixtureUrl('tagged.pdf'));
    expect(getTree()).to.be.null;
    expect(getLink().getAttribute('aria-label')).to.equal('Vaadin website (opens in a new tab)');
    // The link is read in the flow of the text instead.
    expect(viewer.shadowRoot!.querySelector(`.text-layer [aria-owns~="${getLink().id}"]`)).to.be.ok;
  });

  it('should show the structure elements that are blocks in HTML as blocks, so screen readers start lines at them', async () => {
    await stubStructTrees(() => ({
      role: 'Root',
      children: [
        { role: 'H1', children: [] },
        {
          role: 'P',
          children: [
            { role: 'Strong', children: [] },
            { role: 'NonStruct', children: [] },
          ],
        },
      ],
    }));
    await loadAndRender(viewer, fixtureUrl('tagged.pdf'));
    const tree = getTree()!;
    expect(getComputedStyle(tree.querySelector('[role="heading"]')!).display).to.equal('block');
    expect(getComputedStyle(tree.querySelector('[role="paragraph"]')!).display).to.equal('block');
    expect(getComputedStyle(tree.querySelector('[role="strong"]')!).display).to.equal('inline');
    expect(getComputedStyle(tree.querySelector('[role="none"]')!).display).to.equal('inline');
  });

  describe('tagged', () => {
    beforeEach(async () => {
      await loadAndRender(viewer, fixtureUrl('tagged.pdf'));
    });

    it('should own elements that exist, without marked content, as Chrome ignores aria-owns of display: contents', () => {
      const ids = [...getTree()!.querySelectorAll('[aria-owns]')].flatMap((element) =>
        element.getAttribute('aria-owns')!.split(' '),
      );
      expect(ids.length).to.be.greaterThan(0);
      ids.forEach((id) => {
        const element = viewer.shadowRoot!.getElementById(id)!;
        expect(element, id).to.be.ok;
        expect(getComputedStyle(element).display, id).to.not.equal('contents');
      });
    });

    it('should keep the structure in the canvas, also when the page renders again', async () => {
      const tree = getTree()!;
      const canvas = getPage(1).querySelector('canvas');
      expect(tree.parentElement).to.equal(canvas);
      const idle = nextRenderIdle(viewer);
      viewer.zoom = 2;
      await idle;
      expect(getPage(1).querySelector('canvas')).to.not.equal(canvas);
      expect(getTree()).to.equal(tree);
      expect(tree.parentElement).to.equal(getPage(1).querySelector('canvas'));
      // Before the text layer, in reading order.
      expect(getPage(1).firstElementChild).to.equal(tree.parentElement);
    });

    it('should give a link the text of its structure element, which is no second link', () => {
      expect(getOwnedText(getLink())).to.equal('Vaadin website');
      // Chrome ignores aria-owns of an element that a link owns, so the link owns the text itself.
      getLink()
        .getAttribute('aria-owns')!
        .split(' ')
        .forEach((id) => {
          expect(viewer.shadowRoot!.getElementById(id)!.closest('.text-layer')).to.be.ok;
          expect(getTree()!.querySelector(`[aria-owns~="${id}"]`)).to.be.null;
        });
      expect(getLink().getAttribute('aria-label')).to.equal('Vaadin website (opens in a new tab)');
      expect(getTree()!.querySelector('[role="link"]')).to.be.null;
    });

    it('should own a link in the structure instead of adding it to the text before it', () => {
      expect(getTree()!.querySelector(`[aria-owns="${getLink().id}"]`)).to.be.ok;
      expect(viewer.shadowRoot!.querySelector('.text-layer [aria-owns]')).to.be.null;
    });
  });

  describe('released pages', () => {
    let url: string;

    // The page objects of the created PDF are 5, 7, 9 and so on.
    function getPageTree(pageNumber: number): PdfViewerStructTreeNode {
      const pageObject = 5 + 2 * (pageNumber - 1);
      return { role: 'Root', children: [{ role: 'P', children: [{ type: 'content', id: `p${pageObject}R_mc0` }] }] };
    }

    function scrollTo(scrollTop: number) {
      const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
      content.scrollTop = scrollTop === Infinity ? content.scrollHeight : scrollTop;
    }

    beforeEach(() => {
      viewer.style.height = '300px';
      url = createPdf(
        Array.from({ length: 6 }, (_, index) => ({
          content: `/P << /MCID 0 >> BDC BT /F1 24 Tf 72 700 Td (Page ${index + 1}) Tj ET EMC`,
        })),
      );
    });

    afterEach(() => {
      URL.revokeObjectURL(url);
    });

    it('should remove the structure when a page is released', async () => {
      await stubStructTrees(getPageTree);
      await loadAndRender(viewer, url);
      expect(getPage(1).querySelector('.struct-tree')).to.be.ok;
      const idle = nextRenderIdle(viewer);
      scrollTo(Infinity);
      await idle;
      expect(getPage(1).querySelector('.struct-tree')).to.be.null;
    });

    it('should render the structure again when a released page renders again, without loading it again', async () => {
      const structTreeStub = await stubStructTrees(getPageTree);
      await loadAndRender(viewer, url);
      let idle = nextRenderIdle(viewer);
      scrollTo(Infinity);
      await idle;
      idle = nextRenderIdle(viewer);
      scrollTo(0);
      await idle;
      expect(getPage(1).querySelectorAll('.struct-tree')).to.have.lengthOf(1);
      const pageNumbers = structTreeStub.thisValues.map((pdfPage: PDFPageProxy) => pdfPage.pageNumber);
      expect(pageNumbers.filter((pageNumber) => pageNumber === 1)).to.have.lengthOf(1);
    });

    it('should render the structure of a page that is released while its structure loads', async () => {
      let resolveTree!: () => void;
      const treeLoaded = new Promise<void>((resolve) => {
        resolveTree = resolve;
      });
      await stubStructTrees(async (pageNumber) => {
        if (pageNumber === 1) {
          await treeLoaded;
        }
        return getPageTree(pageNumber);
      });
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = url;
      await loaded;
      for (let i = 0; i < 50 && !getPage(1).querySelector('.text-layer'); i++) {
        await nextFrame();
      }
      expect(getPage(1).querySelector('.text-layer')).to.be.ok;
      // Released while its structure loads.
      scrollTo(Infinity);
      for (let i = 0; i < 50 && getPage(1).querySelector('.text-layer'); i++) {
        await nextFrame();
      }
      expect(getPage(1).querySelector('.text-layer')).to.be.null;
      resolveTree();
      await nextRenderIdle(viewer);
      const idle = nextRenderIdle(viewer);
      scrollTo(0);
      await idle;
      expect(getPage(1).querySelectorAll('.struct-tree')).to.have.lengthOf(1);
    });
  });

  it('should give each link the text of its own page', async () => {
    // The pages are objects 5 and 8, their links objects 7 and 10.
    await stubStructTrees((pageNumber) => {
      const [pageObject, linkObject] = pageNumber === 1 ? [5, 7] : [8, 10];
      return {
        role: 'Root',
        children: [
          {
            role: 'Link',
            children: [
              { type: 'content', id: `p${pageObject}R_mc0` },
              { type: 'annotation', id: `pdfjs_internal_id_${linkObject}R` },
            ],
          },
        ],
      };
    });
    url = createPdf(
      ['First', 'Second'].map((text) => ({
        content: `/Link << /MCID 0 >> BDC BT /F1 24 Tf 72 700 Td (${text}) Tj ET EMC`,
        annotations: [
          '<< /Type /Annot /Subtype /Link /Rect [72 690 160 720] /Border [0 0 0] /A << /S /URI /URI (https://vaadin.com/) >> >>',
        ],
      })),
    );
    viewer.style.height = '2000px';
    await loadAndRender(viewer, url);
    const [first, second] = viewer.shadowRoot!.querySelectorAll('a.link');
    expect(getOwnedText(first)).to.equal('First');
    expect(getOwnedText(second)).to.equal('Second');
  });

  describe('links that the viewer leaves out', () => {
    [
      // The layer is object 5, so the page is object 6 and its link object 8.
      {
        name: 'whose link is on a hidden layer',
        page: 6,
        link: 8,
        entries: '/OC 5 0 R',
        uri: 'https://vaadin.com/docs',
      },
      {
        name: 'whose link has a URL that the viewer does not open',
        page: 5,
        link: 7,
        entries: '',
        // eslint-disable-next-line no-script-url -- the viewer must not create this link
        uri: 'javascript:void(0)',
      },
    ].forEach(({ name, page, link, entries, uri }) => {
      it(`should read the text of a link structure element ${name} as text`, async () => {
        const tree: PdfViewerStructTreeNode = {
          role: 'Root',
          children: [
            {
              role: 'Link',
              children: [
                { type: 'content', id: `p${page}R_mc0` },
                { type: 'annotation', id: `pdfjs_internal_id_${link}R` },
              ],
            },
          ],
        };
        await stubStructTrees(() => tree);
        url = createPdf(
          [
            {
              content: '/Link << /MCID 0 >> BDC BT /F1 24 Tf 72 700 Td (Docs) Tj ET EMC',
              annotations: [
                `<< /Type /Annot /Subtype /Link /Rect [72 690 130 720] /Border [0 0 0] ${entries} /A << /S /URI /URI (${uri}) >> >>`,
              ],
            },
          ],
          { layers: entries ? [{ name: 'Hidden', visible: false }] : [] },
        );
        await loadAndRender(viewer, url);
        expect(viewer.shadowRoot!.querySelector('a.link')).to.be.null;
        expect(getTree()!.querySelector('[role="link"]')).to.be.null;
        expect(getOwnedText(getTree()!)).to.equal('Docs');
      });
    });
  });

  it('should add a link that the structure does not own to the text before it', async () => {
    // Object 5 is the page of the created PDF, and object 7 its link, which no structure element has.
    await stubStructTrees(() => ({
      role: 'Root',
      children: [{ role: 'P', children: [{ type: 'content', id: 'p5R_mc0' }] }],
    }));
    url = createPdf([
      {
        content: '/P << /MCID 0 >> BDC BT /F1 24 Tf 72 700 Td (Docs) Tj ET EMC',
        annotations: [
          '<< /Type /Annot /Subtype /Link /Rect [72 690 130 720] /Border [0 0 0] /A << /S /URI /URI (https://vaadin.com/docs) >> >>',
        ],
      },
    ]);
    await loadAndRender(viewer, url);
    expect(getTree()).to.be.ok;
    expect(getTree()!.querySelector(`[aria-owns~="${getLink().id}"]`)).to.be.null;
    expect(viewer.shadowRoot!.querySelector(`.text-layer [aria-owns~="${getLink().id}"]`)).to.be.ok;
  });

  it('should name a link that covers no text by the text that it owns in the structure, with its lines apart', async () => {
    // Object 5 is the page of the created PDF, and object 7 its link, which is below the text.
    await stubStructTrees(() => ({
      role: 'Root',
      children: [
        {
          role: 'Link',
          children: [
            { type: 'content', id: 'p5R_mc0' },
            { type: 'annotation', id: 'pdfjs_internal_id_7R' },
          ],
        },
      ],
    }));
    url = createPdf([
      {
        content: '/Link << /MCID 0 >> BDC BT /F1 24 Tf 72 700 Td (Vaadin) Tj 0 -30 Td (docs) Tj ET EMC',
        annotations: [
          '<< /Type /Annot /Subtype /Link /Rect [72 600 130 608] /Border [0 0 0] /A << /S /URI /URI (https://vaadin.com/docs) >> >>',
        ],
      },
    ]);
    await loadAndRender(viewer, url);
    expect(getLink().getAttribute('aria-label')).to.equal('Vaadin docs (opens in a new tab)');
  });

  it('should name a link by the text that it covers rather than by the text that it owns in the structure', async () => {
    // Object 5 is the page of the created PDF, and object 7 its link, which covers the text without structure.
    await stubStructTrees(() => ({
      role: 'Root',
      children: [
        {
          role: 'Link',
          children: [
            { type: 'content', id: 'p5R_mc0' },
            { type: 'annotation', id: 'pdfjs_internal_id_7R' },
          ],
        },
      ],
    }));
    url = createPdf([
      {
        content: '/Link << /MCID 0 >> BDC BT /F1 24 Tf 72 700 Td (Docs) Tj ET EMC BT /F1 24 Tf 72 600 Td (Guide) Tj ET',
        annotations: [
          '<< /Type /Annot /Subtype /Link /Rect [72 590 160 620] /Border [0 0 0] /A << /S /URI /URI (https://vaadin.com/docs) >> >>',
        ],
      },
    ]);
    await loadAndRender(viewer, url);
    expect(getLink().getAttribute('aria-label')).to.equal('Guide (opens in a new tab)');
  });

  describe('alternative text of links', () => {
    let url: string;

    beforeEach(async () => {
      // Object 5 is the page of the created PDF, and object 7 its link.
      const tree: PdfViewerStructTreeNode = {
        role: 'Root',
        children: [
          {
            role: 'Link',
            alt: 'Vaadin documentation',
            children: [
              { type: 'content', id: 'p5R_mc0' },
              { type: 'annotation', id: 'pdfjs_internal_id_7R' },
            ],
          },
        ],
      };
      await stubStructTrees(() => tree);
      url = createPdf([
        {
          content: '/Link << /MCID 0 >> BDC BT /F1 24 Tf 72 700 Td (Docs) Tj ET EMC',
          annotations: [
            '<< /Type /Annot /Subtype /Link /Rect [72 690 130 720] /Border [0 0 0] /A << /S /URI /URI (https://vaadin.com/docs) >> >>',
          ],
        },
      ]);
    });

    afterEach(() => {
      URL.revokeObjectURL(url);
    });

    it('should name a link by the alternative text of its structure element', async () => {
      await loadAndRender(viewer, url);
      expect(getLink().getAttribute('aria-label')).to.equal('Vaadin documentation (opens in a new tab)');
      expect(getOwnedText(getLink())).to.equal('Docs');
      // The alternative text names the link, not its structure element.
      expect(getTree()!.querySelector('[aria-label]')).to.be.null;
    });

    it('should own and name a link by its structure element when the structure renders after the link', async () => {
      await failTextOnce(1);
      sinon.stub(console, 'warn');
      await loadAndRender(viewer, url);
      expect(getTree()).to.be.null;
      expect(getLink().hasAttribute('aria-owns')).to.be.false;
      expect(getLink().getAttribute('aria-label')).to.equal('Docs (opens in a new tab)');
      const idle = nextRenderIdle(viewer);
      viewer.style.width = '900px';
      await idle;
      expect(getOwnedText(getLink())).to.equal('Docs');
      expect(viewer.shadowRoot!.querySelector('.text-layer [aria-owns]')).to.be.null;
      expect(getLink().getAttribute('aria-label')).to.equal('Vaadin documentation (opens in a new tab)');
      viewer.i18n = { externalLink: '{text} (åpnes i en ny fane)' };
      await nextUpdate(viewer);
      expect(getLink().getAttribute('aria-label')).to.equal('Vaadin documentation (åpnes i en ny fane)');
    });
  });

  describe('roles', () => {
    function create(children: PdfViewerStructTreeNode[]) {
      return new PdfViewerStructureLayer({ role: 'Root', children });
    }

    it('should not take a role from the inherited properties of objects', () => {
      const { element } = create(
        ['constructor', 'toString', '__proto__'].map((role) => ({
          role,
          children: [{ type: 'content', id: 'p3R_mc0' }],
        })),
      );
      expect(element.querySelector('[role]:not([role="none"])')).to.be.null;
    });

    it('should expose a table of contents as a list', () => {
      const { element } = create([
        {
          role: 'TOC',
          children: [
            { role: 'TOCI', children: [{ type: 'content', id: 'p3R_mc0' }] },
            { role: 'TOCI', children: [{ type: 'content', id: 'p3R_mc1' }] },
          ],
        },
      ]);
      const list = element.querySelector('[role="list"]')!;
      expect(list.querySelectorAll('[role="listitem"]')).to.have.lengthOf(2);
    });

    it('should expose the cells that span rows and columns', () => {
      const { element } = create([
        {
          role: 'Table',
          children: [
            {
              role: 'TR',
              children: [{ role: 'TD', rowSpan: 2, colSpan: 3, children: [{ type: 'content', id: 'p3R_mc0' }] }],
            },
          ],
        },
      ]);
      const cell = element.querySelector('[role="cell"]')!;
      expect(cell.getAttribute('aria-rowspan')).to.equal('2');
      expect(cell.getAttribute('aria-colspan')).to.equal('3');
    });

    it('should expose the headers of the rows of a table body as row headers', () => {
      const { element } = create([
        {
          role: 'Table',
          children: [
            {
              role: 'TBody',
              children: [{ role: 'TR', children: [{ role: 'TH', children: [{ type: 'content', id: 'p3R_mc0' }] }] }],
            },
          ],
        },
      ]);
      expect(element.querySelector('[role="rowheader"]')).to.be.ok;
    });

    it('should expose headers by their scope', () => {
      const header = (scope: 'Column' | 'Row') => ({
        role: 'TH',
        scope,
        children: [{ type: 'content', id: 'p3R_mc0' }],
      });
      const { element } = create([
        {
          role: 'Table',
          children: [
            { role: 'TR', children: [header('Row')] },
            { role: 'TBody', children: [{ role: 'TR', children: [header('Column')] }] },
          ],
        },
      ]);
      const roles = [...element.querySelectorAll('[role="row"] > *')].map((cell) => cell.getAttribute('role'));
      expect(roles).to.deep.equal(['rowheader', 'columnheader']);
    });

    it('should expose a caption only as the caption of a table or a figure', () => {
      const caption = { role: 'Caption', children: [{ type: 'content', id: 'p3R_mc0' }] };
      const { element } = create([
        { role: 'Table', children: [caption] },
        { role: 'Figure', children: [caption] },
        { role: 'P', children: [caption] },
      ]);
      const roles = [...element.querySelectorAll('[aria-owns="p3R_mc0"]')].map((owner) => owner.getAttribute('role'));
      expect(roles).to.deep.equal(['caption', 'caption', null]);
    });

    it('should not own content directly in a list or a row, which have only items or cells', () => {
      const { element } = create([
        {
          role: 'L',
          children: [
            { type: 'content', id: 'p3R_mc0' },
            { role: 'LI', children: [] },
          ],
        },
        {
          role: 'Table',
          children: [
            {
              role: 'TR',
              children: [
                { type: 'content', id: 'p3R_mc1' },
                { role: 'TD', children: [] },
              ],
            },
          ],
        },
      ]);
      expect(element.querySelector('[aria-owns]')).to.be.null;
    });

    it('should not name a paragraph with its alternative text', () => {
      const { element } = create([{ role: 'P', alt: 'Note', children: [{ type: 'content', id: 'p3R_mc0' }] }]);
      const paragraph = element.querySelector('[role="paragraph"]')!;
      expect(paragraph.hasAttribute('aria-label')).to.be.false;
      expect(paragraph.getAttribute('aria-description')).to.equal('Note');
    });

    it('should describe an element without a role by its alternative text, but not an element without semantics', () => {
      const { element } = create([
        { role: 'Span', alt: 'Note', children: [{ type: 'content', id: 'p3R_mc0' }] },
        { role: 'NonStruct', alt: 'Hidden', children: [{ type: 'content', id: 'p3R_mc1' }] },
      ]);
      const [span, nonStruct] = element.children;
      expect(span.getAttribute('aria-description')).to.equal('Note');
      expect(nonStruct.getAttribute('role')).to.equal('none');
      expect(nonStruct.hasAttribute('aria-description')).to.be.false;
      expect(nonStruct.hasAttribute('aria-label')).to.be.false;
    });

    it('should own the text in marked content, and in nested marked content once, without artifacts', () => {
      const textLayer = document.createElement('div');
      textLayer.innerHTML = `
        <span class="markedContent" id="p3R_mc0">
          <span>A</span>
          <br>
          <span class="markedContent" id="p3R_mc1"><span>B</span></span>
          <span class="markedContent"><span>C</span></span>
          <span class="markedContent" aria-hidden="true"><span>Artifact</span></span>
        </span>
      `;
      const structure = create([
        { role: 'P', children: [{ type: 'content', id: 'p3R_mc0' }] },
        { role: 'Span', children: [{ type: 'content', id: 'p3R_mc1' }] },
      ]);
      structure.updateTextLayer(textLayer);
      const owned = [...structure.element.querySelectorAll('[aria-owns]')].map((owner) =>
        owner
          .getAttribute('aria-owns')!
          .split(' ')
          .map((id) => textLayer.querySelector(`#${id}`)!.textContent),
      );
      expect(owned).to.deep.equal([['A', 'C'], ['B']]);
    });

    it('should only own the elements of content and annotations', () => {
      const { element } = create([
        {
          role: 'P',
          children: [
            { type: 'content', id: 'p3R_mc0' },
            { type: 'content', id: 'p12R1_mc7' },
            { type: 'content', id: 'p3R_mcx content pages thumbnails' },
            { type: 'annotation', id: 'pdfjs_internal_id_5R' },
            { type: 'annotation', id: 'content' },
            { type: 'object', id: '15R' },
          ],
        },
      ]);
      const owned = [...element.querySelectorAll('[aria-owns]')].map((owner) => owner.getAttribute('aria-owns'));
      expect(owned).to.deep.equal(['p3R_mc0', 'p12R1_mc7', 'pdfjs_internal_id_5R']);
    });

    function createLink(id: string) {
      const link = document.createElement('a');
      link.id = id;
      return link;
    }

    it('should not own an annotation directly in a table, which owns no content', () => {
      const structure = create([{ role: 'Table', children: [{ type: 'annotation', id: 'pdfjs_internal_id_5R' }] }]);
      expect(structure.element.querySelector('[aria-owns]')).to.be.null;
      expect(structure.addLinks([createLink('pdfjs_internal_id_5R')])).to.be.empty;
    });

    it('should name an element by its alternative text when its annotation gets no link, e.g. a form field', () => {
      const structure = create([
        { role: 'Form', alt: 'Name', children: [{ type: 'annotation', id: 'pdfjs_internal_id_5R' }] },
      ]);
      const form = structure.element.querySelector('[role="form"]')!;
      expect(form.hasAttribute('aria-label')).to.be.false;
      structure.addLinks([]);
      expect(form.getAttribute('aria-label')).to.equal('Name');
    });

    it('should describe a link structure element by its alternative text when it gets no link', () => {
      const structure = create([
        {
          role: 'Link',
          alt: 'Docs',
          children: [
            { type: 'content', id: 'p3R_mc0' },
            { type: 'annotation', id: 'pdfjs_internal_id_5R' },
          ],
        },
      ]);
      const element = structure.element.querySelector('[role="link"]')!;
      structure.addLinks([]);
      expect(element.hasAttribute('role')).to.be.false;
      expect(element.getAttribute('aria-description')).to.equal('Docs');
    });

    it('should not add an image for a figure with a link, which its alternative text names', () => {
      const structure = create([
        {
          role: 'Figure',
          alt: 'Chart',
          children: [
            { type: 'content', id: 'p3R_mc0' },
            { type: 'annotation', id: 'pdfjs_internal_id_5R' },
          ],
        },
      ]);
      expect(structure.element.querySelector('[role="img"]')).to.be.null;
      expect(structure.getLinkAlt('pdfjs_internal_id_5R')).to.equal('Chart');
    });

    it('should keep the role of a link structure element until a link takes its place', () => {
      const structure = create([
        {
          role: 'Link',
          alt: 'Docs',
          children: [
            { type: 'content', id: 'p3R_mc0' },
            { type: 'annotation', id: 'pdfjs_internal_id_5R' },
          ],
        },
      ]);
      const element = structure.element.querySelector('[role="link"]')!;
      expect(structure.getLinkAlt('pdfjs_internal_id_5R')).to.equal('Docs');
      const link = createLink('pdfjs_internal_id_5R');
      expect(structure.addLinks([link])).to.have.all.keys('pdfjs_internal_id_5R');
      expect(element.hasAttribute('role')).to.be.false;
      expect(element.hasAttribute('aria-description')).to.be.false;
      expect(link.getAttribute('aria-owns')).to.equal('p3R_mc0');
      expect(structure.element.querySelector('[aria-owns="p3R_mc0"]')).to.be.null;
    });
  });
});
