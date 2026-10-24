import { expect } from '@vaadin/chai-plugins';
import { dispatchTouch, setTouchEmulation } from '@vaadin/test-runner-commands';
import { fixtureSync, isChrome, nextFrame, nextRender, TOUCH_DEVICE } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { Select } from '@vaadin/select';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, loadDocument, nextRenderIdle, startPrint } from './helpers.js';

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

    describe('pinch', () => {
      /** A touch point as [x, y], and optionally the element it touches, which is the first page by default. */
      type Point = [number, number, Element?];

      function getPagesElement() {
        return viewer.shadowRoot!.querySelector<HTMLElement>('#pages')!;
      }

      /** The zoom factor that the pages are shown at. */
      function getZoomFactor() {
        return getPages()[0].getBoundingClientRect().width / A4_WIDTH;
      }

      /**
       * Dispatches a touch event on the target with the touches that are down after it, by id.
       * Browsers that cannot create touch events get an event with the same properties.
       */
      function touch(type: string, points: Record<number, Point>, target: Element = getPages()[0]) {
        const touches = Object.entries(points).map(([id, [x, y, element]]) => {
          const init = { identifier: Number(id), target: element ?? getPages()[0], clientX: x, clientY: y };
          return TOUCH_DEVICE ? new Touch(init) : init;
        });
        const init = { bubbles: true, composed: true, cancelable: true };
        const event = TOUCH_DEVICE
          ? new TouchEvent(type, { ...init, touches: touches as Touch[] })
          : Object.assign(new CustomEvent(type, init), { touches });
        target.dispatchEvent(event);
      }

      /** Pinches around the given point, from the given distance between the fingers to another. */
      async function pinch(x: number, y: number, from: number, to: number) {
        const idle = nextRenderIdle(viewer);
        touch('touchstart', { 1: [x - from / 2, y] });
        touch('touchstart', { 1: [x - from / 2, y], 2: [x + from / 2, y] });
        touch('touchmove', { 1: [x - to / 2, y], 2: [x + to / 2, y] });
        touch('touchend', { 2: [x + to / 2, y] });
        touch('touchend', {});
        await idle;
      }

      function getCenter(): [number, number] {
        const rect = getContent().getBoundingClientRect();
        return [rect.left + rect.width / 2, rect.top + 100];
      }

      function getTextSpan() {
        return [...getPages()[0].querySelectorAll('.text-layer span')].find((element) =>
          element.textContent!.startsWith('The quick'),
        )!;
      }

      it('should zoom by the change of the distance between the fingers', async () => {
        const zoomFactor = getZoomFactor();
        await pinch(...getCenter(), 100, 150);
        expect(viewer.zoom).to.be.closeTo(zoomFactor * 1.5, 0.01);
        expect(getZoomFactor()).to.be.closeTo(viewer.zoom as number, 0.001);
      });

      it('should fire one zoom-changed event for a pinch', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('zoom-changed', spy);
        const [x, y] = getCenter();
        const idle = nextRenderIdle(viewer);
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        [60, 70, 80].forEach((distance) => {
          touch('touchmove', { 1: [x - distance, y], 2: [x + distance, y] });
        });
        touch('touchend', {});
        await idle;
        expect(spy).to.be.calledOnce;
        expect(spy.firstCall.args[0].detail.value).to.equal(viewer.zoom);
      });

      it('should keep the point between the fingers in place', async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        const before = getTextSpan().getBoundingClientRect();
        const x = before.left + 20;
        const y = before.top + before.height / 2;
        await pinch(x, y, 100, 200);
        expect(viewer.zoom).to.equal(2);
        const after = getTextSpan().getBoundingClientRect();
        // The point was 20px from the start of the text, which is twice as far now
        expect(after.left + 40).to.be.closeTo(x, 2);
        expect(after.top + after.height / 2).to.be.closeTo(y, 2);
      });

      it('should keep the point between the fingers in place while pinching', async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        const before = getTextSpan().getBoundingClientRect();
        const [x, y] = [before.left + 20, before.top + before.height / 2];
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        touch('touchmove', { 1: [x - 100, y], 2: [x + 100, y] });
        const preview = getTextSpan().getBoundingClientRect();
        expect(preview.left + 40).to.be.closeTo(x, 2);
        expect(preview.top + preview.height / 2).to.be.closeTo(y, 2);
        touch('touchcancel', {});
      });

      it('should keep the point between the fingers when they move together', async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        const before = getTextSpan().getBoundingClientRect();
        const [x, y] = [before.left + 20, before.top + before.height / 2];
        const idle = nextRenderIdle(viewer);
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        // Spread to twice the distance, and move 30px down
        touch('touchmove', { 1: [x - 100, y + 30], 2: [x + 100, y + 30] });
        touch('touchend', {});
        await idle;
        const after = getTextSpan().getBoundingClientRect();
        expect(after.left + 40).to.be.closeTo(x, 2);
        expect(after.top + after.height / 2).to.be.closeTo(y + 30, 2);
      });

      it('should keep the current page in view when the zoom changes after a pinch', async () => {
        await pinch(...getCenter(), 100, 200);
        const content = getContent();
        const page = getPages()[0];
        const offset = (content.scrollTop - page.offsetTop) / page.offsetHeight;
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        expect((content.scrollTop - page.offsetTop) / page.offsetHeight).to.be.closeTo(offset, 0.01);
      });

      it('should not zoom in further than the largest zoom level', async () => {
        await pinch(...getCenter(), 10, 300);
        expect(viewer.zoom).to.equal(4);
      });

      it('should not zoom out further than the smallest zoom level', async () => {
        await pinch(...getCenter(), 300, 10);
        expect(viewer.zoom).to.equal(0.25);
      });

      it('should preview the zoom while pinching, and not change the zoom when cancelled', async () => {
        const [x, y] = getCenter();
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        touch('touchmove', { 1: [x - 50, y], 2: [x + 100, y] });
        expect(getPagesElement().style.transform).to.contain('scale(1.5)');
        touch('touchcancel', {});
        await nextFrame();
        expect(getPagesElement().style.transform).to.equal('');
        expect(viewer.zoom).to.equal('page-width');
      });

      it('should end the pinch when one of its fingers is lifted, also with a third finger down', async () => {
        const zoomFactor = getZoomFactor();
        const [x, y] = getCenter();
        const idle = nextRenderIdle(viewer);
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y], 3: [x + 200, y] });
        touch('touchmove', { 1: [x - 100, y], 2: [x + 100, y], 3: [x + 200, y] });
        touch('touchend', { 2: [x + 100, y], 3: [x + 200, y] });
        // The remaining fingers don't start another pinch from a wrong distance
        touch('touchmove', { 2: [x + 300, y], 3: [x + 200, y] });
        touch('touchend', {});
        await idle;
        expect(viewer.zoom).to.be.closeTo(zoomFactor * 2, 0.01);
      });

      it('should keep pinching when a third finger is lifted', async () => {
        const zoomFactor = getZoomFactor();
        const [x, y] = getCenter();
        const idle = nextRenderIdle(viewer);
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y], 3: [x + 200, y] });
        touch('touchmove', { 1: [x - 100, y], 2: [x + 100, y], 3: [x + 200, y] });
        touch('touchend', { 1: [x - 100, y], 2: [x + 100, y] });
        touch('touchmove', { 1: [x - 150, y], 2: [x + 150, y] });
        touch('touchend', {});
        await idle;
        expect(viewer.zoom).to.be.closeTo(zoomFactor * 3, 0.01);
      });

      it('should start a new pinch when the end of the previous one was missed', async () => {
        const zoomFactor = getZoomFactor();
        const [x, y] = getCenter();
        const idle = nextRenderIdle(viewer);
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        touch('touchmove', { 1: [x - 100, y], 2: [x + 100, y] });
        touch('touchstart', { 3: [x - 50, y], 4: [x + 50, y] });
        touch('touchmove', { 3: [x - 75, y], 4: [x + 75, y] });
        touch('touchend', {});
        await idle;
        expect(viewer.zoom).to.be.closeTo(zoomFactor * 1.5, 0.01);
      });

      it('should clear the preview when the zoom does not change', async () => {
        const [x, y] = getCenter();
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        touch('touchmove', { 1: [x - 50, y], 2: [x + 50.2, y] });
        touch('touchend', {});
        await nextFrame();
        expect(getPagesElement().style.transform).to.equal('');
        expect(viewer.zoom).to.equal('page-width');
      });

      it('should scroll by as much as the fingers moved when the zoom does not change', async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        const content = getContent();
        const scrollTop = content.scrollTop;
        const [x, y] = getCenter();
        touch('touchstart', { 1: [x - 50, y + 50], 2: [x + 50, y + 50] });
        touch('touchmove', { 1: [x - 50, y], 2: [x + 50, y] });
        touch('touchend', {});
        expect(content.scrollTop).to.equal(scrollTop + 50);
        expect(viewer.zoom).to.equal(1);
      });

      it('should clear the preview when the viewer is detached while pinching', async () => {
        const [x, y] = getCenter();
        touch('touchstart', { 1: [x - 50, y], 2: [x + 50, y] });
        touch('touchmove', { 1: [x - 100, y], 2: [x + 100, y] });
        const parent = viewer.parentElement!;
        viewer.remove();
        parent.appendChild(viewer);
        await nextFrame();
        expect(getPagesElement().style.transform).to.equal('');
        touch('touchend', {});
        await nextFrame();
        expect(viewer.zoom).to.equal('page-width');
      });

      it('should not zoom with one finger', async () => {
        const [x, y] = getCenter();
        touch('touchstart', { 1: [x, y] });
        touch('touchmove', { 1: [x + 100, y] });
        touch('touchend', {});
        await nextFrame();
        expect(viewer.zoom).to.equal('page-width');
      });

      it('should not start a pinch without a document', async () => {
        viewer.src = null;
        await nextFrame();
        const [x, y] = getCenter();
        touch('touchstart', { 1: [x - 50, y, getContent()], 2: [x + 50, y, getContent()] }, getContent());
        touch('touchmove', { 1: [x - 100, y, getContent()], 2: [x + 100, y, getContent()] }, getContent());
        touch('touchend', {}, getContent());
        await nextFrame();
        expect(getPagesElement().style.transform).to.equal('');
        expect(viewer.zoom).to.equal('page-width');
      });

      it('should not zoom with a finger on the print progress', async () => {
        const release = await startPrint(viewer);
        try {
          const progress = viewer.shadowRoot!.querySelector('[part="print-progress"]')!;
          const rect = progress.getBoundingClientRect();
          const [x, y] = [rect.left + rect.width / 2, rect.top + rect.height / 2];
          touch('touchstart', { 1: [x, y, progress] }, progress);
          touch('touchstart', { 1: [x, y, progress], 2: [x, y + 100] });
          touch('touchmove', { 1: [x, y - 100, progress], 2: [x, y + 200] });
          touch('touchend', { 1: [x, y - 100, progress] });
          touch('touchend', {}, progress);
          await nextFrame();
          expect(getPagesElement().style.transform).to.equal('');
          expect(viewer.zoom).to.equal('page-width');
        } finally {
          release();
        }
      });

      it('should let the browser pan but not zoom the pages area with touch', () => {
        expect(getComputedStyle(getContent()).touchAction).to.equal('pan-x pan-y');
      });

      // Only Chromium can send real touch input in the tests.
      (isChrome ? describe : describe.skip)('real touch input', () => {
        beforeEach(async () => {
          await setTouchEmulation(true);
        });

        afterEach(async () => {
          await setTouchEmulation(false);
        });

        it('should zoom when the first finger scrolled before the second one touched the pages', async () => {
          const zoomFactor = getZoomFactor();
          const [x, y] = getCenter();
          const idle = nextRenderIdle(viewer);
          await dispatchTouch('touchStart', [{ x, y: y + 100, id: 0 }]);
          // Far enough for the browser to start scrolling
          for (let step = 1; step <= 5; step++) {
            await dispatchTouch('touchMove', [{ x, y: y + 100 - step * 10, id: 0 }]);
          }
          await dispatchTouch('touchStart', [
            { x, y: y + 50, id: 0 },
            { x: x + 50, y: y + 50, id: 1 },
          ]);
          for (let step = 1; step <= 5; step++) {
            await dispatchTouch('touchMove', [
              { x: x - step * 10, y: y + 50, id: 0 },
              { x: x + 50 + step * 10, y: y + 50, id: 1 },
            ]);
          }
          await dispatchTouch('touchEnd', []);
          await idle;
          // From 50px to 150px between the fingers
          expect(viewer.zoom).to.be.closeTo(zoomFactor * 3, 0.05);
        });

        it('should not zoom with a finger on the print progress', async () => {
          const release = await startPrint(viewer);
          try {
            const rect = viewer.shadowRoot!.querySelector('[part="print-progress"]')!.getBoundingClientRect();
            const [x, y] = [Math.round(rect.left + rect.width / 2), Math.round(rect.top + 10)];
            await dispatchTouch('touchStart', [{ x, y, id: 0 }]);
            await dispatchTouch('touchStart', [
              { x, y, id: 0 },
              { x, y: y + 150, id: 1 },
            ]);
            for (let step = 1; step <= 5; step++) {
              await dispatchTouch('touchMove', [
                { x, y, id: 0 },
                { x, y: y + 150 + step * 20, id: 1 },
              ]);
            }
            await dispatchTouch('touchEnd', []);
            await nextFrame();
            expect(getPagesElement().style.transform).to.equal('');
            expect(viewer.zoom).to.equal('page-width');
          } finally {
            release();
          }
        });
      });
    });
  });
});
