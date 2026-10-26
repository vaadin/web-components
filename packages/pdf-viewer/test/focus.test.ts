import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { loadDocument } from './helpers.js';

describe('focus', () => {
  let viewer: PdfViewer;
  let input: HTMLInputElement;
  let content: HTMLElement;

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <vaadin-pdf-viewer style="width: 400px; height: 400px"></vaadin-pdf-viewer>
        <input>
      </div>
    `);
    input = wrapper.querySelector(':scope > input')!;
    viewer = wrapper.querySelector('vaadin-pdf-viewer')!;
    await nextRender();
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should not focus the page area on focus() without a document', () => {
    viewer.focus();
    expect(viewer.shadowRoot!.activeElement).to.be.null;
    expect(viewer.hasAttribute('focus-ring')).to.be.false;
  });

  describe('with a document', () => {
    beforeEach(async () => {
      await loadDocument(viewer, 'multi-page.pdf');
      await nextRender();
    });

    it('should toggle focused attribute on page area focus', () => {
      content.focus();
      expect(viewer.hasAttribute('focused')).to.be.true;
      content.blur();
      expect(viewer.hasAttribute('focused')).to.be.false;
    });

    it('should toggle focused attribute when focus moves between the page area and an element in a page', () => {
      // E.g. a link in a page
      const button = document.createElement('button');
      content.querySelector('[part~="page"]')!.append(button);
      content.focus();
      button.focus();
      expect(viewer.hasAttribute('focused')).to.be.false;
      content.focus();
      expect(viewer.hasAttribute('focused')).to.be.true;
    });

    it('should set focus-ring attribute when the page area is focused using keyboard', async () => {
      input.focus();
      await sendKeys({ press: 'Shift+Tab' });
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
      expect(viewer.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring attribute when the page area is focused using pointer', async () => {
      await sendMouseToElement({ type: 'click', element: content });
      expect(viewer.hasAttribute('focused')).to.be.true;
      expect(viewer.hasAttribute('focus-ring')).to.be.false;
    });

    it('should focus the page area on focus()', () => {
      viewer.focus();
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
      expect(viewer.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring attribute on focus() with focusVisible: false', () => {
      viewer.focus({ focusVisible: false });
      expect(viewer.shadowRoot!.activeElement).to.equal(content);
      expect(viewer.hasAttribute('focus-ring')).to.be.false;
    });
  });
});
