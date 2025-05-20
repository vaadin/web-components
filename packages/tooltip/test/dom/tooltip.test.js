import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-tooltip.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-tooltip', () => {
  let tooltip;

  beforeEach(() => {
    resetUniqueId();
    tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
  });

  it('host', async () => {
    await expect(tooltip).dom.to.equalSnapshot();
  });

  it('default', async () => {
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  [
    'top-start',
    'top',
    'top-end',
    'bottom-start',
    'bottom',
    'bottom-end',
    'start-top',
    'start',
    'start-bottom',
    'end-top',
    'end',
    'end-bottom',
  ].forEach((position) => {
    it(position, async () => {
      tooltip.position = position;
      await nextUpdate(tooltip);
      await expect(tooltip).shadowDom.to.equalSnapshot();
    });
  });

  describe('opened', () => {
    let overlay;

    beforeEach(async () => {
      overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
      tooltip.manual = true;
      tooltip.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('overlay', async () => {
      await expect(overlay).dom.to.equalSnapshot();
    });

    it('overlay class', async () => {
      tooltip.overlayClass = 'custom tooltip-overlay';
      await nextUpdate(tooltip);
      await expect(overlay).dom.to.equalSnapshot();
    });
  });
});
