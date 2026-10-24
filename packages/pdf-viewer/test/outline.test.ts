import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdf, getPdfDocumentPrototype, loadDocument, nextRenderIdle } from './helpers.js';

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

  function getToggle(title: string) {
    return getItem(title).querySelector<HTMLElement>('[part~="outline-toggle"]')!;
  }

  function getTitle(title: string) {
    return getItem(title).querySelector<HTMLElement>('[part="outline-item-title"]')!;
  }

  function getViewButtons() {
    return [...viewer.querySelectorAll<HTMLElement>('vaadin-pdf-viewer-button[slot="sidebar-header"]')];
  }

  function getSidebarToggle() {
    return viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[icon="sidebar"]')!;
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
      expect(viewer.shadowRoot!.querySelector<HTMLElement>('[part="sidebar-header"]')!.hidden).to.be.true;
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
      expect(getViewButtons()[1].getAttribute('aria-pressed')).to.equal('false');
    });

    it('should label the view buttons and their group', () => {
      expect(getViewButtons().map((button) => button.getAttribute('aria-label'))).to.deep.equal([
        'Thumbnails',
        'Outline',
      ]);
      const header = viewer.shadowRoot!.querySelector<HTMLElement>('[part="sidebar-header"]')!;
      expect(header.getAttribute('role')).to.equal('group');
      expect(header.getAttribute('aria-label')).to.equal('Sidebar view');
    });

    it('should keep the rendered thumbnails while the outline is shown', async () => {
      const getCanvas = () => viewer.shadowRoot!.querySelector('[part~="thumbnail"] canvas');
      for (let i = 0; i < 100 && !getCanvas(); i++) {
        await nextFrame();
      }
      expect(getCanvas()).to.be.ok;
      getViewButtons()[1].click();
      await nextRender();
      await nextRender();
      expect(getCanvas()).to.be.ok;
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
        expect(getViewButtons()[1].getAttribute('aria-pressed')).to.equal('true');
      });

      it('should show the thumbnails again with the thumbnails button', async () => {
        getViewButtons()[0].click();
        await nextRender();
        expect(getOutline().hidden).to.be.true;
        expect(viewer.shadowRoot!.querySelector<HTMLElement>('[part="thumbnails"]')!.hidden).to.be.false;
      });

      it('should scroll the thumbnail of the current page into view when showing the thumbnails again', async () => {
        const list = viewer.shadowRoot!.querySelector<HTMLElement>('[part="thumbnails"]')!;
        viewer.style.height = '300px';
        viewer.page = 3;
        await nextRenderIdle(viewer);
        getViewButtons()[0].click();
        await nextRender();
        const thumbnail = viewer.shadowRoot!.querySelectorAll('[part~="thumbnail"]')[2].getBoundingClientRect();
        expect(thumbnail.top).to.be.at.least(list.getBoundingClientRect().top - 1);
        expect(thumbnail.bottom).to.be.at.most(list.getBoundingClientRect().bottom + 1);
      });

      it('should use i18n for the labels', async () => {
        viewer.i18n = { outline: 'Disposition', thumbnailsView: 'Miniatyrer', sidebarView: 'Vy' };
        await nextRender();
        expect(getOutline().getAttribute('aria-label')).to.equal('Disposition');
        expect(getViewButtons()[0].getAttribute('aria-label')).to.equal('Miniatyrer');
        expect(getViewButtons()[1].getAttribute('aria-label')).to.equal('Disposition');
      });

      it('should mark the item of the current page', async () => {
        await nextRender();
        expect(getItem('Chapter 1').getAttribute('aria-current')).to.equal('location');
        viewer.page = 3;
        await nextRenderIdle(viewer);
        await nextRender();
        expect(getItem('Chapter 3').getAttribute('aria-current')).to.equal('location');
        expect(getItem('Chapter 1').hasAttribute('aria-current')).to.be.false;
      });

      it('should mark a clicked item that starts on the same page as others', async () => {
        getToggle('Chapter 1').click();
        await nextRender();
        getTitle('Section 1.2').click();
        await nextRender();
        await nextRender();
        expect(getItem('Section 1.2').getAttribute('aria-current')).to.equal('location');
        expect(getItem('Chapter 1').hasAttribute('aria-current')).to.be.false;
      });

      it('should move the tab stop to the item of the current page', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        await nextRender();
        const tabStops = getItems().filter((item) => item.getAttribute('tabindex') === '0');
        expect(tabStops).to.deep.equal([getItem('Chapter 3')]);
      });

      it('should keep the tab stop on the focused item while focus is in the outline', async () => {
        getItem('Chapter 2').focus();
        getItem('Chapter 2').click();
        await nextRender();
        viewer.page = 3;
        await nextRenderIdle(viewer);
        await nextRender();
        expect(getItem('Chapter 2').getAttribute('tabindex')).to.equal('0');
      });

      it('should add the current part name to the item of the current page', async () => {
        await nextRender();
        expect(getItem('Chapter 1').part.contains('current')).to.be.true;
        expect(getItem('Chapter 3').part.contains('current')).to.be.false;
      });

      it('should add the expanded part name to the toggle of an expanded item', async () => {
        expect(getToggle('Chapter 1').part.contains('expanded')).to.be.false;
        getToggle('Chapter 1').click();
        await nextRender();
        expect(getToggle('Chapter 1').part.contains('expanded')).to.be.true;
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

      it('should name an item by its title only, also when expanded', async () => {
        getToggle('Chapter 1').click();
        await nextRender();
        expect(getItem('Chapter 1').getAttribute('aria-label')).to.equal('Chapter 1');
      });

      it('should set the level and position of the items', () => {
        const item = getItem('Chapter 2');
        expect(item.getAttribute('aria-level')).to.equal('1');
        expect(item.getAttribute('aria-posinset')).to.equal('2');
        expect(item.getAttribute('aria-setsize')).to.equal('3');
      });

      it('should expand an item when clicking its toggle', async () => {
        getToggle('Chapter 1').click();
        await nextRender();
        expect(getItem('Chapter 1').getAttribute('aria-expanded')).to.equal('true');
        expect(getItem('Section 1.2').getAttribute('aria-level')).to.equal('2');
      });

      it('should collapse an item when clicking its toggle again', async () => {
        getToggle('Chapter 1').click();
        await nextRender();
        getToggle('Chapter 1').click();
        await nextRender();
        expect(getItem('Chapter 1').getAttribute('aria-expanded')).to.equal('false');
        expect(getItem('Section 1.2')).to.be.undefined;
      });

      it('should go to the destination of a clicked item', async () => {
        getTitle('Chapter 3').click();
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(3);
      });

      it('should keep the sidebar open after going to a clicked item', async () => {
        getTitle('Chapter 3').click();
        await nextRenderIdle(viewer);
        expect(viewer.sidebarOpened).to.be.true;
      });

      it('should scroll to the position of the destination of an item', async () => {
        getToggle('Chapter 1').click();
        await nextRender();
        getTitle('Section 1.2').click();
        await nextRenderIdle(viewer);
        const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
        const heading = [...viewer.shadowRoot!.querySelectorAll('.text-layer span:not(.markedContent)')].find(
          (span) => span.textContent === 'Section 1.2',
        )!;
        // The destination is the top of the heading, which is in the middle of the page
        const offset = heading.getBoundingClientRect().top - content.getBoundingClientRect().top;
        expect(content.scrollTop).to.be.greaterThan(0);
        expect(offset).to.be.within(-10, 40);
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

        it('should swap ArrowRight and ArrowLeft in RTL', async () => {
          viewer.setAttribute('dir', 'rtl');
          await nextRender();
          await sendKeys({ press: 'ArrowLeft' });
          await nextRender();
          expect(getItem('Chapter 1').getAttribute('aria-expanded')).to.equal('true');
          await sendKeys({ press: 'ArrowRight' });
          await nextRender();
          expect(getItem('Chapter 1').getAttribute('aria-expanded')).to.equal('false');
        });

        it('should move focus to the last visible item with End', async () => {
          await sendKeys({ press: 'End' });
          await nextRender();
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Chapter 3'));
        });

        it('should move focus to the first item with Home', async () => {
          await sendKeys({ press: 'End' });
          await nextRender();
          await sendKeys({ press: 'Home' });
          await nextRender();
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Chapter 1'));
        });

        it('should go to the destination with Enter and keep focus in the outline', async () => {
          await sendKeys({ press: 'ArrowDown' });
          await nextRender();
          const idle = nextRenderIdle(viewer);
          await sendKeys({ press: 'Enter' });
          await idle;
          expect(viewer.page).to.equal(2);
          expect(viewer.shadowRoot!.activeElement).to.equal(getItem('Chapter 2'));
        });
      });

      describe('narrow viewer', () => {
        beforeEach(async () => {
          viewer.style.width = '360px';
          await nextRender();
        });

        it('should close the sidebar and focus the toggle button after going to a clicked item', async () => {
          getItem('Chapter 3').focus();
          getTitle('Chapter 3').click();
          await nextRenderIdle(viewer);
          expect(viewer.page).to.equal(3);
          expect(viewer.sidebarOpened).to.be.false;
          expect(document.activeElement).to.equal(getSidebarToggle());
        });

        it('should keep the sidebar open when expanding an item', async () => {
          getToggle('Chapter 1').click();
          await nextRender();
          expect(viewer.sidebarOpened).to.be.true;
        });

        it('should close the sidebar with Escape and focus the toggle button', async () => {
          getItem('Chapter 1').focus();
          await sendKeys({ press: 'Escape' });
          await nextRender();
          expect(viewer.sidebarOpened).to.be.false;
          expect(document.activeElement).to.equal(getSidebarToggle());
        });

        it('should close the sidebar with Escape on a view button and focus the toggle button', async () => {
          getViewButtons()[1].focus();
          await sendKeys({ press: 'Escape' });
          await nextRender();
          expect(viewer.sidebarOpened).to.be.false;
          expect(document.activeElement).to.equal(getSidebarToggle());
        });
      });
    });

    it('should not throw when removed while showing the outline', async () => {
      const errorSpy = sinon.spy();
      window.addEventListener('error', errorSpy);
      try {
        getViewButtons()[1].click();
        await nextRender();
        viewer.remove();
        await nextRender();
        expect(errorSpy).to.be.not.called;
      } finally {
        window.removeEventListener('error', errorSpy);
      }
    });

    it('should remove the outline when src is cleared', async () => {
      getViewButtons()[1].click();
      await nextRender();
      viewer.src = undefined;
      await nextRender();
      expect(getViewButtons()).to.be.empty;
      expect(getItems()).to.be.empty;
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

  describe('outdated outline', () => {
    let getOutlineStub: sinon.SinonStub;

    afterEach(() => {
      getOutlineStub.restore();
    });

    it('should not show the outline of a document that was replaced while its outline loaded', async () => {
      const prototype = await getPdfDocumentPrototype();
      const original = prototype.getOutline;
      let release!: () => void;
      const released = new Promise<void>((resolve) => {
        release = resolve;
      });
      getOutlineStub = sinon.stub(prototype, 'getOutline').callsFake(async function (this: unknown) {
        const outline = await original.call(this);
        // Only the first document waits
        if (outline) {
          await released;
        }
        return outline;
      });
      await loadDocument(viewer, 'outline.pdf');
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
      release();
      for (let i = 0; i < 10; i++) {
        await nextFrame();
      }
      expect(getViewButtons()).to.be.empty;
      expect(getItems()).to.be.empty;
    });
  });

  describe('external links', () => {
    let url: string;
    let open: sinon.SinonStub;

    beforeEach(async () => {
      open = sinon.stub(window, 'open');
      url = createPdf([{ content: 'BT /F1 24 Tf 72 700 Td (Links) Tj ET' }], {
        outline: [
          { title: 'Vaadin', action: '<< /S /URI /URI (https://vaadin.com/) >>' },
          { title: 'File server', action: '<< /S /URI /URI (ftp://example.com/file.pdf) >>' },
        ],
      });
      const idle = nextRenderIdle(viewer);
      viewer.src = url;
      await idle;
      await waitForOutline();
      getViewButtons()[1].click();
      await nextRender();
    });

    afterEach(() => {
      open.restore();
      URL.revokeObjectURL(url);
    });

    it('should open the URL of an item in a new tab', () => {
      getTitle('Vaadin').click();
      expect(open).to.be.calledOnceWith('https://vaadin.com/', '_blank', 'noopener,noreferrer');
    });

    it('should not open a URL with a protocol that is not allowed', () => {
      getTitle('File server').click();
      expect(open).to.be.not.called;
      expect(getItem('File server').getAttribute('aria-disabled')).to.equal('true');
      expect(getItem('Vaadin').hasAttribute('aria-disabled')).to.be.false;
    });
  });
});
