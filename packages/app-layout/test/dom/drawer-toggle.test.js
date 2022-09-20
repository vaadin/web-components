import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-drawer-toggle.js';

describe('vaadin-app-layout', () => {
  let toggle;

  beforeEach(() => {
    toggle = fixtureSync('<vaadin-drawer-toggle></vaadin-drawer-toggle>');
  });

  it('default', async () => {
    await expect(toggle).shadowDom.to.equalSnapshot();
  });
});
