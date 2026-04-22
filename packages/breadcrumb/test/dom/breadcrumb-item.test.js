import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';

// Enable the experimental feature flag before importing the breadcrumb modules
// — without it, the elements never register in customElements.
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

await import('../../src/vaadin-breadcrumb-item.js');

describe('vaadin-breadcrumb-item', () => {
  let item;

  describe('shadow', () => {
    it('with path', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item>');
      await nextRender();
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('current (no path, with current attribute)', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item current>Current</vaadin-breadcrumb-item>');
      await nextRender();
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('with prefix slot content', async () => {
      item = fixtureSync(`
        <vaadin-breadcrumb-item path="/">
          <span slot="prefix">[icon]</span>
          Home
        </vaadin-breadcrumb-item>
      `);
      await nextRender();
      await expect(item).shadowDom.to.equalSnapshot();
    });
  });
});
