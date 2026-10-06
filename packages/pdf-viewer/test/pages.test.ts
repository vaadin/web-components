import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, loadDocument, nextRenderIdle } from './helpers.js';

const A4_RATIO = 842.88 / 595.92;

describe('pages', () => {
  let viewer: PdfViewer;

  function getContent() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  }

  function getPages() {
    return [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[part~="page"]')];
  }

  function getRenderedPageNumbers() {
    return getPages()
      .map((page, index) => (page.querySelector('canvas') ? index + 1 : 0))
      .filter(Boolean);
  }

  function getPageTop(pageNumber: number) {
    const content = getContent();
    return getPages()[pageNumber - 1].getBoundingClientRect().top - content.getBoundingClientRect().top;
  }

  async function scrollTo(scrollTop: number) {
    const idle = nextRenderIdle(viewer);
    getContent().scrollTop = scrollTop;
    await idle;
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 400px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
    const idle = nextRenderIdle(viewer);
    await loadDocument(viewer, 'multi-page.pdf');
    await idle;
  });

  describe('layout', () => {
    it('should create a placeholder for every page', () => {
      expect(getPages()).to.have.lengthOf(6);
    });

    it('should size the placeholders to the page sizes', () => {
      const [first, , , , , last] = getPages().map((page) => page.getBoundingClientRect());
      expect(first.height / first.width).to.be.closeTo(A4_RATIO, 0.01);
      expect(last.width / last.height).to.be.closeTo(A4_RATIO, 0.01);
    });

    it('should only render the visible pages and the next page', () => {
      expect(getRenderedPageNumbers()).to.deep.equal([1, 2]);
    });

    it('should render pages that are scrolled into view', async () => {
      await scrollTo(getContent().scrollHeight);
      expect(getRenderedPageNumbers()).to.include(6);
    });

    it('should release pages that are scrolled far out of view', async () => {
      await scrollTo(getContent().scrollHeight);
      expect(getRenderedPageNumbers()).to.not.include(1);
    });

    it('should render the canvas at the device pixel ratio', () => {
      const page = getPages()[0];
      const canvas = page.querySelector('canvas')!;
      expect(canvas.width).to.be.closeTo(page.offsetWidth * window.devicePixelRatio, 1);
    });
  });

  describe('current page', () => {
    it('should be the first page initially', () => {
      expect(viewer.page).to.equal(1);
    });

    it('should update the page when scrolling', async () => {
      await scrollTo(getContent().scrollHeight);
      expect(viewer.page).to.equal(6);
    });

    it('should fire page-changed event when scrolling to another page', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('page-changed', spy);
      await scrollTo(getPages()[1].offsetTop);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.equal(2);
    });

    it('should scroll to the start of the page when setting page', async () => {
      viewer.page = 4;
      await nextRenderIdle(viewer);
      const padding = parseFloat(getComputedStyle(getContent()).paddingTop);
      expect(getPageTop(4)).to.be.closeTo(padding, 1);
    });

    it('should keep the page when setting the last page that cannot scroll to the top', async () => {
      viewer.page = 6;
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(6);
    });

    it('should not scroll when setting a page out of range', async () => {
      const stub = sinon.stub(console, 'warn');
      try {
        viewer.page = 10;
        await nextFrame();
        expect(getContent().scrollTop).to.equal(0);
        expect(viewer.page).to.equal(10);
        expect(stub).to.be.calledOnce;
      } finally {
        stub.restore();
      }
    });

    it('should reset the page when src changes', async () => {
      await scrollTo(getContent().scrollHeight);
      await loadDocument(viewer, 'links.pdf');
      expect(viewer.page).to.equal(1);
      expect(getContent().scrollTop).to.equal(0);
    });
  });

  describe('page set before loading', () => {
    beforeEach(async () => {
      viewer = fixtureSync('<vaadin-pdf-viewer style="width: 400px; height: 400px"></vaadin-pdf-viewer>');
      viewer.page = 3;
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
    });

    it('should scroll to the page once loaded', () => {
      expect(viewer.page).to.equal(3);
      const padding = parseFloat(getComputedStyle(getContent()).paddingTop);
      expect(getPageTop(3)).to.be.closeTo(padding, 1);
    });
  });

  describe('hidden viewer', () => {
    beforeEach(async () => {
      viewer = fixtureSync('<vaadin-pdf-viewer style="width: 400px; height: 400px" hidden></vaadin-pdf-viewer>');
      viewer.page = 3;
      const idle = nextRenderIdle(viewer);
      viewer.src = fixtureUrl('multi-page.pdf');
      await idle;
    });

    it('should not render pages while hidden', () => {
      expect(getRenderedPageNumbers()).to.be.empty;
    });

    it('should lay out and render pages once shown', async () => {
      const idle = nextRenderIdle(viewer);
      viewer.hidden = false;
      await idle;
      expect(getRenderedPageNumbers()).to.include(3);
      expect(viewer.page).to.equal(3);
    });
  });

  describe('resize', () => {
    it('should fit the pages to the new width with page-width zoom', async () => {
      viewer.style.width = '600px';
      await nextResize(viewer);
      await nextRenderIdle(viewer);
      const page = getPages()[0];
      const padding = parseFloat(getComputedStyle(getContent()).paddingLeft);
      expect(page.offsetWidth).to.be.closeTo(getContent().clientWidth - 2 * padding, 1);
    });
  });
});
