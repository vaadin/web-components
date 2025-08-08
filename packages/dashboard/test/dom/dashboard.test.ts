import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-dashboard.js';

describe('vaadin-dashboard', () => {
  let dashboard;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
    dashboard.items = [{ id: '0' }, { id: '1' }];
    await nextRender();
  });

  it('host', async () => {
    await expect(dashboard).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(dashboard).shadowDom.to.equalSnapshot();
  });
});
