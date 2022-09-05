import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/time-picker';
import '@vaadin/tooltip';

describe('time-picker with tooltip', () => {
  let timePicker, tooltip;

  beforeEach(() => {
    timePicker = fixtureSync(`
      <vaadin-time-picker>
        <vaadin-tooltip slot="tooltip" text="Evening times are preferred"></vaadin-tooltip>
      </vaadin-time-picker>
    `);
    tooltip = timePicker.querySelector('vaadin-tooltip');
  });

  it('should set tooltip target as timePicker host element', () => {
    expect(tooltip.target).to.equal(timePicker);
  });
});
