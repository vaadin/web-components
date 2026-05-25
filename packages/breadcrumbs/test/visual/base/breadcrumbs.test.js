import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../not-animated-styles.css';
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

    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('item-focus', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'item-focus');
    });
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

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

    it('rtl-basic', async () => {
      await visualDiff(div, 'rtl-basic');
    });
  });

  describe('overflow', () => {
    let breadcrumbs;

    beforeEach(async () => {
      div.style.width = '220px';
      fixtureSync(
        `
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs">Documents</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs/projects" disabled>Projects</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Summary report</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        `,
        div,
      );
      breadcrumbs = div.querySelector('vaadin-breadcrumbs');
      await nextRender();
      await nextResize(breadcrumbs);
    });

    it('overflow', async () => {
      await visualDiff(div, 'overflow');
    });

    it('overflow-focus', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'overflow-focus');
    });

    it('overflow-opened', async () => {
      div.style.height = '150px';
      const overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      button.focus();
      await sendKeys({ press: 'Enter' });
      await oneEvent(overlay, 'vaadin-overlay-open');
      await visualDiff(div, 'overflow-opened');
    });
  });
});
