import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';

describe('accessibility', () => {
  let comboBox, inputElement;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
    inputElement = comboBox.inputElement;
  });

  describe('ARIA', () => {
    let scroller, items;

    describe('input', () => {
      describe('required', () => {
        beforeEach(() => {
          comboBox.required = true;
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
          comboBox.placeholder = 'Fruits';
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
      });
    });

    describe('items', () => {
      beforeEach(() => {
        comboBox.selectedItems = ['Apple', 'Lemon'];
        inputElement.click();
        scroller = comboBox.$.comboBox.$.dropdown._scroller;
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
    let clock, region;

    before(() => {
      region = document.querySelector('[aria-live]');
    });

    beforeEach(() => {
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
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon'];
      inputElement.click();

      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();

      clock.tick(150);

      expect(region.textContent).to.equal('Apple removed from selection 2 items selected');
    });

    it('should announce when clicking clear button', () => {
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon'];
      comboBox.clearButtonVisible = true;

      comboBox.$.clearButton.click();

      clock.tick(150);

      expect(region.textContent).to.equal('Selection cleared');
    });
  });
});
