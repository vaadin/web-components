import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import type { Button } from '@vaadin/button';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import type { Tooltip } from '@vaadin/tooltip';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdf,
  createPdfUrl,
  fixtureUrl,
  getPdfDocumentPrototype,
  getPdfPagePrototype,
  loadAndRender,
  loadDocument,
  nextRenderIdle,
  openSidebar,
} from './helpers.js';

describe('sidebar', () => {
  let viewer: PdfViewer;
  let button: Button;
  let sidebar: HTMLElement;
  let list: HTMLElement;
  let content: HTMLElement;
  let url: string | undefined;

  function getThumbnails() {
    return [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[part~="thumbnail"]')];
  }

  function getTabStops() {
    return getThumbnails().filter((thumbnail) => thumbnail.getAttribute('tabindex') === '0');
  }

  function getRenderedThumbnails() {
    return getThumbnails().filter((thumbnail) => thumbnail.querySelector('canvas'));
  }

  async function waitForThumbnail(pageNumber: number) {
    for (let i = 0; i < 100 && !getThumbnails()[pageNumber - 1].querySelector('canvas'); i++) {
      await nextFrame();
    }
    if (!getThumbnails()[pageNumber - 1].querySelector('canvas')) {
      throw new Error(`The thumbnail of page ${pageNumber} did not render`);
    }
  }

  async function nextFrames(count: number) {
    for (let i = 0; i < count; i++) {
      await nextFrame();
    }
  }

  function expectThumbnailInView(pageNumber: number) {
    const listRect = list.getBoundingClientRect();
    const thumbnail = getThumbnails()[pageNumber - 1].getBoundingClientRect();
    expect(thumbnail.top).to.be.at.least(listRect.top - 1);
    expect(thumbnail.bottom).to.be.at.most(listRect.bottom + 1);
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 700px; height: 500px"></vaadin-pdf-viewer>');
    await nextRender();
    await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    button = viewer.querySelector<Button>('[slot="toolbar-sidebar"]')!;
    sidebar = viewer.shadowRoot!.querySelector<HTMLElement>('[part="sidebar"]')!;
    list = viewer.shadowRoot!.querySelector<HTMLElement>('[part="thumbnails"]')!;
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  });

  afterEach(() => {
    sinon.restore();
    if (url) {
      URL.revokeObjectURL(url);
      url = undefined;
    }
  });

  it('should not create the thumbnails before the sidebar opens', () => {
    expect(getThumbnails()).to.be.empty;
  });

  it('should open and close the sidebar on sidebar button click', async () => {
    const spy = sinon.spy();
    viewer.addEventListener('sidebar-opened-changed', spy);
    button.click();
    await nextRender();
    expect(viewer.sidebarOpened).to.be.true;
    expect(spy).to.be.calledOnce;
    expect(sidebar.checkVisibility()).to.be.true;
    expect(button.getAttribute('aria-expanded')).to.equal('true');

    button.click();
    await nextRender();
    expect(viewer.sidebarOpened).to.be.false;
    expect(sidebar.checkVisibility()).to.be.false;
    expect(button.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should toggle the sidebar-opened attribute on sidebarOpened change', async () => {
    viewer.sidebarOpened = true;
    await nextRender();
    expect(viewer.hasAttribute('sidebar-opened')).to.be.true;
    viewer.sidebarOpened = false;
    await nextRender();
    expect(viewer.hasAttribute('sidebar-opened')).to.be.false;
  });

  it('should close the sidebar with the toolbar button without a document', async () => {
    viewer.sidebarOpened = true;
    viewer.src = undefined;
    await nextRender();
    expect(button.disabled).to.be.false;
    button.click();
    await nextRender();
    expect(viewer.sidebarOpened).to.be.false;
    expect(button.disabled).to.be.true;
  });

  it('should fit the pages to the width left by the sidebar', async () => {
    const idle = nextRenderIdle(viewer);
    viewer.sidebarOpened = true;
    await idle;
    const page = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="page"]')!;
    const padding = parseFloat(getComputedStyle(content).paddingLeft);
    expect(page.offsetWidth).to.be.closeTo(content.clientWidth - 2 * padding, 1);
  });

  describe('opened', () => {
    let thumbnails: HTMLElement[];

    beforeEach(async () => {
      viewer.sidebarOpened = true;
      await nextRender();
      thumbnails = getThumbnails();
    });

    it('should mark the thumbnail of the current page', async () => {
      viewer.scrollToPage(3);
      await nextRenderIdle(viewer);
      expect(thumbnails[2].getAttribute('aria-selected')).to.equal('true');
      expect(thumbnails[2].part.contains('current')).to.be.true;
      expect(thumbnails[0].hasAttribute('aria-selected')).to.be.false;
      expect(thumbnails[0].part.contains('current')).to.be.false;
    });

    it('should go to the page of a clicked thumbnail', async () => {
      thumbnails[3].click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(4);
      expect(viewer.sidebarOpened).to.be.true;
    });

    it('should use the texts set with i18n', async () => {
      viewer.i18n = { sidebar: 'Sidopanel', thumbnails: 'Miniatyrer', thumbnailLabel: 'Sida {page}' };
      await nextRender();
      expect(button.querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Sidopanel');
      expect(list.getAttribute('aria-label')).to.equal('Miniatyrer');
      expect(thumbnails[1].getAttribute('aria-label')).to.equal('Sida 2');
    });

    it('should focus the thumbnail of the current page with Tab from the toolbar', async () => {
      viewer.scrollToPage(2);
      await nextRenderIdle(viewer);
      viewer.querySelector<HTMLElement>('[slot="toolbar-download"]')!.focus();
      await sendKeys({ press: 'Tab' });
      expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[1]);
    });

    describe('keyboard', () => {
      beforeEach(() => {
        thumbnails[0].focus();
      });

      it('should move focus to the next thumbnail with ArrowDown', async () => {
        await sendKeys({ press: 'ArrowDown' });
        expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[1]);
        expect(thumbnails[1].matches(':focus-visible')).to.be.true;
        expect(viewer.page).to.equal(1);
      });

      it('should move focus to the previous thumbnail with ArrowUp', async () => {
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowUp' });
        expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[0]);
      });

      it('should move focus to the first thumbnail with Home', async () => {
        await sendKeys({ press: 'End' });
        await sendKeys({ press: 'Home' });
        expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[0]);
      });

      it('should move focus to the last thumbnail with End', async () => {
        await sendKeys({ press: 'End' });
        expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[5]);
      });

      it('should keep focus on the first thumbnail with ArrowUp', async () => {
        await sendKeys({ press: 'ArrowUp' });
        expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[0]);
      });

      it('should keep focus on the last thumbnail with ArrowDown', async () => {
        await sendKeys({ press: 'End' });
        await sendKeys({ press: 'ArrowDown' });
        expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[5]);
      });

      it('should go to the page of the focused thumbnail with Enter', async () => {
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowDown' });
        const idle = nextRenderIdle(viewer);
        await sendKeys({ press: 'Enter' });
        await idle;
        expect(viewer.page).to.equal(3);
        expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[2]);
      });

      it('should go to the page of the focused thumbnail with Space', async () => {
        await sendKeys({ press: 'ArrowDown' });
        const idle = nextRenderIdle(viewer);
        await sendKeys({ press: 'Space' });
        await idle;
        expect(viewer.page).to.equal(2);
      });

      it('should move focus out of the thumbnails with Tab', async () => {
        await sendKeys({ press: 'Tab' });
        expect(list.contains(viewer.shadowRoot!.activeElement)).to.be.false;
      });

      it('should not move focus with a modifier key', async () => {
        await sendKeys({ press: 'Control+ArrowDown' });
        expect(viewer.shadowRoot!.activeElement).to.equal(thumbnails[0]);
      });

      it('should not move focus while the list itself has focus', async () => {
        list.focus();
        await sendKeys({ press: 'ArrowDown' });
        expect(viewer.shadowRoot!.activeElement).to.equal(list);
      });

      it('should keep the tab stop on the focused thumbnail when the page changes', async () => {
        await sendKeys({ press: 'ArrowDown' });
        viewer.scrollToPage(4);
        await nextRenderIdle(viewer);
        expect(getTabStops()).to.deep.equal([thumbnails[1]]);
      });
    });

    it('should keep one tab stop after clicking a thumbnail and moving focus', async () => {
      thumbnails[3].focus();
      thumbnails[3].click();
      expect(getTabStops()).to.deep.equal([thumbnails[3]]);
      await sendKeys({ press: 'ArrowDown' });
      expect(getTabStops()).to.deep.equal([thumbnails[4]]);
    });

    it('should move focus to the sidebar button when the sidebar closes', async () => {
      thumbnails[0].focus();
      viewer.sidebarOpened = false;
      await nextRender();
      expect(document.activeElement).to.equal(button);
    });

    it('should move focus to the pages when the sidebar closes with the toolbar collapsed', async () => {
      viewer.toolbarCollapsed = true;
      await nextRender();
      thumbnails[0].focus();
      viewer.sidebarOpened = false;
      await nextRender();
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
    });

    it('should move focus to the sidebar button when another document loads', async () => {
      thumbnails[0].focus();
      await loadDocument(viewer, 'links.pdf');
      expect(document.activeElement).to.equal(button);
    });

    it('should remove the thumbnails when another document loads', async () => {
      await loadDocument(viewer, 'links.pdf');
      await nextRender();
      expect(getThumbnails()).to.have.lengthOf(4);
    });

    it('should keep the rendered thumbnails while the sidebar is closed', async () => {
      await waitForThumbnail(1);
      viewer.sidebarOpened = false;
      await nextRender();
      await nextFrame();
      expect(thumbnails[0].querySelector('canvas')).to.be.ok;
    });
  });

  describe('rendering', () => {
    it('should render the thumbnails again when the device pixel ratio changes', async () => {
      const descriptor = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
      const pixelRatio = (window.devicePixelRatio || 1) + 1;
      const query = new EventTarget();
      const matchMedia = window.matchMedia.bind(window);
      sinon
        .stub(window, 'matchMedia')
        .callsFake((media: string) =>
          media.startsWith('(resolution') ? (query as MediaQueryList) : matchMedia(media),
        );
      try {
        await openSidebar(viewer);
        const thumbnail = getThumbnails()[0];
        const canvas = thumbnail.querySelector('canvas')!;
        const width = thumbnail.querySelector<HTMLElement>('.thumbnail-image')!.offsetWidth;
        Object.defineProperty(window, 'devicePixelRatio', { value: pixelRatio, configurable: true });
        query.dispatchEvent(new Event('change'));
        for (let i = 0; i < 100 && thumbnail.querySelector('canvas') === canvas; i++) {
          await nextFrame();
        }
        expect(thumbnail.querySelectorAll('canvas')).to.have.lengthOf(1);
        expect(thumbnail.querySelector('canvas')!.width).to.be.closeTo(width * pixelRatio, 1);
        expect(canvas.width).to.equal(0);
      } finally {
        if (descriptor) {
          Object.defineProperty(window, 'devicePixelRatio', descriptor);
        } else {
          delete (window as any).devicePixelRatio;
        }
      }
    });

    it('should give the thumbnails the size of their page when the sidebar is open while the document loads', async () => {
      // Many pages, so that the thumbnail of the last one is not rendered
      const portrait = { content: '', mediaBox: [0, 0, 612, 792] as [number, number, number, number] };
      const landscape = { content: '', mediaBox: [0, 0, 792, 612] as [number, number, number, number] };
      url = createPdf([...Array.from({ length: 30 }, () => portrait), landscape]);
      viewer.sidebarOpened = true;
      await loadAndRender(viewer, url);
      await nextFrame();
      const last = getThumbnails()[30];
      expect(last.querySelector('canvas')).to.be.null;
      const { width, height } = last.querySelector('.thumbnail-image')!.getBoundingClientRect();
      expect(width / height).to.be.closeTo(792 / 612, 0.01);
    });

    describe('large document', () => {
      let thumbnails: HTMLElement[];

      beforeEach(async () => {
        url = createPdfUrl(200);
        const loaded = oneEvent(viewer, 'document-load');
        viewer.src = url;
        await loaded;
        viewer.sidebarOpened = true;
        await nextRender();
        thumbnails = getThumbnails();
      });

      it('should only render the thumbnails near the visible part of the sidebar', async () => {
        const listRect = list.getBoundingClientRect();
        const inView = thumbnails.filter((thumbnail) => thumbnail.getBoundingClientRect().top < listRect.bottom);
        await waitForThumbnail(inView.length);
        await nextFrames(20);
        expect(getRenderedThumbnails().length).to.be.lessThan(20);
        expect(thumbnails[199].querySelector('canvas')).to.be.null;
      });

      it('should render one thumbnail at a time', async () => {
        const prototype = await getPdfPagePrototype();
        const render = prototype.render;
        let pending = 0;
        let maxPending = 0;
        function countingRender(this: PDFPageProxy, params: Parameters<PDFPageProxy['render']>[0]) {
          const task = render.call(this, params);
          if (params.viewport.width < 300) {
            pending += 1;
            maxPending = Math.max(maxPending, pending);
            const done = () => {
              pending -= 1;
            };
            task.promise.then(done, done);
          }
          return task;
        }
        sinon.stub(prototype, 'render').callsFake(countingRender);
        // Scrolling adds thumbnails to render while one is rendering.
        for (let i = 1; i <= 5; i++) {
          list.scrollTop = (list.scrollHeight * i) / 10;
          await nextFrame();
        }
        await nextFrames(10);
        expect(maxPending).to.equal(1);
      });

      it('should not render thumbnails while the sidebar is closed', async () => {
        viewer.sidebarOpened = false;
        viewer.scrollToPage(150);
        await nextRenderIdle(viewer);
        const render = sinon.spy(await getPdfPagePrototype(), 'render');
        const getThumbnailRenders = () => render.getCalls().filter((call) => call.args[0].viewport.width < 300).length;
        viewer.sidebarOpened = true;
        for (let i = 0; i < 50 && !getThumbnailRenders(); i++) {
          await nextFrame();
        }
        viewer.sidebarOpened = false;
        const count = getThumbnailRenders();
        expect(count).to.be.above(0);
        await nextFrames(30);
        // A thumbnail that waits for its page when the sidebar closes still renders.
        expect(getThumbnailRenders()).to.be.at.most(count + 1);
      });

      it('should release the thumbnails that left the view while the sidebar was closed', async () => {
        await waitForThumbnail(1);
        viewer.sidebarOpened = false;
        await nextRender();
        viewer.scrollToPage(150);
        await nextRenderIdle(viewer);
        viewer.sidebarOpened = true;
        await nextRender();
        await waitForThumbnail(150);
        expect(thumbnails[0].querySelector('canvas')).to.be.null;
      });

      it('should scroll the thumbnail of the current page into view, down and back up', async () => {
        viewer.scrollToPage(150);
        await nextRenderIdle(viewer);
        expectThumbnailInView(150);
        viewer.scrollToPage(2);
        await nextRenderIdle(viewer);
        expectThumbnailInView(2);
      });

      it('should render the thumbnails of a scrolled-to part of the list when attached again', async () => {
        await waitForThumbnail(1);
        const parent = viewer.parentElement!;
        viewer.remove();
        parent.appendChild(viewer);
        await nextRender();
        viewer.scrollToPage(150);
        await nextRenderIdle(viewer);
        await waitForThumbnail(150);
        expect(thumbnails[149].querySelector('canvas')).to.be.ok;
      });
    });

    describe('outdated thumbnails', () => {
      let release: () => void;

      afterEach(() => {
        release?.();
      });

      /**
       * Makes the next request for the first page of a document, which is the
       * one of its thumbnail once the pages have rendered, wait until
       * `release()` is called. The page is loaded already, so that it is
       * returned also when the document has been unloaded meanwhile.
       */
      async function delayFirstPage() {
        const prototype = await getPdfDocumentPrototype();
        const getPage = prototype.getPage;
        const released = new Promise<void>((resolve) => {
          release = resolve;
        });
        let isDelayed = false;
        async function delayedGetPage(this: PDFDocumentProxy, pageNumber: number) {
          const pdfPage = await getPage.call(this, pageNumber);
          if (pageNumber === 1 && !isDelayed) {
            isDelayed = true;
            await released;
          }
          return pdfPage;
        }
        return sinon.stub(prototype, 'getPage').callsFake(delayedGetPage);
      }

      async function waitForCall(stub: sinon.SinonStub) {
        for (let i = 0; i < 50 && !stub.calledWith(1); i++) {
          await nextFrame();
        }
        expect(stub).to.be.calledWith(1);
      }

      it('should render the thumbnails of a new document after an outdated thumbnail finishes', async () => {
        const getPage = await delayFirstPage();
        viewer.sidebarOpened = true;
        await waitForCall(getPage);

        await loadAndRender(viewer, fixtureUrl('links.pdf'));
        await nextRender();
        release();
        await waitForThumbnail(4);
        expect(getRenderedThumbnails()).to.have.lengthOf(4);
      });

      it('should render other thumbnails after one that was scrolled away from finishes', async () => {
        url = createPdfUrl(100);
        await loadAndRender(viewer, url);
        const getPage = await delayFirstPage();
        viewer.sidebarOpened = true;
        await waitForCall(getPage);

        list.scrollTop = list.scrollHeight / 2;
        // Let the thumbnails that became visible wait for the outdated one.
        await nextFrames(5);
        release();
        const listRect = list.getBoundingClientRect();
        const visible = getThumbnails().find((thumbnail) => {
          const rect = thumbnail.getBoundingClientRect();
          return rect.top >= listRect.top && rect.bottom <= listRect.bottom;
        })!;
        await waitForThumbnail(Number(visible.dataset.page));
        expect(visible.querySelector('canvas')).to.be.ok;
        expect(getThumbnails()[0].querySelector('canvas')).to.be.null;
      });
    });

    describe('failed thumbnails', () => {
      let warn: sinon.SinonStub;
      let isBroken: boolean;

      beforeEach(async () => {
        clearWarnings();
        isBroken = true;
        const prototype = await getPdfDocumentPrototype();
        const getPage = prototype.getPage;
        function failingGetPage(this: PDFDocumentProxy, pageNumber: number) {
          return pageNumber === 2 && isBroken
            ? Promise.reject(new Error('Broken page'))
            : getPage.call(this, pageNumber);
        }
        // Only the thumbnails request pages once the pages have rendered.
        sinon.stub(prototype, 'getPage').callsFake(failingGetPage);
        warn = sinon.stub(console, 'warn');
      });

      it('should warn and render the other thumbnails when a thumbnail fails to render', async () => {
        viewer.sidebarOpened = true;
        await nextRender();
        await waitForThumbnail(3);
        expect(getThumbnails()[2].querySelector('canvas')).to.be.ok;
        expect(getThumbnails()[1].querySelector('canvas')).to.be.null;
        expect(warn).to.be.calledWith('Failed to render the thumbnail of page 2 of the PDF document: Broken page');
      });

      it('should render a failed thumbnail again after it was scrolled away from', async () => {
        viewer.style.height = '250px';
        viewer.sidebarOpened = true;
        await nextRender();
        for (let i = 0; i < 100 && !warn.called; i++) {
          await nextFrame();
        }
        isBroken = false;
        list.scrollTop = list.scrollHeight;
        await nextFrames(5);
        list.scrollTop = 0;
        await waitForThumbnail(2);
        expect(getThumbnails()[1].querySelector('canvas')).to.be.ok;
      });
    });
  });
});
