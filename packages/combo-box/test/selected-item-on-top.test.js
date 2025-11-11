import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import { flushComboBox, getAllItems, getViewportItems, setInputValue } from './helpers.js';

describe('selected item on top', () => {
  let comboBox, input;

  describe('string items', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      input = comboBox.inputElement;

      comboBox.items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
    });

    it('should have selectedItemOnTop property set to false by default', () => {
      expect(comboBox.selectedItemOnTop).to.be.false;
    });

    it('should show items in original order when selectedItemOnTop is false', async () => {
      comboBox.selectedItem = 'Banana';
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Apple');
      expect(items[1].textContent.trim()).to.equal('Banana');
      expect(items[2].textContent.trim()).to.equal('Cherry');
    });

    it('should show selected item first when selectedItemOnTop is true', async () => {
      comboBox.selectedItem = 'Banana';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Banana');
      expect(items[1].textContent.trim()).to.equal('Apple');
      expect(items[2].textContent.trim()).to.equal('Banana'); // Banana in original position
      expect(items[3].textContent.trim()).to.equal('Cherry');
      expect(items.length).to.equal(6); // 5 original items + 1 duplicate
    });

    it('should update position when selection changes', async () => {
      comboBox.selectedItemOnTop = true;
      comboBox.selectedItem = 'Banana';
      comboBox.open();
      await nextRender();

      let items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Banana');

      comboBox.selectedItem = 'Date';
      await nextRender();

      items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Date');
      expect(items[1].textContent.trim()).to.equal('Apple');
    });

    it('should show selected item both on top and in original position', async () => {
      comboBox.selectedItem = 'Cherry';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      const cherryItems = items.filter((item) => item.textContent.trim() === 'Cherry');
      expect(cherryItems.length).to.equal(2);
      expect(items[0].textContent.trim()).to.equal('Cherry');
      // Cherry should also appear in its original position (index 2 in the original array)
      expect(items[3].textContent.trim()).to.equal('Cherry');
    });

    it('should show all items when no item is selected', async () => {
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Apple');
      expect(items.length).to.equal(5);
    });

    it('should restore original order when selectedItemOnTop is disabled', async () => {
      comboBox.selectedItem = 'Banana';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      let items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Banana');

      comboBox.close();
      comboBox.selectedItemOnTop = false;
      comboBox.open();
      await nextRender();

      items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Apple');
      expect(items[1].textContent.trim()).to.equal('Banana');
    });

    it('should not affect filtering', async () => {
      comboBox.selectedItem = 'Banana';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'err');
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items.length).to.equal(2);
      expect(items[0].textContent.trim()).to.equal('Cherry');
      expect(items[1].textContent.trim()).to.equal('Elderberry');
    });

    it('should work when opening overlay after setting selectedItemOnTop', async () => {
      comboBox.selectedItemOnTop = true;
      comboBox.selectedItem = 'Cherry';
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Cherry');
    });

    it('should add selected-item-on-top attribute to first item when selected', async () => {
      comboBox.selectedItem = 'Banana';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getAllItems(comboBox);
      expect(items[0].hasAttribute('selected-item-on-top')).to.be.true;
      expect(items[1].hasAttribute('selected-item-on-top')).to.be.false;
    });

    it('should remove selected-item-on-top attribute when feature is disabled', async () => {
      comboBox.selectedItem = 'Banana';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      let items = getAllItems(comboBox);
      expect(items[0].hasAttribute('selected-item-on-top')).to.be.true;

      comboBox.close();
      comboBox.selectedItemOnTop = false;
      comboBox.open();
      await nextRender();

      items = getAllItems(comboBox);
      expect(items[0].hasAttribute('selected-item-on-top')).to.be.false;
      expect(items[1].hasAttribute('selected-item-on-top')).to.be.false;
    });

    it('should not add attribute when filtering', async () => {
      comboBox.selectedItem = 'Banana';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'err');
      await nextRender();

      const items = getAllItems(comboBox);
      // Cherry and Elderberry - neither should have the attribute
      items.forEach((item) => {
        expect(item.hasAttribute('selected-item-on-top')).to.be.false;
      });
    });

    it('should remove attribute when filtering starts and restore when filter is cleared', async () => {
      comboBox.selectedItem = 'Banana';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      let items = getAllItems(comboBox);
      expect(items[0].hasAttribute('selected-item-on-top')).to.be.true;

      // Start filtering
      setInputValue(comboBox, 'err');
      await nextRender();

      items = getAllItems(comboBox);
      items.forEach((item) => {
        expect(item.hasAttribute('selected-item-on-top')).to.be.false;
      });

      // Clear filter
      setInputValue(comboBox, '');
      await nextRender();
      flushComboBox(comboBox); // Force virtualizer to update all items
      await nextRender();

      items = getAllItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Banana');
      expect(items[0].hasAttribute('selected-item-on-top')).to.be.true;
    });
  });

  describe('object items', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      input = comboBox.inputElement;

      comboBox.items = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Cherry', value: 'cherry' },
        { label: 'Date', value: 'date' },
      ];
    });

    it('should show selected object item first', async () => {
      comboBox.selectedItem = comboBox.items[1];
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Banana');
      expect(items[1].textContent.trim()).to.equal('Apple');
    });

    it('should work with itemIdPath', async () => {
      comboBox.itemIdPath = 'value';
      comboBox.selectedItem = comboBox.items[2];
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Cherry');
    });

    it('should handle item reference changes with itemIdPath', async () => {
      comboBox.itemIdPath = 'value';
      comboBox.selectedItemOnTop = true;
      comboBox.selectedItem = comboBox.items[1]; // Banana
      comboBox.open();
      await nextRender();

      let items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Banana');

      // Simulate data provider returning new item references
      comboBox.items = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }, // Same value, different reference
        { label: 'Cherry', value: 'cherry' },
        { label: 'Date', value: 'date' },
      ];
      comboBox.value = 'banana';
      await nextRender();

      items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Banana');
    });
  });

  describe('with data provider', () => {
    let dataProviderSpy;

    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();

      const items = ['Item 0', 'Item 1', 'Item 2', 'Item 3', 'Item 4'];
      dataProviderSpy = sinon.spy((params, callback) => {
        const { page, pageSize, filter } = params;
        const filteredItems = items.filter((item) => item.toLowerCase().includes(filter.toLowerCase()));
        const start = page * pageSize;
        const end = start + pageSize;
        callback(filteredItems.slice(start, end), filteredItems.length);
      });

      comboBox.dataProvider = dataProviderSpy;
      comboBox.pageSize = 50;
    });

    it('should show selected item first with data provider', async () => {
      comboBox.selectedItem = 'Item 2';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Item 2');
      expect(items[1].textContent.trim()).to.equal('Item 0');
      expect(items[2].textContent.trim()).to.equal('Item 1');
    });

    it('should not affect data provider filtering', async () => {
      comboBox.selectedItem = 'Item 2';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      setInputValue(comboBox, '1');
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items.length).to.equal(1);
      expect(items[0].textContent.trim()).to.equal('Item 1');
    });
  });

  describe('edge cases', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
    });

    it('should handle empty items array', async () => {
      comboBox.items = [];
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items.length).to.equal(0);
    });

    it('should handle single item', async () => {
      comboBox.items = ['Only Item'];
      comboBox.selectedItem = 'Only Item';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      const items = getViewportItems(comboBox);
      expect(items.length).to.equal(2); // Item appears both on top and in original position
      expect(items[0].textContent.trim()).to.equal('Only Item');
      expect(items[1].textContent.trim()).to.equal('Only Item');
    });

    it('should handle clearing selection', async () => {
      comboBox.items = ['Item 1', 'Item 2', 'Item 3'];
      comboBox.selectedItem = 'Item 2';
      comboBox.selectedItemOnTop = true;
      comboBox.open();
      await nextRender();

      let items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Item 2');

      comboBox.selectedItem = null;
      await nextRender();

      items = getViewportItems(comboBox);
      expect(items[0].textContent.trim()).to.equal('Item 1');
    });
  });
});
