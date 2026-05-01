import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumb-trail.js';
import '../vaadin-breadcrumb-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbTrailComponent = true;

describe('vaadin-breadcrumb-trail', () => {
  it('should register vaadin-breadcrumb-trail in the custom element registry', () => {
    expect(customElements.get('vaadin-breadcrumb-trail')).to.be.ok;
  });

  it('should register vaadin-breadcrumb-item in the custom element registry', () => {
    expect(customElements.get('vaadin-breadcrumb-item')).to.be.ok;
  });

  it('should attach the trail with a non-null shadowRoot', async () => {
    const trail = fixtureSync('<vaadin-breadcrumb-trail></vaadin-breadcrumb-trail>');
    await nextRender();
    expect(trail.shadowRoot).to.not.be.null;
  });

  it('should attach the item with a non-null shadowRoot', async () => {
    const item = fixtureSync('<vaadin-breadcrumb-item></vaadin-breadcrumb-item>');
    await nextRender();
    expect(item.shadowRoot).to.not.be.null;
  });
});
