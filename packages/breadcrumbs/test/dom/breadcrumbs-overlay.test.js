import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumbs.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs-overlay', () => {
  let breadcrumbs, overlay;

  beforeEach(async () => {
    breadcrumbs = fixtureSync(`
      <vaadin-breadcrumbs style="max-width: 200px">
        <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item path="/a">Alpha section</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item path="/a/b">Beta section</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item>Current page</vaadin-breadcrumbs-item>
      </vaadin-breadcrumbs>
    `);
    await nextRender();
    await nextResize(breadcrumbs);
    overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(overlay).shadowDom.to.equalSnapshot();
    });
  });

  describe('opened', () => {
    beforeEach(async () => {
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('host', async () => {
      await expect(breadcrumbs).dom.to.equalSnapshot();
    });
  });
});
