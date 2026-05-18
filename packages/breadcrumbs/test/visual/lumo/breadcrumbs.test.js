import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/breadcrumbs.css';
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
            <vaadin-breadcrumbs-item path="/docs/projects">Projects</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs/projects/2026">2026</vaadin-breadcrumbs-item>
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
  });
});
