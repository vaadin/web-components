import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { loadDocument, nextRenderIdle } from './helpers.js';

describe('outline', () => {
  let viewer: PdfViewer;

  function getOutline() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="outline"]')!;
  }

  function getItems() {
    return [...viewer.shadowRoot!.querySelectorAll<HTMLElement>('[role="treeitem"]')];
  }

  function getItem(title: string) {
    return getItems().find((item) => item.querySelector('[part="outline-item-title"]')!.textContent === title)!;
  }

  function getViewButtons() {
    return [...viewer.querySelectorAll<HTMLElement>('vaadin-button[slot="sidebar-header"]')];
  }

  async function waitForOutline() {
    for (let i = 0; i < 50 && !getViewButtons().length; i++) {
      await nextFrame();
    }
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 700px; height: 500px" sidebar-opened></vaadin-pdf-viewer>');
    await nextRender();
  });

  describe('document without outline', () => {
    beforeEach(async () => {
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    it('should not show the view buttons or the outline', () => {
      expect(getViewButtons()).to.be.empty;
      expect(getOutline().hidden).to.be.true;
    });
  });

  describe('document with outline', () => {
    beforeEach(async () => {
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'outline.pdf');
      await idle;
      await waitForOutline();
    });

    it('should show the thumbnails by default', () => {
      expect(getOutline().hidden).to.be.true;
      expect(getViewButtons()[0].getAttribute('aria-pressed')).to.equal('true');
    });

    describe('outline view', () => {
      beforeEach(async () => {
        getViewButtons()[1].click();
        await nextRender();
      });

      it('should show the outline', () => {
        expect(getOutline().hidden).to.be.false;
        expect(getOutline().getAttribute('role')).to.equal('tree');
        expect(getOutline().getAttribute('aria-label')).to.equal('Outline');
      });

      it('should show the top-level items collapsed', () => {
        expect(getItems().map((item) => item.textContent!.trim())).to.deep.equal([
          'Chapter 1',
          'Chapter 2',
          'Chapter 3',
        ]);
        expect(getItem('Chapter 1').getAttribute('aria-expanded')).to.equal('false');
        expect(getItem('Chapter 2').hasAttribute('aria-expanded')).to.be.false;
      });

      it('should set the level and position of the items', () => {
        const item = getItem('Chapter 2');
        expect(item.getAttribute('aria-level')).to.equal('1');
        expect(item.getAttribute('aria-posinset')).to.equal('2');
        expect(item.getAttribute('aria-setsize')).to.equal('3');
      });

      it('should expand an item when clicking its toggle', async () => {
        getItem('Chapter 1').querySelector<HTMLElement>('[part="outline-toggle"]')!.click();
        await nextRender();
        expect(getItem('Chapter 1').getAttribute('aria-expanded')).to.equal('true');
        expect(getItem('Section 1.2').getAttribute('aria-level')).to.equal('2');
      });

      it('should go to the destination of a clicked item', async () => {
        getItem('Chapter 3').querySelector<HTMLElement>('[part="outline-item-title"]')!.click();
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(3);
      });

      describe('keyboard', () => {
        beforeEach(() => {
          getItem('Chapter 1').focus();
        });

        it('should have one tab stop', () => {
          const tabStops = getItems().filter((item) => item.getAttribute('tabindex') === '0');
          expect(tabStops).to.deep.equal([getItem('Chapter 1')]);
        });

        it('should move focus with ArrowDown and ArrowUp', async () => {
          await sendKeys({ press: 'ArrowDown' });
          await nextRender();
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Chapter 2'));
          await sendKeys({ press: 'ArrowUp' });
          await nextRender();
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Chapter 1'));
        });

        it('should expand with ArrowRight, then move to the first child', async () => {
          await sendKeys({ press: 'ArrowRight' });
          await nextRender();
          expect(getItem('Chapter 1').getAttribute('aria-expanded')).to.equal('true');
          await sendKeys({ press: 'ArrowRight' });
          await nextRender();
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Section 1.1'));
        });

        it('should move to the parent, then collapse with ArrowLeft', async () => {
          await sendKeys({ press: 'ArrowRight' });
          await nextRender();
          await sendKeys({ press: 'ArrowRight' });
          await nextRender();
          await sendKeys({ press: 'ArrowLeft' });
          await nextRender();
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Chapter 1'));
          await sendKeys({ press: 'ArrowLeft' });
          await nextRender();
          expect(getItem('Chapter 1').getAttribute('aria-expanded')).to.equal('false');
        });

        it('should move focus to the last visible item with End', async () => {
          await sendKeys({ press: 'End' });
          await nextRender();
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Chapter 3'));
        });

        it('should go to the destination with Enter and keep focus in the outline', async () => {
          await sendKeys({ press: 'ArrowDown' });
          await nextRender();
          await sendKeys({ press: 'Enter' });
          await nextRenderIdle(viewer);
          expect(viewer.page).to.equal(2);
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Chapter 2'));
        });
      });
    });

    it('should hide the outline when a document without outline loads', async () => {
      getViewButtons()[1].click();
      await nextRender();
      await loadDocument(viewer, 'multi-page.pdf');
      await nextRender();
      expect(getOutline().hidden).to.be.true;
      expect(getViewButtons()).to.be.empty;
      const thumbnails = viewer.shadowRoot!.querySelector<HTMLElement>('[part="thumbnails"]')!;
      expect(thumbnails.hidden).to.be.false;
    });
  });
});
