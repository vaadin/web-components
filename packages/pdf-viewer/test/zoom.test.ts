import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { Select } from '@vaadin/select';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, loadDocument, nextRenderIdle } from './helpers.js';

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
  });

  it('should apply a zoom set before the document loads', async () => {
    viewer.zoom = 0.5;
    const idle = nextRenderIdle(viewer);
    viewer.src = fixtureUrl('multi-page.pdf');
    await idle;
    expect(getPages()[0].offsetWidth).to.be.closeTo(A4_WIDTH / 2, 1);
  });

  it('should format the zoom levels in the default language for an invalid lang', async () => {
    const wrapper = fixtureSync(`
      <div lang="en_US">
        <vaadin-pdf-viewer style="width: 400px; height: 400px"></vaadin-pdf-viewer>
      </div>
    `);
    viewer = wrapper.querySelector('vaadin-pdf-viewer')!;
    viewer.zoom = 1.5;
    await nextRender();
    const select = viewer.querySelector<Select>('vaadin-select')!;
    expect(select.value).to.equal('1.5');
    const label = new Intl.NumberFormat(undefined, { style: 'percent' }).format(1.5);
    expect(select.items!.find(({ value }) => value === '1.5')!.label).to.equal(label);
  });

  describe('with document', () => {
    beforeEach(async () => {
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

    it('should fire zoom-changed when zoom changes', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('zoom-changed', spy);
      viewer.zoom = 2;
      await nextRenderIdle(viewer);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.equal(2);
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
          const content = getContent();
          const left = content.getBoundingClientRect().left + content.clientLeft;
          return page.left + page.width / 2 - (left + content.clientWidth / 2);
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

    describe('invalid values', () => {
      let stub: sinon.SinonStub;

      beforeEach(async () => {
        stub = sinon.stub(console, 'warn');
        viewer.zoom = 2;
        await nextRenderIdle(viewer);
      });

      afterEach(() => {
        stub.restore();
      });

      const throwingValue = {
        valueOf() {
          throw new Error('not a number');
        },
        toString() {
          throw new Error('not a string');
        },
      };

      (
        [
          ['an unknown string', 'invalid'],
          ['Infinity', Infinity],
          ['-Infinity', -Infinity],
          ['NaN', NaN],
          ['0', 0],
          ['a negative number', -1],
          ['a string out of range', '1e999'],
          ['an object that throws when converted', throwingValue],
          ['a symbol', Symbol('zoom')],
        ] as Array<[string, unknown]>
      ).forEach(([description, value]) => {
        it(`should show the pages at page-width for ${description}`, async () => {
          const idle = nextRenderIdle(viewer);
          viewer.zoom = value as any;
          await idle;
          const page = getPages()[0];
          expect(page.offsetWidth).to.be.closeTo(getAvailableSize().width, 1);
          expect(page.querySelector('canvas')!.width).to.be.greaterThan(0);
          expect(stub).to.be.calledOnce;
          // The property keeps the value as set
          expect(Object.is(viewer.zoom, value)).to.be.true;
        });
      });
    });
  });
});
