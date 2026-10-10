import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-details.js';

describe('vaadin-details', () => {
  let details;

  beforeEach(async () => {
    details = fixtureSync(`
      <vaadin-details>
        <vaadin-details-summary slot="summary">Summary</vaadin-details-summary>
        <div>Content</div>
      </vaadin-details>
    `);
    await nextUpdate(details);
  });

  it('default', async () => {
    await expect(details).to.equalAriaSnapshot();
  });

  it('opened', async () => {
    details.opened = true;
    await nextUpdate(details);
    await expect(details).to.equalAriaSnapshot();
  });

  it('disabled', async () => {
    details.disabled = true;
    await nextUpdate(details);
    await expect(details).to.equalAriaSnapshot();
  });

  it('summary string', async () => {
    details = fixtureSync('<vaadin-details summary="Summary"><div>Content</div></vaadin-details>');
    await nextUpdate(details);
    await expect(details).to.equalAriaSnapshot();
  });
});
