import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './enable-feature-flag.js';
import '../vaadin-pdf-viewer.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';
import { loadDocument, nextRenderIdle, scrollSettled } from './helpers.js';

describe('keyboard', () => {
  let viewer: PdfViewer;
  let content: HTMLElement;

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 400px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
    content = viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
  });

  it('should not make the page area focusable without a document', () => {
    expect(content.getAttribute('tabindex')).to.equal('-1');
  });

  it('should make the page area focusable once a document has loaded', async () => {
    await loadDocument(viewer, 'multi-page.pdf');
    await nextUpdate(viewer);
    expect(content.getAttribute('tabindex')).to.equal('0');
  });

  describe('with a document', () => {
    beforeEach(async () => {
      const idle = nextRenderIdle(viewer);
      await loadDocument(viewer, 'multi-page.pdf');
      await idle;
    });

    it('should scroll the pages with the arrow keys', async () => {
      content.focus();
      const scrolled = oneEvent(content, 'scroll');
      // WebKit stops the scroll animation on keyup, so hold the key
      await sendKeys({ down: 'ArrowDown' });
      await aTimeout(50);
      await sendKeys({ up: 'ArrowDown' });
      await scrolled;
      expect(content.scrollTop).to.be.greaterThan(0);
    });

    it('should scroll by a page with PageDown', async () => {
      content.focus();
      await sendKeys({ press: 'PageDown' });
      await scrollSettled(content);
      expect(content.scrollTop).to.be.greaterThan(content.clientHeight * 0.5);
    });

    it('should scroll to the end with End', async () => {
      content.focus();
      await sendKeys({ press: 'End' });
      await scrollSettled(content);
      expect(content.scrollTop).to.be.closeTo(content.scrollHeight - content.clientHeight, 2);
    });

    it('should go to the last page with Ctrl+End', async () => {
      content.focus();
      const idle = nextRenderIdle(viewer);
      await sendKeys({ press: 'Control+End' });
      await idle;
      expect(viewer.page).to.equal(6);
    });

    it('should scroll to the top of the current first page with Ctrl+Home', async () => {
      const scrolled = oneEvent(content, 'scroll');
      content.scrollTop = 50;
      await scrolled;
      await nextFrame();
      expect(viewer.page).to.equal(1);
      const spy = sinon.spy();
      document.addEventListener('keydown', spy);
      content.focus();
      await sendKeys({ press: 'Control+Home' });
      document.removeEventListener('keydown', spy);
      await nextFrame();
      expect(content.scrollTop).to.equal(0);
      const event = spy.args.map(([e]) => e).find((e) => e.key === 'Home');
      expect(event.defaultPrevented).to.be.true;
    });

    it('should scroll to the top of the current last page with Ctrl+End', async () => {
      viewer.page = 6;
      await nextRenderIdle(viewer);
      const top = content.scrollTop;
      const scrolled = oneEvent(content, 'scroll');
      content.scrollTop = top - 50;
      await scrolled;
      await nextFrame();
      expect(viewer.page).to.equal(6);
      content.focus();
      await sendKeys({ press: 'Control+End' });
      await nextFrame();
      expect(content.scrollTop).to.be.closeTo(top, 1);
    });

    it('should go to the first page with Ctrl+Home', async () => {
      viewer.page = 4;
      await nextRenderIdle(viewer);
      content.focus();
      await sendKeys({ press: 'Control+Home' });
      await nextFrame();
      expect(viewer.page).to.equal(1);
    });
  });
});
