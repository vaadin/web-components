import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/pdf-viewer/test/enable-feature-flag.js';
import '@vaadin/pdf-viewer/src/vaadin-pdf-viewer.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';

describe('pdf-viewer with slotted controls', () => {
  let viewer, approve, reject;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    viewer = fixtureSync(`
      <vaadin-pdf-viewer style="width: 900px; height: 400px">
        <vaadin-button slot="toolbar-actions">
          Approve
          <vaadin-tooltip slot="tooltip" text="Approve the document"></vaadin-tooltip>
        </vaadin-button>
      </vaadin-pdf-viewer>
    `);
    await nextRender();
    const idle = oneEvent(viewer, 'render-idle');
    viewer.src = new URL('../../packages/pdf-viewer/test/fixtures/multi-page.pdf', import.meta.url).href;
    await idle;
    approve = viewer.querySelector('vaadin-button');
    // Added after the viewer rendered its toolbar
    reject = document.createElement('vaadin-button');
    reject.slot = 'toolbar-actions';
    reject.textContent = 'Reject';
    viewer.appendChild(reject);
    await nextRender();
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should show the slotted buttons in DOM order at the end of the toolbar, before the download button', () => {
    const toolbar = viewer.shadowRoot.querySelector('[part="toolbar"]').getBoundingClientRect();
    const zoomIn = viewer.querySelector('vaadin-pdf-viewer-button[icon="zoom-in"]').getBoundingClientRect();
    const download = viewer.querySelector('vaadin-pdf-viewer-button[icon="download"]').getBoundingClientRect();
    const approveRect = approve.getBoundingClientRect();
    const rejectRect = reject.getBoundingClientRect();
    expect(approveRect.left).to.be.greaterThan(zoomIn.right);
    expect(approveRect.right).to.be.at.most(rejectRect.left);
    expect(rejectRect.right).to.be.at.most(download.left);
    expect(toolbar.right - download.right).to.be.lessThan(20);
  });

  it('should show the tooltip of a slotted button on hover', async () => {
    const tooltip = approve.querySelector('vaadin-tooltip');
    await sendMouseToElement({ type: 'move', element: approve });
    await nextRender();
    expect(tooltip.opened).to.be.true;
  });

  it('should reach the slotted buttons with Tab after the toolbar controls', async () => {
    viewer.querySelector('vaadin-pdf-viewer-button[icon="zoom-in"]').focus();
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(approve);
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(reject);
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(viewer.querySelector('vaadin-pdf-viewer-button[icon="download"]'));
  });

  it('should keep the slotted buttons when the toolbar renders again', async () => {
    viewer.zoom = 2;
    await oneEvent(viewer, 'render-idle');
    viewer.i18n = { zoomIn: 'Suurenna' };
    await nextFrame();
    expect(approve.parentElement).to.equal(viewer);
    expect(reject.parentElement).to.equal(viewer);
    expect(approve.checkVisibility()).to.be.true;
    expect(reject.checkVisibility()).to.be.true;
  });

  it('should hide the slotted buttons with the collapsed toolbar', async () => {
    viewer.headerVisible = true;
    viewer.toolbarCollapsed = true;
    await nextFrame();
    expect(approve.checkVisibility()).to.be.false;
    expect(reject.checkVisibility()).to.be.false;
  });

  it('should move focus from a slotted button to the toggle button when the toolbar collapses', async () => {
    viewer.headerVisible = true;
    await nextFrame();
    reject.focus();
    viewer.toolbarCollapsed = true;
    await nextFrame();
    expect(document.activeElement).to.equal(viewer.querySelector('[slot="toolbar-toggle"]'));
  });
});
