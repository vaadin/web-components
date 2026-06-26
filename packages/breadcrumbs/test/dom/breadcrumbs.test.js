import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
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

  describe('overflow', () => {
    let overlay;

    beforeEach(async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs style="max-width: 160px">
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/api">API</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
      await nextResize(breadcrumbs);
      overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
    });

    it('host', async () => {
      await expect(breadcrumbs).dom.to.equalSnapshot();
    });

    it('shadow', async () => {
      await expect(breadcrumbs).shadowDom.to.equalSnapshot();
    });

    it('overlay shadow', async () => {
      await expect(overlay).shadowDom.to.equalSnapshot();
    });

    it('opened', async () => {
      breadcrumbs.$.overflow.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      await expect(breadcrumbs).dom.to.equalSnapshot();
    });
  });
});
