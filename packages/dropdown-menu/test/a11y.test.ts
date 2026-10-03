import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import './not-animated-styles.css';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import type { DropdownMenuButton } from '../src/vaadin-dropdown-menu-button.js';
import type { DropdownMenu } from '../vaadin-dropdown-menu.js';
import { getButton, getMenuItems, openMenu } from './helpers.js';

function getFlatTreeAncestors(node: Node): Node[] {
  const ancestors: Node[] = [];
  let current: Node | null = node;
  while (current) {
    current = (current as Element).assignedSlot || current.parentNode || (current as ShadowRoot).host || null;
    if (current) {
      ancestors.push(current);
    }
  }
  return ancestors;
}

describe('vaadin-dropdown-menu - a11y', () => {
  let menu: DropdownMenu;
  let button: DropdownMenuButton;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>');
    menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }];
    await nextRender();
    button = getButton(menu);
  });

  afterEach(() => {
    menu.close();
  });

  it('should not set role on the host', () => {
    expect(menu.hasAttribute('role')).to.be.false;
  });

  it('should set role and aria-haspopup on the button', () => {
    expect(button.getAttribute('role')).to.equal('button');
    expect(button.getAttribute('aria-haspopup')).to.equal('menu');
  });

  it('should toggle aria-expanded attribute on open', async () => {
    expect(button.getAttribute('aria-expanded')).to.equal('false');
    await openMenu(menu);
    expect(button.getAttribute('aria-expanded')).to.equal('true');
    menu.close();
    expect(button.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should toggle aria-label on the button with accessibleName', async () => {
    menu.accessibleName = 'More actions';
    await nextUpdate(menu);
    expect(button.getAttribute('aria-label')).to.equal('More actions');
    menu.accessibleName = null;
    await nextUpdate(menu);
    expect(button.hasAttribute('aria-label')).to.be.false;
  });

  it('should keep aria-label of a custom button when accessibleName is not set', async () => {
    const custom = document.createElement('vaadin-dropdown-menu-button');
    custom.slot = 'button';
    custom.setAttribute('aria-label', 'Custom');
    menu.appendChild(custom);
    await nextRender();
    expect(getButton(menu)).to.equal(custom);
    expect(custom.getAttribute('aria-label')).to.equal('Custom');
  });

  describe('aria references', () => {
    it('should set aria-controls on the button to the list-box id on open', async () => {
      expect(button.hasAttribute('aria-controls')).to.be.false;
      await openMenu(menu);
      const listBox = menu.querySelector(':scope > [slot="overlay"] vaadin-context-menu-list-box')!;
      const id = button.getAttribute('aria-controls')!;
      expect(id).to.equal(listBox.id);
      expect((menu.getRootNode() as Document).getElementById(id)).to.equal(listBox);
    });

    it('should set aria-labelledby on the list-box to the button id on open', async () => {
      await openMenu(menu);
      const listBox = menu.querySelector(':scope > [slot="overlay"] vaadin-context-menu-list-box')!;
      const id = listBox.getAttribute('aria-labelledby')!;
      expect(id).to.equal(button.id);
      expect((menu.getRootNode() as Document).getElementById(id)).to.equal(button);
    });

    describe('slotted list-box', () => {
      let listBox: HTMLElement;

      beforeEach(async () => {
        menu = fixtureSync(`
          <vaadin-dropdown-menu label="Actions">
            <vaadin-context-menu-list-box slot="overlay">
              <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
            </vaadin-context-menu-list-box>
          </vaadin-dropdown-menu>
        `);
        await nextRender();
        button = getButton(menu);
        listBox = menu.querySelector('vaadin-context-menu-list-box')!;
      });

      it('should set aria-controls and aria-labelledby before open', () => {
        expect(listBox.id).to.be.ok;
        expect(button.getAttribute('aria-controls')).to.equal(listBox.id);
        expect(listBox.getAttribute('aria-labelledby')).to.equal(button.id);
      });

      it('should remove aria-controls when the list-box is removed', async () => {
        listBox.remove();
        await nextRender();
        expect(button.hasAttribute('aria-controls')).to.be.false;
        expect(listBox.hasAttribute('aria-labelledby')).to.be.false;
      });
    });

    describe('slotted list-box with custom attributes', () => {
      let listBox: HTMLElement;

      beforeEach(async () => {
        menu = fixtureSync(`
          <vaadin-dropdown-menu label="Actions">
            <vaadin-context-menu-list-box slot="overlay" id="custom-id" aria-label="Custom">
              <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
            </vaadin-context-menu-list-box>
          </vaadin-dropdown-menu>
        `);
        await nextRender();
        button = getButton(menu);
        listBox = menu.querySelector('vaadin-context-menu-list-box')!;
      });

      it('should keep the list-box id', () => {
        expect(listBox.id).to.equal('custom-id');
        expect(button.getAttribute('aria-controls')).to.equal('custom-id');
      });

      it('should not set aria-labelledby when the list-box has aria-label', () => {
        expect(listBox.hasAttribute('aria-labelledby')).to.be.false;
      });
    });
  });

  it('should not render menu items inside the button', async () => {
    await openMenu(menu);
    const item = getMenuItems(menu)[0];
    expect(getFlatTreeAncestors(item)).to.not.include(button);
  });

  it('should focus the button on host focus()', () => {
    menu.focus();
    expect(getDeepActiveElement()).to.equal(button);
  });

  it('should remove focus from the button on host blur()', () => {
    menu.focus();
    menu.blur();
    expect(getDeepActiveElement()).to.equal(document.body);
  });

  it('should set menu role on the list-box and menuitem role on the items', async () => {
    await openMenu(menu);
    const listBox = menu.querySelector(':scope > [slot="overlay"] vaadin-context-menu-list-box')!;
    expect(listBox.getAttribute('role')).to.equal('menu');
    getMenuItems(menu).forEach((item) => {
      expect(item.getAttribute('role')).to.equal('menuitem');
    });
  });
});
