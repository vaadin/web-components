import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, focusin, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-menu-bar.js';

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

  async function updateItemsAndButtons() {
    menu.items = [...menu.items];
    await nextUpdate(menu);
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
    expect(overflow.hasAttribute('hidden')).to.be.true;
  });

  it('should set buttons text content based on the text property', () => {
    menu.items.forEach((item, idx) => {
      expect(buttons[idx].textContent.trim()).to.equal(item.text);
    });
  });

  it('should disable all buttons when menu-bar disabled is set to true', async () => {
    menu.disabled = true;
    await nextUpdate(menu);
    buttons.forEach((btn) => {
      expect(btn.disabled).to.be.true;
    });
  });

  it('should keep previously disabled buttons disabled when re-enabling the menu-bar', async () => {
    expect(buttons[2].disabled).to.be.true;
    menu.disabled = true;
    await nextUpdate(menu);
    expect(buttons[2].disabled).to.be.true;
    menu.disabled = false;
    await nextUpdate(menu);
    expect(buttons[2].disabled).to.be.true;
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

  it('should set tabindex to 0 when the button is not disabled in tab navigation', async () => {
    menu.tabNavigation = true;
    await nextUpdate(menu);
    buttons.forEach((btn) => {
      if (btn.disabled) {
        expect(btn.getAttribute('tabindex')).to.equal('-1');
      } else {
        expect(btn.getAttribute('tabindex')).to.equal('0');
      }
    });
  });

  it('should reset tabindex after switching back from tab navigation', async () => {
    menu.tabNavigation = true;
    await nextUpdate(menu);
    menu.tabNavigation = false;
    await nextUpdate(menu);
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

  describe('updating items', () => {
    it('should remove buttons when setting empty array', async () => {
      menu.items = [];
      await nextUpdate(menu);
      expect(menu._buttons.filter((b) => b !== menu._overflow).length).to.eql(0);
    });

    it('should remove buttons when setting falsy items property', async () => {
      menu.items = undefined;
      await nextUpdate(menu);
      expect(menu._buttons.filter((b) => b !== menu._overflow).length).to.eql(0);
    });
  });

  describe('theme attribute', () => {
    it('should propagate theme attribute to all internal buttons', async () => {
      menu.setAttribute('theme', 'contained');
      await nextUpdate(menu);
      buttons.forEach((btn) => expect(btn.getAttribute('theme')).to.equal('contained'));
    });

    it('should propagate theme attribute to added buttons', async () => {
      menu.setAttribute('theme', 'contained');
      await nextUpdate(menu);
      menu.items = [{ text: 'new' }, ...menu.items];
      await nextUpdate(menu);
      buttons.forEach((btn) => expect(btn.getAttribute('theme')).to.equal('contained'));
    });

    it('should remove theme attribute from internal buttons when it is removed from host', async () => {
      menu.setAttribute('theme', 'contained');
      await nextUpdate(menu);
      menu.removeAttribute('theme');
      await nextUpdate(menu);
      buttons.forEach((btn) => expect(btn.hasAttribute('theme')).to.be.false);
    });

    it('should override the theme attribute of the component with the item.theme property', async () => {
      menu.setAttribute('theme', 'contained');
      menu.items[1].theme = 'item-theme';
      await updateItemsAndButtons();

      expect(buttons[0].getAttribute('theme')).to.equal('contained');
      expect(buttons[1].getAttribute('theme')).to.equal('item-theme');

      menu.removeAttribute('theme');
      await nextUpdate(menu);

      expect(buttons[0].hasAttribute('theme')).to.be.false;
      expect(buttons[1].getAttribute('theme')).to.equal('item-theme');
    });

    it('should support setting multiple themes with an array', async () => {
      menu.items[1].theme = ['theme-1', 'theme-2'];
      await updateItemsAndButtons();

      expect(buttons[1].getAttribute('theme')).to.equal('theme-1 theme-2');

      menu.items[1].theme = [];
      await updateItemsAndButtons();

      expect(buttons[1].hasAttribute('theme')).to.be.false;
    });

    it('should override the theme attribute of the component with an empty item.theme property', async () => {
      menu.setAttribute('theme', 'contained');
      menu.items[0].theme = '';
      await updateItemsAndButtons();

      expect(buttons[0].hasAttribute('theme')).to.be.false;

      menu.items[0].theme = [];
      await updateItemsAndButtons();

      expect(buttons[0].hasAttribute('theme')).to.be.false;

      menu.items[0].theme = [''];
      await updateItemsAndButtons();

      expect(buttons[0].hasAttribute('theme')).to.be.false;

      menu.items[0].theme = null;
      await updateItemsAndButtons();

      expect(buttons[0].getAttribute('theme')).to.equal('contained');
    });
  });
});

describe('item components', () => {
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
      { text: 'Item 1' },
      { text: 'Item 2' },
      { component: makeComponent('3') },
      { text: 'Item 4 text', component: makeComponent('4') },
      { text: 'Item 5', component: document.createElement('vaadin-menu-bar-item') },
      { component: makeComponent('6'), children: [{ text: 'SubItem6.1' }, { text: 'SubItem6.2' }] },
    ];
    await nextRender(menu);
    buttons = menu._buttons;
  });

  it('should render the component inside the menu-bar item', () => {
    const item = buttons[2].firstChild;
    expect(item).to.equal(buttons[2].item.component);
    expect(item.localName).to.equal('vaadin-menu-bar-item');
    const div = item.firstChild;
    expect(div).to.equal(menu.items[2].component);
    expect(div.localName).to.equal('div');
    expect(div.textContent).to.equal('Item 3');
    expect(getComputedStyle(div).width).to.equal('100px');
  });

  it('should override the component text when defined on the item', () => {
    const item = buttons[3].firstChild;
    expect(item).to.equal(buttons[3].item.component);
    expect(item.localName).to.equal('vaadin-menu-bar-item');
    const div = item.firstChild;
    expect(div).to.equal(menu.items[3].component);
    expect(div.localName).to.equal('div');
    expect(div.textContent).to.equal('Item 4 text');
    expect(getComputedStyle(div).width).to.equal('100px');
  });

  it('should render provided menu-bar item as a component', () => {
    expect(buttons[4].firstChild).to.equal(buttons[4].item.component);
    expect(buttons[4].item.component).to.equal(menu.items[4].component);
    expect(buttons[4].item.component.children.length).to.equal(0);
    expect(buttons[4].item.component.textContent).to.equal('Item 5');
  });
});

describe('menu-bar in flex', () => {
  let wrapper;
  let menu;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div style="display: flex; width: 400px;">
        <vaadin-menu-bar></vaadin-menu-bar>
      </div>
    `);
    menu = wrapper.firstElementChild;
    menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }];
    await nextRender();
  });

  it('should not expand to full width of the container', () => {
    expect(menu.offsetWidth).to.be.lessThan(wrapper.offsetWidth);
  });
});
