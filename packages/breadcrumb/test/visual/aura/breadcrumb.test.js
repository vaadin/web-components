import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-breadcrumb.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('breadcrumb', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  describe('default', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/shoes">Shoes</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Running Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('default', async () => {
      await visualDiff(div, 'default');
    });
  });

  describe('current', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('current-page', async () => {
      await visualDiff(div, 'current-page');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products" disabled>Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('disabled-item', async () => {
      await visualDiff(div, 'disabled-item');
    });
  });

  describe('overflow', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb style="width: 250px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/shoes">Shoes</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/shoes/running">Running</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Trail Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('overflow', async () => {
      await visualDiff(div, 'overflow');
    });

    it('overflow-open', async () => {
      div.style.height = '200px';
      const breadcrumb = div.querySelector('vaadin-breadcrumb');
      const button = breadcrumb.shadowRoot.querySelector('[part="overflow-button"]');
      button.click();
      await nextRender();
      await visualDiff(div, 'overflow-open');
    });
  });

  describe('mobile', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb style="width: 80px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('mobile', async () => {
      await visualDiff(div, 'mobile');
    });
  });

  describe('focus-ring', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring');
    });
  });
});
