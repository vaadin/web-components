import { expect } from '@vaadin/chai-plugins';
import { arrowRight, fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';

// Utility function to assert a menu item is not visible
const assertHidden = (elem) => {
  const style = getComputedStyle(elem);
  expect(style.visibility).to.equal('hidden');
  expect(style.position).to.equal('absolute');
};

// Utility function to assert a menu item is visible
const assertVisible = (elem) => {
  const style = getComputedStyle(elem);
  expect(style.visibility).to.equal('visible');
  expect(style.position).to.not.equal('absolute');
};

/**
 * Resolves once the function is invoked on the given object.
 */
function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    sinon.replace(object, functionName, (...args) => {
      sinon.restore();
      object[functionName](...args);
      resolve();
    });
  });
}

/**
 * Resolves once the ResizeObserver has processed a resize.
 */
async function onceResized(menu) {
  await onceInvoked(menu, '__setOverflowItems');
}

describe('overflow', () => {
  describe('overflow button', () => {
    let wrapper, menu, buttons, overflow;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="display: flex">
          <div style="width: 100px;"></div>
          <vaadin-menu-bar style="width: 200px"></vaadin-menu-bar>
        </div>
      `);
      menu = wrapper.querySelector('vaadin-menu-bar');
      await nextRender(menu);
      menu.items = [
        { text: 'Item 1' },
        { text: 'Item 2' },
        { text: 'Item 3' },
        { text: 'Item 4' },
        { text: 'Item 5', disabled: true },
      ];
      await nextUpdate(menu);
      buttons = menu._buttons;
      overflow = buttons[buttons.length - 1];
    });

    it('should show overflow button and hide the buttons which do not fit', () => {
      assertHidden(buttons[2]);
      expect(buttons[2].disabled).to.be.true;
      assertHidden(buttons[3]);
      expect(buttons[3].disabled).to.be.true;
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should set items to overflow button for buttons which do not fit', () => {
      expect(overflow.item).to.be.instanceOf(Object);
      expect(overflow.item.children).to.be.instanceOf(Array);
      expect(overflow.item.children.length).to.equal(3);
      expect(overflow.item.children[0]).to.deep.equal(menu.items[2]);
      expect(overflow.item.children[1]).to.deep.equal(menu.items[3]);
      expect(overflow.item.children[2]).to.deep.equal(menu.items[4]);
    });

    it('should show overflow button after assigning the same items', async () => {
      menu.items = [...menu.items];
      await nextUpdate(menu);
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should show buttons and update overflow items when width increased', async () => {
      menu.style.width = '350px';
      await onceResized(menu);
      assertVisible(buttons[2]);
      expect(buttons[2].disabled).to.not.be.true;
      assertVisible(buttons[3]);
      expect(buttons[3].disabled).to.not.be.true;
      expect(overflow.item.children.length).to.equal(1);
      expect(overflow.item.children[0]).to.deep.equal(menu.items[4]);
    });

    it('should show buttons and update overflow items when width increased in RTL', async () => {
      menu.setAttribute('dir', 'rtl');
      menu.style.width = '350px';
      await onceResized(menu);
      assertVisible(buttons[2]);
      expect(buttons[2].disabled).to.not.be.true;
      assertVisible(buttons[3]);
      expect(buttons[3].disabled).to.not.be.true;
      expect(overflow.item.children.length).to.equal(1);
      expect(overflow.item.children[0]).to.deep.equal(menu.items[4]);
    });

    it('should hide buttons and update overflow items when width decreased', async () => {
      menu.style.width = '150px';
      await onceResized(menu);
      assertHidden(buttons[1]);
      expect(buttons[1].disabled).to.be.true;
      expect(overflow.item.children.length).to.equal(4);
      expect(overflow.item.children[0]).to.deep.equal(menu.items[1]);
      expect(overflow.item.children[1]).to.deep.equal(menu.items[2]);
      expect(overflow.item.children[2]).to.deep.equal(menu.items[3]);
      expect(overflow.item.children[3]).to.deep.equal(menu.items[4]);
    });

    it('should hide buttons and update overflow items when width decreased in RTL', async () => {
      menu.setAttribute('dir', 'rtl');
      menu.style.width = '150px';
      await onceResized(menu);
      assertHidden(buttons[1]);
      expect(buttons[1].disabled).to.be.true;
      expect(overflow.item.children.length).to.equal(4);
      expect(overflow.item.children[0]).to.deep.equal(menu.items[1]);
      expect(overflow.item.children[1]).to.deep.equal(menu.items[2]);
      expect(overflow.item.children[2]).to.deep.equal(menu.items[3]);
      expect(overflow.item.children[3]).to.deep.equal(menu.items[4]);
    });

    it('should hide overflow button and reset its items when all buttons fit', async () => {
      menu.style.width = 'auto';
      await onceResized(menu);
      assertVisible(buttons[2]);
      expect(buttons[2].disabled).to.not.be.true;
      assertVisible(buttons[3]);
      expect(buttons[3].disabled).to.not.be.true;
      assertVisible(buttons[4]);
      expect(buttons[4].disabled).to.be.true;
      expect(overflow.hasAttribute('hidden')).to.be.true;
      expect(overflow.item.children.length).to.equal(0);
    });

    it('should hide overflow button and reset its items when all buttons fit after changing items', async () => {
      // See https://github.com/vaadin/vaadin-menu-bar/issues/133
      menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }];
      await nextRender(menu);
      buttons = menu._buttons;
      overflow = buttons[2];
      assertVisible(buttons[1]);

      expect(overflow.hasAttribute('hidden')).to.be.true;
      expect(overflow.item.children.length).to.equal(0);
    });

    it('should show overflow button when theme makes buttons do not fit', async () => {
      menu.style.width = '400px';
      await onceResized(menu);
      expect(overflow.hasAttribute('hidden')).to.be.true;
      menu.setAttribute('theme', 'big');
      await nextUpdate(menu);
      assertHidden(buttons[3]);
      assertHidden(buttons[4]);
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should set tabindex on the last remaining button when width decreased', async () => {
      buttons[0].focus();
      arrowRight(buttons[0]);

      expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
      expect(buttons[1].getAttribute('tabindex')).to.equal('0');

      menu.style.width = '150px';
      await onceResized(menu);

      expect(buttons[0].getAttribute('tabindex')).to.equal('0');
    });

    it('should set the aria-label of the overflow button according to the i18n of the menu bar', async () => {
      const moreOptionsSv = 'Fler alternativ';
      expect(overflow.getAttribute('aria-label')).to.equal('More options');
      menu.i18n = { ...menu.i18n, moreOptions: moreOptionsSv };
      await nextUpdate(menu);
      expect(overflow.getAttribute('aria-label')).to.equal(moreOptionsSv);
    });

    it('should remove the aria-label from the overflow button when empty i18n string is set', async () => {
      menu.i18n = { ...menu.i18n, moreOptions: '' };
      await nextUpdate(menu);
      expect(overflow.hasAttribute('aria-label')).to.be.false;
    });

    describe('reverse-collapse', () => {
      beforeEach(async () => {
        menu.reverseCollapse = true;
        await nextUpdate(menu);
      });

      it('should show overflow button and hide the buttons which do not fit', () => {
        assertHidden(buttons[0]);
        expect(buttons[0].disabled).to.be.true;
        assertHidden(buttons[1]);
        expect(buttons[1].disabled).to.be.true;
        assertHidden(buttons[2]);
        expect(buttons[2].disabled).to.be.true;
        assertVisible(buttons[3]);
        expect(buttons[3].disabled).to.be.false;
        assertVisible(buttons[4]);
        expect(buttons[4].disabled).to.be.true;

        expect(overflow.hasAttribute('hidden')).to.be.false;
      });

      it('should set items to overflow button for buttons which do not fit', () => {
        expect(overflow.item).to.be.instanceOf(Object);
        expect(overflow.item.children).to.be.instanceOf(Array);
        expect(overflow.item.children.length).to.equal(3);
        expect(overflow.item.children[0]).to.deep.equal(menu.items[0]);
        expect(overflow.item.children[1]).to.deep.equal(menu.items[1]);
        expect(overflow.item.children[2]).to.deep.equal(menu.items[2]);
      });

      it('should update overflow when reverseCollapse changes', async () => {
        menu.reverseCollapse = false;
        await nextUpdate(menu);
        assertVisible(buttons[0]);
        expect(buttons[0].disabled).to.be.false;
        assertVisible(buttons[1]);
        expect(buttons[1].disabled).to.be.false;
        assertHidden(buttons[2]);
        expect(buttons[2].disabled).to.be.true;
        assertHidden(buttons[3]);
        expect(buttons[3].disabled).to.be.true;
        assertHidden(buttons[4]);
        expect(buttons[4].disabled).to.be.true;
      });
    });
  });

  describe('has-single-button attribute', () => {
    let menu, buttons, overflow;

    beforeEach(async () => {
      menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
      menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }, { text: 'Item 4' }];
      await nextRender(menu);
      buttons = menu._buttons;
      overflow = buttons[buttons.length - 1];
    });

    it('should not set when one button and overflow are only visible', async () => {
      menu.style.width = '150px';
      await onceResized(menu);
      assertVisible(buttons[0]);
      assertHidden(buttons[1]);
      expect(overflow.hasAttribute('hidden')).to.be.false;
      expect(menu.hasAttribute('has-single-button')).to.be.false;
    });

    it('should set when only overflow button is visible', async () => {
      menu.style.width = '100px';
      await onceResized(menu);
      assertHidden(buttons[0]);
      assertHidden(buttons[1]);
      expect(menu.hasAttribute('has-single-button')).to.be.true;
    });

    it('should remove when buttons become visible after size increases', async () => {
      menu.style.width = '100px';
      await onceResized(menu);

      menu.style.width = '150px';
      await onceResized(menu);
      expect(menu.hasAttribute('has-single-button')).to.be.false;
    });

    it('should set when theme attribute makes other buttons not fit', async () => {
      menu.style.width = '150px';
      await onceResized(menu);

      menu.setAttribute('theme', 'big');
      await nextUpdate(menu);
      expect(menu.hasAttribute('has-single-button')).to.be.true;
    });

    it('should set when changing items to only have one button', async () => {
      menu.items = [{ text: 'Actions' }];
      await nextUpdate(menu);
      expect(menu.hasAttribute('has-single-button')).to.be.true;
    });

    it('should not remove after changing items to not overflow', async () => {
      menu.style.width = '100px';
      await onceResized(menu);

      menu.items = [{ text: 'Actions' }];
      await nextUpdate(menu);
      expect(menu.hasAttribute('has-single-button')).to.be.true;
    });

    it('should remove when changing items to have more than one button', async () => {
      menu.items = [{ text: 'Actions' }];
      await nextFrame();

      menu.items = [{ text: 'Edit' }, { text: 'Delete' }];
      await nextUpdate(menu);
      expect(menu.hasAttribute('has-single-button')).to.be.false;
    });
  });

  describe('responsive behavior in container', () => {
    let container, menu, buttons, overflow;

    beforeEach(async () => {
      container = fixtureSync(
        '<div style="display: flex;"><vaadin-menu-bar style="min-width: 100%"></vaadin-menu-bar></div>',
      );
      menu = container.firstChild;

      container.style.width = '250px';

      menu.items = [
        { text: 'Item 1' },
        { text: 'Item 2' },
        { text: 'Item 3' },
        { text: 'Item 4' },
        { text: 'Item 5', disabled: true },
      ];
      await nextRender(menu);
      buttons = menu._buttons;
      overflow = buttons[buttons.length - 1];
    });

    it('should hide overflow button and reset its items when all buttons fit', async () => {
      // Must work even if menu-bar won't automatically resize to a larger size
      // when more space becomes available
      // see https://github.com/vaadin/vaadin-menu-bar/issues/130
      menu.style.minWidth = '0';
      container.style.width = '150px';
      await onceResized(menu);
      assertHidden(buttons[2]);
      expect(buttons[2].disabled).to.be.true;
      assertHidden(buttons[3]);
      expect(buttons[3].disabled).to.be.true;

      container.style.width = '400px';
      await onceResized(menu);
      assertVisible(buttons[2]);
      expect(buttons[2].disabled).to.not.be.true;
      assertVisible(buttons[3]);
      expect(buttons[3].disabled).to.not.be.true;
      assertVisible(buttons[4]);
      expect(buttons[4].disabled).to.be.true;
      expect(overflow.hasAttribute('hidden')).to.be.true;
      expect(overflow.item.children.length).to.equal(0);
    });

    it('should keep buttons disabled when resizing', async () => {
      menu.disabled = true;
      await nextUpdate(menu);
      container.style.width = '150px';
      await onceResized(menu);
      buttons.forEach((btn) => {
        expect(btn.disabled).to.be.true;
      });
    });
  });

  describe('parent resize', () => {
    let container, text, menu, buttons;

    beforeEach(() => {
      container = fixtureSync('<div style="display: flex; max-width: 300px"></div>');
      text = document.createElement('div');
      text.textContent = 'Sibling';
      menu = document.createElement('vaadin-menu-bar');
      menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }, { text: 'Item 4' }];
      menu.style.minWidth = '100px';
    });

    describe('container', () => {
      beforeEach(async () => {
        container.append(text, menu);
        await onceResized(menu);
        buttons = menu._buttons;
      });

      it('should show buttons when container width increases and menu-bar width stays the same', async () => {
        assertHidden(buttons[2]);
        assertHidden(buttons[3]);

        container.style.maxWidth = '400px';
        await onceResized(menu);

        assertVisible(buttons[2]);
        assertVisible(buttons[3]);
      });

      it('should show buttons after attaching another container and increasing its width', async () => {
        const other = document.createElement('div');
        other.style.display = 'flex';
        other.style.maxWidth = '300px';
        container.parentNode.appendChild(other);

        other.append(text, menu);
        other.style.maxWidth = '400px';
        await onceResized(menu);

        assertVisible(buttons[2]);
        assertVisible(buttons[3]);
      });
    });

    describe('shadow host', () => {
      beforeEach(async () => {
        container.attachShadow({ mode: 'open' });
        container.shadowRoot.append(text, menu);
        await onceResized(menu);
        buttons = menu._buttons;
      });

      it('should show buttons when shadow host width increases and menu-bar width stays the same', async () => {
        assertHidden(buttons[2]);
        assertHidden(buttons[3]);

        container.style.maxWidth = '400px';
        await onceResized(menu);

        assertVisible(buttons[2]);
        assertVisible(buttons[3]);
      });
    });
  });

  describe('sub-menu', () => {
    let menu, buttons, overflow, subMenu;

    function makeComponent(id) {
      const div = document.createElement('div');
      div.style.width = '100px';
      div.textContent = `Item ${id}`;
      return div;
    }

    beforeEach(async () => {
      menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
      menu.items = [
        { text: 'Item 1' },
        { text: 'Item 2' },
        { component: makeComponent('3') },
        { text: 'Item 4 text', component: makeComponent('4') },
        { text: 'Item 5', component: document.createElement('vaadin-menu-bar-item') },
        { component: makeComponent('6'), children: [{ text: 'SubItem6.1' }, { text: 'SubItem6.2' }] },
      ];
      await nextRender(menu);
      buttons = menu._buttons;
      overflow = buttons[buttons.length - 1];
      subMenu = menu._subMenu;

      menu.style.width = '250px';
      await onceResized(menu);
    });

    it('should close the overflow sub-menu on menu-bar resize', async () => {
      overflow.click();
      await nextRender(subMenu);
      menu.style.width = 'auto';
      await onceResized(menu);
      expect(subMenu.opened).to.be.false;
    });

    it('should close the overflow sub-menu programmatically', async () => {
      overflow.click();
      await nextRender(subMenu);
      expect(subMenu.opened).to.be.true;

      menu.close();
      expect(subMenu.opened).to.be.false;
    });

    it('should teleport the same component to overflow sub-menu and back', async () => {
      overflow.click();
      await nextRender(subMenu);
      const listBox = subMenu._overlayElement.querySelector('vaadin-menu-bar-list-box');
      expect(listBox.items[0]).to.equal(buttons[2].item.component);
      expect(listBox.items[0].firstChild).to.equal(menu.items[2].component);
      expect(listBox.items[0].firstChild.localName).to.equal('div');
      subMenu.close();
      await nextUpdate(menu);
      menu.style.width = 'auto';
      await onceResized(menu);
      const item = buttons[2].firstChild;
      expect(item).to.equal(buttons[2].item.component);
      expect(item.getAttribute('role')).to.not.equal('menuitem');
    });

    it('should restore menu bar item attribute state when moved from sub-menu back to menu bar', async () => {
      const item = buttons[5].firstChild;
      const itemAttributes = item.getAttributeNames();
      overflow.click();
      await nextRender(subMenu);
      subMenu.close();
      await nextUpdate(menu);
      menu.style.width = 'auto';
      await onceResized(menu);
      expect(item.getAttributeNames()).to.have.members(itemAttributes);
    });

    it('should keep the class names when moved to sub-menu and back', async () => {
      // Simulate a custom class name being added through the Flow menu bar item component
      const item = buttons[5].firstChild;
      item.classList.add('test-class-1');
      overflow.click();
      await nextRender(subMenu);
      subMenu.close();
      await nextUpdate(menu);
      menu.style.width = 'auto';
      await onceResized(menu);
      expect(item.classList.contains('test-class-1')).to.be.true;
    });
  });
});
