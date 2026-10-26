import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';
import { PdfViewerRenderQueue, type PdfViewerRenderQueueOptions } from '../src/pdf-viewer-render-queue.js';

const PAGE_PIXELS = 100;

class FakePage {
  pageNumber: number;

  canvasPixels = 0;

  renderFailed = false;

  renderedPixelRatio = 0;

  cancel = sinon.spy();

  constructor(pageNumber: number) {
    this.pageNumber = pageNumber;
  }

  isRendered(pixelRatio: number) {
    return this.canvasPixels > 0 && this.renderedPixelRatio === pixelRatio;
  }
}

describe('render queue', () => {
  let pages: FakePage[];
  let rendered: number[];
  let released: number[];
  let queue: PdfViewerRenderQueue<FakePage>;
  let resolveIdle: (() => void) | undefined;

  function createQueue(options: Partial<PdfViewerRenderQueueOptions<FakePage>> = {}) {
    queue = new PdfViewerRenderQueue<FakePage>({
      async renderPage(page, pixelRatio) {
        rendered.push(page.pageNumber);
        page.canvasPixels = PAGE_PIXELS;
        page.renderedPixelRatio = pixelRatio;
      },
      releasePage(page) {
        released.push(page.pageNumber);
        page.canvasPixels = 0;
      },
      onIdle() {
        resolveIdle?.();
      },
      renderAhead: 1,
      keepRendered: 1,
      maxPagePixels: PAGE_PIXELS,
      maxTotalPixels: 100 * PAGE_PIXELS,
      ...options,
    });
    queue.setPages(pages);
  }

  async function update(...visible: Array<[index: number, height: number]>) {
    const idle = new Promise<void>((resolve) => {
      resolveIdle = resolve;
    });
    queue.update(visible.map(([index, height]) => ({ index, height })));
    await idle;
  }

  beforeEach(() => {
    pages = Array.from({ length: 10 }, (_, index) => new FakePage(index + 1));
    rendered = [];
    released = [];
  });

  describe('order', () => {
    beforeEach(() => {
      createQueue();
    });

    it('should render the most visible page first, then the other visible pages, then one page ahead on each side', async () => {
      await update([3, 50], [4, 300], [5, 100]);
      expect(rendered).to.deep.equal([5, 6, 4, 7, 3]);
    });

    it('should not render a page again', async () => {
      await update([3, 100]);
      rendered = [];
      await update([4, 100]);
      expect(rendered).to.deep.equal([6]);
    });

    it('should not render a page that failed to render', async () => {
      pages[3].renderFailed = true;
      await update([3, 100]);
      expect(rendered).to.deep.equal([5, 3]);
    });

    it('should render the pages again at a new pixel ratio', async () => {
      await update([3, 100]);
      rendered = [];
      const idle = new Promise<void>((resolve) => {
        resolveIdle = resolve;
      });
      queue.setPixelRatio(2);
      queue.renderNext();
      await idle;
      expect(rendered).to.deep.equal([4, 5, 3]);
      expect(pages[3].renderedPixelRatio).to.equal(2);
    });

    it('should render one page at a time', async () => {
      const renderPage = sinon.stub().returns(new Promise(() => {}));
      createQueue({ renderPage });
      queue.update([
        { index: 3, height: 100 },
        { index: 4, height: 100 },
      ]);
      await Promise.resolve();
      expect(renderPage).to.be.calledOnce;
    });

    it('should cancel the page being rendered', () => {
      createQueue({ renderPage: () => new Promise(() => {}) });
      queue.update([{ index: 3, height: 100 }]);
      queue.cancel();
      expect(pages[3].cancel).to.be.calledOnce;
    });

    it('should not render more pages after clear', async () => {
      let finishRender!: () => void;
      const renderPage = sinon.stub().callsFake(
        () =>
          new Promise<void>((resolve) => {
            finishRender = resolve;
          }),
      );
      createQueue({ renderPage });
      queue.update([
        { index: 3, height: 100 },
        { index: 4, height: 100 },
      ]);
      queue.clear();
      finishRender();
      await new Promise((resolve) => {
        setTimeout(resolve);
      });
      expect(renderPage).to.be.calledOnce;
    });
  });

  describe('memory', () => {
    it('should release pages that are more than one page away from the view', async () => {
      createQueue();
      await update([3, 100]);
      await update([5, 100]);
      expect(released).to.have.members([3, 4]);
    });

    it('should not render pages ahead when one more canvas does not fit the budget', async () => {
      createQueue({ maxTotalPixels: 2.5 * PAGE_PIXELS });
      await update([3, 100], [4, 100]);
      expect(rendered).to.deep.equal([4, 5]);
    });

    it('should render all visible pages also over the budget', async () => {
      createQueue({ maxTotalPixels: PAGE_PIXELS });
      await update([3, 100], [4, 100], [5, 100]);
      expect(rendered).to.have.members([4, 5, 6]);
    });

    it('should release pages next to the view while over the budget', async () => {
      createQueue({ maxTotalPixels: 1.5 * PAGE_PIXELS, keepRendered: 5 });
      await update([3, 100], [4, 100]);
      released = [];
      await update([4, 100]);
      expect(released).to.deep.equal([4]);
    });
  });
});
