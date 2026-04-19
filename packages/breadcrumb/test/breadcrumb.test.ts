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

  describe('role and label', () => {
    it('should have role="navigation" on the host', () => {
      expect(breadcrumb.getAttribute('role')).to.equal('navigation');
    });

    it('should have aria-label="Breadcrumb" by default', () => {
      expect(breadcrumb.getAttribute('aria-label')).to.equal('Breadcrumb');
    });

    it('should have label property defaulting to "Breadcrumb"', () => {
      expect(breadcrumb.label).to.equal('Breadcrumb');
    });

    it('should update aria-label when label property changes', async () => {
      breadcrumb.label = 'Product navigation';
      await nextRender();
      expect(breadcrumb.getAttribute('aria-label')).to.equal('Product navigation');
    });

    it('should have role="list" on the shadow container div', () => {
      const container = breadcrumb.shadowRoot!.querySelector('[part="container"]');
      expect(container!.getAttribute('role')).to.equal('list');
    });
  });
});

describe('vaadin-breadcrumb current item management', () => {
  let breadcrumb: Breadcrumb;

  beforeEach(async () => {
    breadcrumb = fixtureSync(`
      <vaadin-breadcrumb>
        <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
      </vaadin-breadcrumb>
    `);
    await nextRender();
  });

  it('should set current on the last slotted item', () => {
    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    expect(items[2].hasAttribute('current')).to.be.true;
  });

  it('should not set current on previous items', () => {
    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    expect(items[0].hasAttribute('current')).to.be.false;
    expect(items[1].hasAttribute('current')).to.be.false;
  });

  it('should move current to a newly added last item', async () => {
    const newItem = document.createElement('vaadin-breadcrumb-item');
    newItem.textContent = 'New Page';
    breadcrumb.appendChild(newItem);
    await nextRender();

    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    expect(items[2].hasAttribute('current')).to.be.false;
    expect(items[3].hasAttribute('current')).to.be.true;
  });

  it('should move current to the new last item when the last item is removed', async () => {
    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    breadcrumb.removeChild(items[2]);
    await nextRender();

    const remainingItems = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    expect(remainingItems[0].hasAttribute('current')).to.be.false;
    expect(remainingItems[1].hasAttribute('current')).to.be.true;
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
