import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdfUrl, loadDocument, nextRenderIdle } from './helpers.js';

describe('sidebar', () => {
  let viewer: PdfViewer;

  function getSidebar() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="sidebar"]')!;
  }

  function getList() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="thumbnails"]')!;
  }

  function getThumbnails() {
    return [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[part~="thumbnail"]')];
  }

  function getToggle() {
    return viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="sidebar"]')!;
  }

  async function waitForThumbnail(pageNumber: number) {
    for (let i = 0; i < 100 && !getThumbnails()[pageNumber - 1].querySelector('canvas'); i++) {
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

  it('should toggle the sidebar with the toolbar button', async () => {
    getToggle().click();
    await nextRender();
    expect(viewer.sidebarOpened).to.be.true;
    expect(getSidebar().hidden).to.be.false;
    expect(getToggle().getAttribute('aria-pressed')).to.equal('true');
    expect(getToggle().getAttribute('aria-label')).to.equal('Sidebar');
  });

  it('should fire sidebar-opened-changed event when toggled with the toolbar button', async () => {
    const spy = sinon.spy();
    viewer.addEventListener('sidebar-opened-changed', spy);
    getToggle().click();
    await nextRender();
    expect(spy).to.be.calledOnce;
  });

  it('should reflect sidebarOpened to the sidebar-opened attribute', async () => {
    viewer.sidebarOpened = true;
    await nextRender();
    expect(viewer.hasAttribute('sidebar-opened')).to.be.true;
  });

  it('should fit the pages to the width left by the sidebar', async () => {
    const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
    const idle = nextRenderIdle(viewer);
    viewer.sidebarOpened = true;
    await idle;
    const page = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="page"]')!;
    const padding = parseFloat(getComputedStyle(content).paddingLeft);
    expect(page.offsetWidth).to.be.closeTo(content.clientWidth - 2 * padding, 1);
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

    it('should label the thumbnails', () => {
      expect(getList().getAttribute('role')).to.equal('listbox');
      expect(getList().getAttribute('aria-label')).to.equal('Page thumbnails');
      expect(getThumbnails()[1].getAttribute('role')).to.equal('option');
      expect(getThumbnails()[1].getAttribute('aria-label')).to.equal('Page 2');
    });

    it('should have one tab stop, on the thumbnail of the current page', () => {
      const tabStops = getThumbnails().filter((thumbnail) => thumbnail.getAttribute('tabindex') === '0');
      expect(tabStops).to.deep.equal([getThumbnails()[0]]);
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

      it('should move focus to the last thumbnail with End', async () => {
        await sendKeys({ press: 'End' });
        expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[5]);
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
    });

    it('should keep the sidebar open after going to a clicked thumbnail', async () => {
      getThumbnails()[3].click();
      await nextRenderIdle(viewer);
      expect(viewer.sidebarOpened).to.be.true;
    });

    it('should keep one tab stop after clicking a thumbnail and moving focus', async () => {
      getThumbnails()[3].focus();
      getThumbnails()[3].click();
      await sendKeys({ press: 'ArrowDown' });
      const tabStops = getThumbnails().filter((thumbnail) => thumbnail.getAttribute('tabindex') === '0');
      expect(tabStops).to.deep.equal([getThumbnails()[4]]);
    });

    it('should move focus to the toggle button when the sidebar closes', async () => {
      getThumbnails()[0].focus();
      viewer.sidebarOpened = false;
      await nextRender();
      expect(document.activeElement).to.equal(getToggle());
    });

    it('should remove the thumbnails when another document loads', async () => {
      await loadDocument(viewer, 'links.pdf');
      await nextRender();
      expect(getThumbnails()).to.have.lengthOf(4);
    });
  });

  describe('narrow viewer', () => {
    beforeEach(async () => {
      viewer.style.width = '360px';
      viewer.sidebarOpened = true;
      await nextRender();
    });

    it('should show the sidebar over the pages', () => {
      expect(getComputedStyle(getSidebar()).position).to.equal('absolute');
    });

    it('should close the sidebar with Escape and focus the toggle button', async () => {
      getThumbnails()[0].focus();
      await sendKeys({ press: 'Escape' });
      await nextRender();
      expect(viewer.sidebarOpened).to.be.false;
      expect(document.activeElement).to.equal(getToggle());
    });

    it('should close the sidebar and focus the toggle button after going to a clicked thumbnail', async () => {
      getThumbnails()[3].focus();
      getThumbnails()[3].click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(4);
      expect(viewer.sidebarOpened).to.be.false;
      expect(document.activeElement).to.equal(getToggle());
    });

    it('should close the sidebar after going to a thumbnail with Enter', async () => {
      getThumbnails()[0].focus();
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(2);
      expect(viewer.sidebarOpened).to.be.false;
    });

    it('should keep the width of the pages', () => {
      const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
      expect(content.getBoundingClientRect().left).to.be.closeTo(viewer.getBoundingClientRect().left + 1, 1);
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
    });

    it('should only render the thumbnails near the visible part of the sidebar', async () => {
      await waitForThumbnail(1);
      const rendered = getThumbnails().filter((thumbnail) => thumbnail.querySelector('canvas'));
      expect(rendered.length).to.be.greaterThan(0);
      expect(rendered.length).to.be.lessThan(20);
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
  });

  describe('outdated thumbnails', () => {
    /**
     * Makes the document wait with returning the first page until the returned
     * function is called. The page is loaded already, so that it is returned
     * also when the document has been unloaded meanwhile.
     */
    async function delayFirstPage() {
      const pdfDocument = (viewer as any)._pdfDocument;
      const getPage = pdfDocument.getPage.bind(pdfDocument);
      const firstPage = await getPage(1);
      let release!: () => void;
      const released = new Promise<void>((resolve) => {
        release = resolve;
      });
      const stub = sinon.stub(pdfDocument, 'getPage').callsFake(async (pageNumber: unknown) => {
        if (pageNumber === 1) {
          await released;
          return firstPage;
        }
        return getPage(pageNumber);
      });
      return { stub, release };
    }

    it('should render the thumbnails of a new document after an outdated thumbnail finishes', async () => {
      const { stub, release } = await delayFirstPage();
      viewer.sidebarOpened = true;
      for (let i = 0; i < 50 && !stub.calledWith(1); i++) {
        await nextFrame();
      }
      expect(stub).to.be.calledWith(1);

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
        const { stub, release } = await delayFirstPage();
        viewer.sidebarOpened = true;
        for (let i = 0; i < 50 && !stub.calledWith(1); i++) {
          await nextFrame();
        }
        expect(stub).to.be.calledWith(1);

        getList().scrollTop = getList().scrollHeight / 2;
        // Let the thumbnails that became visible wait for the outdated one.
        for (let i = 0; i < 5; i++) {
          await nextFrame();
        }
        release();
        const visible = getThumbnails().find((thumbnail) => {
          const rect = thumbnail.getBoundingClientRect();
          const list = getList().getBoundingClientRect();
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
});
