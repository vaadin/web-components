import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fire, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getFirstItem } from './helpers.js';

describe('basic', () => {
  let comboBox, inputElement;

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
    await nextRender();
    inputElement = comboBox.inputElement;
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = comboBox.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('properties and attributes', () => {
    it('should propagate owner property to overlay', () => {
      expect(comboBox.$.overlay.owner).to.equal(comboBox);
    });

    it('should propagate opened property to overlay', () => {
      comboBox.opened = true;
      expect(comboBox.$.overlay.opened).to.be.true;

      comboBox.opened = false;
      expect(comboBox.$.overlay.opened).to.be.false;
    });

    it('should reflect opened property to attribute', () => {
      comboBox.opened = true;
      expect(comboBox.hasAttribute('opened')).to.be.true;

      comboBox.opened = false;
      expect(comboBox.hasAttribute('opened')).to.be.false;
    });

    it('should propagate placeholder property to input', () => {
      expect(inputElement.placeholder).to.be.not.ok;
      comboBox.placeholder = 'foo';
      expect(inputElement.placeholder).to.be.equal('foo');
    });

    it('should propagate disabled property to input', () => {
      expect(inputElement.disabled).to.be.false;
      comboBox.disabled = true;
      expect(inputElement.disabled).to.be.true;
    });

    it('should reflect readonly property to attribute', () => {
      comboBox.readonly = true;
      expect(comboBox.hasAttribute('readonly')).to.be.true;
    });

    it('should set itemLabelPath property by default', () => {
      expect(comboBox.itemLabelPath).to.equal('label');
    });

    it('should set itemValuePath property by default', () => {
      expect(comboBox.itemValuePath).to.equal('value');
    });

    it('should reflect loading property to attribute', () => {
      comboBox.loading = true;
      expect(comboBox.hasAttribute('loading')).to.be.true;

      comboBox.loading = false;
      expect(comboBox.hasAttribute('loading')).to.be.false;
    });

    it('should not throw on clearCache() if not attached', () => {
      const combo = document.createElement('vaadin-multi-select-combo-box');
      expect(() => {
        combo.clearCache();
      }).to.not.throw(Error);
    });

    it('should throw when pageSize is set to zero', () => {
      comboBox.pageSize = 123;
      expect(() => {
        comboBox.pageSize = 0;
      }).to.throw('pageSize');
      expect(comboBox.pageSize).to.equal(123);
    });
  });

  describe('clear button', () => {
    let clearButton;

    beforeEach(() => {
      clearButton = comboBox.$.clearButton;
      comboBox.clearButtonVisible = true;
    });

    it('should not show clear button when disabled', () => {
      comboBox.disabled = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should not show clear button when readonly', () => {
      comboBox.readonly = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should not open the dropdown', () => {
      comboBox.selectedItems = ['apple', 'orange'];
      clearButton.click();
      expect(comboBox.opened).to.be.false;
    });

    it('should clear selected items on Esc when clear button is visible', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      inputElement.focus();
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should not clear selected items on Esc when clear button is visible and opened', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      inputElement.focus();
      inputElement.click();
      await oneEvent(comboBox.$.overlay, 'vaadin-overlay-open');
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.deep.equal(['apple', 'orange']);
    });

    it('should not clear selected items on Esc when clear button is not visible', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.clearButtonVisible = false;
      inputElement.focus();
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.deep.equal(['apple', 'orange']);
    });

    it('should not clear selected items on Esc when readonly', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.readonly = true;
      inputElement.focus();
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.deep.equal(['apple', 'orange']);
    });

    it('should clear selected items on clear button click', () => {
      comboBox.selectedItems = ['apple', 'orange'];
      clearButton.click();
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should clear selected items on clear button touchend', () => {
      comboBox.selectedItems = ['apple', 'orange'];
      fire(clearButton, 'touchend');
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should not clear filter on clear button click', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      inputElement.focus();
      await sendKeys({ type: 'app' });

      clearButton.click();
      expect(inputElement.value).to.equal('app');
      expect(comboBox.filter).to.equal('app');
      expect(comboBox.filteredItems).to.deep.equal(['apple']);
    });
  });

  describe('toggle button', () => {
    let toggleButton;

    beforeEach(() => {
      toggleButton = comboBox.$.toggleButton;
    });

    // WebKit returns true for isTouch in the test envirnoment. This test fails when isTouch == true, which is a correct behavior
    (isTouch ? it.skip : it)('should focus input element on toggle button click', () => {
      toggleButton.click();
      expect(comboBox.opened).to.be.true;
      expect(document.activeElement).to.equal(inputElement);
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(async () => {
      spy = sinon.spy();
      comboBox.addEventListener('change', spy);
      comboBox.selectedItems = ['apple'];
      await nextRender();
      inputElement.focus();
    });

    it('should fire change on user arrow input commit', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on clear button click', () => {
      comboBox.clearButtonVisible = true;
      comboBox.$.clearButton.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change when chip is removed', () => {
      const chip = comboBox.querySelector('[slot="chip"]');
      chip.shadowRoot.querySelector('[part="remove-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should stop change event on the native input', () => {
      inputElement.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      expect(spy.called).to.be.false;
    });
  });

  describe('allowCustomValue', () => {
    beforeEach(async () => {
      comboBox.allowCustomValue = true;
      comboBox.selectedItems = ['apple'];
      await nextRender();
      inputElement.focus();
    });

    it('should fire custom-value-set event when entering custom value', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should clear input element value after entering custom value', async () => {
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(inputElement.value).to.equal('');
    });

    it('should clear input element value after clicking matching value', async () => {
      await sendKeys({ type: 'ora' });
      const item = getFirstItem(comboBox);
      item.click();
      expect(inputElement.value).to.equal('');
    });

    it('should clear filter property after clicking matching value', async () => {
      await sendKeys({ type: 'ora' });
      const item = getFirstItem(comboBox);
      item.click();
      expect(comboBox.filter).to.equal('');
    });

    it('should not add custom value to selectedItems automatically', async () => {
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should not fire custom-value-set event when pressing Tab', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Tab' });
      expect(spy.called).to.be.false;
    });

    it('should not fire custom-value-set event on outside click', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      await sendKeys({ type: 'ap' });
      await sendMouse({ type: 'click', position: [200, 200] });
      await resetMouse();
      expect(spy.called).to.be.false;
    });
  });

  describe('helper text', () => {
    it('should set helper text content using helperText property', async () => {
      comboBox.helperText = 'foo';
      await nextRender();
      expect(comboBox.querySelector('[slot="helper"]').textContent).to.eql('foo');
    });

    it('should display the helper text when slotted helper available', async () => {
      const helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.textContent = 'foo';
      comboBox.appendChild(helper);
      await nextRender();
      expect(comboBox.querySelector('[slot="helper"]').textContent).to.eql('foo');
    });
  });

  describe('theme attribute', () => {
    beforeEach(async () => {
      comboBox.setAttribute('theme', 'foo');
      await nextFrame();
    });

    it('should propagate theme attribute to input container', () => {
      const inputField = comboBox.shadowRoot.querySelector('[part="input-field"]');
      expect(inputField.getAttribute('theme')).to.equal('foo');
    });
  });

  describe('required', () => {
    beforeEach(() => {
      comboBox.required = true;
    });

    it('should focus on required indicator click', () => {
      comboBox.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });
  });

  describe('exportparts', () => {
    let overlay;

    beforeEach(() => {
      overlay = comboBox.$.overlay;
    });

    it('should export overlay parts for styling', () => {
      const parts = [...overlay.shadowRoot.querySelectorAll('[part]')]
        .map((el) => el.getAttribute('part'))
        .filter((part) => part !== 'backdrop');
      const exportParts = overlay.getAttribute('exportparts').split(', ');

      parts.forEach((part) => {
        expect(exportParts).to.include(part);
      });
    });
  });
});
