import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs.js';
import '../vaadin-breadcrumbs-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs', () => {
  it('should register vaadin-breadcrumbs in the custom element registry', () => {
    expect(customElements.get('vaadin-breadcrumbs')).to.be.ok;
  });

  it('should register vaadin-breadcrumbs-item in the custom element registry', () => {
    expect(customElements.get('vaadin-breadcrumbs-item')).to.be.ok;
  });

  it('should attach the breadcrumbs with a non-null shadowRoot', async () => {
    const breadcrumbs = fixtureSync('<vaadin-breadcrumbs></vaadin-breadcrumbs>');
    await nextRender();
    expect(breadcrumbs.shadowRoot).to.not.be.null;
  });

  it('should attach the item with a non-null shadowRoot', async () => {
    const item = fixtureSync('<vaadin-breadcrumbs-item></vaadin-breadcrumbs-item>');
    await nextRender();
    expect(item.shadowRoot).to.not.be.null;
  });
});
