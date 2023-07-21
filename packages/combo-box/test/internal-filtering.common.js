import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ComboBoxPlaceholder } from '../src/vaadin-combo-box-placeholder.js';
import { flushComboBox, getAllItems, getFocusedItemIndex, makeItems, onceOpened, setInputValue } from './helpers.js';

describe('internal filtering', () => {
  let comboBox;

  describe('value is set before', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box value="foo"></vaadin-combo-box>`);
      await nextRender();
      comboBox.items = ['foo', 'bar'];
      await nextUpdate(comboBox);
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
      await nextUpdate(comboBox);
    });

    it('should open the popup if closed', async () => {
      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);
      expect(comboBox.opened).to.equal(true);
    });

    it('should not open the popup if closed and autoOpenDisabled is true', async () => {
      comboBox.autoOpenDisabled = true;

      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.equal(false);
    });

    it('should filter items when filter is changed regardless of autoOpenDisabled', async () => {
      comboBox.autoOpenDisabled = true;

      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      comboBox.open();
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'foo ');
      await nextUpdate(comboBox);

      expect(comboBox.filteredItems).to.be.empty;
    });

    it('should open the popup when the value of the input field is set to none', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.equal(false);

      setInputValue(comboBox, '');
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.equal(true);
    });

    it('should not open the popup when the value of the input field is set to none and autoOpenDisabled is true', async () => {
      comboBox.autoOpenDisabled = true;
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.equal(false);

      setInputValue(comboBox, '');
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.equal(false);
    });

    it('should not change the value of the combobox', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);

      expect(comboBox.value).to.equal('foo');
    });

    it('should set the combobox value when closing', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);

      comboBox.close();
      await nextUpdate(comboBox);

      expect(comboBox.value).to.equal('bar');
    });

    it('should set the combobox value when closing case insensitively', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'BAR');
      await nextUpdate(comboBox);

      comboBox.close();
      await nextUpdate(comboBox);

      expect(comboBox.value).to.equal('bar');
    });

    it('should be reverted to the combobox value when cancelled', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'b');
      await nextUpdate(comboBox);

      comboBox.cancel();
      await nextUpdate(comboBox);

      expect(comboBox.inputElement.value).to.equal('foo');
    });

    it('should be revert to the combobox value when selecting the same value', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'FOO');
      await nextUpdate(comboBox);

      comboBox.close();
      await nextUpdate(comboBox);

      expect(comboBox.inputElement.value).to.equal('foo');
    });
  });

  describe('focusing items while filtering', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      comboBox.items = ['foo', 'bar', 'baz'];
      await nextUpdate(comboBox);
    });

    it('should focus on an exact match', async () => {
      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);
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

    it('should update focus when opening with filling filter', async () => {
      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should reset focus when opening with filter cleared', async () => {
      comboBox.value = 'bar';
      await nextUpdate(comboBox);

      setInputValue(comboBox, '');
      await nextUpdate(comboBox);

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
      await nextUpdate(comboBox);
      overlay = comboBox.$.overlay;
    });

    it('should filter items using contains', async () => {
      setInputValue(comboBox, 'a');
      await nextUpdate(comboBox);
      expect(comboBox.filteredItems).to.eql(['bar', 'baz']);
    });

    it('should filter out all items with a invalid filter', async () => {
      setInputValue(comboBox, 'qux');
      await nextUpdate(comboBox);
      expect(comboBox.filteredItems).to.be.empty;
    });

    it('should be reset after closing the dropdown', async () => {
      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      comboBox.close();
      await nextUpdate(comboBox);

      expect(comboBox.filter).to.be.empty;
    });

    it('should filter boolean', async () => {
      comboBox.items = [true, false];
      await nextUpdate(comboBox);

      setInputValue(comboBox, 't');
      await nextUpdate(comboBox);

      expect(comboBox.filteredItems).to.eql([true]);
    });

    it('should show initial selection', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      comboBox.open();
      await nextUpdate(comboBox);

      expect(comboBox._scroller.selectedItem).to.eql('foo');
    });

    it('should not lose the selected value', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);

      expect(comboBox._scroller.selectedItem).to.eql('foo');
    });

    it('should ignore case', async () => {
      setInputValue(comboBox, 'FOO');
      await nextUpdate(comboBox);
      expect(comboBox.filteredItems).to.eql(['foo']);
    });

    it('should focus filtered items on match case insensitively', async () => {
      setInputValue(comboBox, 'BA');
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);

      setInputValue(comboBox, 'BAR');
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should reset focus when filter changes', async () => {
      setInputValue(comboBox, 'BAR');
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'BA');
      await nextUpdate(comboBox);

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should not filter with a null filter', async () => {
      setInputValue(comboBox, null);
      await nextUpdate(comboBox);
      expect(comboBox.filteredItems).to.eql(['foo', 'bar', 'baz']);
    });

    it('should not throw an error when items arent set', async () => {
      comboBox.items = null;
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      expect(comboBox.filteredItems).to.be.null;
    });

    it('should close overlay when filtered items length is 0', async () => {
      setInputValue(comboBox, 'THIS IS NOT FOUND');
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.false;
    });

    it('should reset the filter on value change', async () => {
      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);
      expect(comboBox.filter).to.equal('bar');

      comboBox.value = 'foo';
      await nextUpdate(comboBox);
      expect(comboBox.filter).to.be.empty;
    });

    it('should reset the filter on selected item change', async () => {
      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);
      expect(comboBox.filter).to.equal('bar');

      comboBox.selectedItem = 'foo';
      await nextUpdate(comboBox);
      expect(comboBox.filter).to.be.empty;
    });
  });

  describe('setting items when opened', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      comboBox.items = [];
      await nextUpdate(comboBox);
    });

    it('should properly display all items in the selector', async () => {
      comboBox.open();
      await nextUpdate(comboBox);

      comboBox.filteredItems = makeItems(10);
      await nextUpdate(comboBox);

      // FIXME: needed for Lit
      flushComboBox(comboBox);

      expect(getAllItems(comboBox).length).to.equal(10);
    });
  });

  describe('setting placeholder items', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      comboBox.items = [new ComboBoxPlaceholder(), new ComboBoxPlaceholder()];
      await nextUpdate(comboBox);
    });

    it('should have no selected item when value is empty', () => {
      expect(comboBox.selectedItem).to.not.be.instanceOf(ComboBoxPlaceholder);
    });
  });
});
