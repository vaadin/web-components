import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumb.js';
import '../../src/vaadin-breadcrumb-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-breadcrumb>
        <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
      </vaadin-breadcrumb>
    `);
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(element).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });
});

describe('vaadin-breadcrumb-item', () => {
  describe('with path', () => {
    let element;

    beforeEach(async () => {
      element = fixtureSync('<vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>');
      await nextRender();
    });

    describe('host', () => {
      it('default', async () => {
        await expect(element).dom.to.equalSnapshot();
      });

      it('disabled', async () => {
        element.disabled = true;
        await expect(element).dom.to.equalSnapshot();
      });
    });

    describe('shadow', () => {
      it('default', async () => {
        await expect(element).shadowDom.to.equalSnapshot();
      });
    });
  });

  describe('without path', () => {
    let element;

    beforeEach(async () => {
      element = fixtureSync('<vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>');
      await nextRender();
    });

    describe('host', () => {
      it('default', async () => {
        await expect(element).dom.to.equalSnapshot();
      });
    });

    describe('shadow', () => {
      it('default', async () => {
        await expect(element).shadowDom.to.equalSnapshot();
      });
    });
  });
});
