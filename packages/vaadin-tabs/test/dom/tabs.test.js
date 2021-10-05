import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-tabs.js';

describe('vaadin-tabs', () => {
  let tabs;

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
