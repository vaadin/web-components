import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { type Fixture, loadDocument, nextRenderIdle } from './helpers.js';

describe('text and links', () => {
  let viewer: PdfViewer;

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
