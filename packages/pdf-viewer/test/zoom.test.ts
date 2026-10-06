import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { loadDocument, nextRenderIdle } from './helpers.js';

/** The width of an A4 page at 100% in CSS pixels */
const A4_WIDTH = (595.92 * 96) / 72;

describe('zoom', () => {
  let viewer: PdfViewer;

  function getContent() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  }

  function getPages() {
    return [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[part~="page"]')];
  }

  function getAvailableSize() {
    const content = getContent();
    const style = getComputedStyle(content);
    return {
      width: content.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      height: content.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
    };
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 400px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
    const idle = nextRenderIdle(viewer);
    await loadDocument(viewer, 'multi-page.pdf');
    await idle;
  });

  it('should fit the page width by default', () => {
    expect(viewer.zoom).to.equal('page-width');
    expect(getPages()[0].offsetWidth).to.be.closeTo(getAvailableSize().width, 1);
  });

  it('should fit the whole page with page-fit', async () => {
    viewer.zoom = 'page-fit';
    await nextRenderIdle(viewer);
    expect(getPages()[0].offsetHeight).to.be.closeTo(getAvailableSize().height, 1);
  });

  it('should show pages at their actual size with zoom 1', async () => {
    viewer.zoom = 1;
    await nextRenderIdle(viewer);
    expect(getPages()[0].offsetWidth).to.be.closeTo(A4_WIDTH, 1);
  });

  it('should scale pages with a numeric zoom', async () => {
    viewer.zoom = 0.5;
    await nextRenderIdle(viewer);
    expect(getPages()[0].offsetWidth).to.be.closeTo(A4_WIDTH / 2, 1);
  });

  it('should accept a numeric zoom set as attribute', async () => {
    viewer.setAttribute('zoom', '0.5');
    await nextRenderIdle(viewer);
    expect(viewer.zoom).to.equal(0.5);
    expect(getPages()[0].offsetWidth).to.be.closeTo(A4_WIDTH / 2, 1);
  });

  it('should keep the same part of the current page in view when zooming', async () => {
    viewer.page = 3;
    await nextRenderIdle(viewer);
    const content = getContent();
    // Scroll to the middle of page 3
    const page = getPages()[2];
    content.scrollTop += page.offsetHeight / 2;
    // Let the viewer handle the scroll
    await nextFrame();
    await nextFrame();
    const offset = (content.scrollTop - page.offsetTop) / page.offsetHeight;

    viewer.zoom = 2;
    await nextRenderIdle(viewer);
    expect(viewer.page).to.equal(3);
    expect((content.scrollTop - page.offsetTop) / page.offsetHeight).to.be.closeTo(offset, 0.01);
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      beforeEach(() => {
        viewer.setAttribute('dir', dir);
      });

      function getHorizontalCenterOffset() {
        const page = getPages()[0].getBoundingClientRect();
        const content = getContent().getBoundingClientRect();
        return page.left + page.width / 2 - (content.left + getContent().clientWidth / 2);
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

  it('should re-render visible pages at the new zoom', async () => {
    viewer.zoom = 2;
    await nextRenderIdle(viewer);
    const page = getPages()[0];
    expect(page.querySelector('canvas')!.width).to.be.closeTo(page.offsetWidth * window.devicePixelRatio, 1);
  });

  it('should fall back to page-width for an invalid zoom', async () => {
    const stub = sinon.stub(console, 'warn');
    try {
      viewer.zoom = 2;
      await nextRenderIdle(viewer);
      viewer.zoom = 'invalid' as any;
      await nextRenderIdle(viewer);
      expect(stub).to.be.calledOnce;
      expect(getPages()[0].offsetWidth).to.be.closeTo(getAvailableSize().width, 1);
    } finally {
      stub.restore();
    }
  });
});
