import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/date-picker.css';
import '../src/vaadin-date-picker.js';
import { open } from './helpers.js';

describe('closing animation', () => {
  let width;
  let height;

  before(() => {
    width = window.innerWidth;
    height = window.innerHeight;
  });

  afterEach(async () => {
    await setViewport({ width, height });
  });

  it('should preserve the month scroll position while closing', async () => {
    await setViewport({ width: 420, height: 700 });
    const datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    await nextRender();
    await open(datePicker);

    const overlay = datePicker.$.overlay;
    const content = datePicker._overlayContent;
    const monthScroller = content._monthScroller;
    const position = monthScroller.position;

    // Keep the overlay in the closing state until the scroll position is checked.
    overlay._enqueueAnimation = () => {};
    overlay.shadowRoot.querySelector('[part="backdrop"]').click();
    expect(overlay.hasAttribute('closing')).to.be.true;

    // Check the position while the overlay is still visible.
    await aTimeout(50);

    expect(overlay.hasAttribute('closing')).to.be.true;
    expect(monthScroller.position).to.equal(position);
    overlay._finishClosing();
  });
});
