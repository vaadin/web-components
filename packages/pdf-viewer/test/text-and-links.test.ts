import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, isDesktopSafari, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
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
  loadDocument,
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
  let url: string | undefined;

  function getContent() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  }

  function getPages() {
    return [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[part~="page"]')];
  }

  function getTextLayer(pageNumber: number) {
    return getPages()[pageNumber - 1].querySelector<HTMLElement>('.text-layer');
  }

  function getLinks(pageNumber: number) {
    return [...getPages()[pageNumber - 1].querySelectorAll<HTMLAnchorElement>('a.link')];
  }

  async function load(name: Fixture) {
    const idle = nextRenderIdle(viewer);
    await loadDocument(viewer, name);
    await idle;
  }

  async function loadPdf(pages: PdfPage[], options?: { dests?: string; lang?: string }) {
    url = createPdf(pages, options);
    const idle = nextRenderIdle(viewer);
    viewer.src = url;
    await idle;
  }

  function uriLink(rect: number[], uri = 'https://vaadin.com/') {
    return `<< /Type /Annot /Subtype /Link /Rect [${rect.join(' ')}] /Border [0 0 0] /A << /S /URI /URI (${uri}) >> >>`;
  }

  beforeEach(async () => {
    url = undefined;
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 500px"></vaadin-pdf-viewer>');
    await nextRender();
  });

  afterEach(() => {
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
      const page = getPages()[0].getBoundingClientRect();
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

    it('should resize the text layer when zooming', async () => {
      viewer.zoom = 2;
      await nextRenderIdle(viewer);
      const page = getPages()[0].getBoundingClientRect();
      const layer = getTextLayer(1)!.getBoundingClientRect();
      expect(layer.width).to.be.closeTo(page.width, 1);
      expect(layer.height).to.be.closeTo(page.height, 1);
    });

    it('should keep the text layer when zooming', async () => {
      const layer = getTextLayer(1);
      viewer.zoom = 2;
      await nextRenderIdle(viewer);
      expect(getTextLayer(1)).to.equal(layer);
    });
  });

  describe('text content', () => {
    let spy: sinon.SinonSpy;

    beforeEach(async () => {
      spy = await spyOnPdfPages('getTextContent');
    });

    afterEach(() => {
      spy.restore();
    });

    it('should load the text of a page once when the page is rendered again', async () => {
      viewer.style.height = '300px';
      await load('multi-page.pdf');
      let idle = nextRenderIdle(viewer);
      getContent().scrollTop = getContent().scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
      idle = nextRenderIdle(viewer);
      getContent().scrollTop = 0;
      await idle;
      viewer.zoom = 2;
      await nextRenderIdle(viewer);
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
      const page = getPages()[0].getBoundingClientRect();
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
      const page = getPages()[0].getBoundingClientRect();
      const layer = getTextLayer(1)!.getBoundingClientRect();
      expect(layer.left).to.be.closeTo(page.left, 1);
      expect(layer.top).to.be.closeTo(page.top, 1);
      expect(layer.width).to.be.closeTo(page.width, 1);
      expect(layer.height).to.be.closeTo(page.height, 1);
    });
  });

  describe('language', () => {
    function getPagesContainer() {
      return viewer.shadowRoot!.querySelector('#pages')!;
    }

    it('should set the language of the document on the pages', async () => {
      await loadPdf([{ content: 'BT /F1 20 Tf 50 700 Td (Hej) Tj ET' }], { lang: 'sv' });
      expect(getPagesContainer().getAttribute('lang')).to.equal('sv');
    });

    it('should remove the language for a document without one', async () => {
      await loadPdf([{ content: 'BT /F1 20 Tf 50 700 Td (Hej) Tj ET' }], { lang: 'sv' });
      await load('multi-page.pdf');
      expect(getPagesContainer().hasAttribute('lang')).to.be.false;
    });
  });

  describe('links', () => {
    beforeEach(async () => {
      await load('links.pdf');
    });

    it('should open external links in a new window without access to the viewer', () => {
      const link = getLinks(1).find((element) => element.href === 'https://vaadin.com/')!;
      expect(link.target).to.equal('_blank');
      expect(link.rel).to.equal('noopener noreferrer');
    });

    it('should use the text of the link as its accessible name', () => {
      const link = getLinks(1).find((element) => element.getAttribute('href') === '#')!;
      expect(link.getAttribute('aria-label')).to.equal('Internal link to page 2');
    });

    it('should tell that an external link opens in a new tab', () => {
      const link = getLinks(1).find((element) => element.href === 'https://vaadin.com/')!;
      expect(link.getAttribute('aria-label')).to.equal('External link to vaadin.com (opens in a new tab)');
    });

    it('should place a link after its text and hide the text from assistive technology', () => {
      const link = getLinks(1).find((element) => element.getAttribute('href') === '#')!;
      const text = link.previousElementSibling!;
      expect(text.textContent).to.equal('Internal link to page 2');
      expect(text.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should move focus to the pages when following an internal link', async () => {
      const link = getLinks(1).find((element) => element.getAttribute('href') === '#')!;
      link.focus();
      link.click();
      await nextRenderIdle(viewer);
      expect(viewer.shadowRoot!.activeElement).to.equal(getContent());
    });

    it('should go to the destination of an internal link', async () => {
      const link = getLinks(1).find((element) => element.getAttribute('href') === '#')!;
      link.click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(2);
    });

    it('should not change the URL of the page when following an internal link', async () => {
      const href = window.location.href;
      getLinks(1)
        .find((element) => element.getAttribute('href') === '#')!
        .click();
      await nextFrame();
      expect(window.location.href).to.equal(href);
    });

    it('should make each link one Tab stop', async () => {
      const after = document.createElement('input');
      viewer.after(after);
      getContent().focus();
      const focused: Element[] = [];
      for (let i = 0; i < 3; i++) {
        await sendKeys({ press: TAB });
        focused.push(viewer.shadowRoot!.activeElement || document.activeElement!);
      }
      expect(focused).to.deep.equal([...getLinks(1), after]);
    });

    it('should show the focus ring of a focused link over its text', async () => {
      getContent().focus();
      await sendKeys({ press: TAB });
      const link = viewer.shadowRoot!.activeElement as HTMLAnchorElement;
      expect(getComputedStyle(link).outlineStyle).to.equal('solid');
      const linkRect = link.getBoundingClientRect();
      const textRect = link.previousElementSibling!.getBoundingClientRect();
      const x = textRect.left + textRect.width / 2;
      const y = textRect.top + textRect.height / 2;
      expect(x).to.be.within(linkRect.left, linkRect.right);
      expect(y).to.be.within(linkRect.top, linkRect.bottom);
    });

    it('should not have focusable elements that are hidden from assistive technology', () => {
      const hidden = viewer.shadowRoot!.querySelectorAll('[aria-hidden="true"] :is(a, [tabindex])');
      expect(hidden).to.have.lengthOf(0);
    });
  });

  describe('links in text', () => {
    // Courier at 20pt has 12pt wide characters, so character `i` starts at x = 50 + 12 * i:
    // "Vaadin" is at x=110-182, "for" at 194-230, "documentation" at 242-398.
    const sentence = 'BT /F2 20 Tf 50 700 Td (Read Vaadin for documentation today) Tj ET';
    const vaadinRect = [110, 695, 182, 725];
    const forRect = [194, 695, 230, 725];
    const documentationRect = [242, 695, 398, 725];

    /** Returns what assistive technology reads in the text layer of page 1, in order. */
    function getReadContent() {
      const result: string[] = [];
      const walk = (element: Element) => {
        [...element.children].forEach((child) => {
          if (child.getAttribute('aria-hidden') === 'true' || child.localName === 'br') {
            return;
          }
          if (child.localName === 'a') {
            result.push(`[${child.getAttribute('aria-label')}]`);
          } else if (child.children.length) {
            walk(child);
          } else if (child.classList.contains('link-text')) {
            result.push(getComputedStyle(child, '::before').content.slice(1, -1).trim());
          } else if (child.textContent!.trim()) {
            result.push(child.textContent!.trim());
          }
        });
      };
      walk(getTextLayer(1)!);
      return result;
    }

    it('should keep the text before and after a link inside a text item', async () => {
      await loadPdf([{ content: sentence, annotations: [uriLink(vaadinRect)] }]);
      expect(getReadContent()).to.deep.equal(['Read', '[Vaadin (opens in a new tab)]', 'for documentation today']);
    });

    it('should name a link by the word it covers in the middle of a text item', async () => {
      await loadPdf([{ content: sentence, annotations: [uriLink(forRect)] }]);
      expect(getReadContent()).to.deep.equal(['Read Vaadin', '[for (opens in a new tab)]', 'documentation today']);
    });

    it('should place several links in one text item in reading order', async () => {
      await loadPdf([
        {
          content: sentence,
          annotations: [uriLink(documentationRect, 'https://vaadin.com/docs'), uriLink(vaadinRect)],
        },
      ]);
      expect(getReadContent()).to.deep.equal([
        'Read',
        '[Vaadin (opens in a new tab)]',
        'for',
        '[documentation (opens in a new tab)]',
        'today',
      ]);
    });

    it('should read a link that covers several lines once, with the text of all lines', async () => {
      // "Vaadin" ends the first line at x=110-182, "docs" starts the second line at x=134-182.
      await loadPdf([
        {
          content: 'BT /F2 20 Tf 50 700 Td (Read Vaadin) Tj ET BT /F2 20 Tf 134 676 Td (docs and more) Tj ET',
          annotations: [uriLink([110, 670, 182, 725])],
        },
      ]);
      expect(getReadContent()).to.deep.equal(['Read', '[Vaadin docs (opens in a new tab)]', 'and more']);
    });

    it('should read the links of the inline links fixture in place', async () => {
      await load('inline-links.pdf');
      // pdf.js makes a text item of each word of this file.
      expect(getReadContent().join(' ')).to.equal(
        [
          'Read the [Vaadin (opens in a new tab)] documentation for details.',
          'Links to [vaadin.com (opens in a new tab)] and to [github.com (opens in a new tab)] in one line.',
          'A link that [continues next line (opens in a new tab)] , then plain text.',
        ].join(' '),
      );
    });

    it('should keep the text of the text layer for selecting and finding text', async () => {
      await loadPdf([{ content: sentence, annotations: [uriLink(vaadinRect)] }]);
      const range = document.createRange();
      range.selectNodeContents(getTextLayer(1)!);
      expect(range.toString()).to.equal('Read Vaadin for documentation today');
    });

    it('should keep a link over text hidden from assistive technology out of the text layer', async () => {
      // A page header marked as an artifact, which is not part of the content
      await loadPdf([{ content: `/Artifact BMC ${sentence} EMC`, annotations: [uriLink(vaadinRect)] }]);
      const link = getLinks(1)[0];
      expect(link.getAttribute('aria-label')).to.equal('Vaadin (opens in a new tab)');
      expect(link.closest('[aria-hidden="true"]')).to.be.null;
      expect(link.closest('.link-layer')).to.be.ok;
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

  describe('protocols', () => {
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
        const page = getPages()[1];
        // The position is 842 - 400 PDF units from the top of the A4 page
        const expected = page.offsetTop + ((842 - 400) / 842) * page.offsetHeight;
        expect(viewer.page).to.equal(2);
        expect(getContent().scrollTop).to.be.closeTo(expected, 1);
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

  describe('links on other pages', () => {
    beforeEach(async () => {
      viewer.style.height = '300px';
      // A link at the top of page 1, and one in the middle of page 2
      await loadPdf([
        { content: '', annotations: [uriLink([50, 780, 200, 800])] },
        { content: '', annotations: [uriLink([50, 410, 200, 430], 'https://vaadin.com/docs')] },
      ]);
    });

    it('should scroll to a link on another page and update the page when tabbing to it', async () => {
      getContent().focus();
      await sendKeys({ press: TAB });
      await sendKeys({ press: TAB });
      const link = viewer.shadowRoot!.activeElement!;
      expect(link).to.equal(getLinks(2)[0]);
      await scrollSettled(getContent());
      const view = getContent().getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      expect(rect.top).to.be.at.least(view.top);
      expect(rect.bottom).to.be.at.most(view.bottom);
      expect(viewer.page).to.equal(2);
    });
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
      expect(getLinkText('un café noir', 'café')).to.deep.equal(['café']);
    });

    it('should find a word in a language without spaces', () => {
      expect(getLinkText('日本語のリンクです', 'リンク')).to.deep.equal(['リンク']);
    });

    it('should not include punctuation around a word', () => {
      expect(getLinkText('See (vaadin.com), please', 'vaadin.com')).to.deep.equal(['vaadin.com']);
    });
  });

  describe('localization', () => {
    const norwegian = {
      document: 'PDF-dokument',
      externalLink: '{text} (åpnes i en ny fane)',
      goToPage: 'Gå til side {page}',
    };

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

    it('should update the fallback accessible name of the viewer when the localization changes', async () => {
      url = createPdf([{ content: 'BT /F1 20 Tf 50 700 Td (No title) Tj ET' }]);
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = url;
      await loaded;
      expect(viewer.getAttribute('aria-label')).to.equal('PDF document');
      viewer.i18n = norwegian;
      await nextUpdate(viewer);
      expect(viewer.getAttribute('aria-label')).to.equal('PDF-dokument');
    });

    it('should keep the document title as accessible name when the localization changes', async () => {
      await load('links.pdf');
      viewer.i18n = norwegian;
      await nextUpdate(viewer);
      expect(viewer.getAttribute('aria-label')).to.equal('Links fixture');
    });

    it('should keep an accessible name set by the application when the localization changes', async () => {
      await load('links.pdf');
      viewer.setAttribute('aria-label', 'Report');
      viewer.i18n = norwegian;
      await nextUpdate(viewer);
      expect(viewer.getAttribute('aria-label')).to.equal('Report');
    });

    it('should use the localization for links of pages rendered again', async () => {
      viewer.style.height = '300px';
      await load('links.pdf');
      viewer.i18n = norwegian;
      let idle = nextRenderIdle(viewer);
      getContent().scrollTop = getContent().scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
      idle = nextRenderIdle(viewer);
      getContent().scrollTop = 0;
      await idle;
      expect(getExternalLink().getAttribute('aria-label')).to.equal('External link to vaadin.com (åpnes i en ny fane)');
    });
  });

  describe('unsafe links', () => {
    beforeEach(async () => {
      await load('unsafe-links.pdf');
    });

    it('should only create links with allowed protocols', () => {
      expect(getLinks(1).map((link) => link.href)).to.deep.equal(['https://vaadin.com/']);
    });
  });

  describe('released pages', () => {
    beforeEach(async () => {
      viewer.style.height = '300px';
      await load('multi-page.pdf');
    });

    it('should keep focus in the viewer when the page of a focused link is released', async () => {
      await load('links.pdf');
      getLinks(1)[0].focus();
      // Scroll away from the link with the keyboard until its page is released
      for (let i = 0; i < 20 && getTextLayer(1); i++) {
        await sendKeys({ press: 'PageDown' });
        await nextFrame();
      }
      expect(getTextLayer(1)).to.be.null;
      expect(viewer.shadowRoot!.activeElement).to.equal(getContent());
    });

    it('should remove the text layer when a page is released', async () => {
      const idle = nextRenderIdle(viewer);
      getContent().scrollTop = getContent().scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
      expect(getPages()[0].querySelector('.link-layer')).to.be.null;
    });
  });

  describe('errors', () => {
    it('should not warn for cancelled renders when the document changes', async () => {
      const stub = sinon.stub(console, 'warn');
      try {
        viewer.src = fixtureUrl('multi-page.pdf');
        await nextFrame();
        await load('links.pdf');
        expect(stub).to.be.not.called;
      } finally {
        stub.restore();
      }
    });
  });

  describe('pdf.js version', () => {
    /** Returns the pdf.js version that the header of a ported source file names. */
    async function getPortedVersion(path: string) {
      const source = await (await fetch(new URL(path, import.meta.url))).text();
      return source.match(/pdf\.js (\d+\.\d+\.\d+)/u)![1];
    }

    ['../src/styles/vaadin-pdf-viewer-page-base-styles.js', '../src/pdf-viewer-structure-layer.js'].forEach((path) => {
      it(`should use the pdf.js version that ${path.split('/').pop()} is ported from`, async () => {
        const { version } = await loadPdfjs();
        expect(await getPortedVersion(path)).to.equal(version);
      });
    });
  });
});
