import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags!.breadcrumbComponent = true;

await import('../src/vaadin-breadcrumb-overlay.js');

import type { BreadcrumbOverlay } from '../src/vaadin-breadcrumb-overlay.js';
import { BreadcrumbOverlayMixin } from '../src/vaadin-breadcrumb-overlay-mixin.js';

describe('vaadin-breadcrumb-overlay', () => {
  describe('element registration', () => {
    it('should register vaadin-breadcrumb-overlay as a custom element', () => {
      expect(customElements.get('vaadin-breadcrumb-overlay')).to.be.a('function');
    });

    it('should expose the tag name via the static "is" getter', () => {
      const ctor = customElements.get('vaadin-breadcrumb-overlay') as CustomElementConstructor & { is: string };
      expect(ctor.is).to.equal('vaadin-breadcrumb-overlay');
    });
  });

  describe('shadow DOM', () => {
    let overlay: BreadcrumbOverlay;

    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-breadcrumb-overlay></vaadin-breadcrumb-overlay>') as BreadcrumbOverlay;
      await nextRender();
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should render a [part="overlay"] wrapper as a direct child of the shadow root', () => {
      const root = overlay.shadowRoot!;
      expect(root.children.length).to.equal(1);
      const overlayPart = root.firstElementChild as HTMLElement;
      expect(overlayPart.getAttribute('part')).to.equal('overlay');
      expect(overlayPart.tagName).to.equal('DIV');
    });

    it('should render a [part="content"] wrapper inside [part="overlay"]', () => {
      const overlayPart = overlay.shadowRoot!.querySelector('[part="overlay"]') as HTMLElement;
      expect(overlayPart.children.length).to.equal(1);
      const contentPart = overlayPart.firstElementChild as HTMLElement;
      expect(contentPart.getAttribute('part')).to.equal('content');
      expect(contentPart.tagName).to.equal('DIV');
    });

    it('should render a default unnamed <slot> inside [part="content"]', () => {
      const contentPart = overlay.shadowRoot!.querySelector('[part="content"]') as HTMLElement;
      expect(contentPart.children.length).to.equal(1);
      const slot = contentPart.firstElementChild as HTMLSlotElement;
      expect(slot.tagName).to.equal('SLOT');
      expect(slot.hasAttribute('name')).to.be.false;
    });
  });

  describe('OverlayMixin integration', () => {
    let overlay: BreadcrumbOverlay;

    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-breadcrumb-overlay></vaadin-breadcrumb-overlay>') as BreadcrumbOverlay;
      await nextRender();
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should set popover="manual" on the host after firstUpdated', () => {
      expect(overlay.getAttribute('popover')).to.equal('manual');
    });

    it('should reflect the opened property to the opened attribute when set to true', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.hasAttribute('opened')).to.be.true;
    });

    it('should remove the opened attribute when opened is set back to false', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.hasAttribute('opened')).to.be.true;

      overlay.opened = false;
      expect(overlay.hasAttribute('opened')).to.be.false;
    });

    it('should match :popover-open after opened is set to true', async () => {
      expect(overlay.matches(':popover-open')).to.be.false;

      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(overlay.matches(':popover-open')).to.be.true;
    });

    it('should not match :popover-open after opened is set back to false', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.matches(':popover-open')).to.be.true;

      overlay.opened = false;
      expect(overlay.matches(':popover-open')).to.be.false;
    });
  });

  describe('mixin chain', () => {
    it('should apply BreadcrumbOverlayMixin to the element class', () => {
      const overlay = fixtureSync('<vaadin-breadcrumb-overlay></vaadin-breadcrumb-overlay>') as BreadcrumbOverlay;
      // BreadcrumbOverlayMixin produces an anonymous class named
      // `BreadcrumbOverlayMixinClass`. Walk the prototype chain looking for
      // that name to confirm the mixin was applied to the element.
      let found = false;
      let proto = Object.getPrototypeOf(overlay);
      while (proto && proto !== HTMLElement.prototype) {
        if (proto.constructor && proto.constructor.name === 'BreadcrumbOverlayMixinClass') {
          found = true;
          break;
        }
        proto = Object.getPrototypeOf(proto);
      }
      expect(found, 'BreadcrumbOverlayMixinClass should be in the prototype chain').to.be.true;
    });

    it('should expose BreadcrumbOverlayMixin as a function from its module', () => {
      expect(BreadcrumbOverlayMixin).to.be.a('function');
    });
  });
});
