import { expect } from '@vaadin/chai-plugins';
import {
  arrowUp,
  click,
  enterKeyDown,
  enterKeyUp,
  fire,
  fixtureSync,
  keyDownChar,
  mousedown,
  nextRender,
  nextUpdate,
  oneEvent,
  tab,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import './select-test-styles.test.js';
import '../src/vaadin-select.js';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';
import { html, render } from 'lit';

describe('vaadin-select', () => {
  let select, valueButton;

  describe('empty', () => {
    let select;

    beforeEach(async () => {
      select = fixtureSync(`<vaadin-select></vaadin-select>`);
      await nextRender();
    });

    it('should not throw an exception if renderer is not set', async () => {
      select.opened = true;
      await nextUpdate(select);
      select.value = 'foo';
      await nextUpdate(select);
      select.opened = false;
      await nextUpdate(select);
    });

    it('should not throw an exception if renderer does not create list-box', async () => {
      select.renderer = (root) => {
        root.appendChild(document.createElement('div'));
      };
      await nextUpdate(select);
      select.opened = true;
      await nextUpdate(select);
      select.value = 'foo';
      await nextUpdate(select);
      select.opened = false;
      await nextUpdate(select);
    });

    it('should assign menu element if renderer was set after DOM is ready', async () => {
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
      await nextUpdate(select);
      expect(select._menuElement).to.not.be.undefined;
    });

    it('should assign menu element set using innerHTML after opening', async () => {
      const renderer = (root) => {
        root.innerHTML = `
          <vaadin-list-box>
            <vaadin-item>Test<vaadin-item>
          </vaadin-list-box>
        `;
      };
      select.renderer = renderer;
      select.opened = true;
      await nextUpdate(select);
      const listBox = select._menuElement;
      expect(listBox.isConnected).to.be.true;
      expect(listBox.parentNode).to.equal(select._overlayElement);
    });

    it('should have position set to relative', () => {
      expect(getComputedStyle(select).position).to.equal('relative');
    });
  });

  describe('with items', () => {
    beforeEach(async () => {
      select = fixtureSync('<vaadin-select></vaadin-select>');
      await nextRender();
      select.renderer = (root) => {
        render(
          html`
            <vaadin-list-box>
              <vaadin-item>Option 1</vaadin-item>
              <vaadin-item value="v2" label="o2"><span>Option 2</span></vaadin-item>
              <vaadin-item value="">Option 3</vaadin-item>
              <vaadin-item></vaadin-item>
              <vaadin-item label="">Empty</vaadin-item>
              <vaadin-item value="v4" disabled>Disabled</vaadin-item>
              <vaadin-item value="5">A number</vaadin-item>
              <vaadin-item value="false">A boolean</vaadin-item>
              <vaadin-item label="foo"></vaadin-item>
              <vaadin-item><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" /></vaadin-item>
            </vaadin-list-box>
          `,
          root,
        );
      };
      valueButton = select.querySelector('vaadin-select-value-button');
      await nextUpdate(select);
    });

    describe('selection', () => {
      let menu;

      beforeEach(async () => {
        select.opened = true;
        await oneEvent(select._overlayElement, 'vaadin-overlay-open');
        menu = select._menuElement;
        await nextRender();
      });

      it('should select the first item with an empty value by default', () => {
        expect(menu.selected).to.be.equal(2);
      });

      it('should close the overlay when selecting a new item', async () => {
        click(select._items[1]);
        await nextUpdate(select);
        expect(select._overlayElement.opened).to.be.false;
      });

      it('should close the overlay when clicking an already selected item', async () => {
        click(select._items[1]);
        await nextUpdate(select);

        select.opened = true;
        await nextRender();

        click(select._items[1]);
        await nextUpdate(select);
        expect(select._overlayElement.opened).to.be.false;
      });

      it('should preserve the selected attribute when selecting the disabled item', async () => {
        menu.selected = 5;
        await nextUpdate(select);
        const valueElement = valueButton.firstChild;
        expect(valueElement.selected).to.be.true;
        expect(valueElement.disabled).to.be.true;
      });

      it('should not update value if the selected item does not have a value', async () => {
        menu.selected = 2;
        await nextUpdate(select);
        expect(select.value).to.be.empty;
      });

      it('should update value with the value of the selected item', async () => {
        menu.selected = 1;
        await nextUpdate(select);
        expect(select.value).to.be.equal('v2');
      });

      it('should set empty value if an item without `value` is selected', async () => {
        menu.selected = 1;
        await nextUpdate(select);
        menu.selected = 3;
        await nextUpdate(select);
        expect(select.value).to.be.empty;
      });

      it('should update selection slot textContent with the selected item `label` string', async () => {
        menu.selected = 1;
        await nextUpdate(select);
        expect(valueButton.textContent.trim()).to.be.equal('o2');
      });

      it('should wrap the selected item `label` string in selected vaadin item', async () => {
        menu.selected = 1;
        await nextUpdate(select);
        const item = valueButton.firstElementChild;
        expect(item.localName).to.equal('vaadin-select-item');
        expect(item.textContent).to.equal('o2');
        expect(item.selected).to.be.true;
        expect(item.getAttribute('tabindex')).to.be.null;
      });

      it('should update selection slot when value is provided', async () => {
        select.value = 'v2';
        await nextUpdate(select);
        expect(valueButton.textContent.trim()).to.be.equal('o2');
      });

      it('should update overlay selected item when value is provided', async () => {
        select.value = 'v2';
        await nextUpdate(select);
        expect(menu.selected).to.be.equal(1);
      });

      it('should not select any item when value is not found in items', async () => {
        select.value = 'v2';
        await nextUpdate(select);
        select.value = 'foo';
        await nextUpdate(select);
        expect(menu.selected).to.be.undefined;
      });

      it('should select a numeric value if a matching item is found', async () => {
        select.value = 5;
        await nextUpdate(select);
        expect(menu.selected).to.be.equal(6);
      });

      it('should select a boolean value if a matching item is found', async () => {
        select.value = false;
        await nextUpdate(select);
        expect(menu.selected).to.be.equal(7);
      });
    });

    describe('keyboard selection', () => {
      let menu;

      beforeEach(() => {
        menu = select._menuElement;
      });

      describe('default', () => {
        it('should select items when alphanumeric keys are pressed', async () => {
          expect(menu.selected).to.be.equal(2);
          keyDownChar(valueButton, 'o');
          keyDownChar(valueButton, 'p');
          keyDownChar(valueButton, 't');
          await nextUpdate(menu);
          expect(menu.selected).to.be.equal(0);
          keyDownChar(valueButton, 'i');
          keyDownChar(valueButton, 'o');
          keyDownChar(valueButton, 'n');
          keyDownChar(valueButton, '2');
          await nextUpdate(menu);
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
          expect(valueButton.textContent.trim()).to.be.equal(SMALL);
          expect(select.value).to.be.equal('small');

          keyDownChar(valueButton, LARGE.charAt(0));
          expect(menu.selected).to.be.equal(0);
          expect(valueButton.textContent.trim()).to.be.equal(LARGE);
          expect(select.value).to.be.equal('large');
        });
      });
    });

    describe('opening the overlay', () => {
      let overlay;

      beforeEach(() => {
        overlay = select._overlayElement;
      });

      it('should keep synchronized opened properties in overlay and select', async () => {
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(select.opened).to.be.true;
        expect(overlay.opened).to.be.true;

        select.opened = false;
        await nextUpdate(select);
        expect(overlay.opened).to.be.false;
        expect(select.opened).to.be.false;
      });

      it('should focus the menu when opening the overlay', async () => {
        const spy = sinon.spy(select._menuElement, 'focus');
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(spy.calledOnce).to.be.true;
      });

      it('should restore attribute focus-ring if it was initially set before opening', async () => {
        select.setAttribute('focus-ring', '');
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        select.opened = false;
        await nextUpdate(select);
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

      it('should prevent default for the toggle button mousedown', () => {
        const e = new CustomEvent('mousedown', { bubbles: true });
        const spy = sinon.spy(e, 'preventDefault');
        select.shadowRoot.querySelector('[part=toggle-button]').dispatchEvent(e);
        expect(spy.calledOnce).to.be.true;
      });

      it('should focus the value button when opening on toggle button mousedown', () => {
        const spy = sinon.spy(valueButton, 'focus');
        mousedown(select.shadowRoot.querySelector('[part=toggle-button]'));
        expect(spy.calledOnce).to.be.true;
      });

      it('should not focus the value button on toggle button mousedown if opened', async () => {
        const spy = sinon.spy(valueButton, 'focus');
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        mousedown(select.shadowRoot.querySelector('[part=toggle-button]'));
        expect(spy.calledOnce).to.be.false;
      });

      it('should not open the overlay on helper click', async () => {
        select.helperText = 'Helper Text';
        await nextUpdate(select);
        select.querySelector('[slot=helper]').click();
        expect(select.opened).to.be.false;
      });

      it('should not open the overlay on error message click', async () => {
        select.errorMessage = 'Error Message';
        await nextUpdate(select);
        select.querySelector('[slot=error-message]').click();
        expect(overlay.opened).to.be.false;
      });

      it('should align the overlay on top left corner by default', async () => {
        // NOTE: avoid setting bottom-aligned because of web-test-runner window size
        select.setAttribute('style', 'position: absolute; top: 10px');
        enterKeyDown(valueButton);
        await nextUpdate(select);
        const overlayRect = overlay.getBoundingClientRect();
        const inputRect = select._inputContainer.getBoundingClientRect();
        expect(overlayRect.top).to.be.equal(inputRect.top);
        expect(inputRect.left).to.be.equal(inputRect.left);
      });

      it('should align the overlay on top right corner in RTL', async () => {
        select.setAttribute('dir', 'rtl');
        // NOTE: avoid setting bottom-aligned because of web-test-runner window size
        select.setAttribute('style', 'position: absolute; top: 10px');
        enterKeyDown(valueButton);
        await nextUpdate(select);
        const overlayRect = overlay.getBoundingClientRect();
        const inputRect = select._inputContainer.getBoundingClientRect();
        expect(overlayRect.top).to.be.equal(inputRect.top);
        expect(inputRect.right).to.be.equal(inputRect.right);
      });
    });

    describe('overlay opened', () => {
      let menu, overlay;

      beforeEach(async () => {
        menu = select._menuElement;
        overlay = select._overlayElement;
        await nextUpdate(select);
        select.focus();
        enterKeyDown(valueButton);
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should close the select on selecting the same value', async () => {
        expect(overlay.opened).to.be.true;
        click(select._items[0]);
        await nextRender();
        expect(overlay.opened).to.be.false;
      });

      it('should restore focused state on closing the overlay if phone', async () => {
        select._phone = true;
        await nextUpdate(select);
        click(select._items[1]);
        expect(select.hasAttribute('focused')).to.be.true;
      });

      it('should focus the button on closing the overlay if phone', async () => {
        const focusedSpy = sinon.spy(valueButton, 'focus');
        select._phone = true;
        await nextUpdate(select);
        click(select._items[1]);
        await nextUpdate(select);
        expect(focusedSpy.called).to.be.true;
      });

      it('should focus the button before moving the focus to next selectable element', async () => {
        const focusedSpy = sinon.spy(valueButton, 'focus');
        tab(menu);
        await nextUpdate(select);
        expect(focusedSpy.called).to.be.true;
      });

      it('should close the overlay when clicking on the overlay', async () => {
        overlay.click();
        await nextUpdate(select);
        expect(select.opened).to.be.false;
      });

      // IOS Safari has incorrect viewport height when navigation bar is
      // visible in landscape orientation. This is workarounded by exposing
      // --vaadin-overlay-viewport-bottom in <vaadin-overlay>.
      it('should support --vaadin-overlay-viewport-bottom CSS property', () => {
        overlay.setAttribute('phone', '');
        overlay.style.setProperty('--vaadin-overlay-viewport-bottom', '50px');
        expect(getComputedStyle(overlay).getPropertyValue('bottom')).to.equal('50px');
      });
    });

    describe('placeholder', () => {
      beforeEach(() => {
        select.placeholder = 'Select an item';
      });

      it('should set placeholder as a value node text content', async () => {
        select.value = null;
        await nextUpdate(select);
        expect(valueButton.textContent).to.equal('Select an item');
      });

      it('should show placeholder when selecting an item with empty label', async () => {
        select.opened = true;
        await nextRender();
        click(select._items[4]);
        await nextUpdate(select);
        expect(valueButton.textContent).to.equal('Select an item');
      });

      it('should show placeholder when selecting an item with empty text', async () => {
        select.opened = true;
        await nextRender();
        click(select._items[3]);
        await nextUpdate(select);
        expect(valueButton.textContent).to.equal('Select an item');
      });

      it('should not show placeholder for items with label, text content or child elements', async () => {
        const emptyItems = [select._items[3], select._items[4]];
        const nonEmptyItems = select._items.filter((item) => !emptyItems.includes(item));

        for (const item of nonEmptyItems) {
          select.opened = true;
          await nextRender();
          click(item);
          await nextUpdate(select);
          expect(valueButton.textContent).not.to.equal('Select an item');
        }
      });
    });

    describe('has-value attribute', () => {
      it('should not be set by default', () => {
        expect(select.getAttribute('has-value')).to.be.null;
      });

      it('should set when value is set to not empty', async () => {
        select.value = 'v2';
        await nextUpdate(select);
        expect(select.getAttribute('has-value')).to.equal('');
      });

      it('should remove when value is set to empty', async () => {
        select.value = 'v2';
        await nextUpdate(select);
        select.value = '';
        await nextUpdate(select);
        expect(select.getAttribute('has-value')).to.be.null;
      });
    });

    describe('disabled', () => {
      beforeEach(async () => {
        select.disabled = true;
        await nextUpdate(select);
      });

      it('should disable the value button element when disabled', () => {
        expect(valueButton.disabled).to.be.true;
      });

      it('should not open on value button Enter when disabled', () => {
        enterKeyDown(valueButton);
        expect(select.opened).to.be.false;
        expect(select._overlayElement.opened).to.be.false;
      });

      it('should not open on value button click when disabled', () => {
        click(valueButton);
        expect(select.opened).to.be.false;
        expect(select._overlayElement.opened).to.be.false;
      });

      it('should disallow programmatic opening when disabled', async () => {
        select.readonly = true;
        await nextUpdate(select);
        select.opened = true;
        await nextUpdate(select);
        expect(select._overlayElement.opened).to.be.false;
      });
    });

    describe('readonly', () => {
      it('should disable opening if select is readonly', async () => {
        select.readonly = true;
        await nextUpdate(select);
        enterKeyDown(valueButton);
        expect(select._overlayElement.opened).to.be.false;

        click(valueButton);
        expect(select._overlayElement.opened).to.be.false;
      });

      it('should disallow programmatic opening when readonly', async () => {
        select.readonly = true;
        await nextUpdate(select);
        select.opened = true;
        await nextUpdate(select);
        expect(select._overlayElement.opened).to.be.false;
      });
    });

    describe('focus', () => {
      it('should be focusable', () => {
        select.focus();
        expect(select.hasAttribute('focused')).to.be.true;
      });

      it('should focus on required indicator click', () => {
        select.shadowRoot.querySelector('[part="required-indicator"]').click();
        expect(select.hasAttribute('focused')).to.be.true;
      });
    });

    describe('focus when overlay opened', () => {
      it('should keep focused state after opening overlay when focused', async () => {
        select.focus();
        select.opened = true;
        await nextUpdate(select);
        expect(select.hasAttribute('focused')).to.be.true;
      });

      it('should not set focused state after opening overlay if not focused', async () => {
        select.opened = true;
        await nextUpdate(select);
        expect(select.hasAttribute('focused')).to.be.false;
      });
    });

    describe('change event', () => {
      let menu, changeSpy;

      beforeEach(async () => {
        menu = select._menuElement;
        await nextUpdate(select);
        changeSpy = sinon.spy();
        select.addEventListener('change', changeSpy);
      });

      it('should not fire `change` event when programmatically opened and selected changed', async () => {
        select.opened = true;
        await nextUpdate(select);
        menu.selected = 1;
        await nextUpdate(menu);
        select.opened = false;
        await nextUpdate(select);
        expect(changeSpy.called).to.be.false;
      });

      it('should not fire `change` event when programmatically opened and value changed', async () => {
        select.opened = true;
        await nextUpdate(select);
        select.value = 'Option 1';
        await nextUpdate(select);
        expect(changeSpy.called).to.be.false;
      });

      it('should not fire `change` event when committing a value programmatically', async () => {
        menu.selected = 1;
        await nextUpdate(select);
        select.value = 'Option 1';
        await nextUpdate(select);
        expect(changeSpy.called).to.be.false;
      });

      it('should fire `change` event when value changes when alphanumeric keys are pressed', async () => {
        keyDownChar(valueButton, 'o');
        keyDownChar(valueButton, 'p');
        keyDownChar(valueButton, 't');
        await nextUpdate(select);
        expect(changeSpy.callCount).to.equal(1);
      });

      it('should fire `change` event when value changes by user clicking the item', async () => {
        select.opened = true;
        await nextUpdate(select);
        menu.firstElementChild.click();
        await nextUpdate(select);
        expect(changeSpy.callCount).to.equal(1);
      });

      it('should fire `change` event when value changes by user clicking the element inside item', async () => {
        select.opened = true;
        await nextUpdate(select);
        const span = menu.children[1].firstElementChild;
        span.click();
        await nextUpdate(select);
        expect(changeSpy).to.be.calledOnce;
      });

      it('should fire `change` event when value changes by user selecting item with keyboard', async () => {
        select.opened = true;
        await nextUpdate(select);
        arrowUp(menu);

        const secondOption = menu.querySelector('[value="v2"]');
        enterKeyDown(secondOption);
        enterKeyUp(secondOption);
        await nextUpdate(select);
        expect(changeSpy.callCount).to.equal(1);
      });
    });

    describe('no-vertical-overlap', () => {
      it('should overlap the input by default', async () => {
        select.opened = true;
        await nextUpdate(select);
        const overlayRect = select._overlayElement.getBoundingClientRect();
        const inputRect = select._inputContainer.getBoundingClientRect();
        expect(overlayRect.top).to.be.equal(inputRect.top);
      });

      it('should toggle the `no-vertical-overlap` attribute in the overlay element', async () => {
        select.noVerticalOverlap = true;
        await nextUpdate(select);
        expect(select._overlayElement.hasAttribute('no-vertical-overlap')).to.be.true;

        select.noVerticalOverlap = false;
        await nextUpdate(select);
        expect(select._overlayElement.hasAttribute('no-vertical-overlap')).to.be.false;
      });

      it('should not overlap the input when overlay is opened', async () => {
        select.noVerticalOverlap = true;
        select.opened = true;
        await nextUpdate(select);
        const overlayRect = select._overlayElement.getBoundingClientRect();
        const inputRect = select._inputContainer.getBoundingClientRect();
        expect(overlayRect.top).to.be.equal(inputRect.bottom);
      });
    });

    describe('overlay width', () => {
      let overlay;

      beforeEach(() => {
        overlay = select._overlayElement;
        select.style.setProperty('--vaadin-select-overlay-width', '400px');
      });

      it('should forward overlay width custom CSS property to the overlay when opened', async () => {
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        const prop = '--vaadin-select-overlay-width';
        const value = getComputedStyle(overlay).getPropertyValue(prop);
        expect(value).to.be.equal('400px');
      });

      it('should set overlay part width based on the overlay width custom CSS property', async () => {
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(overlay.$.overlay.getBoundingClientRect().width).to.equal(400);
      });

      it('should not set overlay part width based on the custom CSS property when phone', async () => {
        select._phone = true;
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(overlay.$.overlay.getBoundingClientRect().width).to.not.equal(400);
      });

      it('should store the select width in the custom CSS property on overlay opening', async () => {
        select.style.width = '200px';
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        const prop = '--vaadin-select-text-field-width';
        const inputRect = select._inputContainer.getBoundingClientRect();
        const value = getComputedStyle(overlay).getPropertyValue(prop);
        expect(value).to.be.equal(`${inputRect.width}px`);
      });

      it('should fallback to the select field width when custom CSS property is unset', async () => {
        select.style.width = '200px';
        select.style.removeProperty('--vaadin-select-overlay-width');

        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');

        expect(overlay.$.overlay.getBoundingClientRect().width).to.equal(200);
      });
    });
  });

  describe('with value', () => {
    let menu, valueButton;

    beforeEach(async () => {
      select = fixtureSync(`<vaadin-select value="v2"></vaadin-select>`);
      await nextRender();
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
      valueButton = select.querySelector('vaadin-select-value-button');
      await nextUpdate(select);
      menu = select._menuElement;
    });

    it('should be possible to set value declaratively', () => {
      expect(menu.selected).to.be.equal(1);
      expect(valueButton.textContent.trim()).to.be.equal('o2');
    });
  });

  describe('inside flexbox', () => {
    let container;

    beforeEach(async () => {
      container = fixtureSync(`
        <div style="display: flex; flex-direction: column; width: 500px;">
          <vaadin-select></vaadin-select>
        </div>
      `);
      await nextRender();
    });

    it('should stretch inside a column flex container', () => {
      const select = container.querySelector('vaadin-select');
      expect(window.getComputedStyle(container).width).to.eql('500px');
      expect(parseFloat(window.getComputedStyle(select).width)).to.eql(500);
    });
  });

  describe('pre-opened', () => {
    beforeEach(() => {
      select = document.createElement('vaadin-select');
      select.items = [{ label: 'Option 1', value: 'value-1' }];
    });

    afterEach(() => {
      select.remove();
    });

    it('should not close overlay when opened set before adding to DOM', async () => {
      select.opened = true;
      document.body.appendChild(select);
      await nextUpdate(select);
      expect(select._overlayElement.opened).to.be.true;
    });
  });
});
