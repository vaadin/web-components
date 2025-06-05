import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/popover/src/vaadin-popover.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { mouseleave } from '@vaadin/popover/test/helpers';
import { mouseenter } from '@vaadin/tooltip/test/helpers';

describe('popover and tooltip', () => {
  let target, popover, popoverOverlay, tooltip, tooltipOverlay;

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <button id="target">Target</button>
        <vaadin-popover></vaadin-popover>
        <vaadin-tooltip text="Tooltip"></vaadin-popover>
      </div>
    `);
    target = wrapper.querySelector('#target');
    popover = wrapper.querySelector('vaadin-popover');
    popoverOverlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
    tooltip = wrapper.querySelector('vaadin-tooltip');
    tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

    popover.trigger = ['hover'];
    popover.target = target;
    popover.hoverDelay = 0;
    popover.hideDelay = 0;

    tooltip.target = target;
    tooltip.hoverDelay = 1;
    tooltip.hideDelay = 1;

    await nextRender();
  });

  it('should close popover on mouse leave while tooltip is opened', async () => {
    mouseenter(target);

    await aTimeout(2);

    expect(popoverOverlay.opened).to.be.true;
    expect(tooltipOverlay.opened).to.be.true;

    mouseleave(target);

    await aTimeout(2);

    expect(popoverOverlay.opened).to.be.false;
    expect(tooltipOverlay.opened).to.be.false;
  });
});
