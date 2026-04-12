import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-breadcrumb.js';

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

  describe('truncation', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/very-long-category-name">Very Long Category Name That Should Truncate</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Another Very Long Label That Should Be Truncated</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('truncated-labels', async () => {
      await visualDiff(div, 'truncated-labels');
    });
  });
});
