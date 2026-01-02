import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-breadcrumb.js';
import '../../../src/vaadin-breadcrumb-item.js';

describe('breadcrumb', () => {
  let div, element;

  afterEach(async () => {
    await resetMouse();
  });

  describe('basic', () => {
    it('default', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products/laptops">Laptops</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>MacBook Pro</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await visualDiff(div, 'default');
    });

    it('short', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Settings</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await visualDiff(div, 'short');
    });

    it('single-item', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await visualDiff(div, 'single-item');
    });

    it('long-trail', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/docs">Documentation</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/docs/components">Components</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/docs/components/navigation">Navigation</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/docs/components/navigation/breadcrumb">Breadcrumb</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Examples</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await visualDiff(div, 'long-trail');
    });
  });

  describe('states', () => {
    it('hover', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      const item = element.querySelector('vaadin-breadcrumb-item[href="/products"]');
      await sendMouseToElement({ type: 'move', element: item });
      await visualDiff(div, 'hover');
    });

    it('focus-ring', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring-first');
    });

    it('focus-ring-second', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring-second');
    });

    it('disabled', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products" disabled>Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await visualDiff(div, 'disabled');
    });

    it('disabled-hover', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products" disabled>Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      const item = element.querySelector('vaadin-breadcrumb-item[disabled]');
      await sendMouseToElement({ type: 'move', element: item });
      await visualDiff(div, 'disabled-hover');
    });
  });

  describe('attributes', () => {
    it('with-target', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="https://vaadin.com" target="_blank">Vaadin (opens in new tab)</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await visualDiff(div, 'with-target');
    });

    it('router-ignore', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/api" router-ignore>API (full page reload)</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await visualDiff(div, 'router-ignore');
    });
  });

  describe('RTL', () => {
    it('rtl', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.setAttribute('dir', 'rtl');
      element = fixtureSync(
        `<vaadin-breadcrumb>
          <vaadin-breadcrumb-item href="/">الصفحة الرئيسية</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item href="/products">المنتجات</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>الصفحة الحالية</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`,
        div,
      );
      await visualDiff(div, 'rtl');
    });
  });
});
