import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumb.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb', () => {
  let breadcrumb;

  beforeEach(async () => {
    breadcrumb = fixtureSync(
      `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `,
    );
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(breadcrumb).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(breadcrumb).shadowDom.to.equalSnapshot();
    });
  });
});
