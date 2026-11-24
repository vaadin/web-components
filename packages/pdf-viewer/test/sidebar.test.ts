import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
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
  stubDevicePixelRatio,
  waitUntil,
} from './helpers.js';

describe('sidebar', () => {
  let viewer: PdfViewer;
  let button: Button;
  let sidebar: HTMLElement;
  let list: HTMLElement;
  let content: HTMLElement;
  let url: string | undefined;
  let setDevicePixelRatio: (ratio: number) => void;

  function getThumbnails() {
    return [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[part~="thumbnail"]')];
  }

  function getTabStops() {
    return getThumbnails().filter((thumbnail) => thumbnail.getAttribute('tabindex') === '0');
  }

  function getRenderedThumbnails() {
    return getThumbnails().filter((thumbnail) => thumbnail.querySelector('canvas'));
  }

  async function setWidth(width: string) {
    viewer.style.width = width;
    await nextResize(viewer);
  }

  function isRendered(pageNumber: number) {
    return !!getThumbnails()[pageNumber - 1].querySelector('canvas');
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
    setDevicePixelRatio = stubDevicePixelRatio();
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

  it('should toggle the sidebar button on sidebarButtonHidden change', async () => {
    viewer.sidebarButtonHidden = true;
    await nextRender();
    expect(button.checkVisibility()).to.be.false;
    viewer.sidebarButtonHidden = false;
    await nextRender();
    expect(button.checkVisibility()).to.be.true;
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

  it('should keep the sidebar open over the pages when the viewer becomes narrow', async () => {
    viewer.sidebarOpened = true;
    await nextRender();
    await setWidth('400px');
    expect(viewer.hasAttribute('sidebar-overlay')).to.be.true;
    expect(viewer.sidebarOpened).to.be.true;
  });

  it('should move focus from the pages to the current thumbnail when the viewer becomes narrow', async () => {
    viewer.sidebarOpened = true;
    await nextRender();
    content.focus();
    await setWidth('400px');
    await nextRender();
    expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[0]);
  });

  it('should show the open sidebar of a viewer that is narrow from the start over the pages', async () => {
    const narrow = fixtureSync<PdfViewer>(
      '<vaadin-pdf-viewer sidebar-opened style="width: 400px"></vaadin-pdf-viewer>',
    );
    await nextUpdate(narrow);
    expect(narrow.hasAttribute('sidebar-overlay')).to.be.true;
    expect(narrow.sidebarOpened).to.be.true;
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

    it('should fire thumbnail-click with the page on thumbnail click', () => {
      const spy = sinon.spy();
      viewer.addEventListener('thumbnail-click', spy);
      thumbnails[3].click();
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail).to.deep.equal({ page: 4 });
      expect(viewer.page).to.equal(4);
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

      it('should fire thumbnail-click with the page on Enter and Space', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('thumbnail-click', spy);
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Space' });
        expect(spy.args.map(([event]) => event.detail.page)).to.deep.equal([2, 3]);
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
      await waitUntil(() => isRendered(1));
      viewer.sidebarOpened = false;
      await nextRender();
      await nextFrame();
      expect(thumbnails[0].querySelector('canvas')).to.be.ok;
    });

    it('should not close the sidebar on Escape when it is next to the pages', async () => {
      thumbnails[0].focus();
      await sendKeys({ press: 'Escape' });
      await nextRender();
      expect(viewer.sidebarOpened).to.be.true;
    });
  });

  describe('overlay', () => {
    beforeEach(async () => {
      await setWidth('400px');
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should toggle the sidebar-overlay attribute when the viewer resizes', async () => {
      expect(viewer.hasAttribute('sidebar-overlay')).to.be.true;
      await setWidth('700px');
      expect(viewer.hasAttribute('sidebar-overlay')).to.be.false;
    });

    it('should keep the sidebar-overlay attribute while the viewer is hidden', async () => {
      viewer.style.display = 'none';
      await nextResize(viewer);
      expect(viewer.hasAttribute('sidebar-overlay')).to.be.true;
    });

    it('should not show the sidebar over the pages with --vaadin-pdf-viewer-sidebar-overlay: false', async () => {
      viewer.style.setProperty('--vaadin-pdf-viewer-sidebar-overlay', 'false');
      await setWidth('390px');
      expect(viewer.hasAttribute('sidebar-overlay')).to.be.false;
    });

    it('should show the sidebar over the pages with --vaadin-pdf-viewer-sidebar-overlay: true', async () => {
      viewer.style.setProperty('--vaadin-pdf-viewer-sidebar-overlay', 'true');
      await setWidth('700px');
      expect(viewer.hasAttribute('sidebar-overlay')).to.be.true;
    });

    it('should make the pages inert while the sidebar shows over them', async () => {
      viewer.sidebarOpened = true;
      await nextRender();
      expect(content.inert).to.be.true;
      await setWidth('700px');
      expect(content.inert).to.be.false;
    });

    it('should move focus from the pages to the current thumbnail when the sidebar opens', async () => {
      content.focus();
      viewer.sidebarOpened = true;
      await nextRender();
      expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[0]);
    });

    describe('opened', () => {
      let thumbnails: HTMLElement[];

      beforeEach(async () => {
        viewer.sidebarOpened = true;
        await nextRender();
        thumbnails = getThumbnails();
      });

      it('should close the sidebar on Escape and move focus to the sidebar button', async () => {
        const spy = sinon.spy();
        viewer.parentElement!.addEventListener('keydown', spy);
        thumbnails[0].focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(viewer.sidebarOpened).to.be.false;
        expect(document.activeElement).to.equal(button);
        expect(spy.firstCall.args[0].defaultPrevented).to.be.true;
      });

      it('should move focus to the pages when the sidebar closes on Escape with the toolbar collapsed', async () => {
        viewer.toolbarCollapsed = true;
        await nextRender();
        thumbnails[0].focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(viewer.shadowRoot!.activeElement).to.equal(content);
      });

      it('should close the sidebar on Escape from the sidebar button', async () => {
        button.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(viewer.sidebarOpened).to.be.false;
      });

      it('should not close the sidebar on Escape from other toolbar controls', async () => {
        viewer.querySelector<HTMLElement>('[slot="toolbar-zoom-in"]')!.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(viewer.sidebarOpened).to.be.true;
      });

      it('should go to the page of a chosen thumbnail and close the sidebar', async () => {
        thumbnails[3].click();
        await nextRender();
        expect(viewer.page).to.equal(4);
        expect(viewer.sidebarOpened).to.be.false;
      });

      it('should close the sidebar on a click on the pages', async () => {
        await sendMouseToElement({ type: 'click', element: content });
        await nextRender();
        expect(viewer.sidebarOpened).to.be.false;
      });
    });
  });

  describe('rendering', () => {
    it('should keep the pdf.js data of a page that the pages show when its thumbnail renders', async () => {
      const cleanup = sinon.spy(await getPdfPagePrototype(), 'cleanup');
      await openSidebar(viewer);
      const pageNumbers = cleanup.thisValues.map((pdfPage: PDFPageProxy) => pdfPage.pageNumber);
      expect(pageNumbers).to.not.include(1);
    });

    it('should render the thumbnails again when the device pixel ratio changes', async () => {
      // Tall enough for every thumbnail to render, so that none is rendering when the ratio changes.
      viewer.style.height = '1500px';
      await openSidebar(viewer);
      await waitUntil(() => getRenderedThumbnails().length === getThumbnails().length);
      const thumbnail = getThumbnails()[0];
      const canvas = thumbnail.querySelector('canvas')!;
      const width = thumbnail.querySelector<HTMLElement>('.thumbnail-image')!.offsetWidth;
      const pixelRatio = window.devicePixelRatio + 1;
      setDevicePixelRatio(pixelRatio);
      await waitUntil(() => thumbnail.querySelector('canvas') !== canvas);
      expect(thumbnail.querySelectorAll('canvas')).to.have.lengthOf(1);
      expect(thumbnail.querySelector('canvas')!.width).to.be.closeTo(width * pixelRatio, 1);
      expect(canvas.width).to.equal(0);
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

      // A thumbnail canvas is hidden from screen readers, unlike the canvas of a page.
      function isThumbnailRender(params: Parameters<PDFPageProxy['render']>[0]) {
        return !!params.canvas?.hasAttribute('aria-hidden');
      }

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
        await waitUntil(() => isRendered(inView.length));
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
          if (isThumbnailRender(params)) {
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
        const getThumbnailRenders = () => render.getCalls().filter((call) => isThumbnailRender(call.args[0])).length;
        viewer.sidebarOpened = true;
        await waitUntil(() => getThumbnailRenders() > 0);
        viewer.sidebarOpened = false;
        const count = getThumbnailRenders();
        expect(count).to.be.above(0);
        await nextFrames(30);
        // A thumbnail that waits for its page when the sidebar closes still renders.
        expect(getThumbnailRenders()).to.be.at.most(count + 1);
      });

      it('should release the thumbnails that left the view while the sidebar was closed', async () => {
        await waitUntil(() => isRendered(1));
        viewer.sidebarOpened = false;
        await nextRender();
        viewer.scrollToPage(150);
        await nextRenderIdle(viewer);
        viewer.sidebarOpened = true;
        await nextRender();
        await waitUntil(() => isRendered(150));
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

      it('should not scroll the list when a thumbnail is clicked', async () => {
        const listRect = list.getBoundingClientRect();
        const thumbnail = thumbnails.find((item) => item.getBoundingClientRect().bottom > listRect.bottom)!;
        const { left, width } = thumbnail.getBoundingClientRect();
        const { scrollTop } = list;
        // A mouse click, which focuses the thumbnail, on its part that is in view.
        await sendMouse({ type: 'click', position: [Math.round(left + width / 2), Math.round(listRect.bottom - 10)] });
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(Number(thumbnail.dataset.page));
        expect(list.scrollTop).to.equal(scrollTop);
      });

      it('should free the pdf.js data of a page once its thumbnail has rendered', async () => {
        const cleanup = sinon.spy(await getPdfPagePrototype(), 'cleanup');
        thumbnails[99].scrollIntoView();
        await waitUntil(() => isRendered(100));
        const index = cleanup.thisValues.findIndex((pdfPage: PDFPageProxy) => pdfPage.pageNumber === 100);
        // cleanup() returns false when pdf.js only defers freeing the page
        expect(cleanup.returnValues[index]).to.be.true;
      });

      it('should render the thumbnails of a scrolled-to part of the list when attached again', async () => {
        await waitUntil(() => isRendered(1));
        const parent = viewer.parentElement!;
        viewer.remove();
        parent.appendChild(viewer);
        await nextRender();
        viewer.scrollToPage(150);
        await nextRenderIdle(viewer);
        await waitUntil(() => isRendered(150));
        expect(thumbnails[149].querySelector('canvas')).to.be.ok;
      });
    });

    describe('outdated thumbnails', () => {
      let release: () => void;

      afterEach(() => {
        release?.();
      });

      // Holds the next request for the first page, which comes from its thumbnail once the pages have rendered.
      async function holdFirstPage() {
        const prototype = await getPdfDocumentPrototype();
        const getPage = prototype.getPage;
        const released = new Promise<void>((resolve) => {
          release = resolve;
        });
        let isHeld = false;
        async function heldGetPage(this: PDFDocumentProxy, pageNumber: number) {
          // The page loads first, so that it is returned also after the document is unloaded.
          const pdfPage = await getPage.call(this, pageNumber);
          if (pageNumber === 1 && !isHeld) {
            isHeld = true;
            await released;
          }
          return pdfPage;
        }
        const stub = sinon.stub(prototype, 'getPage').callsFake(heldGetPage);
        return () => waitUntil(() => stub.calledWith(1));
      }

      it('should render the thumbnails of a new document after an outdated thumbnail finishes', async () => {
        const requested = await holdFirstPage();
        viewer.sidebarOpened = true;
        await requested();

        await loadAndRender(viewer, fixtureUrl('links.pdf'));
        await nextRender();
        release();
        await waitUntil(() => isRendered(4));
        expect(getRenderedThumbnails()).to.have.lengthOf(4);
      });

      it('should render other thumbnails after one that was scrolled away from finishes', async () => {
        url = createPdfUrl(100);
        await loadAndRender(viewer, url);
        const requested = await holdFirstPage();
        viewer.sidebarOpened = true;
        await requested();

        list.scrollTop = list.scrollHeight / 2;
        // Let the thumbnails that became visible wait for the outdated one.
        await nextFrames(5);
        release();
        const listRect = list.getBoundingClientRect();
        const visible = getThumbnails().find((thumbnail) => {
          const rect = thumbnail.getBoundingClientRect();
          return rect.top >= listRect.top && rect.bottom <= listRect.bottom;
        })!;
        await waitUntil(() => isRendered(Number(visible.dataset.page)));
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
        await waitUntil(() => isRendered(3));
        expect(getThumbnails()[2].querySelector('canvas')).to.be.ok;
        expect(getThumbnails()[1].querySelector('canvas')).to.be.null;
        expect(warn).to.be.calledWith('Failed to render the thumbnail of page 2 of the PDF document: Broken page');
      });

      it('should render a failed thumbnail again after it was scrolled away from', async () => {
        viewer.style.height = '250px';
        viewer.sidebarOpened = true;
        await nextRender();
        await waitUntil(() => warn.called);
        isBroken = false;
        list.scrollTop = list.scrollHeight;
        await nextFrames(5);
        list.scrollTop = 0;
        await waitUntil(() => isRendered(2));
        expect(getThumbnails()[1].querySelector('canvas')).to.be.ok;
      });
    });
  });
});
