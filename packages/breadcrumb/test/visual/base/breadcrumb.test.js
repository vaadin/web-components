import { emulateMedia } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';

// Enable the experimental feature flag before importing the breadcrumb
// modules, otherwise the elements never register in customElements.
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

await import('../../../src/vaadin-breadcrumb.js');
await import('@vaadin/icon/src/vaadin-icon.js');
await import('@vaadin/icons/vaadin-iconset.js');

describe('breadcrumb', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
  });

  afterEach(async () => {
    // Reset forced-colors emulation between tests so a single failing test
    // does not leak emulation state into the next test.
    await emulateMedia({ forcedColors: 'none' });
  });

  it('basic', async () => {
    element = fixtureSync(
      `
        <vaadin-breadcrumb aria-label="Trail">
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `,
      div,
    );
    await nextRender();
    await visualDiff(div, 'basic');
  });

  it('icon-prefix', async () => {
    element = fixtureSync(
      `
        <vaadin-breadcrumb aria-label="Trail">
          <vaadin-breadcrumb-item path="/">
            <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
            Home
          </vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `,
      div,
    );
    await nextRender();
    await visualDiff(div, 'icon-prefix');
  });

  it('overflow', async () => {
    // Constrain the wrapping div to a width that forces overflow detection
    // to collapse the inner items into the overflow button. The host has
    // its own deterministic width via the wrapper, so the overflow logic
    // produces a stable layout for the screenshot.
    div.style.display = 'block';
    div.style.width = '260px';
    element = fixtureSync(
      `
        <vaadin-breadcrumb aria-label="Trail" style="width: 240px;">
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs">Documentation</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs/security">Security</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs/security/oauth">OAuth</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `,
      div,
    );
    await nextRender();
    await visualDiff(div, 'overflow');
  });

  it('forced-colors', async () => {
    // Emulate forced-colors mode at the browser level so the @media
    // (forced-colors: active) rules in the base styles take effect. The
    // afterEach hook resets the emulation for subsequent tests.
    await emulateMedia({ forcedColors: 'active' });
    div.style.display = 'block';
    div.style.width = '260px';
    element = fixtureSync(
      `
        <vaadin-breadcrumb aria-label="Trail" style="width: 240px;">
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs">Documentation</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs/security">Security</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `,
      div,
    );
    await nextRender();
    await visualDiff(div, 'forced-colors');
  });

  it('custom-separator', async () => {
    // A slash glyph is a common alternative separator. Setting it on the
    // host applies to both per-item separators and the overflow separator,
    // so the snapshot also forces overflow to exercise both paths.
    div.style.display = 'block';
    div.style.width = '260px';
    element = fixtureSync(
      `
        <vaadin-breadcrumb aria-label="Trail" style="width: 240px;">
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs">Documentation</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/docs/security">Security</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `,
      div,
    );
    element.style.setProperty(
      '--vaadin-breadcrumb-separator',
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 19 18 5'/></svg>\")",
    );
    await nextRender();
    await visualDiff(div, 'custom-separator');
  });
});
