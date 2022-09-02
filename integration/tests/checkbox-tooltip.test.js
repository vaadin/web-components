import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/checkbox';
import '@vaadin/tooltip';

describe('checkbox with tooltip', () => {
  let checkbox, tooltip;

  beforeEach(() => {
    checkbox = fixtureSync(`
      <vaadin-checkbox label="I accept terms and conditions">
        <vaadin-tooltip slot="tooltip" text="Please read first"></vaadin-tooltip>
      </vaadin-checkbox>
    `);
    tooltip = checkbox.querySelector('vaadin-tooltip');
  });

  it('should set tooltip target as checkbox host element', () => {
    expect(tooltip.target).to.equal(checkbox);
  });
});
