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

  beforeEach(async () => {
    breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = breadcrumb.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('shadow DOM', () => {
    it('should render a div with part="container" and role="list" containing a slot', () => {
      const container = breadcrumb.shadowRoot!.querySelector('[part="container"]');
      expect(container).to.be.ok;
      expect(container!.tagName.toLowerCase()).to.equal('div');
      expect(container!.getAttribute('role')).to.equal('list');
      const slot = container!.querySelector('slot');
      expect(slot).to.be.ok;
    });
  });
});

describe('vaadin-breadcrumb-item', () => {
  let item: BreadcrumbItem;

  beforeEach(async () => {
    item = fixtureSync('<vaadin-breadcrumb-item>Label</vaadin-breadcrumb-item>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = item.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('shadow DOM', () => {
    it('should render an anchor element and a span with part="separator"', () => {
      const link = item.shadowRoot!.querySelector('a');
      expect(link).to.be.ok;
      const separator = item.shadowRoot!.querySelector('[part="separator"]');
      expect(separator).to.be.ok;
      expect(separator!.tagName.toLowerCase()).to.equal('span');
    });
  });
});
