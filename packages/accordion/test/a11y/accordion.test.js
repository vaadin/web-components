import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-accordion.js';

describe('vaadin-accordion', () => {
  let accordion;

  beforeEach(async () => {
    accordion = fixtureSync(`
      <vaadin-accordion>
        <vaadin-accordion-panel>
          <vaadin-accordion-heading slot="summary">Panel 1</vaadin-accordion-heading>
          <div>Content 1</div>
        </vaadin-accordion-panel>
        <vaadin-accordion-panel>
          <vaadin-accordion-heading slot="summary">Panel 2</vaadin-accordion-heading>
          <div>Content 2</div>
        </vaadin-accordion-panel>
        <vaadin-accordion-panel>
          <vaadin-accordion-heading slot="summary">Panel 3</vaadin-accordion-heading>
          <div>Content 3</div>
        </vaadin-accordion-panel>
      </vaadin-accordion>
    `);
    await nextRender();
  });

  it('default', async () => {
    await expect(accordion).to.equalAriaSnapshot();
  });

  it('opened', async () => {
    accordion.opened = 1;
    await nextUpdate(accordion);
    await expect(accordion).to.equalAriaSnapshot();
  });

  it('closed', async () => {
    accordion.opened = null;
    await nextUpdate(accordion);
    await expect(accordion).to.equalAriaSnapshot();
  });

  it('disabled panel', async () => {
    accordion.items[2].disabled = true;
    await nextUpdate(accordion.items[2]);
    await expect(accordion).to.equalAriaSnapshot();
  });
});
