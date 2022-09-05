import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/tooltip';
import '@vaadin/time-picker';
import { mouseenter } from '@vaadin/tooltip/test/helpers.js';

describe(`timepicker tooltip`, () => {
  let timepicker, tooltipOverlay;

  beforeEach(() => {
    timepicker = fixtureSync(`
      <vaadin-time-picker>
        <vaadin-tooltip slot="tooltip" text="Tooltip text"></vaadin-tooltip>
      </vaadin-time-picker>
    `);
    const tooltip = timepicker.querySelector('vaadin-tooltip');
    tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
  });

  it('should show tooltip', () => {
    mouseenter(timepicker);
    expect(tooltipOverlay.opened).to.be.true;
  });

  it('should not show tooltip when open', () => {
    timepicker.click();
    mouseenter(timepicker);
    expect(tooltipOverlay.opened).not.to.be.true;
  });
});
