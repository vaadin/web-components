import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';

describe('basic', () => {
  let comboBox, internal, inputElement;

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

    it('should not un-select item when typing its value manually', async () => {
      comboBox.selectedItems = ['orange'];
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'orange' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['orange']);
    });

    it('should update has-value attribute on selected items change', () => {
      expect(comboBox.hasAttribute('has-value')).to.be.false;
      comboBox.selectedItems = ['apple', 'banana'];
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });

    it('should keep has-value attribute after user clears input value', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      await sendKeys({ type: 'o' });
      await sendKeys({ down: 'Backspace' });
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });

    it('should clear last selected item on Backspace if input has no value', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();

      await sendKeys({ down: 'Backspace' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);

      await sendKeys({ down: 'Backspace' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should not clear last selected item on Backspace if input has value', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      await sendKeys({ type: 'lemon' });

      await sendKeys({ down: 'Backspace' });
      expect(comboBox.selectedItems).to.deep.equal(['apple', 'banana']);
    });

    it('should not clear last selected item on Backspace when readonly', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      comboBox.readonly = true;

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

    it('should keep overlay open when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(internal.opened).to.be.true;
    });

    it('should keep overlay focused index when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      expect(item.hasAttribute('focused')).to.be.true;
    });

    it('should keep overlay focused index when entering and committing', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'banana' });
      await sendKeys({ down: 'Enter' });
      const item = document.querySelectorAll('vaadin-multi-select-combo-box-item')[1];
      expect(item.hasAttribute('focused')).to.be.true;
    });

    it('should not unselect previously committed item on focusout', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      await sendKeys({ down: 'Tab' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
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

    it('should clear selected items on Esc when clear button is visible', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      inputElement.focus();
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should not clear selected items on Esc when clear button is not visible', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.clearButtonVisible = false;
      inputElement.focus();
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.deep.equal(['apple', 'orange']);
    });
  });

  describe('chips', () => {
    const getChips = (combo) => combo.shadowRoot.querySelectorAll('[part~="chip"]');

    const getChipContent = (chip) => chip.shadowRoot.querySelector('[part="label"]').textContent;

    const nextResize = (target) => {
      return new Promise((resolve) => {
        new ResizeObserver(() => setTimeout(resolve)).observe(target);
      });
    };

    beforeEach(async () => {
      comboBox.selectedItems = ['orange'];
      await nextRender();
    });

    describe('programmatic update', () => {
      beforeEach(async () => {
        comboBox.style.width = '100%';
        await nextResize(comboBox);
      });

      it('should re-render chips when selectedItems is updated', async () => {
        comboBox.selectedItems = ['apple', 'banana'];
        await nextRender();
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(3);
        expect(getChipContent(chips[1])).to.equal('apple');
        expect(getChipContent(chips[2])).to.equal('banana');
      });

      it('should re-render chips when selectedItems is cleared', async () => {
        comboBox.selectedItems = [];
        await nextRender();
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(1);
      });
    });

    describe('manual selection', () => {
      beforeEach(async () => {
        comboBox.style.width = '100%';
        await nextResize(comboBox);
        inputElement.focus();
      });

      it('should re-render chips when selecting the item', async () => {
        await sendKeys({ down: 'ArrowDown' });
        await sendKeys({ down: 'ArrowDown' });
        await sendKeys({ down: 'Enter' });
        await nextRender();
        expect(getChips(comboBox).length).to.equal(3);
      });

      it('should re-render chips when un-selecting the item', async () => {
        await sendKeys({ down: 'ArrowDown' });
        await sendKeys({ down: 'ArrowUp' });
        await sendKeys({ down: 'Enter' });
        await nextRender();
        expect(getChips(comboBox).length).to.equal(1);
      });

      it('should remove chip on remove button click', async () => {
        const chip = getChips(comboBox)[1];
        chip.shadowRoot.querySelector('[part="remove-button"]').click();
        await nextRender();
        expect(getChips(comboBox).length).to.equal(1);
      });
    });

    describe('disabled', () => {
      beforeEach(async () => {
        comboBox.style.width = '250px';
        await nextResize(comboBox);
        comboBox.selectedItems = ['apple', 'banana'];
        await nextRender();
        comboBox.disabled = true;
      });

      it('should hide overflow chip if width permits when disabled', () => {
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(3);
        expect(chips[0].hasAttribute('hidden')).to.be.true;
      });

      it('should regenerate chips when disabled is set to false', () => {
        comboBox.disabled = false;
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(2);
        expect(chips[0].hasAttribute('hidden')).to.be.false;
      });

      it('should set disabled attribute on all chips when disabled', () => {
        const chips = getChips(comboBox);
        expect(chips[0].hasAttribute('disabled')).to.be.true;
        expect(chips[1].hasAttribute('disabled')).to.be.true;
        expect(chips[2].hasAttribute('disabled')).to.be.true;
      });

      it('should remove disabled attribute from chips when re-enabled', () => {
        comboBox.disabled = false;
        const chips = getChips(comboBox);
        expect(chips[0].hasAttribute('disabled')).to.be.false;
        expect(chips[1].hasAttribute('disabled')).to.be.false;
      });
    });

    describe('overflow', () => {
      let overflow;

      beforeEach(async () => {
        comboBox.style.width = '250px';
        await nextResize(comboBox);
        overflow = getChips(comboBox)[0];
      });

      it('should render chip for each item, plus overflow chip', () => {
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(2);
        expect(getChipContent(chips[1])).to.equal('orange');
      });

      it('should set title attribute on chips matching their label', () => {
        const chips = getChips(comboBox);
        expect(chips[1].getAttribute('title')).to.equal('orange');
      });

      it('should hide overflow chip when all chips are visible', () => {
        expect(overflow.hasAttribute('hidden')).to.be.true;
      });

      it('should show overflow chip when all chips no longer fit', async () => {
        comboBox.selectedItems = ['apple', 'banana'];
        await nextRender();
        expect(getChips(comboBox).length).to.equal(2);
        expect(overflow.hasAttribute('hidden')).to.be.false;
      });

      it('should set overflow chip label as not fitting chips count', async () => {
        comboBox.selectedItems = ['apple', 'banana', 'orange'];
        await nextRender();
        expect(overflow.label).to.equal(2);
      });

      it('should set overflow chip title as not fitting chips labels', async () => {
        comboBox.selectedItems = ['apple', 'banana', 'orange'];
        await nextRender();
        const title = overflow.getAttribute('title');
        expect(title).to.equal('apple, banana');
      });

      it('should set overflow chip part if only one chip does not fit', async () => {
        comboBox.selectedItems = ['apple', 'banana'];
        await nextRender();
        const part = overflow.getAttribute('part');
        expect(part).to.contain('overflow-one');
      });

      it('should set overflow chip part if two chips do not fit', async () => {
        comboBox.selectedItems = ['apple', 'banana', 'orange'];
        await nextRender();
        const part = overflow.getAttribute('part');
        expect(part).to.contain('overflow-two');
      });

      describe('resize', () => {
        beforeEach(async () => {
          comboBox.style.width = '250px';
          await nextResize(comboBox);
          comboBox.selectedItems = ['apple', 'banana', 'orange'];
          await nextRender();
        });

        it('should update overflow chip on resize when width changes', async () => {
          expect(overflow.hasAttribute('hidden')).to.be.false;

          comboBox.style.width = '350px';
          await nextResize(comboBox);
          expect(overflow.hasAttribute('hidden')).to.be.true;

          comboBox.style.width = 'auto';
          await nextResize(comboBox);
          expect(overflow.hasAttribute('hidden')).to.be.false;
        });

        it('should update overflow chip on clear button state change', async () => {
          comboBox.style.width = '350px';
          await nextResize(comboBox);

          comboBox.clearButtonVisible = true;
          await nextRender();
          expect(overflow.hasAttribute('hidden')).to.be.false;

          comboBox.clearButtonVisible = false;
          await nextRender();
          expect(overflow.hasAttribute('hidden')).to.be.true;
        });
      });
    });

    describe('readonly', () => {
      beforeEach(async () => {
        comboBox.style.width = '250px';
        await nextResize(comboBox);
        comboBox.selectedItems = ['apple', 'banana'];
        await nextRender();
        comboBox.readonly = true;
      });

      it('should hide overflow chip if width permits when readonly', () => {
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(3);
        expect(chips[0].hasAttribute('hidden')).to.be.true;
      });

      it('should regenerate chips when readonly is set to false', () => {
        comboBox.readonly = false;
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(2);
        expect(chips[0].hasAttribute('hidden')).to.be.false;
      });

      it('should set readonly attribute on all chips when readonly', () => {
        const chips = getChips(comboBox);
        expect(chips[0].hasAttribute('readonly')).to.be.true;
        expect(chips[1].hasAttribute('readonly')).to.be.true;
        expect(chips[2].hasAttribute('readonly')).to.be.true;
      });

      it('should remove readonly attribute from chips when not readonly', () => {
        comboBox.readonly = false;
        const chips = getChips(comboBox);
        expect(chips[0].hasAttribute('readonly')).to.be.false;
        expect(chips[1].hasAttribute('readonly')).to.be.false;
      });

      it('should set readonly attribute on added chips while readonly', () => {
        comboBox.selectedItems = ['lemon', 'orange'];
        const chips = getChips(comboBox);
        expect(chips[0].hasAttribute('readonly')).to.be.true;
        expect(chips[1].hasAttribute('readonly')).to.be.true;
        expect(chips[2].hasAttribute('readonly')).to.be.true;
      });
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
      const chip = comboBox.shadowRoot.querySelector('[part="chip"]');
      chip.shadowRoot.querySelector('[part="remove-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('allowCustomValues', () => {
    beforeEach(async () => {
      comboBox.allowCustomValues = true;
      comboBox.selectedItems = ['apple'];
      await nextRender();
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
      expect(inputElement.value).to.equal('');
    });

    it('should clear input element value after clicking matching value', async () => {
      await sendKeys({ type: 'ora' });
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();
      expect(internal.value).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should clear filter property after clicking matching value', async () => {
      await sendKeys({ type: 'ora' });
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();
      expect(comboBox.filter).to.equal('');
    });

    it('should not add custom value to selectedItems automatically', async () => {
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });
  });

  describe('readonly', () => {
    beforeEach(() => {
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.readonly = true;
      inputElement.focus();
    });

    it('should open the dropdown on input click when readonly', () => {
      inputElement.click();
      expect(internal.opened).to.be.true;
    });

    it('should open the dropdown on Arrow Down when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      expect(internal.opened).to.be.true;
    });

    it('should open the dropdown on Arrow Up when readonly', async () => {
      await sendKeys({ down: 'ArrowUp' });
      expect(internal.opened).to.be.true;
    });

    it('should close the dropdown on Tab when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Tab' });
      expect(internal.opened).to.be.false;
    });

    it('should close the dropdown on Enter when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(internal.opened).to.be.false;
    });

    it('should close the dropdown on Esc when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Escape' });
      expect(internal.opened).to.be.false;
    });

    it('should not pre-fill focused item label on Arrow Down', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      expect(inputElement.value).to.equal('');
    });

    it('should not pre-fill focused item label on Arrow Up', async () => {
      await sendKeys({ down: 'ArrowUp' });
      await sendKeys({ down: 'ArrowUp' });
      expect(inputElement.value).to.equal('');
    });

    it('should not set item focus-ring attribute on Arrow Down', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[0].hasAttribute('focus-ring')).to.be.false;
    });

    it('should not set item focus-ring attribute on Arrow Up', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[1].hasAttribute('focus-ring')).to.be.false;
    });

    it('should only render selected items in the dropdown', () => {
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });

    it('should not set selected attribute on the dropdown items', () => {
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[0].hasAttribute('selected')).to.be.false;
      expect(items[1].hasAttribute('selected')).to.be.false;
    });

    it('should set readonly attribute on the dropdown items', () => {
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[0].hasAttribute('readonly')).to.be.true;
      expect(items[1].hasAttribute('readonly')).to.be.true;
    });

    it('should not un-select item on click when readonly', () => {
      inputElement.click();
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();
      expect(comboBox.selectedItems.length).to.equal(2);
    });

    it('should not open the dropdown if selected items are empty', () => {
      comboBox.selectedItems = [];
      inputElement.click();
      expect(internal.opened).to.be.false;
    });

    it('should not open the dropdown if readonly is set after clearing', () => {
      comboBox.readonly = false;
      comboBox.selectedItems = [];

      comboBox.readonly = true;
      inputElement.click();
      expect(internal.opened).to.be.false;
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

    it('should not be invalid when empty and readonly', () => {
      comboBox.readonly = true;
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });
  });
});
