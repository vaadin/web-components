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

  function getPaddingTop() {
    return parseFloat(getComputedStyle(getContent()).paddingTop);
  }

  async function scrollTo(scrollTop: number) {
    getContent().scrollTop = scrollTop;
    // Scrolling in these tests always brings a page into view that still needs rendering
    await nextRenderIdle(viewer);
  }

  async function createViewer(attributes = '') {
    viewer = fixtureSync(`<vaadin-pdf-viewer style="width: 400px; height: 400px" ${attributes}></vaadin-pdf-viewer>`);
    await nextRender();
  }

  async function loadAndRender() {
    const idle = nextRenderIdle(viewer);
    await loadDocument(viewer, 'multi-page.pdf');
    await idle;
  }

  describe('loaded', () => {
    beforeEach(async () => {
      await createViewer();
      await loadAndRender();
    });

    describe('layout', () => {
      it('should create a placeholder for every page', () => {
        expect(getPages()).to.have.lengthOf(6);
      });

      it('should size the placeholders to the page sizes', async () => {
        // Pages after the first get their own size while they load
        await scrollTo(getContent().scrollHeight);
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

      it('should fire page-changed event once per page when scrolling', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('page-changed', spy);
        await scrollTo(getPages()[1].offsetTop);
        await scrollTo(getPages()[2].offsetTop);
        expect(spy).to.be.calledTwice;
        expect(spy.firstCall.args[0].detail.value).to.equal(2);
        expect(spy.secondCall.args[0].detail.value).to.equal(3);
      });

      it('should scroll to the start of the page when setting page', async () => {
        viewer.page = 4;
        await nextRenderIdle(viewer);
        expect(getPageTop(4)).to.be.closeTo(getPaddingTop(), 1);
      });

      it('should keep the page when setting the last page that cannot scroll to the top', async () => {
        viewer.page = 6;
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(6);
      });

      it('should follow the most visible page again after scrolling from a set page', async () => {
        viewer.page = 4;
        await nextRenderIdle(viewer);
        // Scroll until only a small part of page 4 is visible
        await scrollTo(getPages()[4].offsetTop - 30);
        expect(viewer.page).to.equal(5);
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

    describe('hide and show', () => {
      beforeEach(async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
      });

      it('should keep the page while hidden', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('page-changed', spy);
        viewer.hidden = true;
        await nextResize(viewer);
        expect(viewer.page).to.equal(3);
        expect(spy).to.be.not.called;
      });

      it('should show the same page when shown again', async () => {
        viewer.hidden = true;
        await nextResize(viewer);
        viewer.hidden = false;
        await nextResize(viewer);
        expect(viewer.page).to.equal(3);
        expect(getPageTop(3)).to.be.closeTo(getPaddingTop(), 1);
      });

      it('should scroll to a page set while hidden when shown again', async () => {
        viewer.hidden = true;
        await nextResize(viewer);
        viewer.page = 2;
        await nextFrame();
        viewer.hidden = false;
        await nextResize(viewer);
        expect(viewer.page).to.equal(2);
        expect(getPageTop(2)).to.be.closeTo(getPaddingTop(), 1);
      });
    });

    describe('resize', () => {
      it('should fit the pages to the new width with page-width zoom', async () => {
        viewer.style.width = '600px';
        await nextResize(viewer);
        const page = getPages()[0];
        const padding = parseFloat(getComputedStyle(getContent()).paddingLeft);
        expect(page.offsetWidth).to.be.closeTo(getContent().clientWidth - 2 * padding, 1);
      });
    });
  });

  describe('page set before loading', () => {
    beforeEach(async () => {
      await createViewer();
    });

    it('should scroll to the page once loaded', async () => {
      viewer.page = 3;
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
      expect(viewer.page).to.equal(3);
      expect(getPageTop(3)).to.be.closeTo(getPaddingTop(), 1);
    });

    it('should render the first pages for a page out of range', async () => {
      const stub = sinon.stub(console, 'warn');
      try {
        viewer.page = 10;
        viewer.src = fixtureUrl('multi-page.pdf');
        await nextRenderIdle(viewer);
        expect(getRenderedPageNumbers()).to.include(1);
        expect(viewer.page).to.equal(10);
      } finally {
        stub.restore();
      }
    });
  });

  describe('hidden before page sizes are known', () => {
    beforeEach(async () => {
      await createViewer();
      viewer.page = 6;
      viewer.src = fixtureUrl('multi-page.pdf');
      await oneEvent(viewer, 'document-load');
      // Hide before the size of the landscape page 6 is applied
      viewer.hidden = true;
      await nextResize(viewer);
      await nextFrame();
    });

    it('should show the set page when shown again', async () => {
      viewer.hidden = false;
      await nextResize(viewer);
      await nextFrame();
      expect(viewer.page).to.equal(6);
      const pageRect = getPages()[5].getBoundingClientRect();
      const contentRect = getContent().getBoundingClientRect();
      expect(pageRect.bottom).to.be.greaterThan(contentRect.top);
      expect(pageRect.top).to.be.lessThan(contentRect.bottom);
    });
  });

  describe('hidden viewer', () => {
    beforeEach(async () => {
      await createViewer('hidden');
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
});
