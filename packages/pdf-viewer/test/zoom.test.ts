import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, getContentBoxSize, getViewCenter, loadAndRender, nextRenderIdle } from './helpers.js';

/** The width of an A4 page at 100% in CSS pixels */
const A4_WIDTH = (595.92 * 96) / 72;

describe('zoom', () => {
  let viewer: PdfViewer;
  let content: HTMLElement;

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 400px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  });

  it('should apply a zoom set before the document loads', async () => {
    viewer.zoom = 0.5;
    await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    const page = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="page"]')!;
    expect(page.offsetWidth).to.be.closeTo(A4_WIDTH / 2, 1);
  });

  describe('with document', () => {
    let pages: HTMLElement[];

    beforeEach(async () => {
      await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
      pages = [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[part~="page"]')];
    });

    it('should fit the page width by default', () => {
      expect(viewer.zoom).to.equal('page-width');
      expect(pages[0].offsetWidth).to.be.closeTo(getContentBoxSize(content).width, 1);
    });

    it('should fit the whole page with page-fit', async () => {
      viewer.zoom = 'page-fit';
      await nextRenderIdle(viewer);
      expect(pages[0].offsetHeight).to.be.closeTo(getContentBoxSize(content).height, 1);
    });

    it('should show pages at their actual size with zoom 1', async () => {
      viewer.zoom = 1;
      await nextRenderIdle(viewer);
      expect(pages[0].offsetWidth).to.be.closeTo(A4_WIDTH, 1);
    });

    it('should scale pages with a numeric zoom', async () => {
      viewer.zoom = 0.5;
      await nextRenderIdle(viewer);
      expect(pages[0].offsetWidth).to.be.closeTo(A4_WIDTH / 2, 1);
    });

    it('should accept a numeric zoom set as attribute', async () => {
      viewer.setAttribute('zoom', '0.5');
      await nextRenderIdle(viewer);
      expect(viewer.zoom).to.equal(0.5);
      expect(pages[0].offsetWidth).to.be.closeTo(A4_WIDTH / 2, 1);
    });

    it('should fire zoom-changed when zoom changes', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('zoom-changed', spy);
      viewer.zoom = 2;
      await nextRenderIdle(viewer);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.equal(2);
    });

    it('should keep the same part of the current page in view when zooming', async () => {
      // How far the top of the view is down the page, relative to the page height
      const getScrollRatio = (page: HTMLElement) => (content.scrollTop - page.offsetTop) / page.offsetHeight;

      viewer.page = 3;
      await nextRenderIdle(viewer);
      // Scroll to the middle of page 3
      content.scrollTop += pages[2].offsetHeight / 2;
      // Let the viewer handle the scroll
      await nextFrame();
      await nextFrame();
      const ratio = getScrollRatio(pages[2]);

      viewer.zoom = 2;
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(3);
      expect(getScrollRatio(pages[2])).to.be.closeTo(ratio, 0.01);
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(dir, () => {
        beforeEach(() => {
          viewer.setAttribute('dir', dir);
        });

        function getHorizontalCenterOffset() {
          const page = pages[0].getBoundingClientRect();
          return page.left + page.width / 2 - getViewCenter(content);
        }

        it('should keep the page centered when zooming in', async () => {
          viewer.zoom = 2;
          await nextRenderIdle(viewer);
          expect(getHorizontalCenterOffset()).to.be.closeTo(0, 1);
        });

        it('should show the whole page when zooming back to page-width', async () => {
          viewer.zoom = 2;
          await nextRenderIdle(viewer);
          viewer.zoom = 'page-width';
          await nextRenderIdle(viewer);
          expect(getHorizontalCenterOffset()).to.be.closeTo(0, 1);
        });
      });
    });

    it('should render the visible pages again at the new zoom', async () => {
      viewer.zoom = 2;
      await nextRenderIdle(viewer);
      const page = pages[0];
      expect(page.querySelector('canvas')!.width).to.be.closeTo(page.offsetWidth * window.devicePixelRatio, 1);
    });

    describe('invalid values', () => {
      let warnStub: sinon.SinonStub;

      beforeEach(async () => {
        warnStub = sinon.stub(console, 'warn');
        viewer.zoom = 2;
        await nextRenderIdle(viewer);
      });

      afterEach(() => {
        warnStub.restore();
      });

      (
        [
          ['an unknown string', 'invalid'],
          ['0', 0],
          ['a negative number', -1],
          ['a symbol', Symbol('zoom')],
        ] as Array<[string, unknown]>
      ).forEach(([description, value]) => {
        it(`should show the pages at page-width for ${description}`, async () => {
          viewer.zoom = value as any;
          await nextRenderIdle(viewer);
          const page = pages[0];
          expect(page.offsetWidth).to.be.closeTo(getContentBoxSize(content).width, 1);
          expect(page.querySelector('canvas')!.width).to.be.greaterThan(0);
          expect(warnStub).to.be.calledOnce;
          // The property keeps the value as set
          expect(Object.is(viewer.zoom, value)).to.be.true;
        });
      });
    });
  });
});
