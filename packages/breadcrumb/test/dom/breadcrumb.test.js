import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextResize } from '@vaadin/testing-helpers';

// Enable the experimental feature flag before importing the breadcrumb modules
// — without it, the elements never register in customElements.
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

await import('../../src/vaadin-breadcrumb.js');

describe('vaadin-breadcrumb', () => {
  describe('shadow', () => {
    let breadcrumb;

    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('default', async () => {
      await expect(breadcrumb).shadowDom.to.equalSnapshot();
    });

    describe('has-overflow', () => {
      // Items get a fixed width via inline style so the overflow math is
      // deterministic across runs and across browsers.
      const ITEM_WIDTH = 100;

      let wrapper;

      beforeEach(async () => {
        wrapper = fixtureSync(`
          <div style="width: 320px;">
            <vaadin-breadcrumb>
              <vaadin-breadcrumb-item
                path="/"
                style="width: ${ITEM_WIDTH}px; box-sizing: border-box; flex: none;"
              >Root</vaadin-breadcrumb-item>
              <vaadin-breadcrumb-item
                path="/a"
                style="width: ${ITEM_WIDTH}px; box-sizing: border-box; flex: none;"
              >A</vaadin-breadcrumb-item>
              <vaadin-breadcrumb-item
                path="/b"
                style="width: ${ITEM_WIDTH}px; box-sizing: border-box; flex: none;"
              >B</vaadin-breadcrumb-item>
              <vaadin-breadcrumb-item
                style="width: ${ITEM_WIDTH}px; box-sizing: border-box; flex: none;"
              >Current</vaadin-breadcrumb-item>
            </vaadin-breadcrumb>
          </div>
        `);
        breadcrumb = wrapper.querySelector('vaadin-breadcrumb');
        await nextRender();
        // Allow the initial ResizeObserver callback to fire so overflow
        // detection runs against the actual rendered widths.
        await nextResize(breadcrumb);
        await nextFrame();
      });

      it('shadow', async () => {
        // Sanity check: the host should now reflect the overflow attribute.
        expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;
        await expect(breadcrumb).shadowDom.to.equalSnapshot();
      });
    });
  });
});
