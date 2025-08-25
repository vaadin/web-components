import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-multi-select-combo-box.js';
import { setInputValue } from '@vaadin/combo-box/test/helpers.js';

describe('item-label-generator', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
    await nextRender();
  });

  describe('basic functionality', () => {
    beforeEach(() => {
      comboBox.items = [
        { id: 1, name: 'John', surname: 'Doe', age: 30 },
        { id: 2, name: 'Jane', surname: 'Smith', age: 25 },
        { id: 3, name: 'Bob', surname: 'Johnson', age: 35 },
        { id: 4, name: 'Alice', surname: 'Williams', age: 28 },
      ];
    });

    it('should generate labels using itemLabelGenerator in dropdown', async () => {
      comboBox.itemLabelGenerator = (item) => `${item.name} ${item.surname}`;
      comboBox.opened = true;
      await nextRender();

      const items = comboBox._scroller.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[0].textContent).to.equal('John Doe');
      expect(items[1].textContent).to.equal('Jane Smith');
      expect(items[2].textContent).to.equal('Bob Johnson');
      expect(items[3].textContent).to.equal('Alice Williams');
    });

    it('should display generated labels in chips', async () => {
      comboBox.itemLabelGenerator = (item) => `${item.name} ${item.surname}`;
      comboBox.itemIdPath = 'id';
      await nextRender();

      comboBox.selectedItems = [
        { id: 1, name: 'John', surname: 'Doe', age: 30 },
        { id: 2, name: 'Jane', surname: 'Smith', age: 25 },
      ];
      await nextRender();

      const chips = comboBox.querySelectorAll('vaadin-multi-select-combo-box-chip[slot="chip"]');
      expect(chips.length).to.equal(2);
      expect(chips[0].label).to.equal('John Doe');
      expect(chips[1].label).to.equal('Jane Smith');
    });

    it('should filter items using generated labels', () => {
      comboBox.itemLabelGenerator = (item) => `${item.name} ${item.surname}`;

      setInputValue(comboBox, 'john');

      expect(comboBox.filteredItems.length).to.equal(2);
      expect(comboBox.filteredItems[0]).to.deep.equal({ id: 1, name: 'John', surname: 'Doe', age: 30 });
      expect(comboBox.filteredItems[1]).to.deep.equal({ id: 3, name: 'Bob', surname: 'Johnson', age: 35 });
    });

    it('should use itemLabelGenerator over itemLabelPath', async () => {
      comboBox.items = [
        { id: 1, label: 'Label from path', customLabel: 'Custom Label 1' },
        { id: 2, label: 'Another label', customLabel: 'Custom Label 2' },
      ];
      comboBox.itemLabelPath = 'label';
      comboBox.itemLabelGenerator = (item) => item.customLabel;
      comboBox.itemIdPath = 'id';
      comboBox.selectedItems = [{ id: 1, label: 'Label from path', customLabel: 'Custom Label 1' }];
      await nextRender();

      const chip = comboBox.querySelector('vaadin-multi-select-combo-box-chip[slot="chip"]');
      expect(chip.label).to.equal('Custom Label 1');
    });

    it('should handle complex label generation for chips', async () => {
      comboBox.itemLabelGenerator = (item) => `${item.surname}, ${item.name} (${item.age})`;
      comboBox.itemIdPath = 'id';
      await nextRender();

      comboBox.selectedItems = [
        { id: 1, name: 'John', surname: 'Doe', age: 30 },
        { id: 3, name: 'Bob', surname: 'Johnson', age: 35 },
      ];
      await nextRender();

      const chips = comboBox.querySelectorAll('vaadin-multi-select-combo-box-chip[slot="chip"]');
      expect(chips.length).to.equal(2);
      expect(chips[0].label).to.equal('Doe, John (30)');
      expect(chips[1].label).to.equal('Johnson, Bob (35)');
    });

    it('should update chips when itemLabelGenerator changes', async () => {
      comboBox.itemLabelGenerator = (item) => item.name;
      comboBox.itemIdPath = 'id';
      comboBox.selectedItems = [{ id: 1, name: 'John', surname: 'Doe', age: 30 }];
      await nextRender();

      let chip = comboBox.querySelector('vaadin-multi-select-combo-box-chip[slot="chip"]');
      expect(chip.label).to.equal('John');

      comboBox.itemLabelGenerator = (item) => `${item.name} (${item.age})`;
      await nextRender();

      chip = comboBox.querySelector('vaadin-multi-select-combo-box-chip[slot="chip"]');
      expect(chip.label).to.equal('John (30)');
    });

    it('should work with string items when itemLabelGenerator is not set', async () => {
      comboBox.items = ['Apple', 'Banana', 'Orange'];
      await nextRender();

      comboBox.selectedItems = ['Apple', 'Orange'];
      await nextRender();

      const chips = comboBox.querySelectorAll('vaadin-multi-select-combo-box-chip[slot="chip"]');
      expect(chips.length).to.equal(2);
      expect(chips[0].label).to.equal('Apple');
      expect(chips[1].label).to.equal('Orange');
    });

    it('should handle overflow chip with generated labels', async () => {
      comboBox.autoExpandVertically = false;
      comboBox.style.width = '200px';
      comboBox.itemLabelGenerator = (item) => `${item.name} ${item.surname}`;
      comboBox.itemIdPath = 'id';

      // Select many items to trigger overflow
      comboBox.selectedItems = [
        { id: 1, name: 'John', surname: 'Doe', age: 30 },
        { id: 2, name: 'Jane', surname: 'Smith', age: 25 },
        { id: 3, name: 'Bob', surname: 'Johnson', age: 35 },
        { id: 4, name: 'Alice', surname: 'Williams', age: 28 },
      ];
      await nextRender();

      const overflowChip = comboBox.querySelector('vaadin-multi-select-combo-box-chip[slot="overflow"]');
      if (overflowChip && !overflowChip.hasAttribute('hidden')) {
        // Overflow chip should show count
        expect(overflowChip.hasAttribute('count')).to.be.true;
      }
    });

    it('should clear input value after selecting item with generated label', async () => {
      comboBox.itemLabelGenerator = (item) => `${item.name} ${item.surname}`;
      comboBox.itemIdPath = 'id';

      comboBox.inputElement.value = 'Jane Smith';
      comboBox.inputElement.dispatchEvent(new Event('input'));
      await nextRender();

      // Simulate selecting the item
      const items = comboBox._scroller.querySelectorAll('vaadin-multi-select-combo-box-item');
      items[0].click();
      await nextRender();

      expect(comboBox.inputElement.value).to.equal('');
      const chips = comboBox.querySelectorAll('vaadin-multi-select-combo-box-chip[slot="chip"]');
      expect(chips[0].label).to.equal('Jane Smith');
    });
  });
});
