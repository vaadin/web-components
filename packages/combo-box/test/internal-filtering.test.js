import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { getAllItems, makeItems, onceOpened } from './helpers.js';

describe('internal filtering', () => {
  let comboBox, overlay;

  function setInputValue(value) {
    comboBox.inputElement.value = value;
    fire(comboBox.inputElement, 'input');
  }

  function getInputValue() {
    return comboBox.inputElement.value;
  }

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
    overlay = comboBox.$.dropdown.$.overlay;
  });

  describe('setting the input field value', () => {
    it('should open the popup if closed', () => {
      comboBox.close();

      setInputValue('foo');

      expect(comboBox.opened).to.equal(true);
    });

    it('should not open the popup if closed and autoOpenDisabled is true', () => {
      comboBox.autoOpenDisabled = true;
      comboBox.close();

      setInputValue('foo');

      expect(comboBox.opened).to.equal(false);
    });

    it('should filter items when filter is changed regardless of autoOpenDisabled', () => {
      comboBox.autoOpenDisabled = true;
      comboBox.close();

      comboBox.value = 'foo';
      comboBox.open();
      setInputValue('foo ');

      expect(comboBox._getOverlayItems()).to.be.empty;
    });

    it('should open the popup when the value of the input field is set to none', () => {
      comboBox.value = 'foo';
      comboBox.close();
      expect(comboBox.opened).to.equal(false);

      setInputValue('');

      expect(comboBox.opened).to.equal(true);
    });

    it('should not open the popup when the value of the input field is set to none and autoOpenDisabled is true', () => {
      comboBox.autoOpenDisabled = true;
      comboBox.value = 'foo';
      comboBox.close();
      expect(comboBox.opened).to.equal(false);

      setInputValue('');

      expect(comboBox.opened).to.equal(false);
    });

    it('should not change the value of the combobox', () => {
      comboBox.value = 'foo';
      setInputValue('bar');
      expect(comboBox.value).to.equal('foo');
    });

    it('should set the combobox value when closing', () => {
      comboBox.value = 'foo';
      setInputValue('bar');

      comboBox.close();

      expect(comboBox.value).to.equal('bar');
    });

    it('should set the combobox value when closing case insensitively', () => {
      comboBox.value = 'foo';
      setInputValue('BAR');

      comboBox.close();

      expect(comboBox.value).to.equal('bar');
    });

    it('should be reverted to the combobox value when cancelled', () => {
      comboBox.value = 'foo';

      setInputValue('b');
      comboBox.cancel();

      expect(getInputValue()).to.equal('foo');
    });

    it('should be revert to the combobox value when selecting the same value', () => {
      comboBox.value = 'foo';

      setInputValue('FOO');
      comboBox.close();

      expect(getInputValue()).to.equal('foo');
    });
  });

  describe('focusing items while filtering', () => {
    it('should focus on an exact match', () => {
      setInputValue('bar');

      expect(comboBox._focusedIndex).to.eql(0);
    });

    it('should not scroll to selected value when filtering', (done) => {
      comboBox.value = 'baz';

      onceOpened(comboBox).then(() => {
        const spy = sinon.spy(comboBox.$.dropdown, '_scrollIntoView');
        setInputValue('b');

        requestAnimationFrame(() => {
          expect(spy.firstCall.firstArg).to.eql(0);
          done();
        });
      });

      setInputValue('ba');
    });

    it('should update focus when opening with filling filter', () => {
      comboBox.close();

      setInputValue('bar');

      expect(comboBox.opened).to.be.true;
      expect(comboBox._focusedIndex).to.equal(0);
    });

    it('should reset focus when opening with filter cleared', () => {
      comboBox.value = 'bar';
      comboBox.close();

      setInputValue('');

      expect(comboBox.opened).to.be.true;
      expect(comboBox._focusedIndex).to.equal(-1);
    });
  });

  describe('filtering items', () => {
    it('should filter items using contains', () => {
      setInputValue('a');

      expect(comboBox._getOverlayItems()).to.eql(['bar', 'baz']);
    });

    it('should filter out all items with a invalid filter', () => {
      setInputValue('qux');

      expect(comboBox._getOverlayItems()).to.be.empty;
    });

    it('should be reset after closing the dropdown', () => {
      setInputValue('foo');

      comboBox.close();

      expect(comboBox.filter).to.be.empty;
    });

    it('should filter boolean', () => {
      comboBox.items = [true, false];

      setInputValue('t');

      expect(comboBox._getOverlayItems()).to.eql([true]);
    });

    it('should show initial selection', () => {
      comboBox.value = 'foo';
      comboBox.open();

      expect(comboBox.$.dropdown._selectedItem).to.eql('foo');
    });

    it('should not lose the selected value', () => {
      comboBox.value = 'foo';
      setInputValue('bar');

      expect(comboBox.$.dropdown._selectedItem).to.eql('foo');
    });

    it('should ignore case', () => {
      setInputValue('FOO');

      expect(comboBox._getOverlayItems()).to.eql(['foo']);
    });

    it('should focus filtered items on match case insensitively', () => {
      setInputValue('BA');

      expect(comboBox._focusedIndex).to.equal(-1);

      setInputValue('BAR');

      expect(comboBox._focusedIndex).to.equal(0);
    });

    it('should reset focus when filter changes', () => {
      setInputValue('BAR');
      setInputValue('BA');

      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should not filter with a null filter', () => {
      setInputValue(null);

      expect(comboBox._getOverlayItems()).to.eql(['foo', 'bar', 'baz']);
    });

    it('should not throw an error when items arent set', () => {
      comboBox.items = null;

      setInputValue('foo');

      expect(comboBox._getOverlayItems()).to.be.null;
    });

    it('should hide overlay when filtered items length is 0', () => {
      setInputValue('THIS IS NOT FOUND');

      expect(comboBox.opened && overlay.hidden).to.be.true;
    });
  });

  describe('setting items when opened', () => {
    beforeEach(() => {
      comboBox.items = [];
    });

    it('should properly display all items in the selector', () => {
      comboBox.open();
      comboBox.filteredItems = makeItems(10);
      flush();
      expect(getAllItems(comboBox).length).to.equal(10);
    });
  });
});
