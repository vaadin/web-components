import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../not-animated-styles.css';
import '../../../src/vaadin-breadcrumbs.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

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

  describe('overflow', () => {
    let breadcrumbs, overlay;

    beforeEach(async () => {
      div.style.width = '250px';
      breadcrumbs = fixtureSync(
        `
          <vaadin-breadcrumbs style="max-width: 250px">
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
      overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
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
      breadcrumbs.$.overflow.focus();
      await sendKeys({ press: 'Enter' });
      await oneEvent(overlay, 'vaadin-overlay-open');
      await visualDiff(div, 'overflow-opened');
    });

    it('accent', async () => {
      div.style.height = '150px';
      breadcrumbs.setAttribute('theme', 'accent');
      breadcrumbs.$.overflow.focus();
      await sendKeys({ press: 'Enter' });
      await oneEvent(overlay, 'vaadin-overlay-open');
      await visualDiff(div, 'theme-accent');
    });
  });
});
