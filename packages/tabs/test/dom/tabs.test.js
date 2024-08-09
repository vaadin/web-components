import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-tabs.js';

describe('vaadin-tabs', () => {
  let tabs;

  beforeEach(() => {
    tabs = fixtureSync('<vaadin-tabs></vaadin-tabs>');
  });

  it('default', async () => {
    await expect(tabs).shadowDom.to.equalSnapshot();
  });
});
