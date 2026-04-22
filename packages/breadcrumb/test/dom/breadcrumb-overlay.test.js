import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';

// Enable the experimental feature flag before importing the breadcrumb modules
// — without it, the elements never register in customElements.
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

await import('../../src/vaadin-breadcrumb-overlay.js');

describe('vaadin-breadcrumb-overlay', () => {
  describe('shadow', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-breadcrumb-overlay></vaadin-breadcrumb-overlay>');
      await nextRender();
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('default', async () => {
      await expect(overlay).shadowDom.to.equalSnapshot();
    });
  });
});
