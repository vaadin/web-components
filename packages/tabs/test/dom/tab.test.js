import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-tab.js';

describe('vaadin-tab', () => {
  let tab;

  beforeEach(() => {
    tab = fixtureSync('<vaadin-tab></vaadin-tab>');
  });

  it('default', async () => {
    await expect(tab).shadowDom.to.equalSnapshot();
  });
});
