import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumbs-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs-item', () => {
  let item;

  beforeEach(async () => {
    item = fixtureSync('<vaadin-breadcrumbs-item></vaadin-breadcrumbs-item>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(item).dom.to.equalSnapshot();
    });

    it('prefix', async () => {
      item = fixtureSync(`
        <vaadin-breadcrumbs-item>
          <span slot="prefix">icon</span>
          Home
        </vaadin-breadcrumbs-item>
      `);
      await nextRender();
      await expect(item).dom.to.equalSnapshot();
    });

    it('prefix path', async () => {
      item = fixtureSync(`
        <vaadin-breadcrumbs-item path="/foo">
          <span slot="prefix">icon</span>
          Home
        </vaadin-breadcrumbs-item>
      `);
      await nextRender();
      await expect(item).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('path', async () => {
      item.path = '/foo';
      await nextUpdate(item);
      await expect(item).shadowDom.to.equalSnapshot();
    });
  });
});
