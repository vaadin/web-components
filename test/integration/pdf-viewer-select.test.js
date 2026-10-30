import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/pdf-viewer/test/enable-feature-flag.js';
import '@vaadin/pdf-viewer/src/vaadin-pdf-viewer.js';

describe('pdf-viewer with select', () => {
  let viewer, select;

  async function selectItem(label) {
    select.opened = true;
    await nextRender();
    const item = [...select.querySelectorAll('vaadin-select-item')].find((element) => element.textContent === label);
    const idle = oneEvent(viewer, 'render-idle');
    item.click();
    await idle;
  }

  beforeEach(async () => {
    viewer = fixtureSync('<vaadin-pdf-viewer style="width: 600px; height: 400px"></vaadin-pdf-viewer>');
    await nextRender();
    const idle = oneEvent(viewer, 'render-idle');
    viewer.src = new URL('../../packages/pdf-viewer/test/fixtures/multi-page.pdf', import.meta.url).href;
    await idle;
    select = viewer.querySelector('vaadin-select');
  });

  it('should set the zoom selected in the zoom select', async () => {
    await selectItem('200%');
    expect(viewer.zoom).to.equal(2);
  });

  it('should not let the change event of the zoom select reach the application', async () => {
    const spy = sinon.spy();
    viewer.addEventListener('change', spy);
    await selectItem('200%');
    expect(spy).to.be.not.called;
  });
});
