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
      expect(thumbnails[0].getAttribute('aria-selected')).to.equal('false');
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
        await sendKeys({ press: 'Enter' });
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(3);
        expect(viewer.shadowRoot!.activeElement).to.equal(getThumbnails()[2]);
      });
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
});
