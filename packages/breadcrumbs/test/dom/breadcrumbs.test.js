import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumbs.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs', () => {
  let breadcrumbs;

  describe('empty', () => {
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

      it('i18n', async () => {
        breadcrumbs.i18n = { moreItems: 'Show hidden items' };
        await nextRender();
        await expect(breadcrumbs).shadowDom.to.equalSnapshot();
      });
    });
  });

  describe('items', () => {
    beforeEach(async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/api">API</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
    });

    describe('host', () => {
      it('all linked', async () => {
        await expect(breadcrumbs).dom.to.equalSnapshot();
      });

      it('with current', async () => {
        breadcrumbs.querySelector('vaadin-breadcrumbs-item:last-child').removeAttribute('path');
        await nextRender();
        await expect(breadcrumbs).dom.to.equalSnapshot();
      });
    });
  });
});
