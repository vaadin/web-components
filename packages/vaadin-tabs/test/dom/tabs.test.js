import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-tabs.js';

describe('vaadin-tabs', () => {
  let tabs;

  // Ignore generated attributes to prevent failures
  // when running snapshot tests in a different order
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['id', 'aria-describedby', 'aria-labelledby', 'for']
  };

  beforeEach(() => {
    tabs = fixtureSync(`
    <vaadin-tabs>
      <vaadin-tab>Analytics</vaadin-tab>
      <vaadin-tab>Customers</vaadin-tab>
      <vaadin-tab>Dashboards</vaadin-tab>
    </vaadin-tabs>`);
  });

  it('default', async () => {
    await expect(tabs).shadowDom.to.equalSnapshot();
  });
});
