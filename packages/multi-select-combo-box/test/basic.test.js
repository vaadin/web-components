import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';

describe('basic', () => {
  let comboBox, internal, inputElement;

  const getChipContent = (chip) => chip.shadowRoot.querySelector('[part="label"]').textContent;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
    internal = comboBox.$.comboBox;
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
    it('should propagate inputElement property to combo-box', () => {
      expect(internal.inputElement).to.equal(comboBox.inputElement);
    });

    it('should propagate opened property to input', () => {
      comboBox.opened = true;
      expect(internal.opened).to.be.true;

      comboBox.opened = false;
      expect(internal.opened).to.be.false;
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

    it('should propagate required property to input', () => {
      comboBox.required = true;
      expect(inputElement.required).to.be.true;

      comboBox.required = false;
      expect(inputElement.required).to.be.false;
    });

    it('should propagate disabled property to combo-box', () => {
      expect(internal.disabled).to.be.false;
      comboBox.disabled = true;
      expect(internal.disabled).to.be.true;
    });

    it('should propagate disabled property to input', () => {
      expect(inputElement.disabled).to.be.false;
      comboBox.disabled = true;
      expect(inputElement.disabled).to.be.true;
    });

    it('should propagate readonly property to combo-box', () => {
      expect(internal.readonly).to.be.false;
      comboBox.readonly = true;
      expect(internal.readonly).to.be.true;
    });

    it('should reflect readonly property to attribute', () => {
      comboBox.readonly = true;
      expect(comboBox.hasAttribute('readonly')).to.be.true;
    });

    it('should propagate renderer property to combo-box', () => {
      const renderer = (root, _, model) => (root.textContent = model);
      comboBox.renderer = renderer;
      expect(internal.renderer).to.equal(renderer);
    });
  });

  describe('selecting items', () => {
    beforeEach(() => {
      inputElement.focus();
    });

    it('should update selectedItems when selecting an item on Enter', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should update selectedItems when selecting an item on click', async () => {
      await sendKeys({ down: 'ArrowDown' });
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should update has-value attribute on selected items change', () => {
      expect(comboBox.hasAttribute('has-value')).to.be.false;
      comboBox.selectedItems = ['apple', 'banana'];
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });

    it('should keep has-value attribute after user clears input value', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextFrame();
      await sendKeys({ type: 'o' });
      await sendKeys({ down: 'Backspace' });
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });

    it('should clear last selected item on Backspace if input has no value', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextFrame();

      await sendKeys({ down: 'Backspace' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);

      await sendKeys({ down: 'Backspace' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should not clear last selected item on Backspace if input has value', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextFrame();
      await sendKeys({ type: 'lemon' });

      await sendKeys({ down: 'Backspace' });
      expect(comboBox.selectedItems).to.deep.equal(['apple', 'banana']);
    });

    it('should clear internal combo-box value when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'apple' });
      await sendKeys({ down: 'Enter' });
      expect(internal.value).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should not fire internal value-changed event when selecting an item', async () => {
      const spy = sinon.spy();
      internal.addEventListener('value-changed', spy);
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'apple' });
      await sendKeys({ down: 'Enter' });
      expect(spy.calledOnce).to.be.false;
    });
  });

  describe('pageSize', () => {
    beforeEach(() => {
      sinon.stub(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should propagate pageSize property to combo-box', () => {
      comboBox.pageSize = 25;
      expect(internal.pageSize).to.equal(25);
    });

    it('should log error when incorrect pageSize is set', () => {
      comboBox.pageSize = 0;
      expect(internal.pageSize).to.equal(50);
      expect(console.error.calledOnce).to.be.true;
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
      expect(internal.opened).to.be.false;
    });
  });

  describe('chips', () => {
    let spy;

    beforeEach(async () => {
      spy = sinon.spy();
      comboBox.addEventListener('change', spy);
      comboBox.selectedItems = ['orange'];
      await nextFrame();
      inputElement.focus();
    });

    it('should render chips on updating selectedItems', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextFrame();
      const chips = comboBox.shadowRoot.querySelectorAll('[part="chip"]');
      expect(chips.length).to.equal(2);
      expect(getChipContent(chips[0])).to.equal('apple');
      expect(getChipContent(chips[1])).to.equal('banana');
    });

    it('should re-render chips when selecting the item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      await nextFrame();
      expect(comboBox.shadowRoot.querySelectorAll('[part="chip"]').length).to.equal(2);
    });

    it('should remove chip on remove button click', async () => {
      const chip = comboBox.shadowRoot.querySelector('[part="chip"]');
      chip.shadowRoot.querySelector('[part="remove-button"]').click();
      await nextFrame();
      expect(comboBox.shadowRoot.querySelectorAll('[part="chip"]').length).to.equal(0);
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(async () => {
      spy = sinon.spy();
      comboBox.addEventListener('change', spy);
      comboBox.selectedItems = ['apple'];
      await nextFrame();
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
      const chip = comboBox.shadowRoot.querySelector('[part="chip"]');
      chip.shadowRoot.querySelector('[part="remove-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('allowCustomValues', () => {
    beforeEach(async () => {
      comboBox.allowCustomValues = true;
      comboBox.selectedItems = ['apple'];
      await nextFrame();
      inputElement.focus();
    });

    it('should fire custom-values-set event when entering custom value', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-values-set', spy);
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should clear input element value after entering custom value', async () => {
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(internal.value).to.equal('');
    });

    it('should not add custom value to selectedItems automatically', async () => {
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });
  });

  describe('helper text', () => {
    it('should set helper text content using helperText property', async () => {
      comboBox.helperText = 'foo';
      await nextFrame();
      expect(comboBox.querySelector('[slot="helper"]').textContent).to.eql('foo');
    });

    it('should display the helper text when slotted helper available', async () => {
      const helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.textContent = 'foo';
      comboBox.appendChild(helper);
      await nextFrame();
      expect(comboBox.querySelector('[slot="helper"]').textContent).to.eql('foo');
    });
  });

  describe('theme attribute', () => {
    beforeEach(() => {
      comboBox.setAttribute('theme', 'foo');
    });

    it('should propagate theme attribute to input container', () => {
      const inputField = comboBox.shadowRoot.querySelector('[part="input-field"]');
      expect(inputField.getAttribute('theme')).to.equal('foo');
    });

    it('should propagate theme attribute to combo-box', () => {
      expect(comboBox.$.comboBox.getAttribute('theme')).to.equal('foo');
    });
  });

  describe('required', () => {
    beforeEach(() => {
      comboBox.required = true;
    });

    it('should be invalid when selectedItems is empty', () => {
      expect(comboBox.validate()).to.be.false;
      expect(comboBox.invalid).to.be.true;
    });

    it('should be valid when selectedItems is not empty', () => {
      comboBox.selectedItems = ['apple'];
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });

    it('should focus on required indicator click', () => {
      comboBox.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });
  });
});
