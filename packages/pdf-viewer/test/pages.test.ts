import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, createPdfUrl, fixtureUrl, loadDocument, nextRenderIdle } from './helpers.js';

const A4_RATIO = 842.88 / 595.92;

describe('pages', () => {
  let viewer: PdfViewer;
  let content: HTMLElement;
  // A live collection, which follows the pages of the loaded document
  let pages: HTMLCollectionOf<HTMLElement>;

  function getRenderedPageNumbers() {
    return [...pages].map((page, index) => (page.querySelector('canvas') ? index + 1 : 0)).filter(Boolean);
  }

  function getCanvasPixels() {
    return [...viewer.shadowRoot!.querySelectorAll('canvas')].reduce(
      (sum, canvas) => sum + canvas.width * canvas.height,
      0,
    );
  }

  function getPageTop(pageNumber: number) {
    return pages[pageNumber - 1].getBoundingClientRect().top - content.getBoundingClientRect().top;
  }

  function getPaddingTop() {
    return parseFloat(getComputedStyle(content).paddingTop);
  }

  async function scrollTo(scrollTop: number) {
    content.scrollTop = scrollTop;
    // Scrolling in these tests always brings a page into view that still needs rendering
    await nextRenderIdle(viewer);
  }

  afterEach(() => {
    sinon.restore();
  });

  async function createViewer(attributes = '', style = 'width: 400px; height: 400px') {
    viewer = fixtureSync(`<vaadin-pdf-viewer style="${style}" ${attributes}></vaadin-pdf-viewer>`);
    await nextRender();
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
    pages = viewer.shadowRoot!.querySelector('#pages')!.children as HTMLCollectionOf<HTMLElement>;
  }

  async function loadAndRender(src = fixtureUrl('multi-page.pdf')) {
    const idle = nextRenderIdle(viewer);
    const loaded = oneEvent(viewer, 'document-load');
    viewer.src = src;
    await loaded;
    await idle;
  }

  describe('loaded', () => {
    beforeEach(async () => {
      await createViewer();
      await loadAndRender();
    });

    describe('layout', () => {
      it('should create a placeholder for every page', () => {
        expect(pages).to.have.lengthOf(6);
      });

      it('should size the placeholders to the page sizes', async () => {
        // Pages after the first get their own size while they load
        await scrollTo(content.scrollHeight);
        const [first, , , , , last] = [...pages].map((page) => page.getBoundingClientRect());
        expect(first.height / first.width).to.be.closeTo(A4_RATIO, 0.01);
        expect(last.width / last.height).to.be.closeTo(A4_RATIO, 0.01);
      });

      it('should fit the width of the first page to the content', () => {
        const padding = parseFloat(getComputedStyle(content).paddingLeft);
        expect(pages[0].offsetWidth).to.be.closeTo(content.clientWidth - 2 * padding, 1);
      });

      it('should only render the visible pages and the next page', () => {
        expect(getRenderedPageNumbers()).to.deep.equal([1, 2]);
      });

      it('should render pages that are scrolled into view', async () => {
        await scrollTo(content.scrollHeight);
        expect(getRenderedPageNumbers()).to.include(6);
      });

      it('should release pages that are scrolled far out of view', async () => {
        await scrollTo(content.scrollHeight);
        expect(getRenderedPageNumbers()).to.not.include(1);
      });

      it('should free the canvas of a released page', async () => {
        const canvas = pages[0].querySelector('canvas')!;
        await scrollTo(content.scrollHeight);
        expect(canvas.isConnected).to.be.false;
        expect(canvas.width).to.equal(0);
        expect(canvas.height).to.equal(0);
      });

      it('should render the canvas at the device pixel ratio', () => {
        const page = pages[0];
        const canvas = page.querySelector('canvas')!;
        expect(canvas.width).to.be.closeTo(page.offsetWidth * window.devicePixelRatio, 1);
      });

      it('should hide the canvas from assistive technology', () => {
        expect(pages[0].querySelector('canvas')!.getAttribute('aria-hidden')).to.equal('true');
      });
    });

    describe('current page', () => {
      it('should be the first page initially', () => {
        expect(viewer.page).to.equal(1);
      });

      it('should update the page when scrolling', async () => {
        await scrollTo(content.scrollHeight);
        expect(viewer.page).to.equal(6);
      });

      it('should fire page-changed event once per page when scrolling', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('page-changed', spy);
        await scrollTo(pages[1].offsetTop);
        await scrollTo(pages[2].offsetTop);
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
        await scrollTo(pages[4].offsetTop - 30);
        expect(viewer.page).to.equal(5);
      });

      it('should not scroll when setting a page out of range', async () => {
        clearWarnings();
        const stub = sinon.stub(console, 'warn');
        viewer.page = 10;
        await nextFrame();
        expect(content.scrollTop).to.equal(0);
        expect(viewer.page).to.equal(10);
        expect(stub).to.be.calledOnce;
      });

      [0, 2.5, NaN].forEach((value) => {
        it(`should warn and keep the value when setting page to ${value}`, async () => {
          clearWarnings();
          const stub = sinon.stub(console, 'warn');
          viewer.page = value;
          await nextFrame();
          expect(content.scrollTop).to.equal(0);
          expect(Object.is(viewer.page, value)).to.be.true;
          expect(stub).to.be.calledOnce;
          expect(stub.firstCall.args[0]).to.include(`The page ${value} is out of range`);
        });
      });

      it('should reset the page when src changes', async () => {
        await scrollTo(content.scrollHeight);
        await loadDocument(viewer, 'links.pdf');
        expect(viewer.page).to.equal(1);
        expect(content.scrollTop).to.equal(0);
      });

      it('should keep a page set together with src', async () => {
        viewer.page = 2;
        viewer.src = fixtureUrl('links.pdf');
        await oneEvent(viewer, 'document-load');
        expect(viewer.page).to.equal(2);
        expect(getPageTop(2)).to.be.closeTo(getPaddingTop(), 1);
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

      it('should restore the scroll position when shown again', async () => {
        const scrollTop = pages[2].offsetTop + 50;
        const scrolled = oneEvent(content, 'scroll');
        content.scrollTop = scrollTop;
        await scrolled;
        await nextFrame();
        viewer.hidden = true;
        await nextResize(viewer);
        viewer.hidden = false;
        await nextResize(viewer);
        expect(content.scrollTop).to.be.closeTo(scrollTop, 1);
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
      it('should fit the pages to the new width', async () => {
        viewer.style.width = '600px';
        await nextResize(viewer);
        const page = pages[0];
        const padding = parseFloat(getComputedStyle(content).paddingLeft);
        expect(page.offsetWidth).to.be.closeTo(content.clientWidth - 2 * padding, 1);
      });

      it('should keep the current page in view', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        viewer.style.width = '600px';
        await nextResize(viewer);
        await nextFrame();
        expect(viewer.page).to.equal(3);
        // The point at the top of the view keeps its place relative to the page size
        expect(getPageTop(3)).to.be.within(getPaddingTop(), 2 * getPaddingTop());
      });

      it('should center a page narrower than the view after a resize', async () => {
        // Page 6 is landscape, so the pages can scroll sideways while page 1 fits the view
        content.scrollLeft = 40;
        await nextFrame();
        viewer.style.width = '600px';
        await nextResize(viewer);
        await nextFrame();
        const contentRect = content.getBoundingClientRect();
        const pageRect = pages[0].getBoundingClientRect();
        const viewCenter = contentRect.left + content.clientLeft + content.clientWidth / 2;
        expect((pageRect.left + pageRect.right) / 2).to.be.closeTo(viewCenter, 2);
      });

      it('should render the visible pages again at the new size', async () => {
        const idle = nextRenderIdle(viewer);
        viewer.style.width = '600px';
        await idle;
        const page = pages[0];
        expect(page.querySelector('canvas')!.width).to.be.closeTo(page.offsetWidth * window.devicePixelRatio, 1);
      });

      it('should not warn when a resize cancels rendering', async () => {
        const stub = sinon.stub(console, 'warn');
        viewer.src = fixtureUrl('links.pdf');
        await oneEvent(viewer, 'document-load');
        // Rendering of the first page is in progress
        expect(pages[0].querySelector('canvas')).to.be.null;
        const idle = nextRenderIdle(viewer);
        viewer.style.width = '600px';
        await idle;
        expect(stub).to.be.not.called;
      });
    });
  });

  describe('render order', () => {
    let rendered: number[];
    let observer: MutationObserver;

    beforeEach(async () => {
      await createViewer();
      await loadAndRender(createPdfUrl(20));
      rendered = [];
      observer = new MutationObserver((records) => {
        records.forEach((record) => {
          record.addedNodes.forEach((node) => {
            if (node instanceof HTMLCanvasElement) {
              rendered.push([...pages].indexOf(node.parentElement!) + 1);
            }
          });
        });
      });
      observer.observe(viewer.shadowRoot!, { childList: true, subtree: true });
    });

    afterEach(() => {
      observer.disconnect();
    });

    it('should render the most visible page first, then the other visible pages, then one page ahead on each side', async () => {
      // The end of page 9 and most of page 10 are visible
      await scrollTo(pages[9].offsetTop - 100);
      expect(rendered).to.deep.equal([10, 9, 11, 8]);
    });
  });

  describe('rotation', () => {
    beforeEach(async () => {
      await createViewer();
      await loadAndRender(fixtureUrl('rotated.pdf'));
    });

    it('should show a page with rotation in landscape', () => {
      const { width, height } = pages[0].getBoundingClientRect();
      expect(width / height).to.be.closeTo(A4_RATIO, 0.01);
    });
  });

  describe('memory', () => {
    beforeEach(async () => {
      // Pages so wide that each canvas has the most pixels a canvas may have
      await createViewer('', 'width: 4000px; height: 400px');
      await loadAndRender(createPdfUrl(200));
    });

    it('should keep the canvas pixels within the budget while scrolling', async () => {
      const budget = 3 * 2 ** 24;
      let max = getCanvasPixels();
      const observer = new MutationObserver(() => {
        max = Math.max(max, getCanvasPixels());
      });
      observer.observe(viewer.shadowRoot!, { childList: true, subtree: true });
      try {
        // Two pages are visible at each position
        for (const page of [3, 50, 53, 120, 200]) {
          await scrollTo(pages[page - 1].offsetTop - 200);
          max = Math.max(max, getCanvasPixels());
        }
      } finally {
        observer.disconnect();
      }
      expect(max).to.be.above(2 * 2 ** 24);
      expect(max).to.be.at.most(budget);
    });
  });

  describe('device pixel ratio', () => {
    let query: EventTarget;
    let matchMediaStub: sinon.SinonStub;
    let pixelRatio: PropertyDescriptor | undefined;

    beforeEach(async () => {
      pixelRatio = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
      query = new EventTarget();
      const matchMedia = window.matchMedia.bind(window);
      matchMediaStub = sinon
        .stub(window, 'matchMedia')
        .callsFake((media: string) =>
          media.startsWith('(resolution') ? (query as MediaQueryList) : matchMedia(media),
        );
      await createViewer();
      await loadAndRender();
    });

    afterEach(() => {
      matchMediaStub.restore();
      if (pixelRatio) {
        Object.defineProperty(window, 'devicePixelRatio', pixelRatio);
      } else {
        delete (window as any).devicePixelRatio;
      }
    });

    it('should render the visible pages again when the device pixel ratio changes', async () => {
      Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
      const idle = nextRenderIdle(viewer);
      query.dispatchEvent(new Event('change'));
      await idle;
      const page = pages[0];
      expect(page.querySelector('canvas')!.width).to.be.closeTo(page.offsetWidth * 2, 1);
    });

    it('should keep the previous canvas until the new one is rendered', async () => {
      const page = pages[0];
      const canvas = page.querySelector('canvas')!;
      Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
      const idle = nextRenderIdle(viewer);
      query.dispatchEvent(new Event('change'));
      expect(page.querySelector('canvas')).to.equal(canvas);
      await idle;
      expect(page.querySelectorAll('canvas')).to.have.lengthOf(1);
      expect(page.querySelector('canvas')).to.not.equal(canvas);
      expect(canvas.width).to.equal(0);
    });
  });

  describe('render errors', () => {
    let getContextStub: sinon.SinonStub;
    let warnStub: sinon.SinonStub;

    beforeEach(async () => {
      await createViewer();
      const getContext = HTMLCanvasElement.prototype.getContext;
      // The canvas of a page gets an opaque context, the context of a page fails to be created
      getContextStub = sinon.stub(HTMLCanvasElement.prototype, 'getContext').callsFake(function (
        this: HTMLCanvasElement,
        type: string,
        options?: { alpha?: boolean },
      ) {
        return options && options.alpha === false ? null : getContext.call(this, type, options);
      });
      warnStub = sinon.stub(console, 'warn');
    });

    afterEach(() => {
      getContextStub.restore();
      warnStub.restore();
    });

    it('should log a warning for a page that fails to render', async () => {
      await loadAndRender(createPdfUrl(1));
      expect(warnStub).to.be.calledOnce;
      expect(warnStub.firstCall.args[0]).to.include('Failed to render page 1');
      expect(getRenderedPageNumbers()).to.be.empty;
    });

    it('should free the canvas of a page that fails to render', async () => {
      await loadAndRender(createPdfUrl(1));
      const index = getContextStub.returnValues.indexOf(null);
      const canvas: HTMLCanvasElement = getContextStub.thisValues[index];
      expect(canvas.width).to.equal(0);
      expect(canvas.height).to.equal(0);
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
      clearWarnings();
      const stub = sinon.stub(console, 'warn');
      viewer.page = 10;
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextRenderIdle(viewer);
      expect(getRenderedPageNumbers()).to.include(1);
      expect(viewer.page).to.equal(10);
      expect(stub).to.be.calledOnce;
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
      const pageRect = pages[5].getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
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

  describe('rtl', () => {
    beforeEach(async () => {
      await createViewer('dir="rtl"');
      await loadAndRender();
    });

    it('should keep the pages left to right', () => {
      expect(getComputedStyle(pages[0]).direction).to.equal('ltr');
    });

    it('should keep the horizontal position of a wide page on resize', async () => {
      // Page 6 is landscape and wider than the view
      viewer.page = 6;
      await nextRenderIdle(viewer);
      content.scrollLeft = -40;
      await nextFrame();
      const ratioAt = () => {
        const contentRect = content.getBoundingClientRect();
        const pageRect = pages[5].getBoundingClientRect();
        const viewCenter = contentRect.left + content.clientLeft + content.clientWidth / 2;
        return (viewCenter - pageRect.left) / pageRect.width;
      };
      const ratio = ratioAt();
      const { clientWidth } = content;
      const pageWidth = pages[5].getBoundingClientRect().width;
      // A small resize, so that the page stays wider than the view before the pages are scaled
      viewer.style.width = '450px';
      await nextResize(viewer);
      await nextFrame();
      // The content grows to the left before the pages are scaled, which moves
      // the view center on the page. The viewer keeps the point under that center.
      const shift = (content.clientWidth - clientWidth) / 2 / pageWidth;
      expect(ratioAt()).to.be.closeTo(ratio - shift, 0.02);
    });
  });

  describe('mixed page sizes', () => {
    beforeEach(async () => {
      await createViewer();
      await loadAndRender(
        createPdf([
          { content: '', mediaBox: [0, 0, 612, 792] },
          { content: '', mediaBox: [0, 0, 792, 612] },
        ]),
      );
    });

    it('should size each page to its own size', () => {
      const [portrait, landscape] = [...pages].map((page) => page.getBoundingClientRect());
      expect(portrait.height / portrait.width).to.be.closeTo(792 / 612, 0.01);
      expect(landscape.width / landscape.height).to.be.closeTo(792 / 612, 0.01);
    });
  });

  describe('relayout', () => {
    it('should keep a set page at the top after an earlier page gets its own size', async () => {
      await createViewer();
      viewer.page = 3;
      await loadAndRender(
        createPdf([
          { content: '', mediaBox: [0, 0, 612, 792] },
          { content: '', mediaBox: [0, 0, 792, 612] },
          { content: '', mediaBox: [0, 0, 612, 792] },
        ]),
      );
      expect(viewer.page).to.equal(3);
      expect(getPageTop(3)).to.be.closeTo(getPaddingTop(), 1);
    });

    it('should size a page that gets its own size while the viewer is moved in the DOM', async () => {
      await createViewer();
      const idle = nextRenderIdle(viewer);
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = createPdf([
        { content: '', mediaBox: [0, 0, 612, 792] },
        { content: '', mediaBox: [0, 0, 792, 612] },
      ]);
      await loaded;
      // Resolves after the viewer got the page and requested a frame to apply its size
      await viewer['_pdfDocument']!.getPage(2);
      viewer.parentElement!.appendChild(viewer);
      await idle;
      const landscape = pages[1].getBoundingClientRect();
      expect(landscape.width / landscape.height).to.be.closeTo(792 / 612, 0.01);
    });
  });
});
