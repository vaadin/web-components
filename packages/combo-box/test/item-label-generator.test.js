import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-combo-box.js';
import { setInputValue } from './helpers.js';

describe('item-label-generator', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
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

    it('should generate labels using itemLabelGenerator', async () => {
      comboBox.itemLabelGenerator = (item) => `${item.name} ${item.surname}`;
      comboBox.opened = true;
      await nextRender();

      const items = comboBox._scroller.querySelectorAll('vaadin-combo-box-item');
      expect(items[0].textContent).to.equal('John Doe');
      expect(items[1].textContent).to.equal('Jane Smith');
      expect(items[2].textContent).to.equal('Bob Johnson');
      expect(items[3].textContent).to.equal('Alice Williams');
    });

    it('should display generated label in input when item is selected', async () => {
      comboBox.itemLabelGenerator = (item) => `${item.name} ${item.surname} (${item.age})`;
      comboBox.itemValuePath = 'id';
      comboBox.value = 2;
      await nextRender();

      expect(comboBox.inputElement.value).to.equal('Jane Smith (25)');
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
      comboBox.opened = true;
      await nextRender();

      const items = comboBox._scroller.querySelectorAll('vaadin-combo-box-item');
      expect(items[0].textContent).to.equal('Custom Label 1');
      expect(items[1].textContent).to.equal('Custom Label 2');
    });

    it('should handle empty return from itemLabelGenerator', async () => {
      comboBox.itemLabelGenerator = (item) => {
        if (item.id === 2) {
          return '';
        }
        return `${item.name} ${item.surname}`;
      };
      comboBox.opened = true;
      await nextRender();

      const items = comboBox._scroller.querySelectorAll('vaadin-combo-box-item');
      expect(items[0].textContent).to.equal('John Doe');
      expect(items[1].textContent).to.equal('');
      expect(items[2].textContent).to.equal('Bob Johnson');
    });

    it('should update dropdown when itemLabelGenerator changes', async () => {
      comboBox.itemLabelGenerator = (item) => item.name;
      comboBox.opened = true;
      await nextRender();

      let items = comboBox._scroller.querySelectorAll('vaadin-combo-box-item');
      expect(items[0].textContent).to.equal('John');

      comboBox.itemLabelGenerator = (item) => `${item.name} (${item.age})`;
      await nextRender();

      items = comboBox._scroller.querySelectorAll('vaadin-combo-box-item');
      expect(items[0].textContent).to.equal('John (30)');
    });

    it('should work with string items when itemLabelGenerator is not set', async () => {
      comboBox.items = ['Apple', 'Banana', 'Orange'];
      comboBox.opened = true;
      await nextRender();

      const items = comboBox._scroller.querySelectorAll('vaadin-combo-box-item');
      expect(items[0].textContent).to.equal('Apple');
      expect(items[1].textContent).to.equal('Banana');
      expect(items[2].textContent).to.equal('Orange');
    });

    it('should find items by generated label when typing', () => {
      comboBox.itemLabelGenerator = (item) => `${item.surname}, ${item.name}`;
      comboBox.itemValuePath = 'id';

      setInputValue(comboBox, 'Smith, Jane');

      expect(comboBox.filteredItems.length).to.equal(1);
      expect(comboBox.filteredItems[0]).to.deep.equal({ id: 2, name: 'Jane', surname: 'Smith', age: 25 });
    });
  });
});
