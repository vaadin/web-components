import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import type { Tooltip } from '@vaadin/tooltip';
import type { PdfViewerButton } from '../src/vaadin-pdf-viewer-button.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdfUrl, getPdfDocumentPrototype, getPdfPagePrototype, loadDocument, nextRenderIdle } from './helpers.js';

describe('sidebar', () => {
  let viewer: PdfViewer;

  function getSidebar() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="sidebar"]')!;
  }

  function getContent() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  }

  function getList() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="thumbnails"]')!;
  }

  function getThumbnails() {
    return [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[part~="thumbnail"]')];
  }

  function getTabStops() {
    return getThumbnails().filter((thumbnail) => thumbnail.getAttribute('tabindex') === '0');
  }

  function getButton() {
    return viewer.querySelector<PdfViewerButton>('vaadin-pdf-viewer-button[icon="sidebar"]')!;
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

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 700px; height: 500px"></vaadin-pdf-viewer>');
    await nextRender();
    const idle = nextRenderIdle(viewer);
    await loadDocument(viewer, 'multi-page.pdf');
    await idle;
  });

  it('should hide the sidebar by default', () => {
    expect(viewer.sidebarOpened).to.be.false;
    expect(getSidebar().hidden).to.be.true;
  });

  it('should not create the thumbnails before the sidebar opens', () => {
    expect(getThumbnails()).to.be.empty;
  });

  it('should toggle the sidebar with the toolbar button', async () => {
    getButton().click();
    await nextRender();
    expect(viewer.sidebarOpened).to.be.true;
    expect(getSidebar().hidden).to.be.false;
    getButton().click();
    await nextRender();
    expect(viewer.sidebarOpened).to.be.false;
    expect(getSidebar().hidden).to.be.true;
  });

  it('should toggle aria-expanded attribute on the toolbar button when toggled', async () => {
    expect(getButton().getAttribute('aria-expanded')).to.equal('false');
    getButton().click();
    await nextRender();
    expect(getButton().getAttribute('aria-expanded')).to.equal('true');
    getButton().click();
    await nextRender();
    expect(getButton().getAttribute('aria-expanded')).to.equal('false');
  });

  it('should show the sidebar button before the page navigation', () => {
    const previousPage = viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="previous-page"]')!;
    expect(getButton().assignedSlot!.parentElement).to.equal(previousPage.assignedSlot!.parentElement);
    expect(getButton().getBoundingClientRect().right).to.be.at.most(previousPage.getBoundingClientRect().left);
  });

  it('should show the label of the sidebar button in a tooltip', () => {
    expect(getButton().querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Sidebar');
  });

  it('should fire sidebar-opened-changed event when toggled with the toolbar button', async () => {
    const spy = sinon.spy();
    viewer.addEventListener('sidebar-opened-changed', spy);
    getButton().click();
    await nextRender();
    expect(spy).to.be.calledOnce;
    expect(spy.firstCall.args[0].detail.value).to.be.true;
  });

  it('should reflect sidebarOpened to the sidebar-opened attribute', async () => {
    viewer.sidebarOpened = true;
    await nextRender();
    expect(viewer.hasAttribute('sidebar-opened')).to.be.true;
  });

  it('should disable the toolbar button without a document', async () => {
    viewer.src = undefined;
    await nextRender();
    expect(getButton().disabled).to.be.true;
  });

  it('should have a tab stop in the thumbnails for a page out of range', async () => {
    const warn = sinon.stub(console, 'warn');
    try {
      viewer.page = 999;
      viewer.sidebarOpened = true;
      await nextRender();
      expect(getTabStops()).to.deep.equal([getThumbnails()[0]]);
    } finally {
      warn.restore();
    }
  });

  it('should close the sidebar with the toolbar button without a document', async () => {
    viewer.sidebarOpened = true;
    viewer.src = undefined;
    await nextRender();
    expect(getButton().disabled).to.be.false;
    getButton().click();
    await nextRender();
    expect(viewer.sidebarOpened).to.be.false;
    expect(getButton().disabled).to.be.true;
  });

  it('should fit the pages to the width left by the sidebar', async () => {
    const idle = nextRenderIdle(viewer);
    viewer.sidebarOpened = true;
    await idle;
    const content = getContent();
    const page = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="page"]')!;
    const padding = parseFloat(getComputedStyle(content).paddingLeft);
    expect(page.offsetWidth).to.be.closeTo(content.clientWidth - 2 * padding, 1);
  });

  it('should show the sidebar next to the pages', async () => {
    viewer.sidebarOpened = true;
    await nextRender();
    expect(getContent().getBoundingClientRect().left).to.be.at.least(getSidebar().getBoundingClientRect().right);
  });

  it('should show the sidebar at the start in RTL', async () => {
    viewer.setAttribute('dir', 'rtl');
    viewer.sidebarOpened = true;
    await nextRender();
    expect(getContent().getBoundingClientRect().right).to.be.at.most(getSidebar().getBoundingClientRect().left);
  });

  describe('opened', () => {
    beforeEach(async () => {
      viewer.sidebarOpened = true;
      await nextRender();
    });

    it('should show a thumbnail for each page', () => {
      expect(getThumbnails()).to.have.lengthOf(6);
    });

    it('should render the thumbnails that are visible', async () => {
      await waitForThumbnail(1);
      expect(getThumbnails()[0].querySelector('canvas')).to.be.ok;
    });

    it('should mark the thumbnail of the current page', async () => {
      viewer.page = 3;
      await nextRenderIdle(viewer);
      const thumbnails = getThumbnails();
      expect(thumbnails[2].getAttribute('aria-selected')).to.equal('true');
      expect(thumbnails[2].part.contains('current')).to.be.true;
      expect(thumbnails[0].hasAttribute('aria-selected')).to.be.false;
    });

    it('should go to the page of a clicked thumbnail', async () => {
      getThumbnails()[3].click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(4);
    });

    it('should keep the sidebar open after going to a clicked thumbnail', async () => {
      getThumbnails()[3].click();
      await nextRenderIdle(viewer);
      expect(viewer.sidebarOpened).to.be.true;
    });

    it('should label the thumbnails', () => {
      expect(getList().getAttribute('role')).to.equal('listbox');
      expect(getList().getAttribute('aria-label')).to.equal('Page thumbnails');
      expect(getThumbnails()[1].getAttribute('role')).to.equal('option');
      expect(getThumbnails()[1].getAttribute('aria-label')).to.equal('Page 2');
    });

    it('should use the texts set with i18n', async () => {
      viewer.i18n = { sidebar: 'Sidopanel', thumbnails: 'Miniatyrer', pageLabel: 'Sida {page}' };
      await nextRender();
      expect(getButton().querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Sidopanel');
      expect(getList().getAttribute('aria-label')).to.equal('Miniatyrer');
      expect(getThumbnails()[1].getAttribute('aria-label')).to.equal('Sida 2');
    });

    it('should have one tab stop, on the thumbnail of the current page', () => {
      expect(getTabStops()).to.deep.equal([getThumbnails()[0]]);
    });

    it('should keep the tab stop for a page out of range', async () => {
      const warn = sinon.stub(console, 'warn');
      try {
        viewer.page = 999;
        await nextUpdate(viewer);
        expect(viewer.page).to.equal(999);
        expect(getTabStops()).to.deep.equal([getThumbnails()[0]]);
      } finally {
        warn.restore();
      }
    });

    it('should focus the thumbnail of the current page with Tab from the toolbar', async () => {
      viewer.page = 2;
      await nextRenderIdle(viewer);
      viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="download"]')!.focus();
      await sendKeys({ press: 'Tab' });
      expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[1]);
    });

    describe('keyboard', () => {
      beforeEach(() => {
        getThumbnails()[0].focus();
      });

      it('should move focus to the next thumbnail with ArrowDown', async () => {
        await sendKeys({ press: 'ArrowDown' });
        expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[1]);
        expect(viewer.page).to.equal(1);
      });

      it('should move focus to the previous thumbnail with ArrowUp', async () => {
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowUp' });
        expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[0]);
      });

      it('should move focus to the last thumbnail with End', async () => {
        await sendKeys({ press: 'End' });
        expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[5]);
      });

      it('should move focus to the first thumbnail with Home', async () => {
        await sendKeys({ press: 'End' });
        await sendKeys({ press: 'Home' });
        expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[0]);
      });

      it('should go to the page of the focused thumbnail with Enter', async () => {
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowDown' });
        const idle = nextRenderIdle(viewer);
        await sendKeys({ press: 'Enter' });
        await idle;
        expect(viewer.page).to.equal(3);
        expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[2]);
      });

      it('should go to the page of the focused thumbnail with Space', async () => {
        await sendKeys({ press: 'ArrowDown' });
        const idle = nextRenderIdle(viewer);
        await sendKeys({ press: 'Space' });
        await idle;
        expect(viewer.page).to.equal(2);
      });

      it('should keep the tab stop on the focused thumbnail when the page changes', async () => {
        await sendKeys({ press: 'ArrowDown' });
        viewer.page = 4;
        await nextRenderIdle(viewer);
        expect(getTabStops()).to.deep.equal([getThumbnails()[1]]);
      });
    });

    it('should keep one tab stop after clicking a thumbnail and moving focus', async () => {
      getThumbnails()[3].focus();
      getThumbnails()[3].click();
      await sendKeys({ press: 'ArrowDown' });
      expect(getTabStops()).to.deep.equal([getThumbnails()[4]]);
    });

    it('should move focus to the sidebar button when the sidebar closes', async () => {
      getThumbnails()[0].focus();
      viewer.sidebarOpened = false;
      await nextRender();
      expect(document.activeElement).to.equal(getButton());
    });

    it('should move focus to the pages when the sidebar closes with the toolbar collapsed', async () => {
      viewer.toolbarCollapsed = true;
      await nextRender();
      getThumbnails()[0].focus();
      viewer.sidebarOpened = false;
      await nextRender();
      expect(viewer.shadowRoot!.activeElement).to.equal(getContent());
    });

    it('should move focus to the sidebar button when another document loads', async () => {
      getThumbnails()[0].focus();
      await loadDocument(viewer, 'links.pdf');
      expect(document.activeElement).to.equal(getButton());
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
      expect(getThumbnails()[0].querySelector('canvas')).to.be.ok;
    });
  });

  describe('large document', () => {
    let url: string;

    beforeEach(async () => {
      url = createPdfUrl(200);
      const loaded = oneEvent(viewer, 'document-load');
      viewer.src = url;
      await loaded;
      viewer.sidebarOpened = true;
      await nextRender();
    });

    afterEach(() => {
      URL.revokeObjectURL(url);
      sinon.restore();
    });

    it('should only render the thumbnails near the visible part of the sidebar', async () => {
      const list = getList().getBoundingClientRect();
      const inView = getThumbnails().filter((thumbnail) => thumbnail.getBoundingClientRect().top < list.bottom);
      await waitForThumbnail(inView.length);
      await nextFrames(20);
      expect(getRenderedThumbnails().length).to.be.lessThan(20);
      expect(getThumbnails()[199].querySelector('canvas')).to.be.null;
    });

    it('should not render thumbnails while the sidebar is closed', async () => {
      viewer.sidebarOpened = false;
      viewer.page = 150;
      await nextRenderIdle(viewer);
      const render = sinon.spy(await getPdfPagePrototype(), 'render');
      const getThumbnailRenders = () => render.getCalls().filter((call) => call.args[0].viewport.width < 300).length;
      viewer.sidebarOpened = true;
      for (let i = 0; i < 50 && !getThumbnailRenders(); i++) {
        await nextFrame();
      }
      viewer.sidebarOpened = false;
      const count = getThumbnailRenders();
      await nextFrames(30);
      // A thumbnail that waits for its page when the sidebar closes still renders.
      expect(getThumbnailRenders()).to.be.at.most(count + 1);
    });

    it('should release the thumbnails that left the view while the sidebar was closed', async () => {
      await waitForThumbnail(1);
      viewer.sidebarOpened = false;
      await nextRender();
      viewer.page = 150;
      await nextRenderIdle(viewer);
      viewer.sidebarOpened = true;
      await nextRender();
      await waitForThumbnail(150);
      expect(getThumbnails()[0].querySelector('canvas')).to.be.null;
    });

    it('should scroll the thumbnail of the current page into view once a hidden viewer shows', async () => {
      viewer.sidebarOpened = false;
      await nextRender();
      viewer.hidden = true;
      viewer.page = 150;
      viewer.sidebarOpened = true;
      await nextRender();
      viewer.hidden = false;
      await waitForThumbnail(150);
      const list = getList().getBoundingClientRect();
      const thumbnail = getThumbnails()[149].getBoundingClientRect();
      expect(thumbnail.top).to.be.at.least(list.top - 1);
      expect(thumbnail.bottom).to.be.at.most(list.bottom + 1);
    });

    it('should scroll the thumbnail of the current page into view', async () => {
      viewer.page = 150;
      await nextRenderIdle(viewer);
      const list = getList().getBoundingClientRect();
      const thumbnail = getThumbnails()[149].getBoundingClientRect();
      expect(thumbnail.top).to.be.at.least(list.top - 1);
      expect(thumbnail.bottom).to.be.at.most(list.bottom + 1);
    });

    it('should render the thumbnails of a scrolled-to part of the list', async () => {
      viewer.page = 150;
      await nextRenderIdle(viewer);
      await waitForThumbnail(150);
      expect(getThumbnails()[149].querySelector('canvas')).to.be.ok;
      expect(getThumbnails()[0].querySelector('canvas')).to.be.null;
    });

    it('should render the thumbnails of a scrolled-to part of the list when attached again', async () => {
      await waitForThumbnail(1);
      const parent = viewer.parentElement!;
      viewer.remove();
      parent.appendChild(viewer);
      await nextRender();
      viewer.page = 150;
      await nextRenderIdle(viewer);
      await waitForThumbnail(150);
      expect(getThumbnails()[149].querySelector('canvas')).to.be.ok;
    });
  });

  describe('outdated thumbnails', () => {
    let release: () => void;

    afterEach(() => {
      release?.();
      sinon.restore();
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

      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'links.pdf');
      await idle;
      await nextRender();
      release();
      await waitForThumbnail(4);
      expect(getThumbnails().map((thumbnail) => !!thumbnail.querySelector('canvas'))).to.deep.equal([
        true,
        true,
        true,
        true,
      ]);
    });

    it('should render other thumbnails after one that was scrolled away from finishes', async () => {
      const url = createPdfUrl(100);
      try {
        const idle = nextRenderIdle(viewer);
        viewer.src = url;
        await idle;
        const getPage = await delayFirstPage();
        viewer.sidebarOpened = true;
        await waitForCall(getPage);

        getList().scrollTop = getList().scrollHeight / 2;
        // Let the thumbnails that became visible wait for the outdated one.
        for (let i = 0; i < 5; i++) {
          await nextFrame();
        }
        release();
        const list = getList().getBoundingClientRect();
        const visible = getThumbnails().find((thumbnail) => {
          const rect = thumbnail.getBoundingClientRect();
          return rect.top >= list.top && rect.bottom <= list.bottom;
        })!;
        await waitForThumbnail(Number(visible.dataset.page));
        expect(visible.querySelector('canvas')).to.be.ok;
        expect(getThumbnails()[0].querySelector('canvas')).to.be.null;
      } finally {
        URL.revokeObjectURL(url);
      }
    });
  });

  describe('failed thumbnails', () => {
    let warn: sinon.SinonStub;

    beforeEach(async () => {
      clearWarnings();
      const prototype = await getPdfDocumentPrototype();
      const getPage = prototype.getPage;
      function failingGetPage(this: PDFDocumentProxy, pageNumber: number) {
        return pageNumber === 2 ? Promise.reject(new Error('Broken page')) : getPage.call(this, pageNumber);
      }
      // Only the thumbnails request pages once the pages have rendered.
      sinon.stub(prototype, 'getPage').callsFake(failingGetPage);
      warn = sinon.stub(console, 'warn');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should warn and render the other thumbnails when a thumbnail fails to render', async () => {
      viewer.sidebarOpened = true;
      await nextRender();
      await waitForThumbnail(3);
      expect(getThumbnails()[2].querySelector('canvas')).to.be.ok;
      expect(getThumbnails()[1].querySelector('canvas')).to.be.null;
      expect(warn).to.be.calledWith('Failed to render the thumbnail of page 2 of the PDF document: Broken page');
    });
  });
});
