import { expect } from '@vaadin/chai-plugins';
import { aTimeout, enter, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { getAllItems, getFocusedItemIndex, setInputValue } from './helpers.js';

describe('external filtering', () => {
  let comboBox, overlay;

  describe('basic', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      await nextRender();
      overlay = comboBox.$.overlay;
    });

    it('should set items to filteredItems', () => {
      comboBox.items = ['foo'];

      expect(comboBox.filteredItems).to.eql(['foo']);
    });

    it('should not filter items', () => {
      setInputValue(comboBox, 'foo');

      expect(comboBox._scroller.items).to.eql(['foo', 'bar', 'baz']);
    });

    it('should remove focus while loading', async () => {
      setInputValue(comboBox, 'foo');
      comboBox.filteredItems = ['foo'];
      expect(getFocusedItemIndex(comboBox)).to.equal(0);

      comboBox.loading = true;
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should focus on filtered value', () => {
      comboBox.filteredItems = ['foo'];
      setInputValue(comboBox, 'bar');
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);

      comboBox.filteredItems = ['foo', 'bar', 'baz'];

      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should update focus when opening with filling filter', () => {
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      expect(comboBox.opened).to.be.false;

      setInputValue(comboBox, 'bar');

      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not hide the overlay while loading', () => {
      setInputValue(comboBox, 'foo');

      comboBox.loading = true;

      expect(comboBox.opened).to.be.true;
      expect(comboBox.$.overlay.hasAttribute('hidden')).to.be.false;
      expect(comboBox._scroller.hidden).to.be.false;
    });

    it('should refresh items after reassignment', () => {
      comboBox.opened = true;
      comboBox.filteredItems = ['foo'];

      expect(comboBox._scroller.items).to.eql(['foo']);
    });

    it('should toggle loading attributes to host and overlay', () => {
      comboBox.loading = true;
      expect(comboBox.hasAttribute('loading')).to.be.true;
      expect(overlay.hasAttribute('loading')).to.be.true;

      comboBox.loading = false;
      expect(comboBox.hasAttribute('loading')).to.be.false;
      expect(overlay.hasAttribute('loading')).to.be.false;
    });
  });

  describe('requestContentUpdate', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.filteredItems = ['Item 0'];
      await nextRender();
      comboBox.opened = true;
    });

    it('should re-render items after modifying existing filteredItems through mutation', () => {
      comboBox.filteredItems[0] = 'New Item';
      comboBox.requestContentUpdate();
      expect(getAllItems(comboBox).map((item) => item.textContent)).to.eql(['New Item']);
    });

    it('should re-render items after adding more filteredItems through mutation', () => {
      comboBox.filteredItems.push('Item 1');
      comboBox.requestContentUpdate();
      expect(getAllItems(comboBox).map((item) => item.textContent)).to.eql(['Item 0', 'Item 1']);
    });
  });

  describe('filtered items attribute', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box filtered-items='["a", "b", "c"]' value='b'></vaadin-combo-box>`);
      await nextRender();
    });

    it('should not throw when passing filteredItems and value as attributes', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });
  });

  describe('value is set after', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
      await nextRender();
      comboBox.filteredItems = ['foo', 'bar'];
      comboBox.value = 'foo';
    });

    it('should not have the value item focused when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should have the filtered item focused when opened on changing the filter', () => {
      setInputValue(comboBox, 'bar');
      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should commit the filtered value', () => {
      setInputValue(comboBox, 'bar');
      enter(comboBox.inputElement);
      expect(comboBox.value).to.equal('bar');
    });

    it('should have no item focused when opened on clearing the filter', () => {
      setInputValue(comboBox, '');
      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should commit the empty value', () => {
      setInputValue(comboBox, '');
      enter(comboBox.inputElement);
      expect(comboBox.value).to.equal('');
    });
  });

  describe('value is set before', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box value="foo"></vaadin-combo-box>`);
      await nextRender();
      comboBox.filteredItems = ['foo', 'bar'];
    });

    it('should have the selected item', () => {
      expect(comboBox.selectedItem).to.equal('foo');
    });

    it('should have the input value', () => {
      expect(comboBox.inputElement.value).to.equal('foo');
    });

    it('should not have the value item focused when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    // See https://github.com/vaadin/web-components/issues/2615
    it('should not reset value after blur when set as html attribute', () => {
      comboBox.value = '';
      comboBox.focus();
      comboBox.blur();
      expect(comboBox.value).to.equal('');
    });
  });

  describe('value is set before + autoOpenDisabled', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box auto-open-disabled value="bar"></vaadin-combo-box>`);
      await nextRender();
      comboBox.filteredItems = ['foo', 'bar'];
    });

    it('should have the selected item', () => {
      expect(comboBox.selectedItem).to.equal('bar');
    });

    it('should have the input value', () => {
      expect(comboBox.inputElement.value).to.equal('bar');
    });

    it('should not have the value item focused when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should have the filtered item focused when opened after changing the filter', () => {
      setInputValue(comboBox, 'foo');
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should commit the filtered value', () => {
      setInputValue(comboBox, 'foo');
      enter(comboBox.inputElement);
      expect(comboBox.value).to.equal('foo');
    });

    it('should have no item focused when opened after clearing the filter', () => {
      setInputValue(comboBox, '');
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should commit an empty value', () => {
      setInputValue(comboBox, '');
      enter(comboBox.inputElement);
      expect(comboBox.value).to.equal('');
    });

    it('should commit a custom value when custom values are allowed', () => {
      comboBox.allowCustomValue = true;
      setInputValue(comboBox, 'custom');
      enter(comboBox.inputElement);
      expect(comboBox.value).to.equal('custom');
    });
  });

  describe('selectedItem is set before', () => {
    const items = [
      { label: 'Item 0', value: '0' },
      { label: 'Item 1', value: '1' },
      { label: 'Item 2', value: '2' },
    ];

    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
      await nextRender();
      comboBox.selectedItem = items[0];
      comboBox.filteredItems = items;
    });

    it('should set component value based on selected item', () => {
      expect(comboBox.value).to.equal('0');
    });

    it('should set input value based on selected item', () => {
      expect(comboBox.inputElement.value).to.equal('Item 0');
    });

    it('should not have the correct item focused when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });
  });
});
