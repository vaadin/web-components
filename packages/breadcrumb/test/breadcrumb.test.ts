import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-breadcrumb.js';
import type { Breadcrumb } from '../src/vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../src/vaadin-breadcrumb-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb', () => {
  let breadcrumb: Breadcrumb;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      tagName = breadcrumb.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal('vaadin-breadcrumb');
    });
  });

  describe('shadow root', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should render a shadow root without errors', () => {
      expect(breadcrumb.shadowRoot).to.be.ok;
    });
  });
});

describe('vaadin-breadcrumb-item', () => {
  let item: BreadcrumbItem;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      item = fixtureSync('<vaadin-breadcrumb-item></vaadin-breadcrumb-item>');
      tagName = item.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal('vaadin-breadcrumb-item');
    });
  });

  describe('shadow root', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item></vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should render a shadow root without errors', () => {
      expect(item.shadowRoot).to.be.ok;
    });
  });
});

describe('vaadin-breadcrumb-overlay', () => {
  describe('custom element definition', () => {
    beforeEach(() => {
      // The overlay is registered as part of the breadcrumb import
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get('vaadin-breadcrumb-overlay')).to.be.ok;
    });
  });

  describe('shadow root', () => {
    let overlay: HTMLElement;

    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-breadcrumb-overlay></vaadin-breadcrumb-overlay>');
      await nextRender();
    });

    it('should render a shadow root without errors', () => {
      expect(overlay.shadowRoot).to.be.ok;
    });
  });
});
