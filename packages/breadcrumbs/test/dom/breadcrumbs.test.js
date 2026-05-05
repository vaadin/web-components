import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumbs.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs', () => {
  let breadcrumbs;

  beforeEach(async () => {
    breadcrumbs = fixtureSync('<vaadin-breadcrumbs></vaadin-breadcrumbs>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(breadcrumbs).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(breadcrumbs).shadowDom.to.equalSnapshot();
    });
  });
});
