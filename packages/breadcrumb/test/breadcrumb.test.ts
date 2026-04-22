import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};

// Importing the package while the feature flag is unset registers the elements
// with the experimental map but must not register them in `customElements`.
await import('../vaadin-breadcrumb.js');

import type { Breadcrumb } from '../vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../vaadin-breadcrumb-item.js';

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

  describe('host role', () => {
    it('should set role="navigation" on the host after firstUpdated', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();
      expect(breadcrumb.getAttribute('role')).to.equal('navigation');
    });

    it('should not override an application-provided role on the host', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb role="region"></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();
      expect(breadcrumb.getAttribute('role')).to.equal('region');
    });
  });

  describe('shadow DOM', () => {
    let breadcrumb: Breadcrumb;
    let list: HTMLElement;

    beforeEach(async () => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();
      list = breadcrumb.shadowRoot!.querySelector('[part="list"]') as HTMLElement;
    });

    it('should render a [part="list"][role="list"] wrapper in shadow DOM', () => {
      expect(list).to.exist;
      expect(list.getAttribute('role')).to.equal('list');
      expect(list.tagName).to.equal('DIV');
    });

    it('should render the list children in order: root slot, overflow listitem, default slot', () => {
      const descriptors = Array.from(list.children).map((child) => {
        const localName = child.localName;
        const slotName = child.getAttribute('name');
        const part = child.getAttribute('part');
        if (localName === 'slot') {
          return slotName ? `slot[name=${slotName}]` : 'slot';
        }
        return `${localName}[part=${part}]`;
      });
      expect(descriptors).to.deep.equal(['slot[name=root]', 'div[part=overflow]', 'slot']);
    });

    it('should render [part="overflow"] with the hidden attribute set', () => {
      const overflow = list.querySelector('[part="overflow"]') as HTMLElement;
      expect(overflow).to.exist;
      expect(overflow.hasAttribute('hidden')).to.be.true;
      expect(overflow.getAttribute('role')).to.equal('listitem');
    });

    it('should render a button[part="overflow-button"] inside [part="overflow"]', () => {
      const button = list.querySelector('[part="overflow"] button[part="overflow-button"]') as HTMLButtonElement;
      expect(button).to.exist;
      expect(button.getAttribute('aria-haspopup')).to.equal('true');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
      expect(button.hasAttribute('aria-label')).to.be.true;
    });

    it('should render the default unnamed slot as the last child of [part="list"]', () => {
      const defaultSlot = Array.from(list.children).find(
        (child) => child.localName === 'slot' && !child.hasAttribute('name'),
      );
      expect(defaultSlot).to.exist;
      expect(list.lastElementChild).to.equal(defaultSlot);
    });
  });

  describe('root slot routing', () => {
    function getItems(breadcrumb: Breadcrumb): BreadcrumbItem[] {
      return Array.from(breadcrumb.querySelectorAll('vaadin-breadcrumb-item')) as BreadcrumbItem[];
    }

    it('should assign slot="root" to the first vaadin-breadcrumb-item child', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const items = getItems(breadcrumb);
      const first = items.find((it) => it.dataset.testId === 'a')!;
      const middle = items.find((it) => it.dataset.testId === 'b')!;
      const last = items.find((it) => it.dataset.testId === 'c')!;

      expect(first.getAttribute('slot')).to.equal('root');
      expect(middle.hasAttribute('slot')).to.be.false;
      expect(last.hasAttribute('slot')).to.be.false;
    });

    it('should move slot="root" from the previous first item when a new item is prepended', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b">B</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const previousFirst = breadcrumb.querySelector('[data-test-id="a"]') as BreadcrumbItem;
      expect(previousFirst.getAttribute('slot')).to.equal('root');

      const newFirst = document.createElement('vaadin-breadcrumb-item') as BreadcrumbItem;
      newFirst.dataset.testId = 'z';
      newFirst.setAttribute('path', '/z');
      newFirst.textContent = 'Z';
      breadcrumb.insertBefore(newFirst, previousFirst);
      await nextRender();

      expect(newFirst.getAttribute('slot')).to.equal('root');
      expect(previousFirst.hasAttribute('slot')).to.be.false;
    });

    it('should reassign slot="root" to the new first item when the first item is removed', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const oldFirst = breadcrumb.querySelector('[data-test-id="a"]') as BreadcrumbItem;
      const newFirst = breadcrumb.querySelector('[data-test-id="b"]') as BreadcrumbItem;
      expect(oldFirst.getAttribute('slot')).to.equal('root');
      expect(newFirst.hasAttribute('slot')).to.be.false;

      oldFirst.remove();
      await nextRender();

      expect(newFirst.getAttribute('slot')).to.equal('root');
    });

    it('should not assign slot="root" to a non-vaadin-breadcrumb-item light-DOM child', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <span data-test-id="non-item">not an item</span>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b">B</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const span = breadcrumb.querySelector('[data-test-id="non-item"]') as HTMLSpanElement;
      const firstItem = breadcrumb.querySelector('[data-test-id="a"]') as BreadcrumbItem;

      expect(span.hasAttribute('slot')).to.be.false;
      expect(firstItem.getAttribute('slot')).to.equal('root');
    });
  });

  describe('current item detection', () => {
    function getItems(breadcrumb: Breadcrumb): BreadcrumbItem[] {
      return Array.from(breadcrumb.querySelectorAll('vaadin-breadcrumb-item')) as BreadcrumbItem[];
    }

    function getById(breadcrumb: Breadcrumb, id: string): BreadcrumbItem {
      return breadcrumb.querySelector(`[data-test-id="${id}"]`) as BreadcrumbItem;
    }

    // Wait for the per-item path MutationObserver callback to fire and the
    // resulting `current` attribute toggle to render. MutationObserver
    // callbacks are queued as microtasks, so a microtask flush plus an
    // update cycle is enough.
    async function flushCurrentDetection(breadcrumb: Breadcrumb): Promise<void> {
      await Promise.resolve();
      await nextUpdate(breadcrumb);
    }

    it('should set current on the last item when the last item has no path', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const a = getById(breadcrumb, 'a');
      const b = getById(breadcrumb, 'b');
      const c = getById(breadcrumb, 'c');

      expect(a.hasAttribute('current')).to.be.false;
      expect(b.hasAttribute('current')).to.be.false;
      expect(c.hasAttribute('current')).to.be.true;
    });

    it('should not set current on any item when every item has a path', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c" path="/c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const items = getItems(breadcrumb);
      items.forEach((item) => {
        expect(item.hasAttribute('current')).to.be.false;
      });
    });

    it('should add current to the last item when its path is removed at runtime', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c" path="/c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const a = getById(breadcrumb, 'a');
      const b = getById(breadcrumb, 'b');
      const c = getById(breadcrumb, 'c');

      expect(c.hasAttribute('current')).to.be.false;

      c.removeAttribute('path');
      await flushCurrentDetection(breadcrumb);

      expect(a.hasAttribute('current')).to.be.false;
      expect(b.hasAttribute('current')).to.be.false;
      expect(c.hasAttribute('current')).to.be.true;
    });

    it('should remove current from the last item when its path is added at runtime', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const a = getById(breadcrumb, 'a');
      const b = getById(breadcrumb, 'b');
      const c = getById(breadcrumb, 'c');

      expect(c.hasAttribute('current')).to.be.true;

      c.setAttribute('path', '/c');
      await flushCurrentDetection(breadcrumb);

      expect(a.hasAttribute('current')).to.be.false;
      expect(b.hasAttribute('current')).to.be.false;
      expect(c.hasAttribute('current')).to.be.false;
    });

    it('should move current from the previous last item to a newly appended last item', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const c = getById(breadcrumb, 'c');
      expect(c.hasAttribute('current')).to.be.true;

      const newLast = document.createElement('vaadin-breadcrumb-item') as BreadcrumbItem;
      newLast.dataset.testId = 'd';
      newLast.textContent = 'D';
      breadcrumb.appendChild(newLast);
      await nextRender();
      await flushCurrentDetection(breadcrumb);

      const a = getById(breadcrumb, 'a');
      const b = getById(breadcrumb, 'b');
      expect(a.hasAttribute('current')).to.be.false;
      expect(b.hasAttribute('current')).to.be.false;
      expect(c.hasAttribute('current')).to.be.false;
      expect(newLast.hasAttribute('current')).to.be.true;
    });

    it('should set aria-current="page" on the inner link of the current item', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const a = getById(breadcrumb, 'a');
      const c = getById(breadcrumb, 'c');

      // The Task 3 MutationObserver on the item reacts to the `current`
      // attribute set by the container. Wait for that update cycle to render
      // the inner link/span with `aria-current`.
      await nextUpdate(c);

      const currentLink = c.shadowRoot!.querySelector('[part="link"]')!;
      expect(currentLink.getAttribute('aria-current')).to.equal('page');

      const otherLink = a.shadowRoot!.querySelector('[part="link"]')!;
      expect(otherLink.hasAttribute('aria-current')).to.be.false;
    });
  });
});
