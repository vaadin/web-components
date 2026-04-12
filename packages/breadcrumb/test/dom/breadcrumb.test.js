import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumb.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb', () => {
  let breadcrumb;

  beforeEach(async () => {
    breadcrumb = fixtureSync(
      `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
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

  beforeEach(async () => {
    item = fixtureSync(`<vaadin-breadcrumb-item>Item</vaadin-breadcrumb-item>`);
    await nextFrame();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(item).dom.to.equalSnapshot();
    });

    it('path', async () => {
      item.path = '/home';
      await nextRender();
      await expect(item).dom.to.equalSnapshot();
    });

    it('current', async () => {
      item._setCurrent(true);
      await nextRender();
      await expect(item).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      item.path = '/home';
      item.disabled = true;
      await nextRender();
      await expect(item).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('path', async () => {
      item.path = '/home';
      await nextRender();
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('current', async () => {
      item._setCurrent(true);
      await nextRender();
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      item.path = '/home';
      item.disabled = true;
      await nextRender();
      await expect(item).shadowDom.to.equalSnapshot();
    });
  });
});
