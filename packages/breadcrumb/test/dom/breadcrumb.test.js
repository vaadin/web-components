import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';

// Enable experimental feature flag before importing elements
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

import '../../src/vaadin-breadcrumb.js';

describe('vaadin-breadcrumb', () => {
  let breadcrumb;

  beforeEach(async () => {
    breadcrumb = fixtureSync(
      `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/shoes" current>Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `,
    );
    await nextFrame();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(breadcrumb).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(breadcrumb).shadowDom.to.equalSnapshot();
    });
  });
});

describe('vaadin-breadcrumb-item', () => {
  let item;

  describe('default', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>');
      await nextFrame();
    });

    describe('host', () => {
      it('default', async () => {
        await expect(item).dom.to.equalSnapshot();
      });
    });

    describe('shadow', () => {
      it('default', async () => {
        await expect(item).shadowDom.to.equalSnapshot();
      });
    });
  });

  describe('with path', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>');
      await nextFrame();
    });

    describe('host', () => {
      it('default', async () => {
        await expect(item).dom.to.equalSnapshot();
      });
    });

    describe('shadow', () => {
      it('default', async () => {
        await expect(item).shadowDom.to.equalSnapshot();
      });
    });
  });

  describe('with current', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/products" current>Products</vaadin-breadcrumb-item>');
      await nextFrame();
    });

    describe('host', () => {
      it('default', async () => {
        await expect(item).dom.to.equalSnapshot();
      });
    });

    describe('shadow', () => {
      it('default', async () => {
        await expect(item).shadowDom.to.equalSnapshot();
      });
    });
  });
});
