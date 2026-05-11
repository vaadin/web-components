import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../not-animated-styles.js';
import '../../../src/vaadin-breadcrumbs.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

/*
 * Note: there is no `forced-colors: active` visual test here. The repository
 * has no `emulateMedia` / forced-colors infrastructure today, so a real
 * verification of the forced-colors block (separator + focus indicator) cannot
 * be expressed as an automated visual test. Adding a stub that always passes
 * would be misleading. Coverage for that requirement is deferred until the
 * test runner gains forced-colors emulation.
 */

describe('breadcrumbs', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  describe('default', () => {
    beforeEach(async () => {
      fixtureSync(
        `
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        `,
        div,
      );
      await nextRender();
    });

    it('default trail', async () => {
      await visualDiff(div, 'default-trail');
    });
  });
});
