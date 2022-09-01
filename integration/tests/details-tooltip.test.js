import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/details';
import '@vaadin/tooltip';

describe('details with tooltip', () => {
  let details, tooltip;

  beforeEach(() => {
    details = fixtureSync(`
      <vaadin-details>
        <div slot="summary">Summary</div>
        <div>Collapsible content</div>
        <vaadin-tooltip slot="tooltip" text="Click to open"></vaadin-tooltip>
      </vaadin-details>
    `);
    tooltip = details.querySelector('vaadin-tooltip');
  });

  it('should set tooltip target as details summary part', () => {
    const summary = details.shadowRoot.querySelector('[part="summary"]');
    expect(tooltip.target).to.equal(summary);
  });

  it('should set tooltip position property to bottom-start', () => {
    expect(tooltip.target).to.equal('bottom-start');
  });
});
