import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import { ComboBoxPlaceholder } from '../src/vaadin-combo-box-placeholder.js';
import { getAllItems, getFocusedItemIndex, getViewportItems, makeItems, onceOpened, setInputValue } from './helpers.js';

describe('internal filtering', () => {
  let comboBox;

  describe('value is set before', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box value="foo"></vaadin-combo-box>`);
      await nextRender();
      comboBox.items = ['foo', 'bar'];
    });

    it('should have the selected item', () => {
      expect(comboBox.selectedItem).to.equal('foo');
    });

    it('should have the input value', () => {
      expect(comboBox.inputElement.value).to.equal('foo');
    });
  });

  describe('setting the input field value', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      comboBox.items = ['foo', 'bar', 'baz'];
    });

    it('should filter items when filter is changed', () => {
      comboBox.value = 'foo';
      comboBox.open();
      setInputValue(comboBox, 'foo ');

      expect(comboBox.filteredItems).to.be.empty;
    });

    it('should not change the value of the combobox', () => {
      comboBox.value = 'foo';
      setInputValue(comboBox, 'bar');
      expect(comboBox.value).to.equal('foo');
    });

    it('should set the combobox value when closing', () => {
      comboBox.value = 'foo';
      setInputValue(comboBox, 'bar');

      outsideClick();

      expect(comboBox.value).to.equal('bar');
    });

    it('should set the combobox value when closing case insensitively', () => {
      comboBox.value = 'foo';
      setInputValue(comboBox, 'BAR');

      outsideClick();

      expect(comboBox.value).to.equal('bar');
    });

    it('should be reverted to the combobox value when cancelled', () => {
      comboBox.value = 'foo';

      setInputValue(comboBox, 'b');
      comboBox.cancel();

      expect(comboBox.inputElement.value).to.equal('foo');
    });

    it('should be revert to the combobox value when selecting the same value', () => {
      comboBox.value = 'foo';

      setInputValue(comboBox, 'FOO');

      outsideClick();

      expect(comboBox.inputElement.value).to.equal('foo');
    });
  });

  describe('focusing items while filtering', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      comboBox.items = ['foo', 'bar', 'baz'];
    });

    it('should focus on an exact match', () => {
      setInputValue(comboBox, 'bar');

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should not scroll to selected value when filtering', (done) => {
      comboBox.value = 'baz';

      onceOpened(comboBox).then(() => {
        const spy = sinon.spy(comboBox, '_scrollIntoView');
        setInputValue(comboBox, 'b');

        requestAnimationFrame(() => {
          expect(spy.firstCall.firstArg).to.eql(0);
          done();
        });
      });

      setInputValue(comboBox, 'ba');
    });

    it('should update focus when opening with filling filter', () => {
      comboBox.close();

      setInputValue(comboBox, 'bar');

      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should reset focus when opening with filter cleared', () => {
      comboBox.value = 'bar';
      comboBox.close();

      setInputValue(comboBox, '');

      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });
  });

  describe('filtering items', () => {
    let overlay;

    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      comboBox.items = ['foo', 'bar', 'baz'];
      overlay = comboBox.$.overlay;
    });

    it('should filter items using contains', () => {
      setInputValue(comboBox, 'a');

      expect(comboBox.filteredItems).to.eql(['bar', 'baz']);
    });

    it('should filter out all items with a invalid filter', () => {
      setInputValue(comboBox, 'qux');

      expect(comboBox.filteredItems).to.be.empty;
    });

    it('should be reset after closing the dropdown', () => {
      setInputValue(comboBox, 'foo');

      outsideClick();

      expect(comboBox.filter).to.be.empty;
    });

    it('should filter boolean', () => {
      comboBox.items = [true, false];

      setInputValue(comboBox, 't');

      expect(comboBox.filteredItems).to.eql([true]);
    });

    it('should show initial selection', () => {
      comboBox.value = 'foo';
      comboBox.open();

      expect(comboBox._scroller.selectedItem).to.eql('foo');
    });

    it('should not lose the selected value', () => {
      comboBox.value = 'foo';
      setInputValue(comboBox, 'bar');

      expect(comboBox._scroller.selectedItem).to.eql('foo');
    });

    it('should ignore case', () => {
      setInputValue(comboBox, 'FOO');

      expect(comboBox.filteredItems).to.eql(['foo']);
    });

    it('should focus filtered items on match case insensitively', () => {
      setInputValue(comboBox, 'BA');

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);

      setInputValue(comboBox, 'BAR');

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should reset focus when filter changes', () => {
      setInputValue(comboBox, 'BAR');
      setInputValue(comboBox, 'BA');

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should not filter with a null filter', () => {
      setInputValue(comboBox, null);

      expect(comboBox.filteredItems).to.eql(['foo', 'bar', 'baz']);
    });

    it('should not throw an error when items arent set', () => {
      comboBox.items = null;

      setInputValue(comboBox, 'foo');

      expect(comboBox.filteredItems).to.be.null;
    });

    it('should close overlay when filtered items length is 0', () => {
      setInputValue(comboBox, 'THIS IS NOT FOUND');

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.false;
    });

    it('should reset the filter on value change', () => {
      setInputValue(comboBox, 'bar');
      expect(comboBox.filter).to.equal('bar');
      comboBox.value = 'foo';
      expect(comboBox.filter).to.be.empty;
    });

    it('should reset the filter on selected item change', () => {
      setInputValue(comboBox, 'bar');
      expect(comboBox.filter).to.equal('bar');
      comboBox.selectedItem = 'foo';
      expect(comboBox.filter).to.be.empty;
    });
  });

  describe('filtering with many items', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.items = makeItems(1000);
      await nextRender();
    });

    it('should reset scroll position to 0 on filter change', () => {
      comboBox.opened = true;
      comboBox._scrollIntoView(500);
      comboBox.filter = '1';
      expect(getViewportItems(comboBox)[0].index).to.equal(0);
    });
  });

  describe('setting items when opened', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      comboBox.items = [];
    });

    it('should properly display all items in the selector', () => {
      comboBox.open();
      comboBox.filteredItems = makeItems(10);
      expect(getAllItems(comboBox).length).to.equal(10);
    });
  });

  describe('setting placeholder items', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      comboBox.items = [new ComboBoxPlaceholder(), new ComboBoxPlaceholder()];
    });

    it('should have no selected item when value is empty', () => {
      expect(comboBox.selectedItem).to.not.be.instanceOf(ComboBoxPlaceholder);
    });
  });
});
