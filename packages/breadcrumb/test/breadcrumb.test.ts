import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};

// Importing the package while the feature flag is unset registers the elements
// with the experimental map but must not register them in `customElements`.
await import('../vaadin-breadcrumb.js');

import type { Breadcrumb, BreadcrumbItemData } from '../vaadin-breadcrumb.js';
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

    it('should hide [part="overflow"] via CSS when has-overflow is not set', () => {
      const overflow = list.querySelector('[part="overflow"]') as HTMLElement;
      expect(overflow).to.exist;
      expect(overflow.getAttribute('role')).to.equal('listitem');
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.false;
      expect(getComputedStyle(overflow).display).to.equal('none');
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

  describe('items property', () => {
    function getItems(breadcrumb: Breadcrumb): BreadcrumbItem[] {
      return Array.from(breadcrumb.querySelectorAll('vaadin-breadcrumb-item')) as BreadcrumbItem[];
    }

    it('should render one vaadin-breadcrumb-item light-DOM child per items entry', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      breadcrumb.items = [{ text: 'Home', path: '/' }, { text: 'Reports', path: '/reports' }, { text: 'Quarterly' }];
      await nextUpdate(breadcrumb);

      const items = getItems(breadcrumb);
      expect(items.length).to.equal(3);
      items.forEach((item) => {
        expect(item.localName).to.equal('vaadin-breadcrumb-item');
      });
    });

    it('should set the text content of each generated item to the entry text', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      breadcrumb.items = [{ text: 'Home', path: '/' }, { text: 'Reports', path: '/reports' }, { text: 'Quarterly' }];
      await nextUpdate(breadcrumb);

      const items = getItems(breadcrumb);
      expect(items[0].textContent).to.equal('Home');
      expect(items[1].textContent).to.equal('Reports');
      expect(items[2].textContent).to.equal('Quarterly');
    });

    it('should set the path attribute on items whose entry has a path', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      breadcrumb.items = [
        { text: 'Home', path: '/' },
        { text: 'Reports', path: '/reports' },
      ];
      await nextUpdate(breadcrumb);

      const items = getItems(breadcrumb);
      expect(items[0].getAttribute('path')).to.equal('/');
      expect(items[1].getAttribute('path')).to.equal('/reports');
    });

    it('should omit the path attribute on items whose entry has no path', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      breadcrumb.items = [{ text: 'Home', path: '/' }, { text: 'Quarterly' }];
      await nextUpdate(breadcrumb);

      const items = getItems(breadcrumb);
      expect(items[0].hasAttribute('path')).to.be.true;
      expect(items[1].hasAttribute('path')).to.be.false;
    });

    it('should assign slot="root" to the first generated item', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      breadcrumb.items = [{ text: 'Home', path: '/' }, { text: 'Reports', path: '/reports' }, { text: 'Quarterly' }];
      await nextUpdate(breadcrumb);
      await nextRender();

      const items = getItems(breadcrumb);
      expect(items[0].getAttribute('slot')).to.equal('root');
      expect(items[1].hasAttribute('slot')).to.be.false;
      expect(items[2].hasAttribute('slot')).to.be.false;
    });

    it('should set current on the last generated item when it has no path', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      breadcrumb.items = [{ text: 'Home', path: '/' }, { text: 'Reports', path: '/reports' }, { text: 'Quarterly' }];
      await nextUpdate(breadcrumb);
      await nextRender();

      const items = getItems(breadcrumb);
      expect(items[0].hasAttribute('current')).to.be.false;
      expect(items[1].hasAttribute('current')).to.be.false;
      expect(items[2].hasAttribute('current')).to.be.true;
    });

    it('should replace any pre-existing slotted children when items is set', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="x" path="/x">X</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      expect(breadcrumb.querySelector('[data-test-id="x"]')).to.exist;

      breadcrumb.items = [{ text: 'Home', path: '/' }, { text: 'Quarterly' }];
      await nextUpdate(breadcrumb);

      expect(breadcrumb.querySelector('[data-test-id="x"]')).to.not.exist;

      const items = getItems(breadcrumb);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('Home');
      expect(items[1].textContent).to.equal('Quarterly');
    });

    it('should restore pre-existing slotted children when items is set to null', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="x" path="/x">X</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="y">Y</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      breadcrumb.items = [{ text: 'Home', path: '/' }, { text: 'Quarterly' }];
      await nextUpdate(breadcrumb);
      expect(breadcrumb.querySelector('[data-test-id="x"]')).to.not.exist;

      breadcrumb.items = null;
      await nextUpdate(breadcrumb);

      const items = getItems(breadcrumb);
      expect(items.length).to.equal(2);
      expect(items[0].dataset.testId).to.equal('x');
      expect(items[1].dataset.testId).to.equal('y');
    });

    it('should restore pre-existing slotted children when items is set to undefined', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="x" path="/x">X</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      breadcrumb.items = [{ text: 'Home', path: '/' }];
      await nextUpdate(breadcrumb);
      expect(breadcrumb.querySelector('[data-test-id="x"]')).to.not.exist;

      breadcrumb.items = undefined;
      await nextUpdate(breadcrumb);

      const items = getItems(breadcrumb);
      expect(items.length).to.equal(1);
      expect(items[0].dataset.testId).to.equal('x');
    });

    it('should update generated items when reassigned to a different array', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      breadcrumb.items = [{ text: 'A', path: '/a' }, { text: 'B', path: '/b' }, { text: 'C' }];
      await nextUpdate(breadcrumb);
      expect(getItems(breadcrumb).length).to.equal(3);

      breadcrumb.items = [{ text: 'X', path: '/x' }, { text: 'Y' }];
      await nextUpdate(breadcrumb);

      const items = getItems(breadcrumb);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('X');
      expect(items[0].getAttribute('path')).to.equal('/x');
      expect(items[1].textContent).to.equal('Y');
      expect(items[1].hasAttribute('path')).to.be.false;
    });

    it('should accept the BreadcrumbItemData shape', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      const data: BreadcrumbItemData[] = [{ text: 'Home', path: '/' }, { text: 'Quarterly' }];
      breadcrumb.items = data;
      await nextUpdate(breadcrumb);

      expect(getItems(breadcrumb).length).to.equal(2);
    });
  });

  describe('overflow detection', () => {
    // Each item gets a fixed width via inline style so the overflow math is
    // deterministic. Items are 100px wide; with a 7-item trail (root + 5
    // middles + current) plus separators, the natural width is well above
    // 700px. Wrapper widths chosen below are picked so a known number of
    // items overflow.
    const ITEM_WIDTH = 100;

    function getItems(breadcrumb: Breadcrumb): BreadcrumbItem[] {
      return Array.from(breadcrumb.querySelectorAll('vaadin-breadcrumb-item')) as BreadcrumbItem[];
    }

    function getById(breadcrumb: Breadcrumb, id: string): BreadcrumbItem {
      return breadcrumb.querySelector(`[data-test-id="${id}"]`) as BreadcrumbItem;
    }

    function fixedWidthItem(id: string, label: string, path?: string): string {
      const pathAttr = path ? ` path="${path}"` : '';
      return `<vaadin-breadcrumb-item data-test-id="${id}"${pathAttr} style="width: ${ITEM_WIDTH}px; box-sizing: border-box; flex: none;">${label}</vaadin-breadcrumb-item>`;
    }

    async function buildFixture(width: number): Promise<{ wrapper: HTMLElement; breadcrumb: Breadcrumb }> {
      const wrapper = fixtureSync(`
        <div style="width: ${width}px;">
          <vaadin-breadcrumb>
            ${fixedWidthItem('root', 'Root', '/')}
            ${fixedWidthItem('a', 'A', '/a')}
            ${fixedWidthItem('b', 'B', '/b')}
            ${fixedWidthItem('c', 'C', '/c')}
            ${fixedWidthItem('d', 'D', '/d')}
            ${fixedWidthItem('e', 'E', '/e')}
            ${fixedWidthItem('current', 'Current')}
          </vaadin-breadcrumb>
        </div>
      `) as HTMLElement;
      const breadcrumb = wrapper.querySelector('vaadin-breadcrumb') as Breadcrumb;
      await nextRender();
      // Allow the initial ResizeObserver callback to fire so overflow
      // detection runs against the actual rendered widths.
      await nextFrame();
      await nextFrame();
      return { wrapper, breadcrumb };
    }

    async function setWrapperWidth(wrapper: HTMLElement, breadcrumb: Breadcrumb, width: number): Promise<void> {
      wrapper.style.width = `${width}px`;
      await nextResize(breadcrumb);
      // ResizeMixin schedules `_onResize` from a setTimeout inside the
      // ResizeObserver callback; wait one more frame so __updateOverflow
      // has run and the attributes are applied.
      await nextFrame();
    }

    it('should not set has-overflow when all items fit', async () => {
      const { breadcrumb } = await buildFixture(2000);
      const overflow = breadcrumb.shadowRoot!.querySelector('[part="overflow"]') as HTMLElement;

      expect(breadcrumb.hasAttribute('has-overflow')).to.be.false;
      expect(getComputedStyle(overflow).display).to.equal('none');
      getItems(breadcrumb).forEach((item) => {
        expect(item.hasAttribute('data-overflow-hidden')).to.be.false;
      });
    });

    it('should make [part="overflow"] visible when has-overflow is set', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 400);

      const overflow = breadcrumb.shadowRoot!.querySelector('[part="overflow"]') as HTMLElement;
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;
      expect(getComputedStyle(overflow).display).to.not.equal('none');
    });

    it('should hide intermediate items closest to the root first, by identity', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      // Pick a width that leaves room for root + overflow + current + ~one
      // more middle item. With 100px items + the overflow listitem, 500px
      // forces several middle items to collapse.
      await setWrapperWidth(wrapper, breadcrumb, 500);

      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      // Identify hidden items by data-test-id, not by DOM position.
      const hiddenIds = getItems(breadcrumb)
        .filter((item) => item.hasAttribute('data-overflow-hidden'))
        .map((item) => item.dataset.testId);

      // The first items to collapse are the ones closest to the root, i.e.
      // 'a' first, then 'b', etc. At this width at least 'a' and 'b' must
      // be hidden.
      expect(hiddenIds).to.include('a');
      expect(hiddenIds).to.include('b');
      // The current item is never collapsed.
      expect(hiddenIds).to.not.include('current');
      // The collapse order means an item closer to the root is hidden
      // before one further away: if 'b' is hidden, 'a' must also be hidden.
      const middleOrder = ['a', 'b', 'c', 'd', 'e'];
      const lastHiddenIndex = middleOrder.reduce((acc, id, i) => (hiddenIds.includes(id) ? i : acc), -1);
      for (let i = 0; i <= lastHiddenIndex; i += 1) {
        expect(hiddenIds, `expected ${middleOrder[i]} to be hidden`).to.include(middleOrder[i]);
      }
    });

    it('should never set data-overflow-hidden on the current item, even at the smallest width', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 50);

      const current = getById(breadcrumb, 'current');
      expect(current.hasAttribute('data-overflow-hidden')).to.be.false;
    });

    it('should keep the root visible while only middle items still need to collapse', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      // Width chosen so that root + overflow + current still fit, but at
      // least one middle item must collapse. With 100px items, ~350px
      // accommodates root (100) + overflow (~30-40) + current (100) plus a
      // bit of slack, and at least some middle items must be hidden.
      await setWrapperWidth(wrapper, breadcrumb, 350);

      const root = getById(breadcrumb, 'root');
      const current = getById(breadcrumb, 'current');
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;
      expect(root.hasAttribute('data-overflow-hidden')).to.be.false;
      expect(current.hasAttribute('data-overflow-hidden')).to.be.false;

      // Some middle item must be hidden.
      const middleHiddenCount = ['a', 'b', 'c', 'd', 'e'].filter((id) =>
        getById(breadcrumb, id).hasAttribute('data-overflow-hidden'),
      ).length;
      expect(middleHiddenCount).to.be.greaterThan(0);
    });

    it('should hide the root as a last resort when even root + overflow + current does not fit', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      // Width too narrow for root + overflow + current (~230px+) — every
      // middle item is collapsed and the root must collapse too.
      await setWrapperWidth(wrapper, breadcrumb, 120);

      const root = getById(breadcrumb, 'root');
      const current = getById(breadcrumb, 'current');
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;
      expect(root.hasAttribute('data-overflow-hidden')).to.be.true;
      expect(current.hasAttribute('data-overflow-hidden')).to.be.false;
      // Every middle item is hidden too.
      ['a', 'b', 'c', 'd', 'e'].forEach((id) => {
        expect(getById(breadcrumb, id).hasAttribute('data-overflow-hidden')).to.be.true;
      });
    });

    it('should restore items in reverse order as the container grows back', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);

      // Shrink so several items overflow.
      await setWrapperWidth(wrapper, breadcrumb, 400);
      const hiddenAfterShrink = getItems(breadcrumb)
        .filter((item) => item.hasAttribute('data-overflow-hidden'))
        .map((item) => item.dataset.testId);
      expect(hiddenAfterShrink.length).to.be.greaterThan(0);

      // Grow somewhat — fewer items should be hidden.
      await setWrapperWidth(wrapper, breadcrumb, 700);
      const hiddenAfterGrow = getItems(breadcrumb)
        .filter((item) => item.hasAttribute('data-overflow-hidden'))
        .map((item) => item.dataset.testId);
      expect(hiddenAfterGrow.length).to.be.lessThan(hiddenAfterShrink.length);

      // Whichever items remain hidden must be a prefix of the original
      // hidden set (items closest to the root): if 'b' was hidden before
      // and is hidden now, 'a' must also be hidden now.
      const middleOrder = ['a', 'b', 'c', 'd', 'e'];
      const stillHiddenIndex = middleOrder.reduce((acc, id, i) => (hiddenAfterGrow.includes(id) ? i : acc), -1);
      for (let i = 0; i <= stillHiddenIndex; i += 1) {
        expect(hiddenAfterGrow, `expected ${middleOrder[i]} to still be hidden`).to.include(middleOrder[i]);
      }

      // Grow large enough for everything to fit and has-overflow clears.
      await setWrapperWidth(wrapper, breadcrumb, 2000);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.false;
      getItems(breadcrumb).forEach((item) => {
        expect(item.hasAttribute('data-overflow-hidden')).to.be.false;
      });
    });
  });
});
