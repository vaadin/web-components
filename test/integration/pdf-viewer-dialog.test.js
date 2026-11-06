import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/dialog/src/vaadin-dialog.js';
import '@vaadin/pdf-viewer/test/enable-feature-flag.js';
import '@vaadin/pdf-viewer/src/vaadin-pdf-viewer.js';
import { holdPages } from '@vaadin/pdf-viewer/test/helpers.ts';

describe('pdf-viewer in dialog', () => {
  let dialog, viewer;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog>
        <vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>
      </vaadin-dialog>
    `);
    viewer = dialog.querySelector('vaadin-pdf-viewer');
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    const idle = oneEvent(viewer, 'render-idle');
    viewer.src = new URL('../../packages/pdf-viewer/test/fixtures/multi-page.pdf', import.meta.url).href;
    await idle;
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextRender();
  });

  it('should cancel printing first and close the dialog second with Escape', async () => {
    // The pages do not load until released, so that printing stays in progress.
    const release = await holdPages(1);
    try {
      const content = viewer.shadowRoot.querySelector('[part="content"]');
      content.focus();
      viewer.print();
      await nextRender();
      const progress = viewer.shadowRoot.querySelector('[part="print-progress"]');
      expect(progress.hidden).to.be.false;
      await sendKeys({ press: 'Escape' });
      await nextFrame();
      expect(progress.hidden).to.be.true;
      expect(dialog.opened).to.be.true;
      expect(viewer.shadowRoot.activeElement).to.equal(content);

      await sendKeys({ press: 'Escape' });
      await nextFrame();
      expect(dialog.opened).to.be.false;
    } finally {
      release();
    }
  });
});
