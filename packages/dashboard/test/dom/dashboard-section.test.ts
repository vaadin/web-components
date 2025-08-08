import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-dashboard-section.js';

describe('vaadin-dashboard-section', () => {
  let section;

  beforeEach(async () => {
    section = fixtureSync('<vaadin-dashboard-section></vaadin-dashboard-section>');
    section.sectionTitle = 'Custom title';
    await nextRender();
  });

  it('host', async () => {
    await expect(section).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(section).shadowDom.to.equalSnapshot();
  });
});
