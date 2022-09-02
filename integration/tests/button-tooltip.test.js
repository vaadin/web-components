import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/button';
import '@vaadin/tooltip';

describe('button with tooltip', () => {
  let button, tooltip;

  beforeEach(() => {
    button = fixtureSync(`
      <vaadin-button>
        Edit
        <vaadin-tooltip slot="tooltip" text="Click to edit"></vaadin-tooltip>
      </vaadin-button>
    `);
    tooltip = button.querySelector('vaadin-tooltip');
  });

  it('should set tooltip target as button host element', () => {
    expect(tooltip.target).to.equal(button);
  });
});
