import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  arrowUp,
  click,
  enterKeyDown,
  enterKeyUp,
  escKeyDown,
  fire,
  fixtureSync,
  keyboardEventFor,
  keyDownChar,
  nextFrame,
  spaceKeyDown,
  tab,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import './not-animated-styles.js';
import '../vaadin-select.js';
import { html, render } from 'lit';

describe('vaadin-select', () => {
  let select, valueButton;

  describe('empty', () => {
    let select;

    beforeEach(() => {
      select = fixtureSync(`<vaadin-select></vaadin-select>`);
    });

    it('should not throw an exception if renderer is not set', () => {
      select.opened = true;
      select.value = 'foo';
      select.opened = false;
    });

    it('should not throw an exception if renderer does not create list-box', () => {
      select.renderer = (root) => {
        root.appendChild(document.createElement('div'));
      };
      select.opened = true;
      select.value = 'foo';
      select.opened = false;
    });

    it('should assign menu element if renderer was set after DOM is ready', () => {
      const renderer = (root) => {
        if (root.firstElementChild) {
          return;
        }
        const menu = document.createElement('vaadin-list-box');
        const item = document.createElement('vaadin-item');
        menu.appendChild(item);
        root.appendChild(menu);
      };
      select.renderer = renderer;
      expect(select._menuElement).to.not.be.undefined;
    });

    it('should assign menu element set using innerHTML after opening', () => {
      const renderer = (root) => {
        root.innerHTML = `
          <vaadin-list-box>
            <vaadin-item>Test<vaadin-item>
          </vaadin-list-box>
        `;
      };
      select.renderer = renderer;
      select.opened = true;
      const listBox = select._menuElement;
      expect(listBox.isConnected).to.be.true;
      expect(listBox.parentNode).to.equal(select._overlayElement);
    });
  });

  describe('with items', () => {
    beforeEach(async () => {
      select = fixtureSync('<vaadin-select></vaadin-select>');
      select.renderer = (root) => {
        render(
          html`
            <vaadin-list-box>
              <vaadin-item>Option 1</vaadin-item>
              <vaadin-item value="v2" label="o2">Option 2</vaadin-item>
              <vaadin-item value="">Option 3</vaadin-item>
              <vaadin-item></vaadin-item>
              <vaadin-item label="">Empty</vaadin-item>
              <vaadin-item value="v4" disabled>Disabled</vaadin-item>
            </vaadin-list-box>
          `,
          root,
        );
      };
      valueButton = select._valueButton;
      await nextFrame();
    });

    describe('selection', () => {
      let menu;

      beforeEach(async () => {
        select.opened = true;
        menu = select._menuElement;
        await nextFrame();
      });

      it('should select the first item with an empty value by default', () => {
        expect(menu.selected).to.be.equal(2);
      });

      it('should close the overlay when selecting a new item', () => {
        click(select._items[1]);
        expect(select._overlayElement.opened).to.be.false;
      });

      it('should update selection slot with a clone of the selected item', () => {
        menu.selected = 2;
        const itemElement = select._items[menu.selected];
        const valueElement = valueButton.firstChild;
        expect(valueElement).not.to.be.equal(itemElement);
        expect(valueElement.localName).to.be.equal(itemElement.localName);
        expect(valueElement.textContent).to.be.equal(itemElement.textContent);
      });

      it('should preserve the selected attribute when selecting the disabled item', () => {
        menu.selected = 5;
        const valueElement = valueButton.firstChild;
        expect(valueElement.selected).to.be.true;
        expect(valueElement.disabled).to.be.true;
      });

      it('should not update value if the selected item does not have a value', () => {
        menu.selected = 2;
        expect(select.value).to.be.empty;
      });

      it('should update value with the value of the selected item', () => {
        menu.selected = 1;
        expect(select.value).to.be.equal('v2');
      });

      it('should set empty value if an item without `value` is selected', () => {
        menu.selected = 1;
        menu.selected = 3;
        expect(select.value).to.be.empty;
      });

      it('should remove tabindex when cloning the selected element', () => {
        menu.selected = 2;
        const itemElement = select._items[menu.selected];
        const valueElement = valueButton.firstChild;
        expect(itemElement.tabIndex).to.be.equal(0);
        expect(valueElement.hasAttribute('tabindex')).to.be.false;
      });

      it('should remove role when cloning the selected element', () => {
        menu.selected = 2;
        const itemElement = select._items[menu.selected];
        const valueElement = valueButton.firstChild;
        expect(itemElement.tabIndex).to.be.equal(0);
        expect(valueElement.hasAttribute('role')).to.be.false;
      });

      it('should update selection slot textContent with the selected item `label` string', () => {
        menu.selected = 1;
        expect(valueButton.textContent.trim()).to.be.equal('o2');
      });

      it('should wrap the selected item `label` string in selected vaadin item', () => {
        menu.selected = 1;
        const item = valueButton.firstElementChild;
        expect(item.localName).to.equal('vaadin-select-item');
        expect(item.textContent).to.equal('o2');
        expect(item.selected).to.be.true;
        expect(item.getAttribute('tabindex')).to.be.null;
      });

      it('should update selection slot when value is provided', () => {
        select.value = 'v2';
        expect(valueButton.textContent.trim()).to.be.equal('o2');
      });

      it('should update overlay selected item when value is provided', () => {
        select.value = 'v2';
        expect(menu.selected).to.be.equal(1);
      });

      it('should not select any item when value is not found in items', () => {
        select.value = 'v2';
        select.value = 'foo';
        expect(menu.selected).to.be.undefined;
      });
    });

    describe('keyboard selection', () => {
      let menu;

      beforeEach(() => {
        menu = select._menuElement;
      });

      describe('default', () => {
        it('should select items when alphanumeric keys are pressed', () => {
          expect(menu.selected).to.be.equal(2);
          keyDownChar(valueButton, 'o');
          keyDownChar(valueButton, 'p');
          keyDownChar(valueButton, 't');
          expect(menu.selected).to.be.equal(0);
          keyDownChar(valueButton, 'i');
          keyDownChar(valueButton, 'o');
          keyDownChar(valueButton, 'n');
          keyDownChar(valueButton, '2');
          expect(menu.selected).to.be.equal(1);
        });
      });

      describe('non-latin keys', () => {
        const LARGE = 'ใหญ่';
        const SMALL = 'เล็ก';

        beforeEach(() => {
          const items = select._items;
          items[0].value = 'large';
          items[0].textContent = LARGE;
          items[1].value = 'small';
          items[1].textContent = SMALL;
          items[1].removeAttribute('label');
        });

        it('should select items when non-latin keys are pressed', () => {
          keyDownChar(valueButton, SMALL.charAt(0));
          expect(menu.selected).to.be.equal(1);
          expect(select._valueButton.textContent.trim()).to.be.equal(SMALL);
          expect(select.value).to.be.equal('small');

          keyDownChar(valueButton, LARGE.charAt(0));
          expect(menu.selected).to.be.equal(0);
          expect(select._valueButton.textContent.trim()).to.be.equal(LARGE);
          expect(select.value).to.be.equal('large');
        });
      });
    });

    describe('opening the overlay', () => {
      it('should keep synchronized opened properties in overlay and select', () => {
        select.opened = true;
        expect(select.opened).to.be.true;
        expect(select._overlayElement.opened).to.be.true;

        select.opened = false;
        expect(select._overlayElement.opened).to.be.false;
        expect(select.opened).to.be.false;
      });

      it('should focus the menu when opening the overlay', () => {
        const spy = sinon.spy(select._menuElement, 'focus');
        select.opened = true;
        expect(spy.calledOnce).to.be.true;
      });

      it('should restore attribute focus-ring if it was initially set before opening', () => {
        select.setAttribute('focus-ring', '');
        select.opened = true;
        select.opened = false;
        expect(select.hasAttribute('focus-ring')).to.be.true;
      });

      it('should open the overlay on click event on value button', () => {
        expect(select.opened).to.be.false;
        click(valueButton);
        expect(select.opened).to.be.true;
      });

      it('should open the overlay on input container click event', () => {
        expect(select.opened).to.be.false;
        select._inputContainer.click();
        expect(select.opened).to.be.true;
      });

      it('should open the overlay on label click', () => {
        select.querySelector('[slot=label]').click();
        expect(select.opened).to.be.true;
      });

      it('should open the overlay on required indicator click', () => {
        select.shadowRoot.querySelector('[part=required-indicator]').click();
        expect(select.opened).to.be.true;
      });

      it('should prevent default for the handled click event', () => {
        const event = fire(select._inputContainer, 'click');
        expect(event.defaultPrevented).to.be.true;
      });

      it('should open the overlay on ArrowUp', () => {
        arrowUp(valueButton);
        expect(select.opened).to.be.true;
      });

      it('should open the overlay on Down', () => {
        arrowDown(valueButton);
        expect(select.opened).to.be.true;
      });

      it('should open the overlay on Space', () => {
        spaceKeyDown(valueButton);
        expect(select.opened).to.be.true;
      });

      it('should open the overlay on Enter', () => {
        enterKeyDown(valueButton);
        expect(select.opened).to.be.true;
      });

      it('should close the overlay on Escape', () => {
        select.opened = true;
        escKeyDown(valueButton);
        expect(select.opened).to.be.false;
      });

      it('should not open the overlay on helper click', () => {
        select.helperText = 'Helper Text';
        select.querySelector('[slot=helper]').click();
        expect(select.opened).to.be.false;
      });

      it('should not open the overlay on error message click', () => {
        select.errorMessage = 'Error Message';
        select.querySelector('[slot=error-message]').click();
        expect(select._overlayElement.opened).to.be.false;
      });

      it('should align the overlay on top left corner by default', async () => {
        // NOTE: avoid setting bottom-aligned because of web-test-runner window size
        select.setAttribute('style', 'position: absolute; top: 10px');
        enterKeyDown(valueButton);
        await nextFrame();
        const overlayRect = select._overlayElement.getBoundingClientRect();
        const inputRect = select._inputContainer.getBoundingClientRect();
        expect(overlayRect.top).to.be.equal(inputRect.top);
        expect(inputRect.left).to.be.equal(inputRect.left);
      });

      it('should align the overlay on top right corner in RTL', async () => {
        select.setAttribute('dir', 'rtl');
        // NOTE: avoid setting bottom-aligned because of web-test-runner window size
        select.setAttribute('style', 'position: absolute; top: 10px');
        enterKeyDown(valueButton);
        await nextFrame();
        const overlayRect = select._overlayElement.getBoundingClientRect();
        const inputRect = select._inputContainer.getBoundingClientRect();
        expect(overlayRect.top).to.be.equal(inputRect.top);
        expect(inputRect.right).to.be.equal(inputRect.right);
      });

      it('should store the text-field width in the custom CSS property on overlay opening', () => {
        valueButton.style.width = '200px';
        select.opened = true;
        const prop = '--vaadin-select-text-field-width';
        const inputRect = select._inputContainer.getBoundingClientRect();
        const value = getComputedStyle(select._overlayElement).getPropertyValue(prop);
        expect(value).to.be.equal(`${inputRect.width}px`);
      });
    });

    describe('overlay opened', () => {
      let menu;

      beforeEach(async () => {
        menu = select._menuElement;
        await nextFrame();
        select.focus();
        enterKeyDown(valueButton);
      });

      it('should close the select on selecting the same value', () => {
        enterKeyDown(valueButton);
        expect(select._overlayElement.opened).to.be.true;
        click(select._items[0]);
        expect(select._overlayElement.opened).to.be.false;
      });

      it('should focus the input on selecting value and closing the overlay', () => {
        const focusedSpy = sinon.spy();
        select.focusElement.focus = focusedSpy;

        click(select._items[1]);
        expect(select.value).to.be.equal(select._items[menu.selected].value);
        expect(select._overlayElement.opened).to.be.false;
        expect(focusedSpy.called).to.be.true;
      });

      it('should restore focused state on closing the overlay if phone', () => {
        select._phone = true;
        click(select._items[1]);
        expect(select.hasAttribute('focused')).to.be.true;
      });

      it('should focus the button on closing the overlay if phone', () => {
        const focusedSpy = sinon.spy();
        select.focusElement.focus = focusedSpy;

        select._phone = true;
        click(select._items[1]);
        expect(focusedSpy.called).to.be.true;
      });

      it('should focus the button before moving the focus to next selectable element', () => {
        const focusedSpy = sinon.spy();
        select.focusElement.focus = focusedSpy;

        tab(menu);
        expect(focusedSpy.called).to.be.true;
      });

      it('should close the overlay when clicking on the overlay', () => {
        select.opened = false;
        select._overlayElement.click();
        expect(select.opened).to.be.false;
      });

      // IOS Safari has incorrect viewport height when navigation bar is
      // visible in landscape orientation. This is workarounded by exposing
      // --vaadin-overlay-viewport-bottom in <vaadin-overlay>.
      it('should support --vaadin-overlay-viewport-bottom CSS property', () => {
        const overlay = select._overlayElement;
        overlay.setAttribute('phone', '');
        overlay.style.setProperty('--vaadin-overlay-viewport-bottom', '50px');
        expect(getComputedStyle(overlay).getPropertyValue('bottom')).to.equal('50px');
      });
    });

    describe('placeholder', () => {
      it('should set placeholder as a value node text content', () => {
        select.value = null;
        select.placeholder = 'Select an item';
        expect(valueButton.textContent).to.equal('Select an item');
      });
    });

    describe('has-value attribute', () => {
      it('should not be set by default', () => {
        expect(select.getAttribute('has-value')).to.be.null;
      });

      it('should set when value is set to not empty', () => {
        select.value = 'v2';
        expect(select.getAttribute('has-value')).to.equal('');
      });

      it('should remove when value is set to empty', () => {
        select.value = 'v2';
        select.value = '';
        expect(select.getAttribute('has-value')).to.be.null;
      });
    });

    describe('disabled', () => {
      it('should disable the button and disable opening if select is disabled', () => {
        select.disabled = true;
        expect(valueButton.disabled).to.be.true;

        enterKeyDown(valueButton);
        expect(select._overlayElement.opened).to.be.false;

        click(valueButton);
        expect(select._overlayElement.opened).to.be.false;
      });
    });

    describe('readonly', () => {
      it('should disable opening if select is readonly', () => {
        select.readonly = true;
        enterKeyDown(valueButton);
        expect(select._overlayElement.opened).to.be.false;

        click(valueButton);
        expect(select._overlayElement.opened).to.be.false;
      });
    });

    describe('focus', () => {
      it('should be focusable', () => {
        select.focus();
        expect(select.hasAttribute('focused')).to.be.true;
      });

      it('should focus the next focusable element when tabbing', () => {
        select.focus();

        // Tabbing does not natively move the focus, hence we only can check that the event is not prevented
        const ev = keyboardEventFor(9, [], 'Tab');
        valueButton.dispatchEvent(ev);
        expect(ev.defaultPrevented).to.be.false;
      });

      it('should focus the previous element when shift tabbing', () => {
        select.focus();

        // Tabbing does not natively move the focus, hence we only can check that the event is not prevented
        const ev = keyboardEventFor(9, ['shift'], 'Tab');
        valueButton.dispatchEvent(ev);
        expect(ev.defaultPrevented).to.be.false;
      });

      it('should focus on required indicator click', () => {
        select.shadowRoot.querySelector('[part="required-indicator"]').click();
        expect(select.hasAttribute('focused')).to.be.true;
      });
    });

    describe('focus when overlay opened', () => {
      it('should keep focused state after opening overlay when focused', () => {
        select.focus();
        select.opened = true;
        expect(select.hasAttribute('focused')).to.be.true;
      });

      it('should not set focused state after opening overlay if not focused', () => {
        select.opened = true;
        expect(select.hasAttribute('focused')).to.be.false;
      });
    });

    describe('validation', () => {
      it('should set invalid to true when is required but there is no value', () => {
        expect(select.invalid).to.be.false;
        select.setAttribute('required', '');

        enterKeyDown(valueButton);
        escKeyDown(valueButton);
        expect(select.invalid).to.be.true;
      });

      it('should not set invalid to true when is required, there is no value, but is disabled', () => {
        expect(select.invalid).to.be.false;
        select.setAttribute('required', '');
        select.setAttribute('disabled', '');

        select.validate();
        expect(select.invalid).to.be.false;
      });

      it('should validate when closing the overlay', () => {
        const spy = sinon.spy();
        select.validate = spy;
        select.opened = true;

        select.opened = false;
        expect(spy.called).to.be.true;
      });

      it('should validate when blurring', () => {
        const spy = sinon.spy();
        select.validate = spy;
        select.blur();

        expect(spy.called).to.be.true;
      });

      it('should validate when setting value', () => {
        const spy = sinon.spy();
        select.validate = spy;
        select.value = 'v2';
        expect(spy.callCount).to.be.equal(1);
        select.value = '';
        expect(spy.callCount).to.be.equal(2);
      });
    });

    describe('initial validation', () => {
      let spy;

      beforeEach(async () => {
        select.required = true;
        spy = sinon.spy();
        select.validate = spy;
        await nextFrame();
      });

      it('should not validate the initial empty value', () => {
        expect(spy.called).to.be.false;
      });
    });

    describe('change event', () => {
      let menu, changeSpy;

      beforeEach(async () => {
        menu = select._menuElement;
        await nextFrame();
        changeSpy = sinon.spy();
        select.addEventListener('change', changeSpy);
      });

      it('should not fire `change` event when programmatically opened and selected changed', () => {
        select.opened = true;
        menu.selected = 1;
        select.opened = false;
        expect(changeSpy.called).to.be.false;
      });

      it('should not fire `change` event when programmatically opened and value changed', () => {
        select.opened = true;
        select.value = 'Option 1';
        expect(changeSpy.called).to.be.false;
      });

      it('should not fire `change` event when committing a value programmatically', () => {
        menu.selected = 1;
        select.value = 'Option 1';
        expect(changeSpy.called).to.be.false;
      });

      it('should fire `change` event when value changes when alphanumeric keys are pressed', () => {
        keyDownChar(valueButton, 'o');
        keyDownChar(valueButton, 'p');
        keyDownChar(valueButton, 't');
        expect(changeSpy.callCount).to.equal(1);
      });

      it('should fire `change` event when value changes by user clicking the item', () => {
        select.opened = true;
        menu.firstElementChild.click();
        expect(changeSpy.callCount).to.equal(1);
      });

      it('should fire `change` event when value changes by user selecting item with keyboard', () => {
        select.opened = true;
        arrowUp(menu);

        const secondOption = menu.querySelector('[value="v2"]');
        enterKeyDown(secondOption);
        enterKeyUp(secondOption);
        expect(changeSpy.callCount).to.equal(1);
      });
    });
  });

  describe('with value', () => {
    let menu;

    beforeEach(async () => {
      select = fixtureSync(`<vaadin-select value="v2"></vaadin-select>`);
      select.renderer = (root) => {
        render(
          html`
            <vaadin-list-box>
              <vaadin-item value="v1">t1</vaadin-item>
              <vaadin-item value="v2" label="o2">t2</vaadin-item>
            </vaadin-list-box>
          `,
          root,
        );
      };
      menu = select._menuElement;
      await nextFrame();
    });

    it('should be possible to set value declaratively', () => {
      expect(menu.selected).to.be.equal(1);
      expect(select._valueButton.textContent.trim()).to.be.equal('o2');
    });
  });

  describe('inside flexbox', () => {
    let container;

    beforeEach(() => {
      container = fixtureSync(`
        <div style="display: flex; flex-direction: column; width: 500px;">
          <vaadin-select></vaadin-select>
        </div>
      `);
    });

    it('should stretch inside a column flex container', () => {
      const select = container.querySelector('vaadin-select');
      expect(window.getComputedStyle(container).width).to.eql('500px');
      expect(parseFloat(window.getComputedStyle(select).width)).to.eql(500);
    });
  });
});
