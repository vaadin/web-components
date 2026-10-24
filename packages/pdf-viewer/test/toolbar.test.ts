import { expect } from '@vaadin/chai-plugins';
import { sendKeys, setTouchEmulation } from '@vaadin/test-runner-commands';
import { fixtureSync, isChrome, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { IntegerField } from '@vaadin/integer-field';
import type { Select } from '@vaadin/select';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { createPdfUrl, fixtureUrl, loadDocument, nextRenderIdle } from './helpers.js';

describe('toolbar', () => {
  let viewer: PdfViewer;

  function getButton(icon: string) {
    return viewer.querySelector<HTMLElement & { disabled: boolean }>(`vaadin-pdf-viewer-button[icon="${icon}"]`)!;
  }

  function getPageField() {
    return viewer.querySelector<IntegerField>('vaadin-integer-field')!;
  }

  function getZoomSelect() {
    return viewer.querySelector<Select>('vaadin-select')!;
  }

  function getToolbar() {
    return viewer.shadowRoot!.querySelector<HTMLElement>('[part="toolbar"]')!;
  }

  function getGroup(name: string) {
    return viewer.shadowRoot!.querySelector<HTMLElement>(`[part~="toolbar-group"].${name}`)!;
  }

  function getAnnouncement() {
    return [...document.body.children].find((element) => element.hasAttribute('aria-live'))!.textContent;
  }

  beforeEach(async () => {
    // The language sets the format of the zoom levels.
    viewer = fixtureSync('<vaadin-pdf-viewer lang="en" style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
  });

  function expectControlsDisabled() {
    ['previous-page', 'next-page', 'zoom-out', 'zoom-in'].forEach((icon) => {
      expect(getButton(icon).disabled).to.be.true;
    });
    expect(getPageField().disabled).to.be.true;
    expect(getZoomSelect().disabled).to.be.true;
  }

  describe('without document', () => {
    it('should disable the controls', () => {
      expectControlsDisabled();
    });

    it('should disable the controls while a document loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextFrame();
      expectControlsDisabled();
    });

    it('should disable the controls when the document could not be loaded', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      expectControlsDisabled();
    });

    it('should disable the controls when src is cleared', async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      viewer.src = '';
      await nextFrame();
      expectControlsDisabled();
    });
  });

  describe('with document', () => {
    beforeEach(async () => {
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    describe('page navigation', () => {
      it('should show the current page in the page field', () => {
        expect(getPageField().value).to.equal('1');
      });

      it('should update the page field when the page changes', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        expect(getPageField().value).to.equal('3');
      });

      it('should go to the next page when clicking next page', async () => {
        getButton('next-page').click();
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(2);
      });

      it('should go to the previous page when clicking previous page', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        getButton('previous-page').click();
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(2);
      });

      it('should toggle disabled on previous page button on the first page', async () => {
        expect(getButton('previous-page').disabled).to.be.true;
        viewer.page = 2;
        await nextRenderIdle(viewer);
        expect(getButton('previous-page').disabled).to.be.false;
      });

      it('should toggle disabled on next page button on the last page', async () => {
        expect(getButton('next-page').disabled).to.be.false;
        viewer.page = 6;
        await nextRenderIdle(viewer);
        expect(getButton('next-page').disabled).to.be.true;
      });

      it('should go to the page entered in the page field', async () => {
        const field = getPageField();
        field.focus();
        (field.inputElement as HTMLInputElement).select();
        await sendKeys({ type: '4' });
        const idle = nextRenderIdle(viewer);
        await sendKeys({ press: 'Enter' });
        await idle;
        expect(viewer.page).to.equal(4);
      });

      it('should not submit a form that contains the viewer on Enter in the page field', async () => {
        const form = document.createElement('form');
        viewer.parentElement!.appendChild(form);
        form.appendChild(viewer);
        const spy = sinon.spy((event: Event) => event.preventDefault());
        form.addEventListener('submit', spy);
        const field = getPageField();
        field.focus();
        (field.inputElement as HTMLInputElement).select();
        await sendKeys({ type: '4' });
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        expect(spy).to.be.not.called;
      });

      it('should include the page count in the accessible name of the page field', () => {
        expect(getPageField().accessibleName).to.equal('Page of 6');
      });

      it('should not let the change and input events of the page field reach the application', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('change', spy);
        viewer.addEventListener('input', spy);
        const field = getPageField();
        field.focus();
        (field.inputElement as HTMLInputElement).select();
        await sendKeys({ type: '4' });
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        expect(spy).to.be.not.called;
      });

      it('should leave the page field empty for a page out of range', async () => {
        const stub = sinon.stub(console, 'warn');
        try {
          viewer.page = 10;
          await nextFrame();
          expect(getPageField().value).to.equal('');
          expect(getPageField().invalid).to.be.false;
        } finally {
          stub.restore();
        }
      });

      describe('page out of range', () => {
        beforeEach(async () => {
          const field = getPageField();
          field.focus();
          (field.inputElement as HTMLInputElement).select();
          await sendKeys({ type: '999' });
          await sendKeys({ press: 'Enter' });
          await nextFrame();
        });

        function getPageError() {
          return viewer.querySelector<HTMLElement>('[slot="page-error"]')!;
        }

        it('should keep the entered page and mark the field invalid', () => {
          const field = getPageField();
          expect(viewer.page).to.equal(1);
          expect(field.value).to.equal('999');
          expect(field.invalid).to.be.true;
        });

        it('should explain the error with a localized message', async () => {
          expect(getPageError().textContent).to.equal('Enter 1–6');
          expect(getPageError().checkVisibility()).to.be.true;
          viewer.i18n = { pageError: 'Skriv inn en side fra 1 til {pageCount}' };
          await nextFrame();
          expect(getPageError().textContent).to.equal('Skriv inn en side fra 1 til 6');
        });

        it('should describe the page field with the error message', () => {
          const input = getPageField().inputElement as HTMLInputElement;
          expect(input.getAttribute('aria-describedby')!.split(' ')).to.include(getPageError().id);
          expect(input.getAttribute('aria-invalid')).to.equal('true');
        });

        it('should keep the entered page when the toolbar is updated', async () => {
          viewer.zoom = 2;
          await nextRenderIdle(viewer);
          expect(getPageField().value).to.equal('999');
          expect(getPageField().invalid).to.be.true;
        });

        it('should go to a page entered after it', async () => {
          (getPageField().inputElement as HTMLInputElement).select();
          await sendKeys({ type: '4' });
          await sendKeys({ press: 'Enter' });
          await nextRenderIdle(viewer);
          expect(viewer.page).to.equal(4);
          expect(getPageField().value).to.equal('4');
          expect(getPageField().invalid).to.be.false;
        });

        it('should show the current page again when the page changes', async () => {
          viewer.page = 3;
          await nextRenderIdle(viewer);
          expect(getPageField().value).to.equal('3');
          expect(getPageField().invalid).to.be.false;
          expect(getPageError().textContent).to.equal('');
        });

        it('should show the current page again when the field is cleared', async () => {
          const field = getPageField();
          (field.inputElement as HTMLInputElement).select();
          await sendKeys({ press: 'Backspace' });
          await sendKeys({ press: 'Enter' });
          await nextFrame();
          expect(field.value).to.equal('1');
          expect(field.invalid).to.be.false;
        });
      });

      describe('announcements', () => {
        let clock: sinon.SinonFakeTimers;

        beforeEach(() => {
          clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
        });

        afterEach(() => {
          clock.restore();
        });

        it('should announce the page when navigating with the toolbar', async () => {
          getButton('next-page').click();
          await clock.tickAsync(200);
          expect(getAnnouncement()).to.equal('Page 2 of 6');
        });

        it('should announce the page when going to the page entered in the page field', async () => {
          const field = getPageField();
          field.focus();
          (field.inputElement as HTMLInputElement).select();
          await sendKeys({ type: '4' });
          await sendKeys({ press: 'Enter' });
          await clock.tickAsync(200);
          expect(getAnnouncement()).to.equal('Page 4 of 6');
        });

        it('should use i18n for the page announcement', async () => {
          viewer.i18n = { pageAnnouncement: 'Sida {page} av {pageCount}' };
          await clock.tickAsync(20);
          getButton('next-page').click();
          await clock.tickAsync(200);
          expect(getAnnouncement()).to.equal('Sida 2 av 6');
        });
      });

      it('should move focus to the page field when the focused next page button gets disabled', async () => {
        viewer.page = 5;
        await nextRenderIdle(viewer);
        getButton('next-page').focus();
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        expect(viewer.page).to.equal(6);
        expect(document.activeElement).to.equal(getPageField().inputElement);
      });
    });

    describe('zoom', () => {
      it('should show the zoom in the zoom select', () => {
        expect(getZoomSelect().value).to.equal('page-width');
      });

      it('should show page width in the zoom select for an invalid zoom', async () => {
        const stub = sinon.stub(console, 'warn');
        try {
          viewer.zoom = 2;
          await nextRenderIdle(viewer);
          viewer.zoom = 0;
          await nextRenderIdle(viewer);
          expect(getZoomSelect().value).to.equal('page-width');
        } finally {
          stub.restore();
        }
      });

      it('should show a zoom that is not one of the levels', async () => {
        viewer.zoom = 1.1;
        await nextRenderIdle(viewer);
        const select = getZoomSelect();
        expect(select.value).to.equal('1.1');
        expect(select.items!.find((item) => item.value === '1.1')!.label).to.equal('110%');
      });

      it('should zoom in to the next level', async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        getButton('zoom-in').click();
        await nextRenderIdle(viewer);
        expect(viewer.zoom).to.equal(1.25);
      });

      it('should zoom out to the previous level', async () => {
        viewer.zoom = 1;
        await nextRenderIdle(viewer);
        getButton('zoom-out').click();
        await nextRenderIdle(viewer);
        expect(viewer.zoom).to.equal(0.75);
      });

      it('should zoom in from a fit zoom to the next level above its scale', async () => {
        // 600px wide, so page-width is between 50% and 75%
        getButton('zoom-in').click();
        await nextRenderIdle(viewer);
        expect(viewer.zoom).to.equal(0.75);
      });

      it('should fire zoom-changed event when zooming with the toolbar', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('zoom-changed', spy);
        getButton('zoom-in').click();
        await nextRenderIdle(viewer);
        expect(spy).to.be.calledOnce;
      });

      it('should toggle disabled on zoom in button at the largest zoom', async () => {
        viewer.zoom = 4;
        await nextRenderIdle(viewer);
        expect(getButton('zoom-in').disabled).to.be.true;
        viewer.zoom = 3;
        await nextRenderIdle(viewer);
        expect(getButton('zoom-in').disabled).to.be.false;
      });

      it('should toggle disabled on zoom out button at the smallest zoom', async () => {
        viewer.zoom = 0.25;
        await nextRenderIdle(viewer);
        expect(getButton('zoom-out').disabled).to.be.true;
        viewer.zoom = 0.5;
        await nextRenderIdle(viewer);
        expect(getButton('zoom-out').disabled).to.be.false;
      });

      describe('announcements', () => {
        let clock: sinon.SinonFakeTimers;

        beforeEach(async () => {
          viewer.zoom = 1;
          await nextRenderIdle(viewer);
          clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
        });

        afterEach(() => {
          clock.restore();
        });

        it('should announce the zoom when zooming with the zoom buttons', async () => {
          getButton('zoom-in').click();
          await clock.tickAsync(200);
          expect(getAnnouncement()).to.equal('125%');
        });
      });
    });

    describe('i18n', () => {
      it('should use i18n for the accessible names', async () => {
        viewer.i18n = {
          nextPage: 'Nästa sida',
          page: 'Sida',
          pageOf: 'Sida av {pageCount}',
          zoom: 'Zooma',
          toolbar: 'PDF-verktygsfält',
        };
        await nextFrame();
        expect(getButton('next-page').getAttribute('aria-label')).to.equal('Nästa sida');
        expect(getPageField().accessibleName).to.equal('Sida av 6');
        expect(getZoomSelect().accessibleName).to.equal('Zooma');
        expect(getToolbar().getAttribute('aria-label')).to.equal('PDF-verktygsfält');
      });

      it('should format the zoom levels in the language of the viewer', async () => {
        viewer.setAttribute('lang', 'de');
        viewer.zoom = 1.25;
        await nextRenderIdle(viewer);
        const item = getZoomSelect().items!.find(({ value }) => value === '1.25')!;
        expect(item.label).to.equal('125\u00a0%');
      });

      it('should use i18n for the fit zoom levels', async () => {
        viewer.i18n = { pageWidth: 'Sidbredd', pageFit: 'Hela sidan' };
        await nextFrame();
        const labels = getZoomSelect().items!.map((item) => item.label);
        expect(labels).to.include.members(['Sidbredd', 'Hela sidan']);
      });
    });
  });

  it('should show the toolbar and the find bar without scrolling on a narrow viewer', async () => {
    viewer.style.cssText = 'width: 320px; height: 400px';
    const idle = nextRenderIdle(viewer);
    await loadDocument(viewer, 'multi-page.pdf');
    await idle;
    getButton('find').click();
    await nextRender();
    const area = getToolbar().parentElement!;
    expect(area.scrollHeight).to.be.at.most(area.clientHeight);
  });

  describe('groups', () => {
    beforeEach(async () => {
      viewer.style.width = '900px';
      // An application control in the action group
      const button = document.createElement('button');
      button.slot = 'toolbar-actions';
      button.textContent = 'Approve';
      viewer.appendChild(button);
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    /** Returns the icons of the buttons in a group, in the order they are shown. */
    function getGroupIcons(group: string) {
      const element = getGroup(group);
      return [...viewer.querySelectorAll<HTMLElement>('vaadin-pdf-viewer-button')]
        .filter((button) => element.contains(button.assignedSlot))
        .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)
        .map((button) => button.getAttribute('icon'));
    }

    it('should group the controls into navigation, viewing options and actions', () => {
      expect(getGroupIcons('navigation')).to.deep.equal(['sidebar', 'previous-page', 'next-page']);
      expect(getGroupIcons('viewing')).to.deep.equal(['zoom-out', 'zoom-in']);
      expect(getGroupIcons('actions')).to.deep.equal(['find', 'download', 'print']);
    });

    it('should show the find button before the download button', () => {
      expect(getButton('find').getBoundingClientRect().right).to.be.at.most(
        getButton('download').getBoundingClientRect().left,
      );
    });

    it('should place the groups at the start, middle and end of a wide toolbar', () => {
      const toolbar = getToolbar().getBoundingClientRect();
      const [navigation, viewing, actions] = ['navigation', 'viewing', 'actions'].map((group) =>
        getGroup(group).getBoundingClientRect(),
      );
      expect(navigation.left - toolbar.left).to.be.lessThan(20);
      expect(toolbar.right - actions.right).to.be.lessThan(20);
      expect(viewing.left + viewing.width / 2).to.be.closeTo(toolbar.left + toolbar.width / 2, 2);
    });

    it('should size the page field for the number of digits of the page count', async () => {
      const narrow = getPageField().getBoundingClientRect().width;
      const url = createPdfUrl(120);
      try {
        const loaded = oneEvent(viewer, 'document-load');
        viewer.src = url;
        await loaded;
        await nextFrame();
        expect(getPageField().getBoundingClientRect().width).to.be.greaterThan(narrow);
      } finally {
        URL.revokeObjectURL(url);
      }
    });

    it('should use the page field width set with the custom property', async () => {
      viewer.style.setProperty('--vaadin-pdf-viewer-page-field-width', '200px');
      await nextFrame();
      expect(getPageField().getBoundingClientRect().width).to.equal(200);
    });

    it('should use the zoom select width set with the custom property', async () => {
      viewer.style.setProperty('--vaadin-pdf-viewer-zoom-select-width', '200px');
      await nextFrame();
      expect(getZoomSelect().getBoundingClientRect().width).to.equal(200);
    });

    it('should show the zoom select joined with its buttons', () => {
      const zoomControls = viewer.shadowRoot!.querySelector('[part~="zoom-controls"]')!;
      expect(getZoomSelect().assignedSlot!.parentElement).to.equal(zoomControls);
      expect(getComputedStyle(getZoomSelect()).getPropertyValue('--vaadin-input-field-border-width').trim()).to.equal(
        '0px',
      );
    });

    it('should center the value of the zoom select', () => {
      expect(getZoomSelect().getAttribute('theme')).to.equal('align-center');
    });

    it('should show the page buttons before the page field, not joined with it', () => {
      expect(getPageField().assignedSlot!.parentElement).to.equal(getGroup('navigation'));
      const field = getPageField().getBoundingClientRect();
      expect(getButton('previous-page').getBoundingClientRect().right).to.be.at.most(field.left);
      expect(getButton('next-page').getBoundingClientRect().right).to.be.at.most(field.left);
    });

    ['ltr', 'rtl'].forEach((dir) => {
      it(`should start the groups from the start edge of a narrow toolbar in ${dir}`, async () => {
        viewer.setAttribute('dir', dir);
        viewer.style.width = '360px';
        await nextFrame();
        const toolbar = getToolbar().getBoundingClientRect();
        const groups = [...viewer.shadowRoot!.querySelectorAll('[part~="toolbar-group"]')].map((group) =>
          group.getBoundingClientRect(),
        );
        // Groups on the same line overlap vertically.
        const lines: DOMRect[][] = [];
        groups.forEach((group) => {
          const line = lines.find(([first]) => group.top < first.bottom && group.bottom > first.top);
          if (line) {
            line.push(group);
          } else {
            lines.push([group]);
          }
        });
        expect(lines.length).to.be.greaterThan(1);
        // Each line starts at the start edge.
        lines.forEach((line) => {
          const offset =
            dir === 'ltr'
              ? Math.min(...line.map((group) => group.left)) - toolbar.left
              : toolbar.right - Math.max(...line.map((group) => group.right));
          expect(offset).to.be.lessThan(20);
        });
      });
    });
  });

  // Only Chromium can emulate a touch device in the tests.
  (isChrome ? describe : describe.skip)('touch device', () => {
    beforeEach(async () => {
      await setTouchEmulation(true);
      viewer.style.width = '900px';
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    afterEach(async () => {
      await setTouchEmulation(false);
    });

    it('should not collapse the toolbar by default', async () => {
      const touchViewer = fixtureSync<PdfViewer>('<vaadin-pdf-viewer header-visible></vaadin-pdf-viewer>');
      await loadDocument(touchViewer, 'multi-page.pdf');
      await nextFrame();
      expect(touchViewer.toolbarCollapsed).to.be.false;
      const toolbar = touchViewer.shadowRoot!.querySelector<HTMLElement>('[part="toolbar"]')!;
      expect(toolbar.checkVisibility()).to.be.true;
    });

    it('should hide the zoom select and the page controls', () => {
      expect(getZoomSelect().checkVisibility()).to.be.false;
      expect(getPageField().checkVisibility()).to.be.false;
      expect(getButton('previous-page').checkVisibility()).to.be.false;
      expect(getButton('next-page').checkVisibility()).to.be.false;
    });

    it('should keep the zoom buttons, for zooming without two fingers', () => {
      expect(getButton('zoom-in').checkVisibility()).to.be.true;
      expect(getButton('zoom-out').checkVisibility()).to.be.true;
    });

    it('should keep the sidebar button and the actions', () => {
      ['sidebar', 'find', 'download', 'print'].forEach((icon) => {
        expect(getButton(icon).checkVisibility(), icon).to.be.true;
      });
    });

    [900, 360].forEach((width) => {
      it(`should place the sidebar button at the start and the actions at the end at ${width}px`, async () => {
        viewer.style.width = `${width}px`;
        await nextFrame();
        const toolbar = getToolbar().getBoundingClientRect();
        expect(getButton('sidebar').getBoundingClientRect().left - toolbar.left).to.be.lessThan(20);
        expect(toolbar.right - getButton('print').getBoundingClientRect().right).to.be.lessThan(20);
        // On one line
        expect(getButton('print').getBoundingClientRect().top).to.equal(
          getButton('sidebar').getBoundingClientRect().top,
        );
      });
    });

    it('should show the page controls again when touch emulation ends', async () => {
      await setTouchEmulation(false);
      await nextFrame();
      expect(getPageField().checkVisibility()).to.be.true;
      expect(getZoomSelect().checkVisibility()).to.be.true;
    });
  });

  describe('header', () => {
    function getHeader() {
      return viewer.shadowRoot!.querySelector<HTMLElement>('[part="header"]')!;
    }

    function getTitle() {
      return viewer.shadowRoot!.querySelector<HTMLElement>('[part="title"]')!;
    }

    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
    });

    it('should not show the header by default', () => {
      expect(viewer.headerVisible).to.be.false;
      expect(getHeader().checkVisibility()).to.be.false;
    });

    it('should show the name of the document with headerVisible', async () => {
      viewer.headerVisible = true;
      await nextFrame();
      expect(getHeader().checkVisibility()).to.be.true;
      expect(getTitle().textContent).to.equal('Multi-page fixture');
    });

    it('should show the header when set as attribute', async () => {
      viewer.setAttribute('header-visible', '');
      await nextFrame();
      expect(getHeader().checkVisibility()).to.be.true;
    });

    it('should show headerTitle when set', async () => {
      viewer.headerVisible = true;
      viewer.fileName = 'report.pdf';
      viewer.headerTitle = 'Annual report';
      await nextFrame();
      expect(getTitle().textContent).to.equal('Annual report');
    });

    it('should show fileName when headerTitle is not set', async () => {
      viewer.headerVisible = true;
      viewer.fileName = 'report.pdf';
      await nextFrame();
      expect(getTitle().textContent).to.equal('report.pdf');
    });

    it('should show the localized fallback for a document without name', async () => {
      viewer.headerVisible = true;
      viewer.i18n = { document: 'PDF-Dokument' };
      const url = createPdfUrl(1);
      try {
        const loaded = oneEvent(viewer, 'document-load');
        viewer.src = url;
        await loaded;
        await nextFrame();
        expect(getTitle().textContent).to.equal('PDF-Dokument');
      } finally {
        URL.revokeObjectURL(url);
      }
    });

    it('should not show the header without a document', async () => {
      viewer.headerVisible = true;
      viewer.src = '';
      await nextFrame();
      expect(getHeader().checkVisibility()).to.be.false;
    });
  });

  describe('collapsed toolbar', () => {
    function getToggle() {
      return viewer.querySelector<HTMLElement>('vaadin-pdf-viewer-button[slot="toolbar-toggle"]');
    }

    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
    });

    it('should not collapse the toolbar by default', () => {
      expect(viewer.toolbarCollapsed).to.be.false;
      expect(getToolbar().checkVisibility()).to.be.true;
    });

    it('should not show the toggle button without the header', () => {
      expect(getToggle()).to.be.null;
    });

    it('should not collapse the toolbar without the header, which has the button to expand it', async () => {
      viewer.toolbarCollapsed = true;
      await nextFrame();
      expect(getToolbar().checkVisibility()).to.be.true;
      expect(viewer.toolbarCollapsed).to.be.true;
    });

    it('should move focus to the toggle button when the toolbar collapses as the header is shown', async () => {
      viewer.toolbarCollapsed = true;
      await nextFrame();
      getButton('zoom-in').focus();
      viewer.headerVisible = true;
      await nextFrame();
      expect(getToolbar().checkVisibility()).to.be.false;
      expect(document.activeElement).to.equal(getToggle());
    });

    it('should collapse the toolbar with the attributes', async () => {
      viewer.setAttribute('toolbar-collapsed', '');
      viewer.setAttribute('header-visible', '');
      await nextFrame();
      expect(viewer.toolbarCollapsed).to.be.true;
      expect(getToolbar().checkVisibility()).to.be.false;
    });

    describe('with header', () => {
      beforeEach(async () => {
        viewer.headerVisible = true;
        await nextFrame();
      });

      it('should show the toggle button in the header', () => {
        const header = viewer.shadowRoot!.querySelector('[part="header"]')!;
        expect(header.contains(getToggle()!.assignedSlot)).to.be.true;
        expect(getToggle()!.getAttribute('aria-label')).to.equal('Toolbar');
        expect(getToggle()!.getAttribute('aria-expanded')).to.equal('true');
        expect(getToggle()!.getAttribute('icon')).to.equal('collapse-toolbar');
      });

      it('should collapse and expand the toolbar on toggle button click', async () => {
        const spy = sinon.spy();
        viewer.addEventListener('toolbar-collapsed-changed', spy);
        getToggle()!.click();
        await nextFrame();
        expect(viewer.toolbarCollapsed).to.be.true;
        expect(spy).to.be.calledOnce;
        expect(getToolbar().checkVisibility()).to.be.false;
        expect(getToggle()!.getAttribute('aria-label')).to.equal('Toolbar');
        expect(getToggle()!.getAttribute('aria-expanded')).to.equal('false');
        expect(getToggle()!.getAttribute('icon')).to.equal('expand-toolbar');

        getToggle()!.click();
        await nextFrame();
        expect(viewer.toolbarCollapsed).to.be.false;
        expect(getToolbar().checkVisibility()).to.be.true;
      });

      it('should keep focus on the toggle button when it is activated with the keyboard', async () => {
        getToggle()!.focus();
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        expect(viewer.toolbarCollapsed).to.be.true;
        expect(document.activeElement).to.equal(getToggle());
      });

      it('should use the i18n label for the toggle button', async () => {
        viewer.i18n = { toolbarToggle: 'Verktygsfält' };
        await nextFrame();
        expect(getToggle()!.getAttribute('aria-label')).to.equal('Verktygsfält');
      });

      it('should move focus to the toggle button when the toolbar collapses with focus in it', async () => {
        getButton('zoom-in').focus();
        viewer.toolbarCollapsed = true;
        await nextFrame();
        expect(document.activeElement).to.equal(getToggle());
      });

      it('should keep focus outside the toolbar when it collapses', async () => {
        getButton('find').click();
        await nextRender();
        const findField = viewer.querySelector('vaadin-text-field')!;
        expect(findField.contains(document.activeElement)).to.be.true;
        viewer.toolbarCollapsed = true;
        await nextFrame();
        expect(findField.contains(document.activeElement)).to.be.true;
      });

      it('should move focus to the pages when the toggle button is removed with focus', async () => {
        getToggle()!.focus();
        viewer.src = undefined as any;
        await nextFrame();
        expect(getToggle()).to.be.null;
        expect(viewer.shadowRoot!.activeElement).to.equal(viewer.shadowRoot!.querySelector('[part="content"]'));
      });

      it('should keep the find bar open when the toolbar collapses', async () => {
        getButton('find').click();
        await nextRender();
        viewer.toolbarCollapsed = true;
        await nextFrame();
        const findBar = viewer.shadowRoot!.querySelector<HTMLElement>('[part="find-bar"]')!;
        expect(findBar.checkVisibility()).to.be.true;
      });
    });
  });

  describe('toolbar-actions slot', () => {
    function createButton(text: string) {
      const button = document.createElement('button');
      button.slot = 'toolbar-actions';
      button.textContent = text;
      return button;
    }

    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
    });

    it('should show slotted controls in the action group in DOM order', async () => {
      const approve = createButton('Approve');
      const reject = createButton('Reject');
      viewer.append(approve, reject);
      await nextFrame();
      const actions = getGroup('actions');
      expect(actions.contains(approve.assignedSlot)).to.be.true;
      expect(approve.getBoundingClientRect().right).to.be.at.most(reject.getBoundingClientRect().left);
    });

    it('should show slotted controls before the built-in buttons', async () => {
      const approve = createButton('Approve');
      viewer.appendChild(approve);
      await nextFrame();
      expect(approve.getBoundingClientRect().right).to.be.at.most(getButton('find').getBoundingClientRect().left);
    });

    it('should hide slotted controls with the collapsed toolbar', async () => {
      const approve = createButton('Approve');
      viewer.appendChild(approve);
      viewer.headerVisible = true;
      viewer.toolbarCollapsed = true;
      await nextFrame();
      expect(approve.checkVisibility()).to.be.false;
    });

    it('should render the controls again when the application removes all children', async () => {
      viewer.replaceChildren();
      viewer.zoom = 2;
      await nextFrame();
      expect(viewer.querySelectorAll('vaadin-pdf-viewer-button[icon="zoom-in"]')).to.have.lengthOf(1);
      expect(getButton('zoom-in').checkVisibility()).to.be.true;
      expect(getZoomSelect().value).to.equal('2');
    });

    describe('child added after the first render', () => {
      let approve: HTMLButtonElement;

      beforeEach(async () => {
        approve = createButton('Approve');
        viewer.appendChild(approve);
        await nextFrame();
      });

      it('should keep the child when the toolbar renders again', async () => {
        viewer.zoom = 2;
        await nextRenderIdle(viewer);
        expect(approve.parentElement).to.equal(viewer);
        expect(approve.checkVisibility()).to.be.true;
      });

      it('should keep the child when src changes', async () => {
        await loadDocument(viewer, 'links.pdf');
        await nextFrame();
        expect(approve.parentElement).to.equal(viewer);
        expect(approve.checkVisibility()).to.be.true;
      });

      it('should keep the child when the header shows and hides its toggle button', async () => {
        viewer.headerVisible = true;
        await nextFrame();
        viewer.headerVisible = false;
        await nextFrame();
        expect(approve.parentElement).to.equal(viewer);
        expect(approve.checkVisibility()).to.be.true;
      });

      it('should keep the child when the viewer is detached and attached again', async () => {
        const parent = viewer.parentElement!;
        viewer.remove();
        await nextFrame();
        const loaded = oneEvent(viewer, 'document-load');
        parent.appendChild(viewer);
        await loaded;
        await nextFrame();
        expect(approve.parentElement).to.equal(viewer);
        expect(approve.checkVisibility()).to.be.true;
        expect(viewer.querySelectorAll('vaadin-pdf-viewer-button[icon="zoom-in"]')).to.have.lengthOf(1);
      });
    });
  });

  describe('large text', () => {
    beforeEach(() => {
      // The header and the toolbar need more than 60% of the height
      viewer.style.cssText = 'width: 320px; height: 300px; font-size: 32px';
      viewer.headerVisible = true;
    });

    async function load() {
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    }

    function getControls() {
      return [
        ...viewer.querySelectorAll<HTMLElement>(
          'vaadin-pdf-viewer-button, vaadin-integer-field, vaadin-select, vaadin-text-field',
        ),
      ].filter((control) => control.checkVisibility());
    }

    function expectControlsInside() {
      const host = viewer.getBoundingClientRect();
      getControls().forEach((control) => {
        const rect = control.getBoundingClientRect();
        expect(rect.left, control.getAttribute('aria-label')!).to.be.at.least(host.left);
        expect(rect.right, control.getAttribute('aria-label')!).to.be.at.most(host.right);
      });
    }

    /** Goes backwards from the focused element through the controls, and returns the visited controls. */
    async function expectControlsScrolledIntoView() {
      const area = getToolbar().parentElement!;
      const findBar = viewer.shadowRoot!.querySelector<HTMLElement>('[part="find-bar"]')!;
      const visited = new Set<Element>();
      for (let i = 0; i < 20; i++) {
        const active = document.activeElement!;
        const control = getControls().find((element) => element === active || element.contains(active));
        if (!control) {
          break;
        }
        visited.add(control);
        // The focused element, i.e. the input of a field, which the browser scrolls into view
        const rect = active.getBoundingClientRect();
        // Visible in the header and the toolbar, or in the find bar, which are inside the viewer
        const areaRect = (findBar.contains(control.assignedSlot) ? findBar : area).getBoundingClientRect();
        const viewerRect = viewer.getBoundingClientRect();
        const top = Math.max(areaRect.top, viewerRect.top);
        const bottom = Math.min(areaRect.bottom, viewerRect.bottom);
        // With room for the focus ring around the control
        expect(rect.top, control.getAttribute('aria-label')!).to.be.at.least(top + 3);
        expect(rect.bottom, control.getAttribute('aria-label')!).to.be.at.most(bottom - 3);
        // The viewer itself does not scroll, which would move the toolbar or the pages out of view.
        expect(viewer.scrollTop, control.getAttribute('aria-label')!).to.equal(0);
        await sendKeys({ press: 'Shift+Tab' });
      }
      return visited;
    }

    it('should keep the controls inside the viewer', async () => {
      await load();
      expectControlsInside();
    });

    it('should keep at least 40% of the viewer for the pages', async () => {
      await load();
      const content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
      expect(content.getBoundingClientRect().height).to.be.at.least(viewer.getBoundingClientRect().height * 0.4 - 2);
    });

    it('should scroll each control into view when focused with the keyboard', async () => {
      await load();
      // Go backwards from the pages through all toolbar controls.
      viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!.focus();
      await sendKeys({ press: 'Shift+Tab' });
      const visited = await expectControlsScrolledIntoView();
      expect(visited).to.include(getButton('zoom-in'));
      expect(visited).to.include(viewer.querySelector('vaadin-pdf-viewer-button[slot="toolbar-toggle"]'));
    });

    describe('find bar', () => {
      beforeEach(async () => {
        // High enough for the find bar below the toolbar
        viewer.style.height = '400px';
        viewer.headerVisible = false;
        await load();
        getButton('find').click();
        await nextRender();
        // Show the result in the find field
        await sendKeys({ type: 'quick' });
        const result = viewer.querySelector('vaadin-text-field[slot="find"] > span[slot="suffix"]')!;
        for (let i = 0; i < 50 && !result.textContent!.trim(); i++) {
          await nextFrame();
        }
      });

      it('should keep the controls of the find bar inside the viewer', () => {
        expectControlsInside();
      });

      it('should scroll each control into view when focused with the keyboard', async () => {
        // Go forwards to the last control of the find bar, then backwards from it through all controls.
        for (let i = 0; i < 3; i++) {
          await sendKeys({ press: 'Tab' });
        }
        expect(document.activeElement).to.equal(getButton('close'));
        const visited = await expectControlsScrolledIntoView();
        expect(visited).to.include(viewer.querySelector('vaadin-text-field'));
        expect(visited).to.include(getButton('sidebar'));
      });
    });
  });
});
