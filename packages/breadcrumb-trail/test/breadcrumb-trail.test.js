import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumb-trail.js';
import '../vaadin-breadcrumb-item.js';
import '../vaadin-breadcrumb-trail-overlay.js';

// The breadcrumb trail elements are experimental and only register when the
// feature flag is enabled. Setting the flag here triggers the deferred
// `customElements.define` calls registered by `defineCustomElement` during
// module import, so all three elements become available below.
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbTrailComponent = true;

describe('vaadin-breadcrumb-trail', () => {
  describe('custom element definition', () => {
    it('should register vaadin-breadcrumb-trail in the custom element registry', () => {
      expect(customElements.get('vaadin-breadcrumb-trail')).to.be.ok;
    });

    it('should register vaadin-breadcrumb-item in the custom element registry', () => {
      expect(customElements.get('vaadin-breadcrumb-item')).to.be.ok;
    });

    it('should register vaadin-breadcrumb-trail-overlay in the custom element registry', () => {
      expect(customElements.get('vaadin-breadcrumb-trail-overlay')).to.be.ok;
    });

    it('should expose "vaadin-breadcrumb-trail" as the static is getter', () => {
      expect(customElements.get('vaadin-breadcrumb-trail').is).to.equal('vaadin-breadcrumb-trail');
    });

    it('should expose "vaadin-breadcrumb-item" as the static is getter', () => {
      expect(customElements.get('vaadin-breadcrumb-item').is).to.equal('vaadin-breadcrumb-item');
    });

    it('should expose "vaadin-breadcrumb-trail-overlay" as the static is getter', () => {
      expect(customElements.get('vaadin-breadcrumb-trail-overlay').is).to.equal('vaadin-breadcrumb-trail-overlay');
    });
  });

  describe('element shells', () => {
    let trail;
    let item;

    beforeEach(async () => {
      trail = fixtureSync(`
        <vaadin-breadcrumb-trail>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
        </vaadin-breadcrumb-trail>
      `);
      await nextRender();
      item = trail.querySelector('vaadin-breadcrumb-item');
    });

    it('should attach the trail with a non-null shadowRoot', () => {
      expect(trail.shadowRoot).to.not.be.null;
    });

    it('should attach the item with a non-null shadowRoot', () => {
      expect(item.shadowRoot).to.not.be.null;
    });

    it('should have the trail constructor match the registered element', () => {
      expect(trail.constructor).to.equal(customElements.get('vaadin-breadcrumb-trail'));
    });

    it('should have the item constructor match the registered element', () => {
      expect(item.constructor).to.equal(customElements.get('vaadin-breadcrumb-item'));
    });
  });

  describe('dev page smoke test', () => {
    // The dev page itself is served by `yarn start`, not by Web Test Runner,
    // so we cannot literally open `dev/breadcrumb-trail.html` from inside this
    // unit suite. Instead we exercise the same code path the dev page exercises:
    // the package's main imports plus instantiating the default trail content.
    // If anything in the import or first render path throws or logs an error,
    // this test fails.
    it('should render a default trail without throwing or logging console errors', async () => {
      const originalError = console.error;
      const errors = [];
      console.error = (...args) => {
        errors.push(args);
        originalError.apply(console, args);
      };
      try {
        const fixture = fixtureSync(`
          <div style="resize: horizontal; overflow: auto; width: 600px;">
            <vaadin-breadcrumb-trail>
              <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
              <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
              <vaadin-breadcrumb-item>Details</vaadin-breadcrumb-item>
            </vaadin-breadcrumb-trail>
          </div>
        `);
        await nextRender();
        const renderedTrail = fixture.querySelector('vaadin-breadcrumb-trail');
        expect(renderedTrail.shadowRoot).to.not.be.null;
        expect(errors).to.deep.equal([]);
      } finally {
        console.error = originalError;
      }
    });
  });
});
