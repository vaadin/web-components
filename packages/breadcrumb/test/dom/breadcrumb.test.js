import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumb.js';
import '../../src/vaadin-breadcrumb-item.js';

describe('vaadin-breadcrumb', () => {
  let breadcrumb;

  describe('breadcrumb host', () => {
    beforeEach(() => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
    });

    it('default', async () => {
      await expect(breadcrumb).dom.to.equalSnapshot();
    });

    it('focused', async () => {
      breadcrumb.querySelector('vaadin-breadcrumb-item').focus();
      await expect(breadcrumb).dom.to.equalSnapshot();
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await expect(breadcrumb).dom.to.equalSnapshot();
    });
  });

  describe('breadcrumb shadow', () => {
    beforeEach(() => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
    });

    it('default', async () => {
      await expect(breadcrumb).shadowDom.to.equalSnapshot();
    });
  });
});

describe('vaadin-breadcrumb-item', () => {
  let item;

  describe('item host', () => {
    it('default with href', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>');
      await expect(item).dom.to.equalSnapshot();
    });

    it('default without href', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>');
      await expect(item).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/products" disabled>Products</vaadin-breadcrumb-item>');
      await expect(item).dom.to.equalSnapshot();
    });

    it('with target', async () => {
      item = fixtureSync(
        '<vaadin-breadcrumb-item href="https://vaadin.com" target="_blank">Vaadin</vaadin-breadcrumb-item>',
      );
      await expect(item).dom.to.equalSnapshot();
    });

    it('router-ignore', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/api" router-ignore>API</vaadin-breadcrumb-item>');
      await expect(item).dom.to.equalSnapshot();
    });

    it('focused', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>');
      item.focus();
      await expect(item).dom.to.equalSnapshot();
    });

    it('focus-ring', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>');
      await sendKeys({ press: 'Tab' });
      await expect(item).dom.to.equalSnapshot();
    });

    it('last item with href', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>');
      item._setLast(true);
      await expect(item).dom.to.equalSnapshot();
    });

    it('last item without href', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>');
      item._setLast(true);
      await expect(item).dom.to.equalSnapshot();
    });

    it('current', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>');
      // Simulate matching current page
      item._setCurrent(true);
      await expect(item).dom.to.equalSnapshot();
    });
  });

  describe('item shadow', () => {
    it('default with href', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>');
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('default without href', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>');
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/products" disabled>Products</vaadin-breadcrumb-item>');
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('last item with href', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>');
      item._setLast(true);
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('last item without href', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>');
      item._setLast(true);
      await expect(item).shadowDom.to.equalSnapshot();
    });
  });
});
