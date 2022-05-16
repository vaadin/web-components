import { expect } from '@esm-bundle/chai';
import { arrowLeft, arrowRight, end, fixtureSync, focusin, home, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-menu-bar.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar',
  css`
    :host([theme='big']) [part$='button'] {
      width: 100px;
    }
  `,
  { moduleId: 'vaadin-menu-bar-test-styles' },
);

// utility function to assert a menu item is not visible
const assertHidden = (elem) => {
  const style = getComputedStyle(elem);
  expect(style.visibility).to.equal('hidden');
  expect(style.position).to.equal('absolute');
};

// utility function to assert a menu item is visible
const assertVisible = (elem) => {
  const style = getComputedStyle(elem);
  expect(style.visibility).to.equal('visible');
  expect(style.position).to.not.equal('absolute');
};

describe('custom element definition', () => {
  let menu, tagName;

  beforeEach(() => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    tagName = menu.tagName.toLowerCase();
  });

  it('should be defined in custom element registry', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });
});

describe('root menu layout', () => {
  let menu, buttons;

  function updateItemsAndButtons() {
    menu.items = [...menu.items];
    buttons = menu._buttons;
  }

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3', disabled: true }, { text: 'Item 4' }];
    await nextRender(menu);
    buttons = menu._buttons;
  });

  it('should render button for each item, plus overflow button', () => {
    expect(buttons.length).to.equal(menu.items.length + 1);
  });

  it('should make the overflow button hidden by default', () => {
    const overflow = buttons[menu.items.length];
    expect(overflow.getAttribute('part')).to.equal('overflow-button');
    expect(overflow.hasAttribute('hidden')).to.be.true;
  });

  it('should set buttons text content based on the text property', () => {
    menu.items.forEach((item, idx) => {
      expect(buttons[idx].textContent.trim()).to.equal(item.text);
    });
  });

  it('should render disabled button if disabled property is true', () => {
    expect(buttons[2].disabled).to.be.true;
  });

  it('should set tabindex to -1 to all the buttons except first one', () => {
    focusin(menu);
    expect(buttons[0].getAttribute('tabindex')).to.equal('0');
    buttons.slice(1).forEach((btn) => {
      expect(btn.getAttribute('tabindex')).to.equal('-1');
    });
  });

  it('should not throw when changing items before the menu bar is attached', () => {
    expect(() => {
      const menuBar = document.createElement('vaadin-menu-bar');
      menuBar.items = [{ text: 'Item 1' }];
    }).to.not.throw(Error);
  });

  describe('keyboard navigation', () => {
    describe('default mode', () => {
      it('should move focus to next button on "arrow-right" keydown', () => {
        buttons[0].focus();
        const spy = sinon.spy(buttons[1], 'focus');
        arrowRight(buttons[0]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to prev button on "arrow-left" keydown', () => {
        buttons[1].focus();
        const spy = sinon.spy(buttons[0], 'focus');
        arrowLeft(buttons[1]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[0].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to first button on "home" keydown', () => {
        buttons[1].focus();
        const spy = sinon.spy(buttons[0], 'focus');
        home(buttons[1]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[0].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to second button if first is disabled on "home" keydown', () => {
        menu.items[0].disabled = true;
        updateItemsAndButtons();
        buttons[3].focus();
        const spy = sinon.spy(buttons[1], 'focus');
        home(buttons[3]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to last button on "end" keydown', () => {
        buttons[0].focus();
        const spy = sinon.spy(buttons[3], 'focus');
        end(buttons[0]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[3].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to the closest enabled button if last is disabled on "end" keydown', () => {
        menu.items[3].disabled = true;
        updateItemsAndButtons();
        buttons[0].focus();
        const spy = sinon.spy(buttons[1], 'focus');
        end(buttons[0]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to first button on "arrow-right", if last button has focus', () => {
        buttons[3].focus();
        const spy = sinon.spy(buttons[0], 'focus');
        arrowRight(buttons[3]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[0].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to last button on "arrow-left", if first button has focus', () => {
        buttons[0].focus();
        const spy = sinon.spy(buttons[3], 'focus');
        arrowLeft(buttons[0]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[3].hasAttribute('focused')).to.be.true;
      });
    });

    describe('RTL mode', () => {
      beforeEach(() => {
        menu.setAttribute('dir', 'rtl');
      });

      it('should move focus to next button on "arrow-left" keydown', () => {
        buttons[0].focus();
        const spy = sinon.spy(buttons[1], 'focus');
        arrowLeft(buttons[0]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to prev button on "arrow-right" keydown', () => {
        buttons[1].focus();
        const spy = sinon.spy(buttons[0], 'focus');
        arrowRight(buttons[1]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[0].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to first button on "arrow-left", if last button has focus', () => {
        buttons[3].focus();
        const spy = sinon.spy(buttons[0], 'focus');
        arrowLeft(buttons[3]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[0].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to last button on "arrow-right", if first button has focus', () => {
        buttons[0].focus();
        const spy = sinon.spy(buttons[3], 'focus');
        arrowRight(buttons[0]);
        expect(spy.calledOnce).to.be.true;
        expect(buttons[3].hasAttribute('focused')).to.be.true;
      });
    });
  });

  describe('updating items', () => {
    it('should remove buttons when setting empty array', () => {
      menu.items = [];
      expect(menu._buttons.filter((b) => b !== menu._overflow).length).to.eql(0);
    });

    it('should remove buttons when setting falsy items property', () => {
      menu.items = undefined;
      expect(menu._buttons.filter((b) => b !== menu._overflow).length).to.eql(0);
    });
  });

  describe('theme attribute', () => {
    it('should propagate theme attribute to all internal buttons', () => {
      menu.setAttribute('theme', 'contained');
      buttons.forEach((btn) => expect(btn.getAttribute('theme')).to.equal('contained'));
    });

    it('should propagate theme attribute to added buttons', async () => {
      menu.setAttribute('theme', 'contained');
      menu.unshift('items', { text: 'new' });
      await nextRender(menu);
      buttons.forEach((btn) => expect(btn.getAttribute('theme')).to.equal('contained'));
    });

    it('should remove theme attribute from internal buttons when it is removed from host', () => {
      menu.setAttribute('theme', 'contained');
      menu.removeAttribute('theme');
      buttons.forEach((btn) => expect(btn.hasAttribute('theme')).to.be.false);
    });

    it('should override the theme attribute of the component with the item.theme property', () => {
      menu.setAttribute('theme', 'contained');
      menu.items[1].theme = 'item-theme';
      updateItemsAndButtons();

      expect(buttons[0].getAttribute('theme')).to.equal('contained');
      expect(buttons[1].getAttribute('theme')).to.equal('item-theme');

      menu.removeAttribute('theme');

      expect(buttons[0].hasAttribute('theme')).to.be.false;
      expect(buttons[1].getAttribute('theme')).to.equal('item-theme');
    });

    it('should support setting multiple themes with an array', () => {
      menu.items[1].theme = ['theme-1', 'theme-2'];
      updateItemsAndButtons();

      expect(buttons[1].getAttribute('theme')).to.equal('theme-1 theme-2');

      menu.items[1].theme = [];
      updateItemsAndButtons();

      expect(buttons[1].hasAttribute('theme')).to.be.false;
    });

    it('should override the theme attribute of the component with an empty item.theme property', () => {
      menu.setAttribute('theme', 'contained');
      menu.items[0].theme = '';
      updateItemsAndButtons();

      expect(buttons[0].hasAttribute('theme')).to.be.false;

      menu.items[0].theme = [];
      updateItemsAndButtons();

      expect(buttons[0].hasAttribute('theme')).to.be.false;

      menu.items[0].theme = [''];
      updateItemsAndButtons();

      expect(buttons[0].hasAttribute('theme')).to.be.false;

      menu.items[0].theme = null;
      updateItemsAndButtons();

      expect(buttons[0].getAttribute('theme')).to.equal('contained');
    });
  });
});

describe('overflow button', () => {
  let menu, buttons, overflow;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');

    menu.style.width = '250px';

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

  it('should show overflow button after assigning the same items', () => {
    menu.items = [...menu.items];
    expect(overflow.hasAttribute('hidden')).to.be.false;
  });

  it('should show buttons and update overflow items when width increased', async () => {
    menu.style.width = '350px';
    menu.notifyResize();
    await nextRender(menu);
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
    menu.notifyResize();
    await nextRender(menu);
    assertVisible(buttons[2]);
    expect(buttons[2].disabled).to.not.be.true;
    assertVisible(buttons[3]);
    expect(buttons[3].disabled).to.not.be.true;
    expect(overflow.item.children.length).to.equal(1);
    expect(overflow.item.children[0]).to.deep.equal(menu.items[4]);
  });

  it('should hide buttons and update overflow items when width decreased', async () => {
    menu.style.width = '150px';
    menu.notifyResize();
    await nextRender(menu);
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
    menu.notifyResize();
    await nextRender(menu);
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
    menu.notifyResize();
    await nextRender(menu);
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
    // see https://github.com/vaadin/vaadin-menu-bar/issues/133
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
    menu.notifyResize();
    await nextRender(menu);
    expect(overflow.hasAttribute('hidden')).to.be.true;
    menu.setAttribute('theme', 'big');
    assertHidden(buttons[3]);
    assertHidden(buttons[4]);
    expect(overflow.hasAttribute('hidden')).to.be.false;
  });

  it('should set the aria-label of the overflow button according to the i18n of the menu bar', () => {
    const moreOptionsSv = 'Fler alternativ';
    expect(overflow.getAttribute('aria-label')).to.equal('More options');
    menu.i18n = { ...menu.i18n, moreOptions: moreOptionsSv };
    expect(overflow.getAttribute('aria-label')).to.equal(moreOptionsSv);
  });
});

describe('responsive behaviour in container', () => {
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

  it('should hide overflow button and reset its items when all buttons fit ', async () => {
    // must work even if menu-bar won't automatically resize to a larger size
    // when more space becomes available
    // see https://github.com/vaadin/vaadin-menu-bar/issues/130
    menu.style.minWidth = '0';
    container.style.width = '150px';
    menu.notifyResize();
    await nextRender(container);
    assertHidden(buttons[2]);
    expect(buttons[2].disabled).to.be.true;
    assertHidden(buttons[3]);
    expect(buttons[3].disabled).to.be.true;

    container.style.width = '390px';
    menu.notifyResize();
    await nextRender(container);
    assertVisible(buttons[2]);
    expect(buttons[2].disabled).to.not.be.true;
    assertVisible(buttons[3]);
    expect(buttons[3].disabled).to.not.be.true;
    assertVisible(buttons[4]);
    expect(buttons[4].disabled).to.be.true;
    expect(overflow.hasAttribute('hidden')).to.be.true;
    expect(overflow.item.children.length).to.equal(0);
  });
});

describe('item components', () => {
  let menu, buttons, overflow;

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
      { text: 'Item 5', component: document.createElement('vaadin-context-menu-item') },
    ];
    await nextRender(menu);
    buttons = menu._buttons;
    overflow = buttons[buttons.length - 1];
  });

  it('should render the component inside the context-menu item', () => {
    const item = buttons[2].firstChild;
    expect(item).to.equal(buttons[2].item.component);
    expect(item.localName).to.equal('vaadin-context-menu-item');
    const div = item.firstChild;
    expect(div).to.equal(menu.items[2].component);
    expect(div.localName).to.equal('div');
    expect(div.textContent).to.equal('Item 3');
    expect(getComputedStyle(div).width).to.equal('100px');
  });

  it('should override the component text when defined on the item', () => {
    const item = buttons[3].firstChild;
    expect(item).to.equal(buttons[3].item.component);
    expect(item.localName).to.equal('vaadin-context-menu-item');
    const div = item.firstChild;
    expect(div).to.equal(menu.items[3].component);
    expect(div.localName).to.equal('div');
    expect(div.textContent).to.equal('Item 4 text');
    expect(getComputedStyle(div).width).to.equal('100px');
  });

  it('should render provided context-menu item as a component', () => {
    expect(buttons[4].firstChild).to.equal(buttons[4].item.component);
    expect(buttons[4].item.component).to.equal(menu.items[4].component);
    expect(buttons[4].item.component.children.length).to.equal(0);
    expect(buttons[4].item.component.textContent).to.equal('Item 5');
  });

  it('should teleport the same component to overflow sub-menu and back', async () => {
    menu.style.width = '250px';
    menu.notifyResize();
    await nextRender(menu);
    const subMenu = menu._subMenu;
    overflow.click();
    await nextRender(subMenu);
    const listBox = subMenu.$.overlay.querySelector('vaadin-context-menu-list-box');
    expect(listBox.items[0]).to.equal(buttons[2].item.component);
    expect(listBox.items[0].firstChild).to.equal(menu.items[2].component);
    expect(listBox.items[0].firstChild.localName).to.equal('div');
    subMenu.close();
    menu.style.width = 'auto';
    menu.notifyResize();
    await nextRender(menu);
    const item = buttons[2].firstChild;
    expect(item).to.equal(buttons[2].item.component);
    expect(item.classList.contains('vaadin-menu-item')).to.be.false;
  });

  it('should close the overflow sub-menu on resize', async () => {
    menu.style.width = '150px';
    menu.notifyResize();
    await nextRender(menu);
    const subMenu = menu._subMenu;
    overflow.click();
    await nextRender(subMenu);
    menu.style.width = '300px';
    menu.notifyResize();
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
  });

  it('should set position and z-index on the item component to allow clicks', () => {
    const item = buttons[2].firstChild;
    const style = getComputedStyle(item);
    expect(style.position).to.equal('relative');
    expect(Number(style.zIndex)).to.equal(1);
  });
});

describe('menu-bar in flex', () => {
  let wrapper;
  let menu;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="display: flex; width: 400px;">
        <vaadin-menu-bar></vaadin-menu-bar>
      </div>
    `);
    menu = wrapper.firstElementChild;
    menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }];
  });

  it('should not expand to full width of the container', () => {
    expect(menu.offsetWidth).to.be.lessThan(wrapper.offsetWidth);
  });
});
