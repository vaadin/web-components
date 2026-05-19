import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs-overlay', () => {
  describe('custom element definition', () => {
    it('should be defined in custom element registry', () => {
      expect(customElements.get('vaadin-breadcrumbs-overlay')).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      const ctor = customElements.get('vaadin-breadcrumbs-overlay');
      expect(ctor.is).to.equal('vaadin-breadcrumbs-overlay');
    });
  });

  describe('embedded inside vaadin-breadcrumbs', () => {
    let wrapper, breadcrumbs, overlay;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 200px;">
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a">Alpha section</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a/b">Beta section</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a/b/c">Gamma section</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current page</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        </div>
      `);
      breadcrumbs = wrapper.querySelector('vaadin-breadcrumbs');
      await nextRender();
      await nextResize(breadcrumbs);

      overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
    });

    it('should bind owner to the host breadcrumbs', () => {
      expect(overlay.owner).to.equal(breadcrumbs);
    });

    it('should bind positionTarget to the overflow button', () => {
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      expect(overlay.positionTarget).to.equal(button);
    });

    it('should keep slotted overlay items with role="listitem"', async () => {
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      const slotted = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]')];
      slotted.forEach((item) => {
        expect(item.getAttribute('role')).to.equal('listitem');
      });
    });

    it('should open overlay on overflow button click', async () => {
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      expect(overlay.opened).to.not.be.true;

      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(overlay.opened).to.be.true;
    });
  });
});
