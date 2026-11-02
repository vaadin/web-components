import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { getSelectionRanges } from '../src/pdf-viewer-text-selection-controller.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdf,
  failTextOnce,
  type Fixture,
  fixtureUrl,
  getPdfDocumentPrototype,
  loadAndRender,
  nextRenderIdle,
  type PdfPage,
  scrollSettled,
} from './helpers.js';

describe('links', () => {
  let viewer: PdfViewer;
  let content: HTMLElement;
  // A live collection, which follows the pages of the loaded document
  let pages: HTMLCollectionOf<HTMLElement>;
  let url: string | undefined;

  // Courier at 20pt has 12pt wide characters, so character `i` starts at x = 50 + 12 * i:
  // "Vaadin" is at x=110-182 and "documentation" at 242-398.
  const sentence = 'BT /F2 20 Tf 50 700 Td (Read Vaadin for documentation today) Tj ET';
  const vaadinRect = [110, 695, 182, 725];
  const documentationRect = [242, 695, 398, 725];

  function getTextLayer(pageNumber: number) {
    return pages[pageNumber - 1].querySelector<HTMLElement>('.text-layer');
  }

  function getLinks(pageNumber: number) {
    return [...pages[pageNumber - 1].querySelectorAll<HTMLAnchorElement>('a.link')];
  }

  function getLinkNames() {
    return getLinks(1).map((link) => link.getAttribute('aria-label'));
  }

  /** Returns the link of `links.pdf` that goes to page 2. */
  function getInternalLink() {
    return getLinks(1).find((element) => element.getAttribute('href') === '#')!;
  }

  /** Returns the link of `links.pdf` that goes to vaadin.com. */
  function getExternalLink() {
    return getLinks(1).find((element) => element.href === 'https://vaadin.com/')!;
  }

  async function load(name: Fixture) {
    await loadAndRender(viewer, fixtureUrl(name));
  }

  async function loadPdf(pdfPages: PdfPage[], options?: Parameters<typeof createPdf>[1]) {
    url = createPdf(pdfPages, options);
    await loadAndRender(viewer, url);
  }

  function uriLink(rect: number[], uri = 'https://vaadin.com/') {
    return `<< /Type /Annot /Subtype /Link /Rect [${rect.join(' ')}] /Border [0 0 0] /A << /S /URI /URI (${uri}) >> >>`;
  }

  function destLink(dest: string, index = 0) {
    return `<< /Type /Annot /Subtype /Link /Rect [50 ${700 - index * 40} 300 ${720 - index * 40}] /Border [0 0 0] /Dest ${dest} >>`;
  }

  /**
   * Loads a document with a link on "Vaadin" at the end of the first line (x=336-408) and on
   * "docs" at the start of the second (x=72-120). The rectangle of the link covers both lines.
   */
  async function loadWrappingLink() {
    await loadPdf([
      {
        content: `BT /F2 20 Tf 72 460 Td (For details, read the Vaadin) Tj ET BT /F2 20 Tf 72 436 Td (docs before you start.) Tj ET`,
        annotations: [
          '<< /Type /Annot /Subtype /Link /Rect [72 431 408 479] /Border [0 0 0] /QuadPoints [336 479 408 479 336 455 408 455 72 455 120 455 72 431 120 431] /A << /S /URI /URI (https://vaadin.com/docs) >> >>',
        ],
      },
    ]);
  }

  /** Loads a document whose first page links to the given position on page 2. */
  async function loadLinkToPosition(dest: string, { rotate = 0 } = {}) {
    await loadPdf([{ content: '', annotations: [destLink(dest)] }, { content: '', rotate }, { content: '' }]);
  }

  beforeEach(async () => {
    url = undefined;
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 500px"></vaadin-pdf-viewer>');
    await nextRender();
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
    pages = viewer.shadowRoot!.querySelector('#pages')!.children as HTMLCollectionOf<HTMLElement>;
  });

  afterEach(() => {
    sinon.restore();
    if (url) {
      URL.revokeObjectURL(url);
    }
  });

  describe('rendering', () => {
    it('should not add a link layer to a page without links', async () => {
      await load('multi-page.pdf');
      expect(pages[0].querySelector('.link-layer')).to.be.null;
    });

    it('should only make the quadrilaterals of a link that wraps clickable', async () => {
      await loadWrappingLink();
      const linkAt = (x: number, y: number) => {
        const rect = pages[0].getBoundingClientRect();
        const left = rect.left + (x / 595) * rect.width;
        const top = rect.top + ((842 - y) / 842) * rect.height;
        return viewer.shadowRoot!.elementFromPoint(left, top)?.closest('a') ?? null;
      };
      const [link] = getLinks(1);
      expect(linkAt(370, 465)).to.equal(link);
      expect(linkAt(95, 440)).to.equal(link);
      expect(linkAt(150, 465)).to.be.null;
      expect(linkAt(250, 440)).to.be.null;
    });

    it('should leave out the links on a hidden layer', async () => {
      const layerLink = (layer: number, rect: number[], uri: string) =>
        `<< /Type /Annot /Subtype /Link /Rect [${rect.join(' ')}] /Border [0 0 0] /OC ${layer} 0 R /A << /S /URI /URI (${uri}) >> >>`;
      await loadPdf(
        [
          {
            content: '',
            annotations: [
              layerLink(5, [50, 700, 300, 720], 'https://vaadin.com/hidden'),
              layerLink(6, [50, 600, 300, 620], 'https://vaadin.com/visible'),
            ],
          },
        ],
        {
          layers: [
            { name: 'Hidden', visible: false },
            { name: 'Visible', visible: true },
          ],
        },
      );
      expect(getLinks(1).map((link) => link.href)).to.deep.equal(['https://vaadin.com/visible']);
    });

    it('should render and name the links of a page whose text fails to load', async () => {
      await failTextOnce(1);
      const warn = sinon.stub(console, 'warn');
      await load('links.pdf');
      expect(getTextLayer(1)).to.be.null;
      expect(getLinks(1)).to.have.lengthOf(2);
      // The worker finds the text of a link, also when the text layer fails.
      expect(getExternalLink().getAttribute('aria-label')).to.equal('External link to vaadin.com (opens in a new tab)');
      const warnings = warn.args.map(([message]) => message);
      expect(warnings).to.include('Failed to render the text of page 1 of the PDF document: Broken text');
      expect(warnings.some((message) => message.startsWith('Failed to render page'))).to.be.false;
    });

    [
      { rotate: 90, corner: 'top right' },
      { rotate: 180, corner: 'bottom right' },
      { rotate: 270, corner: 'bottom left' },
    ].forEach(({ rotate, corner }) => {
      it(`should place the link of a page rotated by ${rotate} degrees in the ${corner} corner`, async () => {
        // The link is at the top left of the unrotated page.
        await loadPdf([{ content: '', rotate, annotations: [uriLink([70, 715, 140, 740])] }]);
        const page = pages[0].getBoundingClientRect();
        const rect = getLinks(1)[0].getBoundingClientRect();
        const [vertical, horizontal] = corner.split(' ');
        expect(rect.top + rect.height / 2 < page.top + page.height / 2).to.equal(vertical === 'top');
        expect(rect.left + rect.width / 2 < page.left + page.width / 2).to.equal(horizontal === 'left');
      });
    });

    it('should place the link of a rotated page over its text', async () => {
      await loadPdf([{ content: sentence, rotate: 90, annotations: [uriLink(vaadinRect)] }]);
      const link = getLinks(1)[0];
      const text = [...getTextLayer(1)!.querySelectorAll('span')].find((span) => span.textContent!.includes('Vaadin'))!;
      const range = document.createRange();
      const start = text.textContent!.indexOf('Vaadin');
      range.setStart(text.firstChild!, start);
      range.setEnd(text.firstChild!, start + 'Vaadin'.length);
      const word = range.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      // The page is turned clockwise, so the word runs from the top to the bottom.
      expect(rect.top).to.be.closeTo(word.top, 2);
      expect(rect.bottom).to.be.closeTo(word.bottom, 2);
      expect(word.left + word.width / 2).to.be.within(rect.left, rect.right);
    });

    it('should remove the link layer when a page is released', async () => {
      viewer.style.height = '300px';
      await load('links.pdf');
      expect(pages[0].querySelector('.link-layer')).to.be.ok;
      const idle = nextRenderIdle(viewer);
      content.scrollTop = content.scrollHeight;
      await idle;
      expect(pages[0].querySelector('.link-layer')).to.be.null;
    });
  });

  describe('reading order', () => {
    // "Vaadin" ends the first line at x=110-182, "docs" ends the second line at x=98-146.
    const twoLines = 'BT /F2 20 Tf 50 700 Td (Read Vaadin) Tj ET BT /F2 20 Tf 50 600 Td (See docs) Tj ET';
    const docsRect = [98, 595, 146, 625];

    function getTextDivs() {
      return [...getTextLayer(1)!.querySelectorAll<HTMLElement>(':scope > span')];
    }

    async function loadTwoLines() {
      await loadPdf([
        { content: twoLines, annotations: [uriLink(docsRect, 'https://vaadin.com/docs'), uriLink(vaadinRect)] },
      ]);
    }

    it('should put the links of a page in reading order', async () => {
      await loadTwoLines();
      expect(getLinks(1).map((link) => link.href)).to.deep.equal(['https://vaadin.com/', 'https://vaadin.com/docs']);
    });

    it('should add each link to the text before it for assistive technology', async () => {
      await loadTwoLines();
      const [vaadin, docs] = getLinks(1);
      expect(vaadin.id).to.be.ok.and.not.equal(docs.id);
      expect(getTextDivs().map((div) => div.getAttribute('aria-owns'))).to.deep.equal([vaadin.id, docs.id]);
    });

    it('should add several links to the same text before them', async () => {
      await loadPdf([
        {
          content: sentence,
          annotations: [uriLink(documentationRect, 'https://vaadin.com/docs'), uriLink(vaadinRect)],
        },
      ]);
      const [vaadin, documentation] = getLinks(1);
      expect(getTextDivs()[0].getAttribute('aria-owns')).to.equal(`${vaadin.id} ${documentation.id}`);
    });

    it('should add the links to the text when the text renders after them', async () => {
      await failTextOnce(1);
      sinon.stub(console, 'warn');
      await loadTwoLines();
      expect(getTextLayer(1)).to.be.null;
      const idle = nextRenderIdle(viewer);
      viewer.style.width = '900px';
      await idle;
      const [vaadin, docs] = getLinks(1);
      expect(getTextDivs().map((div) => div.getAttribute('aria-owns'))).to.deep.equal([vaadin.id, docs.id]);
    });
  });

  describe('external links', () => {
    it('should only create links with allowed protocols, which open in a new window without access to the viewer', async () => {
      // pdf.js drops `javascript:` links itself, the viewer drops other protocols.
      const urls = [
        'http://vaadin.com/',
        'https://vaadin.com/',
        'mailto:info@vaadin.com',
        'javascript:alert(1)',
        'ftp://example.com/',
        'tel:123456',
      ];
      await loadPdf([
        {
          content: '',
          annotations: urls.map((uri, index) => uriLink([50, 700 - index * 40, 200, 720 - index * 40], uri)),
        },
      ]);
      const links = getLinks(1);
      expect(links.map((link) => link.href)).to.deep.equal(urls.slice(0, 3));
      links.forEach((link) => {
        expect(link.target).to.equal('_blank');
        expect(link.rel).to.equal('noopener noreferrer');
      });
    });
  });

  describe('names', () => {
    it('should name links by their text, and tell that external links open in a new tab', async () => {
      await load('links.pdf');
      expect(getLinkNames()).to.deep.equal([
        'Internal link to page 2',
        'External link to vaadin.com (opens in a new tab)',
      ]);
    });

    it('should name several links in one text item by their words', async () => {
      await loadPdf([
        {
          content: sentence,
          annotations: [uriLink(documentationRect, 'https://vaadin.com/docs'), uriLink(vaadinRect)],
        },
      ]);
      expect(getLinkNames()).to.deep.equal(['Vaadin (opens in a new tab)', 'documentation (opens in a new tab)']);
    });

    it('should name a link that covers several lines with the text of all lines', async () => {
      // "Vaadin" ends the first line at x=110-182, "docs" starts the second line at x=134-182.
      await loadPdf([
        {
          content: 'BT /F2 20 Tf 50 700 Td (Read Vaadin) Tj ET BT /F2 20 Tf 134 676 Td (docs and more) Tj ET',
          annotations: [uriLink([110, 670, 182, 725])],
        },
      ]);
      expect(getLinkNames()).to.deep.equal(['Vaadin docs (opens in a new tab)']);
    });

    it('should use the URL as the name of an external link without text', async () => {
      await loadPdf([{ content: '', annotations: [uriLink([50, 700, 200, 720])] }]);
      expect(getLinkNames()).to.deep.equal(['https://vaadin.com/ (opens in a new tab)']);
    });

    it('should leave the user name and password out of the URL in the name of a link without text', async () => {
      await loadPdf([
        { content: '', annotations: [uriLink([50, 700, 200, 720], 'https://vaadin.com:secret@example.com/')] },
      ]);
      expect(getLinkNames()).to.deep.equal(['https://example.com/ (opens in a new tab)']);
    });

    it('should name an internal link without text by the page it goes to', async () => {
      await loadPdf([{ content: '', annotations: [destLink('[1 /Fit]')] }, { content: '' }]);
      expect(getLinkNames()).to.deep.equal(['Go to page 2']);
    });

    it('should use a generic name for an internal link that goes nowhere', async () => {
      await loadPdf([{ content: '', annotations: [destLink('/missing')] }]);
      expect(getLinkNames()).to.deep.equal(['Link']);
    });
  });

  describe('destinations', () => {
    it('should go to the destination of an internal link without changing the URL of the page', async () => {
      await load('links.pdf');
      const href = window.location.href;
      getInternalLink().click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(2);
      expect(window.location.href).to.equal(href);
    });

    describe('types', () => {
      // Links on page 1 to the position 400pt from the bottom of page 2, with each type of destination.
      const destinations = {
        XYZ: '[1 /XYZ 0 400 null]',
        FitH: '[1 /FitH 400]',
        FitBH: '[1 /FitBH 400]',
        FitR: '[1 /FitR 0 100 300 400]',
      };

      beforeEach(async () => {
        // The last link goes to a named destination.
        const annotations = [...Object.values(destinations), '/named'].map((dest, index) => destLink(dest, index));
        await loadPdf(
          [
            { content: 'BT /F1 20 Tf 50 750 Td (Page 1) Tj ET', annotations },
            { content: 'BT /F1 20 Tf 50 400 Td (Target) Tj ET' },
            { content: 'BT /F1 20 Tf 50 750 Td (Page 3) Tj ET' },
          ],
          { dests: '/named [1 /FitH 400]' },
        );
      });

      [...Object.keys(destinations), 'named FitH'].forEach((type, index) => {
        it(`should scroll to the position of a ${type} destination`, async () => {
          getLinks(1)[index].click();
          await nextRenderIdle(viewer);
          const page = pages[1];
          // The position is 842 - 400 PDF units from the top of the A4 page
          const expected = page.offsetTop + ((842 - 400) / 842) * page.offsetHeight;
          expect(viewer.page).to.equal(2);
          expect(content.scrollTop).to.be.closeTo(expected, 1);
        });
      });
    });

    [
      { rotate: 90, top: 150 / 595 },
      { rotate: 180, top: 300 / 842 },
      { rotate: 270, top: (595 - 150) / 595 },
    ].forEach(({ rotate, top }) => {
      it(`should scroll to the position of a destination on a page rotated by ${rotate} degrees`, async () => {
        // The position is 150pt from the left and 300pt from the bottom of the unrotated A4 page.
        await loadLinkToPosition('[1 /XYZ 150 300 null]', { rotate });
        getLinks(1)[0].click();
        await nextRenderIdle(viewer);
        const page = pages[1];
        expect(content.scrollTop).to.be.closeTo(page.offsetTop + top * page.offsetHeight, 1);
      });
    });

    [
      { rotate: 90, left: 200 / 842, top: 100 / 595 },
      { rotate: 180, left: 295 / 595, top: 200 / 842 },
      { rotate: 270, left: 442 / 842, top: 295 / 595 },
    ].forEach(({ rotate, left, top }) => {
      it(`should scroll to the top left corner of a FitR rectangle on a page rotated by ${rotate} degrees`, async () => {
        viewer.zoom = 2;
        // The rectangle is 100pt to 300pt from the left and 200pt to 400pt from the bottom of the unrotated A4 page.
        await loadLinkToPosition('[1 /FitR 100 200 300 400]', { rotate });
        getLinks(1)[0].click();
        await nextRenderIdle(viewer);
        const page = pages[1];
        expect(content.scrollLeft).to.be.closeTo(page.offsetLeft + left * page.offsetWidth, 1);
        expect(content.scrollTop).to.be.closeTo(page.offsetTop + top * page.offsetHeight, 1);
      });
    });

    it('should scroll to the position on a rotated page whose size has not loaded yet', async () => {
      // Hold back the second page, so that its size is still unknown when the link is followed.
      let loadPage2!: () => void;
      const page2Held = new Promise<void>((resolve) => {
        loadPage2 = resolve;
      });
      const prototype = await getPdfDocumentPrototype();
      const getPage = prototype.getPage;
      sinon.stub(prototype, 'getPage').callsFake(async function (this: PDFDocumentProxy, pageNumber: number) {
        if (pageNumber === 2) {
          await page2Held;
        }
        return getPage.call(this, pageNumber);
      });
      url = createPdf([
        { content: '', annotations: [destLink('[1 /XYZ 150 300 null]')] },
        { content: '', rotate: 90 },
        { content: '' },
      ]);
      viewer.src = url;
      for (let i = 0; i < 100 && !(pages.length && getLinks(1).length); i++) {
        await nextFrame();
      }
      getLinks(1)[0].click();
      loadPage2();
      await nextRenderIdle(viewer);
      const page = pages[1];
      // On the rotated page, the position 150pt from the left of the unrotated page is 150pt from the top.
      expect(content.scrollTop).to.be.closeTo(page.offsetTop + (150 / 595) * page.offsetHeight, 2);
    });

    it('should scroll to the start of the page of a destination with a position outside the page', async () => {
      // Some PDF generators write -32768 for a missing position.
      await loadLinkToPosition('[1 /FitH -32768]');
      getLinks(1)[0].click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(2);
      expect(content.scrollTop).to.be.closeTo(pages[1].offsetTop, 1);
    });

    ['FitV', 'FitBV'].forEach((type) => {
      it(`should scroll to the left position of a ${type} destination at the top of the page`, async () => {
        viewer.zoom = 2;
        await loadLinkToPosition(`[1 /${type} 200]`);
        getLinks(1)[0].click();
        await nextRenderIdle(viewer);
        const page = pages[1];
        expect(content.scrollLeft).to.be.closeTo(page.offsetLeft + (200 / 595) * page.offsetWidth, 1);
        expect(content.scrollTop).to.be.closeTo(page.offsetTop, 1);
      });
    });

    ['Fit', 'FitB'].forEach((type) => {
      it(`should scroll to the start of the page of a ${type} destination`, async () => {
        await loadLinkToPosition(`[1 /${type}]`);
        getLinks(1)[0].click();
        await nextRenderIdle(viewer);
        const padding = parseFloat(getComputedStyle(content).paddingBlockStart);
        expect(viewer.page).to.equal(2);
        expect(content.scrollTop).to.be.closeTo(pages[1].offsetTop - padding, 1);
      });
    });

    it('should do nothing for a link to a page out of range', async () => {
      await loadPdf([{ content: '', annotations: [destLink('[9 /Fit]')] }, { content: '' }]);
      const warn = sinon.stub(console, 'warn');
      getLinks(1)[0].click();
      await nextFrame();
      await nextFrame();
      expect(viewer.page).to.equal(1);
      expect(content.scrollTop).to.equal(0);
      expect(warn).to.be.not.called;
    });

    it('should scroll horizontally to the position of a destination', async () => {
      viewer.zoom = 2;
      await loadLinkToPosition('[1 /XYZ 200 400 null]');
      getLinks(1)[0].click();
      await nextRenderIdle(viewer);
      const page = pages[1];
      expect(content.scrollLeft).to.be.greaterThan(0);
      expect(content.scrollLeft).to.be.closeTo(page.offsetLeft + (200 / 595) * page.offsetWidth, 1);
    });

    it('should scroll horizontally to the position of a destination in RTL', async () => {
      viewer.setAttribute('dir', 'rtl');
      viewer.zoom = 2;
      await loadLinkToPosition('[1 /XYZ 200 400 null]');
      getLinks(1)[0].click();
      await nextRenderIdle(viewer);
      const page = pages[1].getBoundingClientRect();
      const viewLeft = content.getBoundingClientRect().left + content.clientLeft;
      expect(page.left + (200 / 595) * page.width).to.be.closeTo(viewLeft, 1);
    });
  });

  describe('named actions', () => {
    const actions = ['FirstPage', 'LastPage', 'NextPage', 'PrevPage'];

    beforeEach(async () => {
      // Each page has a link for each action.
      const annotations = actions.map(
        (action, index) =>
          `<< /Type /Annot /Subtype /Link /Rect [50 ${700 - index * 40} 300 ${720 - index * 40}] /A << /S /Named /N /${action} >> >>`,
      );
      await loadPdf(Array.from({ length: 4 }, () => ({ content: '', annotations })));
      viewer.page = 2;
      await nextRenderIdle(viewer);
    });

    [
      ['FirstPage', 1],
      ['LastPage', 4],
      ['NextPage', 3],
      ['PrevPage', 1],
    ].forEach(([action, page]) => {
      it(`should go to the page of the ${action} action`, async () => {
        getLinks(2)[actions.indexOf(action as string)].click();
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(page);
      });
    });

    [
      ['PrevPage', 1],
      ['NextPage', 4],
    ].forEach(([action, page]) => {
      it(`should do nothing for the ${action} action on page ${page}`, async () => {
        viewer.page = page as number;
        await scrollSettled(content);
        const { scrollTop } = content;
        const warn = sinon.stub(console, 'warn');
        getLinks(page as number)[actions.indexOf(action as string)].click();
        await nextFrame();
        await nextFrame();
        expect(viewer.page).to.equal(page);
        expect(content.scrollTop).to.equal(scrollTop);
        expect(warn).to.be.not.called;
      });
    });

    it('should name the links of the next and previous page without a page number', () => {
      // The links of page 2 got their names while page 1 was the current page.
      expect(getLinks(2).map((link) => link.getAttribute('aria-label'))).to.deep.equal([
        'Go to page 1',
        'Go to page 4',
        'Next page',
        'Previous page',
      ]);
    });
  });

  describe('keyboard', () => {
    it('should move focus to the pages when following an internal link', async () => {
      await load('links.pdf');
      const link = getInternalLink();
      link.focus();
      link.click();
      await nextRenderIdle(viewer);
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
    });

    it('should make each link one Tab stop', async () => {
      await load('links.pdf');
      const after = document.createElement('input');
      viewer.after(after);
      content.focus();
      const focused: Element[] = [];
      for (let i = 0; i < 3; i++) {
        await sendKeys({ press: 'Tab' });
        focused.push(getDeepActiveElement());
      }
      after.remove();
      expect(focused).to.deep.equal([...getLinks(1), after]);
    });

    it('should show the focus ring of a focused link', async () => {
      await load('links.pdf');
      content.focus();
      await sendKeys({ press: 'Tab' });
      const link = viewer.shadowRoot!.activeElement as HTMLAnchorElement;
      expect(getComputedStyle(link).outlineStyle).to.equal('solid');
    });

    it('should show the focus ring around the quadrilaterals of a focused link that wraps', async () => {
      await loadWrappingLink();
      content.focus();
      await sendKeys({ press: 'Tab' });
      const link = viewer.shadowRoot!.activeElement as HTMLAnchorElement;
      const areas = [...link.querySelectorAll('.link-area')];
      expect(getComputedStyle(link).outlineStyle).to.equal('none');
      expect(areas.map((area) => getComputedStyle(area).outlineStyle)).to.deep.equal(['solid', 'solid']);
    });

    it('should scroll to a link on another page and update the page when tabbing to it', async () => {
      viewer.style.height = '300px';
      // A link at the top of page 1, and one in the middle of page 2
      await loadPdf([
        { content: '', annotations: [uriLink([50, 780, 200, 800])] },
        { content: '', annotations: [uriLink([50, 410, 200, 430], 'https://vaadin.com/docs')] },
      ]);
      content.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      const link = viewer.shadowRoot!.activeElement!;
      expect(link).to.equal(getLinks(2)[0]);
      await scrollSettled(content);
      const view = content.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      expect(rect.top).to.be.at.least(view.top);
      expect(rect.bottom).to.be.at.most(view.bottom);
      expect(viewer.page).to.equal(2);
    });

    it('should keep focus in the viewer when the page of a focused link is released', async () => {
      viewer.style.height = '300px';
      await load('links.pdf');
      getLinks(1)[0].focus();
      // WebKit scrolls to the focused element after the next layout
      await nextFrame();
      const idle = nextRenderIdle(viewer);
      content.scrollTop = content.scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
    });

    it('should not stop a smooth scroll that releases the page of a focused link', async () => {
      viewer.style.height = '300px';
      const emptyPages = Array.from({ length: 8 }, () => ({ content: '' }));
      await loadPdf([{ content: '', annotations: [uriLink([50, 700, 300, 720])] }, ...emptyPages]);
      getLinks(1)[0].focus();
      await nextFrame();
      const end = content.scrollHeight - content.clientHeight;
      content.scrollTo({ top: end, behavior: 'smooth' });
      await scrollSettled(content);
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
      expect(content.scrollTop).to.be.closeTo(end, 1);
    });
  });

  describe('selection', () => {
    afterEach(async () => {
      await resetMouse();
      document.getSelection()!.removeAllRanges();
    });

    it('should not select the text after a link when dragging a selection over it', async () => {
      await loadPdf([
        {
          content:
            'BT /F1 20 Tf 50 700 Td (First line) Tj ET BT /F1 20 Tf 50 670 Td (Line with a link) Tj ET BT /F1 20 Tf 50 640 Td (Last line) Tj ET',
          annotations: [uriLink([40, 660, 300, 690])],
        },
      ]);
      const first = [...getTextLayer(1)!.querySelectorAll('span')]
        .find((span) => span.textContent === 'First line')!
        .getBoundingClientRect();
      const link = getLinks(1)[0].getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [Math.round(first.left + 2), Math.round(first.top + first.height / 2)],
      });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [Math.round(link.left + 60), Math.round(link.top + link.height / 2)] });
      await nextFrame();
      const selected = getSelectionRanges(viewer.shadowRoot!).join('');
      await sendMouse({ type: 'up' });
      expect(selected).to.include('First line');
      expect(selected).to.not.include('Last line');
    });

    it('should keep links clickable when a click puts the caret in the text', async () => {
      await load('links.pdf');
      const text = [...getTextLayer(1)!.querySelectorAll('span')].find(
        (span) => span.textContent === 'Links',
      )!.firstChild!;
      // The selection change of a click can come after the pointer is released.
      const change = new Promise((resolve) => {
        document.addEventListener('selectionchange', resolve, { once: true });
      });
      document.getSelection()!.collapse(text, 2);
      await change;
      expect(getComputedStyle(getLinks(1)[0]).pointerEvents).to.equal('auto');
    });
  });

  describe('localization', () => {
    const norwegian = { externalLink: '{text} (åpnes i en ny fane)' };

    it('should use the localization set before loading', async () => {
      viewer.i18n = norwegian;
      await load('links.pdf');
      expect(getExternalLink().getAttribute('aria-label')).to.equal('External link to vaadin.com (åpnes i en ny fane)');
    });

    it('should update the accessible names of links when the localization changes', async () => {
      await load('links.pdf');
      viewer.i18n = norwegian;
      await nextUpdate(viewer);
      expect(getExternalLink().getAttribute('aria-label')).to.equal('External link to vaadin.com (åpnes i en ny fane)');
    });

    it('should use the localization for links of pages rendered again', async () => {
      viewer.style.height = '300px';
      await load('links.pdf');
      viewer.i18n = norwegian;
      let idle = nextRenderIdle(viewer);
      content.scrollTop = content.scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
      idle = nextRenderIdle(viewer);
      content.scrollTop = 0;
      await idle;
      expect(getExternalLink().getAttribute('aria-label')).to.equal('External link to vaadin.com (åpnes i en ny fane)');
    });
  });
});
