import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/dialog/src/vaadin-dialog.js';
import '@vaadin/pdf-viewer/test/enable-feature-flag.js';
import '@vaadin/pdf-viewer/src/vaadin-pdf-viewer.js';

describe('pdf-viewer in dialog', () => {
  let dialog, viewer;

  function getFindBar() {
    return viewer.shadowRoot.querySelector('[part="find-bar"]');
  }

  function getContent() {
    return viewer.shadowRoot.querySelector('[part="content"]');
  }

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

  it('should open the find bar with Ctrl+F inside the viewer in the dialog', async () => {
    getContent().focus();
    const spy = sinon.spy();
    const onKeyDown = (event) => spy(event.defaultPrevented);
    document.addEventListener('keydown', onKeyDown);
    await sendKeys({ press: 'Control+KeyF' });
    document.removeEventListener('keydown', onKeyDown);
    await nextRender();
    expect(spy.lastCall.args[0]).to.be.true;
    expect(getFindBar().hidden).to.be.false;
    expect(dialog.opened).to.be.true;
  });

  it('should close the find bar first and the dialog second with Escape', async () => {
    getContent().focus();
    await sendKeys({ press: 'Control+KeyF' });
    await nextRender();
    await sendKeys({ press: 'Escape' });
    await nextFrame();
    expect(getFindBar().hidden).to.be.true;
    expect(dialog.opened).to.be.true;
    expect(viewer.shadowRoot.activeElement).to.equal(getContent());

    await sendKeys({ press: 'Escape' });
    await nextFrame();
    expect(dialog.opened).to.be.false;
  });

  it('should close the sidebar of a narrow viewer first and the dialog second with Escape', async () => {
    viewer.style.width = '360px';
    viewer.sidebarOpened = true;
    await nextRender();
    viewer.shadowRoot.querySelector('[part~="thumbnail"]').focus();
    await sendKeys({ press: 'Escape' });
    await nextFrame();
    expect(viewer.sidebarOpened).to.be.false;
    expect(dialog.opened).to.be.true;
    expect(document.activeElement).to.equal(viewer.querySelector('vaadin-pdf-viewer-button[icon="sidebar"]'));

    await sendKeys({ press: 'Escape' });
    await nextFrame();
    expect(dialog.opened).to.be.false;
  });

  it('should close the dialog with Escape in the sidebar of a wide viewer', async () => {
    viewer.sidebarOpened = true;
    await nextRender();
    viewer.shadowRoot.querySelector('[part~="thumbnail"]').focus();
    await sendKeys({ press: 'Escape' });
    await nextFrame();
    expect(dialog.opened).to.be.false;
  });

  it('should close the find bar and keep the dialog open with Escape on a find bar button', async () => {
    getContent().focus();
    await sendKeys({ press: 'Control+KeyF' });
    await nextRender();
    viewer.querySelector('vaadin-pdf-viewer-button[icon="close"]').focus();
    await sendKeys({ press: 'Escape' });
    await nextFrame();
    expect(getFindBar().hidden).to.be.true;
    expect(dialog.opened).to.be.true;
  });
});
