import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/breadcrumbs.css';
import '../../../src/vaadin-breadcrumbs.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('breadcrumbs', () => {
  let div;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.padding = '10px';
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
