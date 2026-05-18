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

    it('should render the overlay element inside the breadcrumbs shadow DOM', () => {
      expect(overlay).to.be.ok;
      expect(overlay.getRootNode()).to.equal(breadcrumbs.shadowRoot);
    });

    it('should bind owner to the host breadcrumbs', () => {
      expect(overlay.owner).to.equal(breadcrumbs);
    });

    it('should bind positionTarget to the overflow button', () => {
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      expect(overlay.positionTarget).to.equal(button);
    });

    it('should expose role="list" on [part="content"]', () => {
      const content = overlay.shadowRoot.querySelector('[part="content"]');
      expect(content).to.be.ok;
      expect(content.getAttribute('role')).to.equal('list');
    });

    it('should have an [part="overlay"] element wrapping the content', () => {
      const outer = overlay.shadowRoot.querySelector('[part="overlay"]');
      expect(outer).to.be.ok;
      const inner = outer.querySelector('[part="content"]');
      expect(inner).to.be.ok;
    });

    it('should export overlay and content parts via exportparts on the host overlay element', () => {
      const exportParts = overlay.getAttribute('exportparts');
      expect(exportParts).to.be.ok;
      expect(exportParts).to.match(/\boverlay\b/u);
      expect(exportParts).to.match(/content:\s*overlay-content/u);
    });

    it('should have a default slot inside [part="content"] projecting overlay items', async () => {
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      const content = overlay.shadowRoot.querySelector('[part="content"]');
      const defaultSlot = content.querySelector('slot:not([name])');
      expect(defaultSlot).to.be.ok;

      const assigned = defaultSlot.assignedElements({ flatten: true });
      const slotted = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]')];
      expect(slotted.length).to.be.greaterThan(0);
      slotted.forEach((item) => {
        expect(assigned).to.include(item);
      });
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

    it('should reflect opened to the overlay when overflow button is clicked', async () => {
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      expect(overlay.opened).to.not.be.true;

      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(overlay.opened).to.be.true;
    });
  });
});
