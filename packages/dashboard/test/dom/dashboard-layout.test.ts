import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-dashboard-layout.js';

describe('vaadin-dashboard-layout', () => {
  let dashboard;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard-layout></vaadin-dashboard-layout>');
    await nextRender();
  });

  it('host', async () => {
    await expect(dashboard).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(dashboard).shadowDom.to.equalSnapshot();
  });
});
