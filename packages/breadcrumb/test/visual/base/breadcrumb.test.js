import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-breadcrumb.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('breadcrumb', () => {
  let div, _element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  beforeEach(async () => {
    _element = fixtureSync(
      `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `,
      div,
    );
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(div, 'breadcrumb-basic');
  });
});
