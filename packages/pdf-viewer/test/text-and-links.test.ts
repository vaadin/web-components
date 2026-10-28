import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, isDesktopSafari, nextFrame, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import { getTextInside } from '../src/pdf-viewer-links.js';
import { acquireWorker, loadPdfjs, releaseWorker } from '../src/pdfjs-loader.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdf,
  type Fixture,
  fixtureUrl,
  loadAndRender,
  nextRenderIdle,
  type PdfPage,
  scrollSettled,
} from './helpers.js';

/** Safari moves focus to links with Option+Tab, unless the user enables Tab for links. */
const TAB = isDesktopSafari ? 'Alt+Tab' : 'Tab';

/**
 * Spies on a method of the pages of every pdf.js document, including the
 * documents of the viewer, through a page of a document loaded for that.
 */
async function spyOnPdfPages(method: 'getTextContent') {
  const pdfjs = await loadPdfjs();
  const handle = acquireWorker(pdfjs);
  const task = pdfjs.getDocument({ url: fixtureUrl('multi-page.pdf'), worker: handle.worker! });
  try {
    const pdfPage = await (await task.promise).getPage(1);
    return sinon.spy(Object.getPrototypeOf(pdfPage), method);
  } finally {
    await task.destroy();
    releaseWorker(handle);
  }
}

describe('text and links', () => {
  let viewer: PdfViewer;
  let content: HTMLElement;
  // A live collection, which follows the pages of the loaded document
  let pages: HTMLCollectionOf<HTMLElement>;
  let url: string | undefined;

  function getTextLayer(pageNumber: number) {
    return pages[pageNumber - 1].querySelector<HTMLElement>('.text-layer');
  }

  function getLinks(pageNumber: number) {
    return [...pages[pageNumber - 1].querySelectorAll<HTMLAnchorElement>('a.link')];
  }

  /** Makes the viewer wider, which renders the pages again at a larger scale. */
  async function resizeViewer() {
    const idle = nextRenderIdle(viewer);
    viewer.style.width = '900px';
    await nextResize(viewer);
    await idle;
  }

  async function load(name: Fixture) {
    await loadAndRender(viewer, fixtureUrl(name));
  }

  async function loadPdf(pdfPages: PdfPage[], options?: { dests?: string; lang?: string }) {
    url = createPdf(pdfPages, options);
    await loadAndRender(viewer, url);
  }

  function uriLink(rect: number[], uri = 'https://vaadin.com/') {
    return `<< /Type /Annot /Subtype /Link /Rect [${rect.join(' ')}] /Border [0 0 0] /A << /S /URI /URI (${uri}) >> >>`;
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

  describe('text layer', () => {
    beforeEach(async () => {
      await load('multi-page.pdf');
    });

    it('should contain the text of the rendered pages', () => {
      expect(getTextLayer(1)!.textContent).to.include('Unique word on this page: marker1.');
    });

    it('should not have a text layer for pages that are not rendered', () => {
      expect(getTextLayer(6)).to.be.null;
    });

    it('should place the text over the same text on the canvas', () => {
      const page = pages[0].getBoundingClientRect();
      const heading = [...getTextLayer(1)!.querySelectorAll('span')].find((span) => span.textContent === 'Page 1')!;
      const rect = heading.getBoundingClientRect();
      // The heading is printed with a 20mm margin, which is about 57pt of the 596pt wide page
      expect((rect.left - page.left) / page.width).to.be.closeTo(56.7 / 595.92, 0.01);
      expect(rect.width).to.be.greaterThan(0);
    });

    it('should allow selecting the text', () => {
      const span = [...getTextLayer(1)!.querySelectorAll('span')].find((element) =>
        element.textContent!.startsWith('The quick brown fox'),
      )!;
      expect(getComputedStyle(span).userSelect).to.not.equal('none');
      const range = document.createRange();
      range.selectNodeContents(getTextLayer(1)!);
      expect(range.toString()).to.include('The quick brown fox');
    });

    it('should resize the text layer when the pages resize', async () => {
      await resizeViewer();
      const page = pages[0].getBoundingClientRect();
      const layer = getTextLayer(1)!.getBoundingClientRect();
      expect(layer.width).to.be.closeTo(page.width, 1);
      expect(layer.height).to.be.closeTo(page.height, 1);
    });

    it('should keep the text layer when the pages resize', async () => {
      const layer = getTextLayer(1);
      await resizeViewer();
      expect(getTextLayer(1)).to.equal(layer);
    });
  });

  describe('text content', () => {
    let spy: sinon.SinonSpy;

    beforeEach(async () => {
      spy = await spyOnPdfPages('getTextContent');
    });

    it('should load the text of a page once when the page is rendered again', async () => {
      viewer.style.height = '300px';
      await load('multi-page.pdf');
      let idle = nextRenderIdle(viewer);
      content.scrollTop = content.scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
      idle = nextRenderIdle(viewer);
      content.scrollTop = 0;
      await idle;
      await resizeViewer();
      expect(getTextLayer(1)).to.be.ok;
      const pageNumbers = spy.thisValues.map((pdfPage) => pdfPage.pageNumber);
      expect(pageNumbers).to.include(1);
      expect(pageNumbers).to.have.lengthOf(new Set(pageNumbers).size);
    });

    it('should load the text again for another document', async () => {
      await load('multi-page.pdf');
      await load('links.pdf');
      await load('multi-page.pdf');
      expect(spy.thisValues.filter((pdfPage) => pdfPage.pageNumber === 1)).to.have.lengthOf(3);
    });
  });

  describe('rotated page', () => {
    beforeEach(async () => {
      await load('rotated.pdf');
    });

    it('should place the text over the same text on the canvas', () => {
      const page = pages[0].getBoundingClientRect();
      const span = [...getTextLayer(1)!.querySelectorAll('span')].find(
        (element) => element.textContent === 'Rotated page',
      )!;
      const rect = span.getBoundingClientRect();
      // The text starts at 72pt from the left of the portrait page, which is the top of the rotated page.
      // Its baseline is 720pt from the bottom, which is 720pt from the left of the rotated page.
      expect((rect.top - page.top) / page.height).to.be.closeTo(72 / 595, 0.01);
      expect((rect.right - page.left) / page.width).to.be.closeTo(745 / 842, 0.02);
      expect(rect.height).to.be.greaterThan(rect.width);
    });

    it('should cover the page with the text layer', () => {
      const page = pages[0].getBoundingClientRect();
      const layer = getTextLayer(1)!.getBoundingClientRect();
      expect(layer.left).to.be.closeTo(page.left, 1);
      expect(layer.top).to.be.closeTo(page.top, 1);
      expect(layer.width).to.be.closeTo(page.width, 1);
      expect(layer.height).to.be.closeTo(page.height, 1);
    });
  });

  describe('language', () => {
    let pagesContainer: HTMLElement;

    beforeEach(async () => {
      pagesContainer = viewer.shadowRoot!.querySelector<HTMLElement>('#pages')!;
      await loadPdf([{ content: 'BT /F1 20 Tf 50 700 Td (Hej) Tj ET' }], { lang: 'sv' });
    });

    it('should set the language of the document on the pages', () => {
      expect(pagesContainer.getAttribute('lang')).to.equal('sv');
    });

    it('should remove the language for a document without one', async () => {
      await load('multi-page.pdf');
      expect(pagesContainer.hasAttribute('lang')).to.be.false;
    });
  });

  describe('links', () => {
    let internalLink: HTMLAnchorElement;
    let externalLink: HTMLAnchorElement;

    beforeEach(async () => {
      await load('links.pdf');
      internalLink = getLinks(1).find((element) => element.getAttribute('href') === '#')!;
      externalLink = getLinks(1).find((element) => element.href === 'https://vaadin.com/')!;
    });

    it('should open external links in a new window without access to the viewer', () => {
      expect(externalLink.target).to.equal('_blank');
      expect(externalLink.rel).to.equal('noopener noreferrer');
    });

    it('should use the text of the link as its accessible name', () => {
      expect(internalLink.getAttribute('aria-label')).to.equal('Internal link to page 2');
    });

    it('should tell that an external link opens in a new tab', () => {
      expect(externalLink.getAttribute('aria-label')).to.equal('External link to vaadin.com (opens in a new tab)');
    });

    it('should move focus to the pages when following an internal link', async () => {
      internalLink.focus();
      internalLink.click();
      await nextRenderIdle(viewer);
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
    });

    it('should go to the destination of an internal link', async () => {
      internalLink.click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(2);
    });

    it('should not change the URL of the page when following an internal link', async () => {
      const href = window.location.href;
      internalLink.click();
      await nextFrame();
      expect(window.location.href).to.equal(href);
    });

    it('should make each link one Tab stop', async () => {
      const after = document.createElement('input');
      viewer.after(after);
      content.focus();
      const focused: Element[] = [];
      for (let i = 0; i < 3; i++) {
        await sendKeys({ press: TAB });
        focused.push(viewer.shadowRoot!.activeElement || document.activeElement!);
      }
      after.remove();
      expect(focused).to.deep.equal([...getLinks(1), after]);
    });

    it('should show the focus ring of a focused link', async () => {
      content.focus();
      await sendKeys({ press: TAB });
      const link = viewer.shadowRoot!.activeElement as HTMLAnchorElement;
      expect(getComputedStyle(link).outlineStyle).to.equal('solid');
    });
  });

  describe('links over text', () => {
    // Courier at 20pt has 12pt wide characters, so character `i` starts at x = 50 + 12 * i:
    // "Vaadin" is at x=110-182, "for" at 194-230, "documentation" at 242-398.
    const sentence = 'BT /F2 20 Tf 50 700 Td (Read Vaadin for documentation today) Tj ET';
    const vaadinRect = [110, 695, 182, 725];
    const forRect = [194, 695, 230, 725];
    const documentationRect = [242, 695, 398, 725];

    function getLinkNames() {
      return getLinks(1).map((link) => link.getAttribute('aria-label'));
    }

    it('should name a link by the word it covers in the middle of a text item', async () => {
      await loadPdf([{ content: sentence, annotations: [uriLink(forRect)] }]);
      expect(getLinkNames()).to.deep.equal(['for (opens in a new tab)']);
    });

    it('should name several links in one text item by their words', async () => {
      await loadPdf([
        {
          content: sentence,
          annotations: [uriLink(documentationRect, 'https://vaadin.com/docs'), uriLink(vaadinRect)],
        },
      ]);
      expect(getLinkNames()).to.deep.equal(['documentation (opens in a new tab)', 'Vaadin (opens in a new tab)']);
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

    it('should name the links of the inline links fixture', async () => {
      await load('inline-links.pdf');
      // A wrapped link has one annotation for each line.
      expect(getLinkNames()).to.have.members([
        'Vaadin (opens in a new tab)',
        'vaadin.com (opens in a new tab)',
        'github.com (opens in a new tab)',
        'continues (opens in a new tab)',
        'on the next line (opens in a new tab)',
      ]);
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
  });

  describe('link names', () => {
    it('should use the URL as the name of an external link without text', async () => {
      await loadPdf([{ content: '', annotations: [uriLink([50, 700, 200, 720])] }]);
      expect(getLinks(1)[0].getAttribute('aria-label')).to.equal('https://vaadin.com/ (opens in a new tab)');
    });

    it('should name an internal link without text by the page it goes to', async () => {
      await loadPdf([
        { content: '', annotations: ['<< /Type /Annot /Subtype /Link /Rect [50 700 200 720] /Dest [1 /Fit] >>'] },
        { content: '' },
      ]);
      expect(getLinks(1)[0].getAttribute('aria-label')).to.equal('Go to page 2');
    });

    it('should use a generic name for an internal link that goes nowhere', async () => {
      await loadPdf([
        { content: '', annotations: ['<< /Type /Annot /Subtype /Link /Rect [50 700 200 720] /Dest /missing >>'] },
      ]);
      expect(getLinks(1)[0].getAttribute('aria-label')).to.equal('Link');
    });
  });

  it('should create links for http, https and mailto URLs', async () => {
    const urls = ['http://vaadin.com/', 'https://vaadin.com/', 'mailto:info@vaadin.com'];
    await loadPdf([
      {
        content: '',
        annotations: urls.map((uri, index) => uriLink([50, 700 - index * 40, 200, 720 - index * 40], uri)),
      },
    ]);
    const links = getLinks(1);
    expect(links.map((link) => link.href)).to.deep.equal(urls);
    links.forEach((link) => {
      expect(link.target).to.equal('_blank');
      expect(link.rel).to.equal('noopener noreferrer');
    });
  });

  it('should only create links with allowed protocols', async () => {
    await load('unsafe-links.pdf');
    expect(getLinks(1).map((link) => link.href)).to.deep.equal(['https://vaadin.com/']);
  });

  describe('destinations', () => {
    // Links on page 1 to the position 400pt from the bottom of page 2, with each type of destination.
    const destinations = {
      XYZ: '[1 /XYZ 0 400 null]',
      FitH: '[1 /FitH 400]',
      FitBH: '[1 /FitBH 400]',
      FitR: '[1 /FitR 0 100 300 400]',
    };

    beforeEach(async () => {
      // The last link goes to a named destination.
      const annotations = [...Object.values(destinations), '/named'].map(
        (dest, index) =>
          `<< /Type /Annot /Subtype /Link /Rect [50 ${700 - index * 40} 300 ${720 - index * 40}] /Border [0 0 0] /Dest ${dest} >>`,
      );
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
  });

  it('should scroll to a link on another page and update the page when tabbing to it', async () => {
    viewer.style.height = '300px';
    // A link at the top of page 1, and one in the middle of page 2
    await loadPdf([
      { content: '', annotations: [uriLink([50, 780, 200, 800])] },
      { content: '', annotations: [uriLink([50, 410, 200, 430], 'https://vaadin.com/docs')] },
    ]);
    content.focus();
    await sendKeys({ press: TAB });
    await sendKeys({ press: TAB });
    const link = viewer.shadowRoot!.activeElement!;
    expect(link).to.equal(getLinks(2)[0]);
    await scrollSettled(content);
    const view = content.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    expect(rect.top).to.be.at.least(view.top);
    expect(rect.bottom).to.be.at.most(view.bottom);
    expect(viewer.page).to.equal(2);
  });

  describe('words of links', () => {
    let span: HTMLSpanElement;

    afterEach(() => {
      span.remove();
    });

    /** Returns the text that a link over the given word of the text finds, see `getTextInside()`. */
    function getLinkText(text: string, word: string) {
      span = document.createElement('span');
      span.textContent = text;
      span.style.cssText = 'position: absolute; top: 0; left: 0; font-size: 20px; white-space: pre';
      document.body.append(span);
      const range = document.createRange();
      const index = text.indexOf(word);
      range.setStart(span.firstChild!, index);
      range.setEnd(span.firstChild!, index + word.length);
      const wordRect = range.getBoundingClientRect();
      const link: Pick<Element, 'getBoundingClientRect'> = { getBoundingClientRect: () => wordRect };
      return getTextInside([span], link as Element).map(({ start, end }) => text.slice(start, end));
    }

    it('should keep a combining mark at the end of a word', () => {
      expect(getLinkText('देखें हिन्दी में', 'हिन्दी')).to.deep.equal(['हिन्दी']);
      expect(getLinkText('un café noir', 'café')).to.deep.equal(['café']);
    });

    it('should find a word in a language without spaces', () => {
      expect(getLinkText('日本語のリンクです', 'リンク')).to.deep.equal(['リンク']);
    });

    it('should not include punctuation around a word', () => {
      expect(getLinkText('See (vaadin.com), please', 'vaadin.com')).to.deep.equal(['vaadin.com']);
    });
  });

  describe('localization', () => {
    const norwegian = { externalLink: '{text} (åpnes i en ny fane)' };

    function getExternalLink() {
      return getLinks(1).find((element) => element.href === 'https://vaadin.com/')!;
    }

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

  describe('released pages', () => {
    beforeEach(() => {
      viewer.style.height = '300px';
    });

    it('should keep focus in the viewer when the page of a focused link is released', async () => {
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

    it('should remove the text and link layers when a page is released', async () => {
      await load('multi-page.pdf');
      const idle = nextRenderIdle(viewer);
      content.scrollTop = content.scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
      expect(pages[0].querySelector('.link-layer')).to.be.null;
    });
  });

  it('should not warn for cancelled renders when the document changes', async () => {
    const stub = sinon.stub(console, 'warn');
    viewer.src = fixtureUrl('multi-page.pdf');
    await nextFrame();
    await load('links.pdf');
    expect(stub).to.be.not.called;
  });

  it('should use the pdf.js version that the text layer styles are ported from', async () => {
    const path = '../src/styles/vaadin-pdf-viewer-page-base-styles.js';
    const source = await (await fetch(new URL(path, import.meta.url))).text();
    const { version } = await loadPdfjs();
    expect(source.match(/pdf\.js (\d+\.\d+\.\d+)/u)![1]).to.equal(version);
  });
});
