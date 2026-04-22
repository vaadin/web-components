import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/icon.css';
import '@vaadin/vaadin-lumo-styles/components/breadcrumb.css';

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
    // Reset the mouse so a hover state from one test does not leak into
    // the next.
    await resetMouse();
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

  it('hover', async () => {
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
    // Hover over the second item to trigger the hover underline state.
    const item = element.querySelectorAll('vaadin-breadcrumb-item')[1];
    await sendMouseToElement({ type: 'move', element: item });
    await visualDiff(div, 'hover');
  });

  it('focus-ring', async () => {
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
    // Tab once to focus the first item's link. The :focus-visible ring
    // is what we want to capture; sendKeys produces a real keyboard
    // focus, so :focus-visible matches.
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'focus-ring');
  });

  it('overflow', async () => {
    // Constrain the wrapping div to a width that forces overflow detection
    // to collapse the inner items into the overflow button.
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

  it('overflow-opened', async () => {
    // Use the document body as the visual diff root so the overlay
    // (which renders into the top layer outside the wrapping div) is
    // also captured in the screenshot.
    document.body.style.height = '220px';
    document.body.style.width = '320px';
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
    // Click the overflow button to open the overlay.
    element._overflowButton.click();
    await nextRender();
    await visualDiff(document.body, 'overflow-opened');
  });
});
