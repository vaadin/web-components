import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFPageProxy } from 'pdfjs-dist';
import type { PdfViewerStructTreeNode } from '../src/pdf-viewer-structure-layer.js';
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
          children: [{ role: 'Strong', children: [] }],
        },
      ],
    }));
    await loadAndRender(viewer, fixtureUrl('tagged.pdf'));
    const tree = getTree()!;
    expect(getComputedStyle(tree.querySelector('[role="heading"]')!).display).to.equal('block');
    expect(getComputedStyle(tree.querySelector('[role="paragraph"]')!).display).to.equal('block');
    expect(getComputedStyle(tree.querySelector('[role="strong"]')!).display).to.equal('inline');
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
});
