import { expect } from '@vaadin/chai-plugins';
import { getAccessibilityTree, sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, isChrome, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import { PdfViewerPage } from '../src/pdf-viewer-page.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, type Fixture, loadDocument, nextRenderIdle, type PdfPage } from './helpers.js';

describe('text and links', () => {
  let viewer: PdfViewer;
  let url: string | undefined;

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

  beforeEach(async () => {
    url = undefined;
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 500px"></vaadin-pdf-viewer>');
    await nextRender();
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
      expect(viewer.shadowRoot!.activeElement).to.equal(viewer.shadowRoot!.querySelector('[part="content"]'));
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
  });

  afterEach(() => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });

  describe('links in text', () => {
    // Courier at 20pt has 12pt wide characters, so character `i` starts at x = 50 + 12 * i:
    // "Vaadin" is at x=110-182, "for" at 194-230, "documentation" at 242-398.
    const sentence = 'BT /F2 20 Tf 50 700 Td (Read Vaadin for documentation today) Tj ET';
    const vaadinRect = [110, 695, 182, 725];
    const forRect = [194, 695, 230, 725];
    const documentationRect = [242, 695, 398, 725];

    function uriLink(rect: number[], uri = 'https://vaadin.com/') {
      return `<< /Type /Annot /Subtype /Link /Rect [${rect.join(' ')}] /Border [0 0 0] /A << /S /URI /URI (${uri}) >> >>`;
    }

    async function loadPdf(page: PdfPage) {
      url = createPdf([page]);
      const idle = nextRenderIdle(viewer);
      viewer.src = url;
      await idle;
    }

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
      await loadPdf({ content: sentence, annotations: [uriLink(vaadinRect)] });
      expect(getReadContent()).to.deep.equal(['Read', '[Vaadin (opens in a new tab)]', 'for documentation today']);
    });

    it('should name a link by the word it covers in the middle of a text item', async () => {
      await loadPdf({ content: sentence, annotations: [uriLink(forRect)] });
      expect(getReadContent()).to.deep.equal(['Read Vaadin', '[for (opens in a new tab)]', 'documentation today']);
    });

    it('should place several links in one text item in reading order', async () => {
      await loadPdf({
        content: sentence,
        annotations: [uriLink(documentationRect, 'https://vaadin.com/docs'), uriLink(vaadinRect)],
      });
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
      await loadPdf({
        content: 'BT /F2 20 Tf 50 700 Td (Read Vaadin) Tj ET BT /F2 20 Tf 134 676 Td (docs and more) Tj ET',
        annotations: [uriLink([110, 670, 182, 725])],
      });
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
      await loadPdf({ content: sentence, annotations: [uriLink(vaadinRect)] });
      const range = document.createRange();
      range.selectNodeContents(getTextLayer(1)!);
      expect(range.toString()).to.equal('Read Vaadin for documentation today');
    });

    // Only Chromium exposes its accessibility tree to the tests.
    (isChrome ? it : it.skip)(
      'should expose the text and the link in reading order in the accessibility tree',
      async () => {
        await loadPdf({ content: sentence, annotations: [uriLink(vaadinRect)] });
        const tree = (await getAccessibilityTree())!;
        const pageIndex = tree.findIndex((node) => node.name === 'Page 1');
        const end = tree.findIndex((node, index) => index > pageIndex && node.depth <= tree[pageIndex].depth);
        const read = tree
          .slice(pageIndex + 1, end === -1 ? undefined : end)
          .filter((node) => node.role === 'StaticText' || node.role === 'link')
          .map((node) => (node.role === 'link' ? `[${node.name}]` : node.name.trim()))
          .filter(Boolean);
        expect(read).to.deep.equal(['Read', '[Vaadin (opens in a new tab)]', 'for documentation today']);
      },
    );
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
      url = createPdf(
        [
          { content: 'BT /F1 20 Tf 50 750 Td (Page 1) Tj ET', annotations },
          { content: 'BT /F1 20 Tf 50 400 Td (Target) Tj ET' },
          { content: 'BT /F1 20 Tf 50 750 Td (Page 3) Tj ET' },
        ],
        { dests: '/named [1 /FitH 400]' },
      );
      const idle = nextRenderIdle(viewer);
      viewer.src = url;
      await idle;
    });

    [...Object.keys(destinations), 'named FitH'].forEach((type, index) => {
      it(`should scroll to the position of a ${type} destination`, async () => {
        const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
        getLinks(1)[index].click();
        await nextRenderIdle(viewer);
        const page = getPages()[1];
        // The position is 842 - 400 PDF units from the top of the A4 page
        const expected = page.offsetTop + ((842 - 400) / 842) * page.offsetHeight;
        expect(viewer.page).to.equal(2);
        expect(content.scrollTop).to.be.closeTo(expected, 1);
      });
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
      const page = new PdfViewerPage(1, { width: 100, height: 100 });
      page.textLayer = { textDivs: [span] } as any;
      return page.getTextInside(link as Element).map(({ start, end }) => text.slice(start, end));
    }

    it('should keep a combining mark at the end of a word', () => {
      expect(getLinkText('देखें हिन्दी में', 'हिन्दी')).to.deep.equal(['हिन्दी']);
      expect(getLinkText('un cafe\u0301 noir', 'cafe\u0301')).to.deep.equal(['cafe\u0301']);
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
      const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
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
      const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
      getLinks(1)[0].focus();
      // Scroll away from the link with the keyboard until its page is released
      for (let i = 0; i < 20 && getTextLayer(1); i++) {
        await sendKeys({ press: 'PageDown' });
        await nextFrame();
      }
      expect(getTextLayer(1)).to.be.null;
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
    });

    it('should remove the text layer when a page is released', async () => {
      const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
      const idle = nextRenderIdle(viewer);
      content.scrollTop = content.scrollHeight;
      await idle;
      expect(getTextLayer(1)).to.be.null;
      expect(getPages()[0].querySelector('.link-layer')).to.be.null;
    });
  });

  describe('errors', () => {
    it('should not warn for cancelled renders when the document changes', async () => {
      const stub = sinon.stub(console, 'warn');
      try {
        viewer.src = new URL('./fixtures/multi-page.pdf', import.meta.url).href;
        await nextFrame();
        await load('links.pdf');
        expect(stub).to.be.not.called;
      } finally {
        stub.restore();
      }
    });
  });
});
