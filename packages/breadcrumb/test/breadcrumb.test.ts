import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};

// Importing the package while the feature flag is unset registers the elements
// with the experimental map but must not register them in `customElements`.
await import('../vaadin-breadcrumb.js');

describe('vaadin-breadcrumb', () => {
  describe('feature flag', () => {
    it('should not register vaadin-breadcrumb before the feature flag is enabled', () => {
      expect(customElements.get('vaadin-breadcrumb')).to.be.undefined;
    });

    it('should not register vaadin-breadcrumb-item before the feature flag is enabled', () => {
      expect(customElements.get('vaadin-breadcrumb-item')).to.be.undefined;
    });

    it('should not register vaadin-breadcrumb-overlay before the feature flag is enabled', () => {
      expect(customElements.get('vaadin-breadcrumb-overlay')).to.be.undefined;
    });
  });

  describe('after enabling the feature flag', () => {
    before(() => {
      window.Vaadin.featureFlags!.breadcrumbComponent = true;
    });

    it('should register vaadin-breadcrumb', () => {
      expect(customElements.get('vaadin-breadcrumb')).to.exist;
    });

    it('should register vaadin-breadcrumb-item', () => {
      expect(customElements.get('vaadin-breadcrumb-item')).to.exist;
    });

    it('should register vaadin-breadcrumb-overlay', () => {
      expect(customElements.get('vaadin-breadcrumb-overlay')).to.exist;
    });

    it('should expose vaadin-breadcrumb tag name via the static "is" getter', () => {
      const ctor = customElements.get('vaadin-breadcrumb') as CustomElementConstructor & { is: string };
      expect(ctor.is).to.equal('vaadin-breadcrumb');
    });

    it('should expose vaadin-breadcrumb-item tag name via the static "is" getter', () => {
      const ctor = customElements.get('vaadin-breadcrumb-item') as CustomElementConstructor & { is: string };
      expect(ctor.is).to.equal('vaadin-breadcrumb-item');
    });

    it('should expose vaadin-breadcrumb-overlay tag name via the static "is" getter', () => {
      const ctor = customElements.get('vaadin-breadcrumb-overlay') as CustomElementConstructor & { is: string };
      expect(ctor.is).to.equal('vaadin-breadcrumb-overlay');
    });

    it('should render an empty vaadin-breadcrumb without throwing', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
      expect(breadcrumb.isConnected).to.be.true;
      expect(breadcrumb.tagName.toLowerCase()).to.equal('vaadin-breadcrumb');
    });
  });
});
