import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { IntegerField } from '@vaadin/integer-field';
import type { Select } from '@vaadin/select';
import type { SelectItem } from '@vaadin/select/src/vaadin-select-item.js';
import type { Tooltip } from '@vaadin/tooltip';
import type { PdfViewerButton } from '../src/vaadin-pdf-viewer-button.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import {
  createPdfUrl,
  fixtureUrl,
  getContentBoxSize,
  loadAndRender,
  loadDocument,
  loadFixtureFrom,
  nextRenderIdle,
} from './helpers.js';

describe('toolbar', () => {
  let viewer: PdfViewer;
  let topArea: HTMLElement;
  let header: HTMLElement;
  let toolbar: HTMLElement;
  let content: HTMLElement;
  let previousButton: PdfViewerButton;
  let nextButton: PdfViewerButton;
  let pageField: IntegerField;
  let zoomOutButton: PdfViewerButton;
  let zoomInButton: PdfViewerButton;
  let zoomSelect: Select;

  function createButton(text: string) {
    const button = document.createElement('button');
    button.slot = 'toolbar-actions';
    button.textContent = text;
    return button;
  }

  function expectControlsDisabled() {
    expect(previousButton.disabled).to.be.true;
    expect(nextButton.disabled).to.be.true;
    expect(pageField.disabled).to.be.true;
    expect(zoomOutButton.disabled).to.be.true;
    expect(zoomInButton.disabled).to.be.true;
    expect(zoomSelect.disabled).to.be.true;
  }

  async function enterPage(value: string) {
    pageField.focus();
    (pageField.inputElement as HTMLInputElement).select();
    await sendKeys({ type: value });
    await sendKeys({ press: 'Enter' });
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
    topArea = viewer.shadowRoot!.querySelector<HTMLElement>('.top-area')!;
    header = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="header"]')!;
    toolbar = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="toolbar"]')!;
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
    previousButton = viewer.querySelector<PdfViewerButton>('vaadin-pdf-viewer-button[icon="previous-page"]')!;
    nextButton = viewer.querySelector<PdfViewerButton>('vaadin-pdf-viewer-button[icon="next-page"]')!;
    pageField = viewer.querySelector<IntegerField>('vaadin-integer-field')!;
    zoomOutButton = viewer.querySelector<PdfViewerButton>('vaadin-pdf-viewer-button[icon="zoom-out"]')!;
    zoomInButton = viewer.querySelector<PdfViewerButton>('vaadin-pdf-viewer-button[icon="zoom-in"]')!;
    zoomSelect = viewer.querySelector<Select>('vaadin-select')!;
  });

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
  });

  describe('page navigation', () => {
    beforeEach(async () => {
      await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    });

    it('should show the current page in the page field', () => {
      expect(pageField.value).to.equal('1');
    });

    it('should update the page field when the page changes', async () => {
      viewer.page = 3;
      await nextRenderIdle(viewer);
      expect(pageField.value).to.equal('3');
    });

    it('should go to the next page when clicking next page', async () => {
      nextButton.click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(2);
    });

    it('should go to the previous page when clicking previous page', async () => {
      viewer.page = 3;
      await nextRenderIdle(viewer);
      previousButton.click();
      await nextRenderIdle(viewer);
      expect(viewer.page).to.equal(2);
    });

    it('should show the label of the page buttons in a tooltip', () => {
      const previousTooltip = previousButton.querySelector<Tooltip>('vaadin-tooltip')!;
      const nextTooltip = nextButton.querySelector<Tooltip>('vaadin-tooltip')!;
      expect(previousTooltip.target).to.equal(previousButton);
      expect(previousTooltip.text).to.equal('Previous page');
      expect(nextTooltip.target).to.equal(nextButton);
      expect(nextTooltip.text).to.equal('Next page');
    });

    it('should use the texts set with i18n', async () => {
      viewer.i18n = { nextPage: 'Next', pageError: 'Max. {pageCount}' };
      await enterPage('999');
      await nextFrame();
      expect(nextButton.querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Next');
      expect(previousButton.querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Previous page');
      expect(pageField.errorMessage).to.equal('Max. 6');
    });

    it('should toggle disabled on previous page button on the first page', async () => {
      expect(previousButton.disabled).to.be.true;
      viewer.page = 2;
      await nextRenderIdle(viewer);
      expect(previousButton.disabled).to.be.false;
    });

    it('should toggle disabled on next page button on the last page', async () => {
      expect(nextButton.disabled).to.be.false;
      viewer.page = 6;
      await nextRenderIdle(viewer);
      expect(nextButton.disabled).to.be.true;
    });

    it('should go to the page entered in the page field', async () => {
      const idle = nextRenderIdle(viewer);
      await enterPage('4');
      await idle;
      expect(viewer.page).to.equal(4);
    });

    it('should not submit a form that contains the viewer on Enter in the page field', async () => {
      const form = document.createElement('form');
      viewer.parentElement!.appendChild(form);
      form.appendChild(viewer);
      const spy = sinon.spy((event: Event) => event.preventDefault());
      form.addEventListener('submit', spy);
      await enterPage('4');
      await nextFrame();
      expect(spy).to.be.not.called;
    });

    it('should not let the change and input events of the page field reach the application', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('change', spy);
      viewer.addEventListener('input', spy);
      await enterPage('4');
      await nextFrame();
      expect(spy).to.be.not.called;
    });

    describe('invalid page', () => {
      let warnStub: sinon.SinonStub;

      beforeEach(() => {
        warnStub = sinon.stub(console, 'warn');
      });

      afterEach(() => {
        warnStub.restore();
      });

      it('should leave the page field empty for a page out of range', async () => {
        viewer.page = 10;
        await nextFrame();
        expect(pageField.value).to.equal('');
        expect(pageField.invalid).to.be.false;
      });

      it('should go to the last page from a page above the page count', async () => {
        viewer.page = 10;
        await nextRenderIdle(viewer);
        previousButton.click();
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(6);
      });
    });

    it('should keep focus on the next page button when it gets disabled', async () => {
      viewer.page = 5;
      await nextRenderIdle(viewer);
      nextButton.focus();
      await sendKeys({ press: 'Enter' });
      await nextFrame();
      expect(viewer.page).to.equal(6);
      expect(nextButton.disabled).to.be.true;
      expect(document.activeElement).to.equal(nextButton);
    });

    describe('page out of range', () => {
      beforeEach(async () => {
        await enterPage('999');
        await nextFrame();
      });

      it('should keep the entered page and show an error', () => {
        expect(viewer.page).to.equal(1);
        expect(pageField.value).to.equal('999');
        expect(pageField.invalid).to.be.true;
        expect(pageField.errorMessage).to.equal('Enter 1–6');
      });

      it('should go to a page entered after it', async () => {
        await enterPage('4');
        await nextRenderIdle(viewer);
        expect(viewer.page).to.equal(4);
        expect(pageField.value).to.equal('4');
        expect(pageField.invalid).to.be.false;
      });

      it('should show the current page again when the page changes', async () => {
        viewer.page = 3;
        await nextRenderIdle(viewer);
        expect(pageField.value).to.equal('3');
        expect(pageField.invalid).to.be.false;
      });

      it('should show the current page again when the field is cleared', async () => {
        (pageField.inputElement as HTMLInputElement).select();
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        expect(pageField.value).to.equal('1');
        expect(pageField.invalid).to.be.false;
      });
    });
  });

  describe('zoom', () => {
    beforeEach(async () => {
      await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    });

    afterEach(() => {
      sinon.restore();
    });

    function getItemLabel(value: string) {
      return zoomSelect.items!.find((item) => item.value === value)!.label;
    }

    async function selectZoomItem(value: string) {
      zoomSelect.opened = true;
      await nextRender();
      [...zoomSelect.querySelectorAll<SelectItem>('vaadin-select-item')].find((item) => item.value === value)!.click();
      await nextRenderIdle(viewer);
    }

    it('should show the zoom in the zoom select', () => {
      expect(zoomSelect.value).to.equal('page-width');
    });

    it('should show a zoom that is not one of the levels', async () => {
      viewer.zoom = 1.1;
      await nextRenderIdle(viewer);
      expect(zoomSelect.value).to.equal('1.1');
      expect(getItemLabel('1.1')).to.equal('110%');
    });

    it('should keep the zoom items when the page changes', async () => {
      const { items } = zoomSelect;
      viewer.page = 3;
      await nextRenderIdle(viewer);
      expect(zoomSelect.items).to.equal(items);
    });

    it('should zoom to the level selected in the zoom select', async () => {
      await selectZoomItem('2');
      expect(viewer.zoom).to.equal(2);
    });

    it('should not let the change event of the zoom select reach the application', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('change', spy);
      await selectZoomItem('2');
      expect(spy).to.be.not.called;
    });

    it('should zoom in to the next level', async () => {
      viewer.zoom = 1;
      await nextRenderIdle(viewer);
      zoomInButton.click();
      await nextRenderIdle(viewer);
      expect(viewer.zoom).to.equal(1.25);
    });

    it('should zoom out to the previous level', async () => {
      viewer.zoom = 1;
      await nextRenderIdle(viewer);
      zoomOutButton.click();
      await nextRenderIdle(viewer);
      expect(viewer.zoom).to.equal(0.75);
    });

    it('should zoom in from a fit zoom to the next level above its scale', async () => {
      // 600px wide, so page-width is between 50% and 75%
      zoomInButton.click();
      await nextRenderIdle(viewer);
      expect(viewer.zoom).to.equal(0.75);
    });

    it('should toggle disabled on zoom in button at the largest zoom', async () => {
      viewer.zoom = 4;
      await nextRenderIdle(viewer);
      expect(zoomInButton.disabled).to.be.true;
      viewer.zoom = 3;
      await nextRenderIdle(viewer);
      expect(zoomInButton.disabled).to.be.false;
    });

    it('should toggle disabled on zoom out button at the smallest zoom', async () => {
      viewer.zoom = 0.25;
      await nextRenderIdle(viewer);
      expect(zoomOutButton.disabled).to.be.true;
      viewer.zoom = 0.5;
      await nextRenderIdle(viewer);
      expect(zoomOutButton.disabled).to.be.false;
    });

    it('should show the label of the zoom buttons in a tooltip', () => {
      expect(zoomOutButton.querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Zoom out');
      expect(zoomInButton.querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Zoom in');
    });

    it('should use the zoom texts set with i18n', async () => {
      viewer.i18n = { zoomIn: 'Größer', pageWidth: 'Seitenbreite', pageFit: 'Ganze Seite' };
      await nextFrame();
      expect(zoomInButton.querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Größer');
      expect(zoomOutButton.querySelector<Tooltip>('vaadin-tooltip')!.text).to.equal('Zoom out');
      expect(getItemLabel('page-width')).to.equal('Seitenbreite');
      expect(getItemLabel('page-fit')).to.equal('Ganze Seite');
    });
  });

  it('should show the toolbar without scrolling on a narrow viewer', async () => {
    viewer.style.maxWidth = '320px';
    await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    expect(topArea.scrollHeight).to.be.at.most(topArea.clientHeight);
  });

  describe('header', () => {
    let title: HTMLElement;

    beforeEach(() => {
      title = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="title"]')!;
    });

    it('should show the header by default', () => {
      expect(viewer.headerHidden).to.be.false;
      expect(header.checkVisibility()).to.be.true;
    });

    it('should hide the header when set as attribute', async () => {
      viewer.setAttribute('header-hidden', '');
      await nextFrame();
      expect(header.checkVisibility()).to.be.false;
    });

    it('should show a fallback title without a document', () => {
      expect(title.textContent).to.equal('PDF document');
    });

    it('should show the file name of src while the document loads', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      await nextFrame();
      expect(title.textContent).to.equal('multi-page.pdf');
    });

    it('should show the file name of src when the document could not be loaded', async () => {
      viewer.src = fixtureUrl('invalid.pdf');
      await oneEvent(viewer, 'document-error');
      await nextFrame();
      expect(title.textContent).to.equal('invalid.pdf');
    });

    it('should show headerTitle instead of the file name', async () => {
      viewer.src = fixtureUrl('multi-page.pdf');
      viewer.headerTitle = 'Annual report';
      await nextFrame();
      expect(title.textContent).to.equal('Annual report');
    });

    it('should show the file name from the Content-Disposition header instead of the file name of src', async () => {
      await loadFixtureFrom(viewer, new URL('/files/multi-page.pdf', location.href).href, {
        'Content-Disposition': 'inline; filename="report.pdf"',
      });
      await nextFrame();
      expect(title.textContent).to.equal('report.pdf');
    });

    it('should show the title of the document for src without a PDF file name', async () => {
      await loadFixtureFrom(viewer, new URL('/files/123', location.href).href);
      await nextFrame();
      expect(title.textContent).to.equal('Multi-page fixture');
    });

    it('should show the title of the document for a blob URL', async () => {
      const blob = await fetch(fixtureUrl('multi-page.pdf')).then((response) => response.blob());
      const url = URL.createObjectURL(blob);
      try {
        await loadAndRender(viewer, url);
        expect(title.textContent).to.equal('Multi-page fixture');
      } finally {
        URL.revokeObjectURL(url);
      }
    });

    it('should show a fallback title for a document without a file name or title', async () => {
      await loadAndRender(viewer, createPdfUrl(1));
      expect(title.textContent).to.equal('PDF document');
    });

    it('should use the fallback title set with i18n', async () => {
      viewer.i18n = { document: 'PDF-Dokument' };
      await nextFrame();
      expect(title.textContent).to.equal('PDF-Dokument');
    });
  });

  describe('collapsed toolbar', () => {
    beforeEach(async () => {
      await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    });

    it('should not collapse the toolbar by default', () => {
      expect(viewer.toolbarCollapsed).to.be.false;
      expect(toolbar.checkVisibility()).to.be.true;
    });

    it('should not collapse the toolbar without the header, which expands it', async () => {
      viewer.headerHidden = true;
      viewer.toolbarCollapsed = true;
      await nextFrame();
      expect(toolbar.checkVisibility()).to.be.true;
    });

    it('should collapse the toolbar when set as attribute', async () => {
      viewer.setAttribute('toolbar-collapsed', '');
      await nextFrame();
      expect(viewer.toolbarCollapsed).to.be.true;
      expect(toolbar.checkVisibility()).to.be.false;
    });

    it('should mark the header as the button that controls the toolbar', () => {
      expect(header.localName).to.equal('button');
      expect(header.getAttribute('aria-controls')).to.equal(toolbar.id);
      expect(header.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should collapse and expand the toolbar on header click', async () => {
      const spy = sinon.spy();
      viewer.addEventListener('toolbar-collapsed-changed', spy);
      header.click();
      await nextFrame();
      expect(viewer.toolbarCollapsed).to.be.true;
      expect(spy).to.be.calledOnce;
      expect(toolbar.checkVisibility()).to.be.false;
      expect(header.getAttribute('aria-expanded')).to.equal('false');

      header.click();
      await nextFrame();
      expect(viewer.toolbarCollapsed).to.be.false;
      expect(toolbar.checkVisibility()).to.be.true;
      expect(header.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should fit the whole page again when the toolbar collapses', async () => {
      viewer.zoom = 'page-fit';
      await nextRenderIdle(viewer);
      viewer.toolbarCollapsed = true;
      await nextResize(content);
      await nextRenderIdle(viewer);
      const page = viewer.shadowRoot!.querySelector<HTMLElement>('[part~="page"]')!;
      expect(page.offsetHeight).to.be.closeTo(getContentBoxSize(content).height, 1);
    });

    it('should keep focus on the header when it is activated with the keyboard', async () => {
      header.focus();
      await sendKeys({ press: 'Enter' });
      await nextFrame();
      expect(viewer.toolbarCollapsed).to.be.true;
      expect(viewer.shadowRoot!.activeElement).to.equal(header);
    });
  });

  describe('toolbar-actions slot', () => {
    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextFrame();
    });

    it('should show slotted controls in the action group in DOM order', async () => {
      const approve = createButton('Approve');
      const reject = createButton('Reject');
      viewer.append(approve, reject);
      await nextFrame();
      expect(approve.assignedSlot!.parentElement!.matches('[part~="toolbar-group"]')).to.be.true;
      expect(approve.getBoundingClientRect().right).to.be.at.most(reject.getBoundingClientRect().left);
    });

    it('should hide slotted controls with the collapsed toolbar', async () => {
      const approve = createButton('Approve');
      viewer.appendChild(approve);
      viewer.toolbarCollapsed = true;
      await nextFrame();
      expect(approve.checkVisibility()).to.be.false;
    });

    describe('child added after the first render', () => {
      let approve: HTMLButtonElement;

      beforeEach(async () => {
        approve = createButton('Approve');
        viewer.appendChild(approve);
        await nextFrame();
      });

      it('should keep the child when the toolbar renders again', async () => {
        viewer.page = 2;
        await nextRenderIdle(viewer);
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
        expect(viewer.querySelectorAll('vaadin-pdf-viewer-button[icon="next-page"]')).to.have.lengthOf(1);
      });
    });
  });

  describe('large text', () => {
    beforeEach(async () => {
      // The toolbar needs more than 60% of the height
      viewer.style.maxWidth = '200px';
      viewer.style.maxHeight = '190px';
      viewer.style.fontSize = '32px';
      await loadAndRender(viewer, fixtureUrl('multi-page.pdf'));
    });

    function getControls() {
      return [...viewer.querySelectorAll<HTMLElement>(':scope > [slot]')].filter((control) =>
        control.checkVisibility(),
      );
    }

    it('should keep at least 40% of the viewer for the pages', () => {
      expect(content.getBoundingClientRect().height).to.be.at.least(viewer.getBoundingClientRect().height * 0.4 - 2);
    });

    it('should scroll each control into view when focused with the keyboard', async () => {
      // The header and the toolbar scroll, so that some controls are out of view
      expect(topArea.scrollHeight).to.be.greaterThan(topArea.clientHeight);
      // Go backwards from the pages through all toolbar controls.
      content.focus();
      await sendKeys({ press: 'Shift+Tab' });
      const visited = new Set<HTMLElement>();
      for (let i = 0; i < 10; i++) {
        const active = viewer.shadowRoot!.activeElement ?? document.activeElement!;
        const control = [header, ...getControls()].find((element) => element === active || element.contains(active));
        if (!control) {
          break;
        }
        visited.add(control);
        const name = control.getAttribute('icon') ?? control.localName;
        const rect = control.getBoundingClientRect();
        // Visible in the header and the toolbar, which are inside the viewer
        const areaRect = topArea.getBoundingClientRect();
        const viewerRect = viewer.getBoundingClientRect();
        const top = Math.max(areaRect.top, viewerRect.top);
        const bottom = Math.min(areaRect.bottom, viewerRect.bottom);
        // With room for the focus ring around the control. The header has it inside.
        const room = control === header ? 0 : 3;
        expect(rect.top, name).to.be.at.least(top + room);
        expect(rect.bottom, name).to.be.at.most(bottom - room);
        // The viewer itself does not scroll, which would move the toolbar or the pages out of view.
        expect(viewer.scrollTop, name).to.equal(0);
        await sendKeys({ press: 'Shift+Tab' });
      }
      expect(visited).to.include(zoomSelect);
      expect(visited).to.include(pageField);
      expect(visited).to.include(nextButton);
      expect(visited).to.include(header);
    });
  });
});
