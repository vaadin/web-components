import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import './not-animated-styles.css';
import type { DropdownMenuButton } from '../src/vaadin-dropdown-menu-button.js';
import type { DropdownMenu } from '../vaadin-dropdown-menu.js';
import { getButton, openMenu } from './helpers.js';

function createButton(text: string): DropdownMenuButton {
  const button = document.createElement('vaadin-dropdown-menu-button');
  button.slot = 'button';
  button.textContent = text;
  return button;
}

describe('vaadin-dropdown-menu - button', () => {
  let menu: DropdownMenu;

  afterEach(() => {
    menu.close();
  });

  describe('default', () => {
    beforeEach(async () => {
      menu = fixtureSync('<vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>');
      menu.items = [{ text: 'Item 1' }];
      await nextRender();
    });

    it('should create a default button with an id in the button slot', () => {
      const button = getButton(menu);
      expect(button.localName).to.equal('vaadin-dropdown-menu-button');
      expect(button.id).to.be.ok;
    });

    it('should set the button text from the label property', async () => {
      expect(getButton(menu).textContent).to.equal('Actions');
      menu.label = 'More';
      await nextUpdate(menu);
      expect(getButton(menu).textContent).to.equal('More');
    });

    it('should clear the button text when label is removed', async () => {
      menu.label = null;
      await nextUpdate(menu);
      expect(getButton(menu).textContent).to.equal('');
    });
  });

  describe('custom', () => {
    let custom: DropdownMenuButton;

    beforeEach(async () => {
      menu = fixtureSync(`
        <vaadin-dropdown-menu label="Actions">
          <vaadin-dropdown-menu-button slot="button">Custom</vaadin-dropdown-menu-button>
        </vaadin-dropdown-menu>
      `);
      menu.items = [{ text: 'Item 1' }];
      await nextRender();
      custom = menu.querySelector('vaadin-dropdown-menu-button')!;
    });

    it('should use the custom button instead of the default one', () => {
      expect(menu.querySelectorAll('[slot="button"]').length).to.equal(1);
      expect(getButton(menu)).to.equal(custom);
      expect(custom.textContent).to.equal('Custom');
    });

    it('should not change the custom button text on label change', async () => {
      menu.label = 'More';
      await nextUpdate(menu);
      expect(custom.textContent).to.equal('Custom');
    });

    it('should open the menu on custom button click', async () => {
      await openMenu(menu);
      expect(menu.opened).to.be.true;
      expect(custom.getAttribute('aria-expanded')).to.equal('true');
    });

    describe('replace', () => {
      let other: DropdownMenuButton;

      beforeEach(async () => {
        menu.disabled = true;
        menu.setAttribute('theme', 'primary');
        other = createButton('Other');
        custom.remove();
        menu.appendChild(other);
        await nextRender();
      });

      it('should sync the host state to the new button', () => {
        expect(getButton(menu)).to.equal(other);
        expect(other.disabled).to.be.true;
        expect(other.getAttribute('theme')).to.equal('primary');
        expect(other.getAttribute('aria-haspopup')).to.equal('menu');
        expect(other.getAttribute('aria-expanded')).to.equal('false');
      });

      it('should open the menu on the new button click', async () => {
        menu.disabled = false;
        await openMenu(menu);
        expect(menu.opened).to.be.true;
        expect(other.getAttribute('aria-expanded')).to.equal('true');
      });

      it('should not open the menu on the old button click', async () => {
        menu.disabled = false;
        custom.click();
        await nextRender();
        expect(menu.opened).to.be.false;
      });
    });

    it('should restore the default button when the custom one is removed', async () => {
      custom.remove();
      await nextRender();
      const button = getButton(menu);
      expect(button).to.be.ok;
      expect(button).to.not.equal(custom);
      expect(button.textContent).to.equal('Actions');
      await openMenu(menu);
      expect(menu.opened).to.be.true;
    });
  });
});
