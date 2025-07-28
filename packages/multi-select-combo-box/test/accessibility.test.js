import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems, getFirstItem } from './helpers.js';

describe('accessibility', () => {
  let comboBox, inputElement;

  describe('ARIA', () => {
    let scroller, items;

    describe('input', () => {
      describe('required', () => {
        beforeEach(async () => {
          comboBox = fixtureSync(`<vaadin-multi-select-combo-box required></vaadin-multi-select-combo-box>`);
          comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
          await nextRender();
          inputElement = comboBox.inputElement;
        });

        it('should set aria-required attribute on the input when required', () => {
          expect(inputElement.getAttribute('aria-required')).to.equal('true');
        });

        it('should not set required attribute on the input when required', () => {
          expect(inputElement.hasAttribute('required')).to.be.false;
        });

        it('should remove aria-required attribute from the input when not required', async () => {
          comboBox.required = false;
          await nextRender();
          expect(inputElement.hasAttribute('aria-required')).to.be.false;
        });
      });

      describe('placeholder', () => {
        beforeEach(async () => {
          // Do not use `fixtureSync()` helper to test the case where both placeholder
          // and selectedItems are set when the component is initialized, to make sure
          // that the placeholder is correctly restored after clearing selectedItems.
          comboBox = document.createElement('vaadin-multi-select-combo-box');
          comboBox.placeholder = 'Fruits';
          comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
          comboBox.selectedItems = ['Apple', 'Banana'];
          document.body.appendChild(comboBox);
          await nextRender();
          inputElement = comboBox.inputElement;
        });

        afterEach(() => {
          comboBox.remove();
        });

        it('should set input placeholder when selected items are changed', () => {
          expect(inputElement.getAttribute('placeholder')).to.equal('Apple, Banana');
        });

        it('should restore original placeholder when selected items are removed', () => {
          comboBox.selectedItems = [];
          expect(inputElement.getAttribute('placeholder')).to.equal('Fruits');
        });

        it('should keep input placeholder when placeholder property is updated', () => {
          comboBox.placeholder = 'Options';
          expect(inputElement.getAttribute('placeholder')).to.equal('Apple, Banana');
        });

        it('should restore updated placeholder when placeholder property is updated', () => {
          comboBox.placeholder = 'Options';
          comboBox.selectedItems = [];
          expect(inputElement.getAttribute('placeholder')).to.equal('Options');
        });

        it('should restore placeholder when selected items are updated and removed', () => {
          comboBox.selectedItems = ['Apple'];
          comboBox.selectedItems = [];
          expect(inputElement.getAttribute('placeholder')).to.equal('Fruits');
        });

        it('should restore empty placeholder when selected items are removed', () => {
          comboBox.placeholder = '';
          comboBox.selectedItems = [];
          expect(comboBox.placeholder).to.be.equal('');
          expect(inputElement.hasAttribute('placeholder')).to.be.false;
        });

        it('should clear placeholder when set to undefined and selected items are removed', () => {
          comboBox.placeholder = undefined;
          comboBox.selectedItems = [];
          expect(comboBox.placeholder).to.be.undefined;
          expect(inputElement.hasAttribute('placeholder')).to.be.false;
        });
      });
    });

    describe('items', () => {
      beforeEach(async () => {
        comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
        await nextRender();
        comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
        comboBox.selectedItems = ['Apple', 'Lemon'];
        comboBox.inputElement.click();
        scroller = comboBox.$.comboBox._scroller;
        items = getAllItems(comboBox);
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

    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.itemIdPath = 'id';
      comboBox.itemLabelPath = 'name';
      comboBox.items = fruits;
      await nextRender();
      inputElement = comboBox.inputElement;
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should announce when selecting an item', () => {
      inputElement.click();

      const item = getFirstItem(comboBox);
      item.click();

      clock.tick(150);

      expect(region.textContent).to.equal('Apple added to selection 1 items selected');
    });

    it('should announce when deselecting an item', () => {
      comboBox.selectedItems = [apple, banana, lemon];
      inputElement.click();

      const item = getFirstItem(comboBox);
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
