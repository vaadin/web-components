import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-breadcrumb.js';

describe('breadcrumb', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item current>Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('current item', async () => {
      await visualDiff(div, 'current-item');
    });
  });

  describe('overflow', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb style="max-width: 200px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/shoes">Shoes</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item current>Running Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
      // Allow overflow detection to run
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
      await nextRender();
    });

    it('overflow', async () => {
      await visualDiff(div, 'overflow');
    });
  });

  describe('custom separator', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb>
          <span slot="separator">/</span>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item current>Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('custom separator', async () => {
      await visualDiff(div, 'custom-separator');
    });
  });

  describe('custom properties', () => {
    beforeEach(async () => {
      fixtureSync(
        `
        <vaadin-breadcrumb style="
          --vaadin-breadcrumb-gap: 1em;
          --vaadin-breadcrumb-separator-color: red;
          --vaadin-breadcrumb-item-text-color: blue;
          --vaadin-breadcrumb-item-current-text-color: green;
        ">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item current>Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
        `,
        div,
      );
      await nextRender();
    });

    it('custom properties', async () => {
      await visualDiff(div, 'custom-properties');
    });
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe(`${dir}-basic`, () => {
        beforeEach(async () => {
          fixtureSync(
            `
            <vaadin-breadcrumb>
              <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
              <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
              <vaadin-breadcrumb-item current>Shoes</vaadin-breadcrumb-item>
            </vaadin-breadcrumb>
            `,
            div,
          );
          await nextRender();
        });

        it('basic', async () => {
          await visualDiff(div, `${dir}-basic`);
        });
      });
    });
  });
});
