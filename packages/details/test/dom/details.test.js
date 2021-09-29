import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-details.js';

describe('vaadin-details', () => {
  let details;

  // Ignore generated attributes to prevent failures
  // when running snapshot tests in a different order
  const SNAPSHOT_CONFIG = { ignoreAttributes: ['id', 'aria-controls'] };

  beforeEach(() => {
    details = fixtureSync(`
      <vaadin-details>
        <div slot="summary">Summary</div>
        <div>Content</div>
      </vaadin-details>
    `);
  });

  it('default', async () => {
    await expect(details).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('opened', async () => {
    details.opened = true;
    await expect(details).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('disabled', async () => {
    details.disabled = true;
    await expect(details).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
