import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { IntegerField } from '@vaadin/integer-field';
import type { Tooltip } from '@vaadin/tooltip';
import type { PdfViewerButton } from '../src/vaadin-pdf-viewer-button.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { fixtureUrl, loadDocument, nextRenderIdle } from './helpers.js';

describe('toolbar', () => {
  let viewer: PdfViewer;
  let header: HTMLElement;
  let content: HTMLElement;
  let previousButton: PdfViewerButton;
  let nextButton: PdfViewerButton;
  let pageField: IntegerField;
  let pageError: HTMLElement;

  function getGroup(name: string) {
    return viewer.shadowRoot!.querySelector<HTMLElement>(`[part~="toolbar-group"].${name}`)!;
  }

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
    header = viewer.shadowRoot!.querySelector<HTMLElement>('.header')!;
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
    previousButton = viewer.querySelector<PdfViewerButton>('vaadin-pdf-viewer-button[icon="previous-page"]')!;
    nextButton = viewer.querySelector<PdfViewerButton>('vaadin-pdf-viewer-button[icon="next-page"]')!;
    pageField = viewer.querySelector<IntegerField>('vaadin-integer-field')!;
    pageError = viewer.querySelector<HTMLElement>('[slot="page-error"]')!;
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
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
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
      expect(pageError.textContent).to.equal('Max. 6');
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
        expect(pageError.textContent).to.equal('Enter 1–6');
        expect(pageError.checkVisibility()).to.be.true;
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
        expect(pageError.checkVisibility()).to.be.false;
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

  it('should show the toolbar without scrolling on a narrow viewer', async () => {
    viewer.style.maxWidth = '320px';
    const idle = nextRenderIdle(viewer);
    await loadDocument(viewer, 'multi-page.pdf');
    await idle;
    expect(header.scrollHeight).to.be.at.most(header.clientHeight);
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
      expect(getGroup('actions').contains(approve.assignedSlot)).to.be.true;
      expect(approve.getBoundingClientRect().right).to.be.at.most(reject.getBoundingClientRect().left);
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
      viewer.style.maxHeight = '200px';
      viewer.style.fontSize = '32px';
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    function getControls() {
      return [previousButton, nextButton, pageField].filter((control) => control.checkVisibility());
    }

    it('should keep at least 40% of the viewer for the pages', () => {
      expect(content.getBoundingClientRect().height).to.be.at.least(viewer.getBoundingClientRect().height * 0.4 - 2);
    });

    it('should scroll each control into view when focused with the keyboard', async () => {
      // The toolbar scrolls, so that some controls are out of view
      expect(header.scrollHeight).to.be.greaterThan(header.clientHeight);
      // Go backwards from the pages through all toolbar controls.
      content.focus();
      await sendKeys({ press: 'Shift+Tab' });
      const visited = new Set<HTMLElement>();
      for (let i = 0; i < 10; i++) {
        const active = document.activeElement!;
        const control = getControls().find((element) => element === active || element.contains(active));
        if (!control) {
          break;
        }
        visited.add(control);
        const name = control.getAttribute('icon') ?? control.localName;
        // The focused element, i.e. the input of a field, which the browser scrolls into view
        const rect = active.getBoundingClientRect();
        // Visible in the toolbar, which is inside the viewer
        const headerRect = header.getBoundingClientRect();
        const viewerRect = viewer.getBoundingClientRect();
        const top = Math.max(headerRect.top, viewerRect.top);
        const bottom = Math.min(headerRect.bottom, viewerRect.bottom);
        // With room for the focus ring around the control
        expect(rect.top, name).to.be.at.least(top + 3);
        expect(rect.bottom, name).to.be.at.most(bottom - 3);
        // The viewer itself does not scroll, which would move the toolbar or the pages out of view.
        expect(viewer.scrollTop, name).to.equal(0);
        await sendKeys({ press: 'Shift+Tab' });
      }
      expect(visited).to.include(pageField);
      expect(visited).to.include(nextButton);
    });
  });
});
