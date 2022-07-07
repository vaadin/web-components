import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';

describe('accessibility', () => {
  let comboBox, inputElement;

  describe('ARIA', () => {
    let scroller, items;

    describe('input', () => {
      describe('required', () => {
        beforeEach(() => {
          comboBox = fixtureSync(`<vaadin-multi-select-combo-box required></vaadin-multi-select-combo-box>`);
          comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
          inputElement = comboBox.inputElement;
        });

        it('should set aria-required attribute on the input when required', () => {
          expect(inputElement.getAttribute('aria-required')).to.equal('true');
        });

        it('should not set required attribute on the input when required', () => {
          expect(inputElement.hasAttribute('required')).to.be.false;
        });

        it('should remove aria-required attribute from the input when not required', () => {
          comboBox.required = false;
          expect(inputElement.hasAttribute('aria-required')).to.be.false;
        });
      });

      describe('placeholder', () => {
        beforeEach(() => {
          comboBox = fixtureSync(`
            <vaadin-multi-select-combo-box
              placeholder="Fruits"
            ></vaadin-multi-select-combo-box>
          `);
          comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
          inputElement = comboBox.inputElement;
        });

        it('should set input placeholder when selected items are changed', () => {
          comboBox.selectedItems = ['Apple', 'Banana'];
          expect(inputElement.getAttribute('placeholder')).to.equal('Apple, Banana');
        });

        it('should restore original placeholder when selected items are removed', () => {
          comboBox.selectedItems = ['Apple', 'Banana'];
          comboBox.selectedItems = [];
          expect(inputElement.getAttribute('placeholder')).to.equal('Fruits');
        });

        it('should keep input placeholder when placeholder property is updated', () => {
          comboBox.selectedItems = ['Apple', 'Banana'];
          comboBox.placeholder = 'Options';
          expect(inputElement.getAttribute('placeholder')).to.equal('Apple, Banana');
        });

        it('should restore updated placeholder when placeholder property is updated', () => {
          comboBox.selectedItems = ['Apple', 'Banana'];
          comboBox.placeholder = 'Options';
          comboBox.selectedItems = [];
          expect(inputElement.getAttribute('placeholder')).to.equal('Options');
        });

        it('should restore empty placeholder when selected items are removed', () => {
          comboBox.placeholder = '';
          comboBox.selectedItems = ['Apple', 'Banana'];
          comboBox.selectedItems = [];
          expect(comboBox.placeholder).to.be.equal('');
          expect(inputElement.hasAttribute('placeholder')).to.be.false;
        });
      });
    });

    describe('items', () => {
      beforeEach(() => {
        comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
        comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
        comboBox.selectedItems = ['Apple', 'Lemon'];
        comboBox.inputElement.click();
        scroller = comboBox.$.comboBox._scroller;
        items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      });

      it('should set aria-multiselectable attribute on the scroller', () => {
        expect(scroller.getAttribute('aria-multiselectable')).to.equal('true');
      });

      it('should set aria-selected on the selected item elements', () => {
        expect(items[0].getAttribute('aria-selected')).to.equal('true');
        expect(items[1].getAttribute('aria-selected')).to.equal('false');
        expect(items[2].getAttribute('aria-selected')).to.equal('true');
        expect(items[3].getAttribute('aria-selected')).to.equal('false');
      });

      it('should update aria-selected when item is selected', () => {
        items[1].click();
        expect(items[1].getAttribute('aria-selected')).to.equal('true');
      });

      it('should update aria-selected when item is deselected', () => {
        items[0].click();
        expect(items[0].getAttribute('aria-selected')).to.equal('false');
      });
    });
  });

  describe('announcements', () => {
    const apple = { id: 1, name: 'Apple' };
    const banana = { id: 2, name: 'Banana' };
    const lemon = { id: 3, name: 'Lemon' };
    const orange = { id: 4, name: 'Orange' };
    const fruits = [apple, banana, lemon, orange];
    let clock, region;

    before(() => {
      region = document.querySelector('[aria-live]');
    });

    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.itemIdPath = 'id';
      comboBox.itemLabelPath = 'name';
      comboBox.items = fruits;
      inputElement = comboBox.inputElement;
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should announce when selecting an item', () => {
      inputElement.click();

      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();

      clock.tick(150);

      expect(region.textContent).to.equal('Apple added to selection 1 items selected');
    });

    it('should announce when deselecting an item', () => {
      comboBox.selectedItems = [apple, banana, lemon];
      inputElement.click();

      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();

      clock.tick(150);

      expect(region.textContent).to.equal('Apple removed from selection 2 items selected');
    });

    it('should announce when clicking clear button', () => {
      comboBox.selectedItems = [apple, banana, lemon];
      comboBox.clearButtonVisible = true;

      comboBox.$.clearButton.click();

      clock.tick(150);

      expect(region.textContent).to.equal('Selection cleared');
    });

    it('should announce when using clear() method', () => {
      comboBox.selectedItems = [apple, banana, lemon];
      comboBox.clearButtonVisible = true;

      comboBox.clear();

      clock.tick(150);

      expect(region.textContent).to.equal('Selection cleared');
    });

    it('should announce when focusing a chip with keyboard', async () => {
      comboBox.selectedItems = [apple];

      inputElement.focus();
      await sendKeys({ press: 'Backspace' });

      clock.tick(150);

      expect(region.textContent).to.equal('Apple focused. Press Backspace to remove');
    });

    it('should announce when removing a chip with keyboard', async () => {
      comboBox.selectedItems = [apple];

      inputElement.focus();
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });

      clock.tick(150);

      expect(region.textContent).to.equal('Apple removed from selection 0 items selected');
    });
  });
});
