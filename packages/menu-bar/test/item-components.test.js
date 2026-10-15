import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-menu-bar.js';

describe('item components', () => {
  describe('basic', () => {
    let menu, buttons;

    function makeComponent(id) {
      const div = document.createElement('div');
      div.style.width = '100px';
      div.textContent = `Item ${id}`;
      return div;
    }

    beforeEach(async () => {
      menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
      menu.items = [
        { component: makeComponent('1') },
        { text: 'Item 2 text', component: makeComponent('2') },
        { text: 'Item 3', component: document.createElement('vaadin-menu-bar-item') },
        { text: 'Item 4' },
      ];
      await nextRender();
      buttons = menu._buttons;
    });

    it('should wrap the provided item component with the menu-bar item', () => {
      const item = buttons[0].firstElementChild;
      expect(item).to.equal(buttons[0].item.component);
      expect(item.localName).to.equal('vaadin-menu-bar-item');
      const div = item.firstChild;
      expect(div).to.equal(menu.items[0].component);
      expect(div.localName).to.equal('div');
      expect(div.textContent).to.equal('Item 1');
      expect(getComputedStyle(div).width).to.equal('100px');
    });

    it('should override the component text when defined on the item', () => {
      const item = buttons[1].firstElementChild;
      expect(item).to.equal(buttons[1].item.component);
      expect(item.localName).to.equal('vaadin-menu-bar-item');
      const div = item.firstElementChild;
      expect(div).to.equal(menu.items[1].component);
      expect(div.localName).to.equal('div');
      expect(div.textContent).to.equal('Item 2 text');
      expect(getComputedStyle(div).width).to.equal('100px');
    });

    it('should render provided menu-bar item as a component', () => {
      expect(buttons[2].firstElementChild).to.equal(buttons[2].item.component);
      expect(buttons[2].item.component).to.equal(menu.items[2].component);
      expect(buttons[2].item.component.textContent).to.equal('Item 3');
    });

    it('should update buttons when replacing item component with text', async () => {
      menu.items = [{ text: 'Item 0' }, ...menu.items.slice(1)];
      await nextRender();
      buttons = menu._buttons;
      expect(buttons[0].textContent).to.equal('Item 0');
    });

    it('should update buttons when replacing item text with component', async () => {
      menu.items = [...menu.items.slice(0, 3), { component: makeComponent('4') }];
      await nextRender();
      buttons = menu._buttons;
      expect(buttons[3].firstElementChild).to.equal(buttons[3].item.component);
      expect(buttons[3].firstElementChild.textContent).to.equal('Item 4');
    });

    it('should update buttons when replacing item component with empty object', async () => {
      menu.items = [{}, ...menu.items.slice(1)];
      await nextRender();
      buttons = menu._buttons;
      expect(buttons[0].textContent).to.equal('');
    });

    it('should update buttons when replacing item text with empty object', async () => {
      menu.items = [...menu.items.slice(0, 3), {}];
      await nextRender();
      buttons = menu._buttons;
      expect(buttons[3].textContent).to.equal('');
    });

    it('should propagate click on the button to the item component', () => {
      const item = buttons[2].item.component;
      const spy = sinon.spy(item, 'click');
      buttons[2].click();
      expect(spy).to.be.calledOnce;
    });
  });

  describe('item rendering', () => {
    let div, menu, items;

    const components = new Map();

    function makeItem(value) {
      const item = document.createElement('vaadin-menu-bar-item');
      item.textContent = `Item ${value}`;
      return item;
    }

    async function updateItems() {
      items.forEach(({ value, className }) => {
        if (!components.has(value)) {
          const component = makeItem(value);
          components.set(value, component);
        }

        // Mimic the Flow component behavior where components are moved
        // to the virtual div when generating menu items, which causes
        // DOM nodes for existing items to disappear if passed to Lit
        // template as is (so we have to use a custom Lit directive).
        const component = components.get(value);
        div.appendChild(component);

        // Mimic the Flow connector logic for className on item components
        component.className = className || '';
      });

      menu.items = [...div.children].map((child) => {
        const item = {
          component: child,
          className: child.className,
        };

        child._item = item;
        return item;
      });

      await nextRender();
    }

    function expectItemsRendered() {
      const buttons = menu._buttons;

      items.forEach(({ value, className }, idx) => {
        const button = buttons[idx];
        const item = button.firstElementChild;
        expect(item).to.equal(button.item.component);
        expect(item.localName).to.equal('vaadin-menu-bar-item');
        expect(item.textContent).to.equal(`Item ${value}`);

        if (className) {
          expect(item.className).to.equal(className);
          expect(button.className).to.equal(className);
        } else {
          // Flow component ITs check for attribute presence
          expect(button.hasAttribute('class')).to.be.false;
        }
      });
    }

    beforeEach(async () => {
      div = document.createElement('div');
      menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
      await nextRender();

      items = [{ value: 'foo' }, { value: 'bar' }, { value: 'baz' }];
      await updateItems();
      expectItemsRendered();
    });

    it('should re-render components when adding new menu-bar items', async () => {
      items.push({ value: 'qux' });
      await updateItems();
      expectItemsRendered();
    });

    it('should re-render components when updating existing menu-bar items', async () => {
      items = [{ value: 'abc' }, ...items.slice(1)];
      await updateItems();
      expectItemsRendered();
    });

    it('should re-render components when removing existing menu-bar items', async () => {
      items = [items[0], items[2]];
      await updateItems();
      expectItemsRendered();
    });

    it('should re-render components when setting the same menu-bar items', async () => {
      items = [...items];
      await updateItems();
      expectItemsRendered();
    });

    it('should update button className when re-rendering item components', async () => {
      items = [{ value: 'foo', className: 'foo' }];
      await updateItems();
      expectItemsRendered();

      items = [{ value: 'foo', className: 'bar' }];
      await updateItems();
      expectItemsRendered();
    });

    it('should remove button className when re-rendering item components', async () => {
      items = [{ value: 'foo', className: 'foo' }];
      await updateItems();
      expectItemsRendered();

      items = [{ value: 'foo' }];
      await updateItems();
      expectItemsRendered();
    });
  });
});
