import { expect } from '@vaadin/chai-plugins';
// This file intentionally does NOT enable the breadcrumbTrailComponent feature
// flag before importing the package. The contract under test: importing the
// package while the flag is disabled (or unset) must not register any of the
// three custom elements.
//
// Web Test Runner loads each *.test.js file in its own browser document, so
// `customElements` (which is per-document) starts empty for this file even
// when other test files in the same suite enable the flag and register the
// elements.
import '../vaadin-breadcrumb-trail.js';
import '../vaadin-breadcrumb-item.js';
import '../vaadin-breadcrumb-trail-overlay.js';

describe('vaadin-breadcrumb-trail feature flag (disabled)', () => {
  it('should not register vaadin-breadcrumb-trail without the feature flag', () => {
    expect(customElements.get('vaadin-breadcrumb-trail')).to.be.undefined;
  });

  it('should not register vaadin-breadcrumb-item without the feature flag', () => {
    expect(customElements.get('vaadin-breadcrumb-item')).to.be.undefined;
  });

  it('should not register vaadin-breadcrumb-trail-overlay without the feature flag', () => {
    expect(customElements.get('vaadin-breadcrumb-trail-overlay')).to.be.undefined;
  });

  it('should not throw when importing the package without the feature flag', () => {
    // The imports above already executed during module evaluation without
    // throwing. If they had thrown, this test file would have failed to load
    // and the assertion below would never run. We re-assert via a direct
    // condition tied to the side effect of `defineCustomElement`: with the
    // flag disabled, the elements remain unregistered.
    expect(customElements.get('vaadin-breadcrumb-trail')).to.be.undefined;
    expect(customElements.get('vaadin-breadcrumb-item')).to.be.undefined;
    expect(customElements.get('vaadin-breadcrumb-trail-overlay')).to.be.undefined;
  });
});
