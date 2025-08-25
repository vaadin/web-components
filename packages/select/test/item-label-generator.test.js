import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-select.js';

describe('item-label-generator', () => {
  let select;

  beforeEach(async () => {
    select = fixtureSync('<vaadin-select></vaadin-select>');
    await nextRender();
  });

  describe('basic functionality', () => {
    beforeEach(() => {
      select.items = [
        { value: 'recent', displayName: 'Most recent first' },
        { value: 'rating-asc', displayName: 'Rating: low to high' },
        { value: 'rating-desc', displayName: 'Rating: high to low' },
        { value: 'price-asc', displayName: 'Price: low to high' },
        { value: 'price-desc', displayName: 'Price: high to low' },
      ];
    });

    it('should generate labels using itemLabelGenerator', () => {
      select.itemLabelGenerator = (item) => item.displayName;
      select.requestContentUpdate();

      const items = select._menuElement.querySelectorAll('vaadin-select-item');
      expect(items[0].textContent).to.equal('Most recent first');
      expect(items[1].textContent).to.equal('Rating: low to high');
      expect(items[2].textContent).to.equal('Rating: high to low');
      expect(items[3].textContent).to.equal('Price: low to high');
      expect(items[4].textContent).to.equal('Price: high to low');
    });

    it('should show generated label in value button when item is selected', async () => {
      select.itemLabelGenerator = (item) => item.displayName;
      select.value = 'rating-asc';
      await nextRender();

      const valueButton = select.querySelector('[slot="value"]');
      expect(valueButton.textContent.trim()).to.equal('Rating: low to high');
    });

    it('should prefer explicit label over itemLabelGenerator', () => {
      select.items = [
        { value: 'recent', label: 'Explicit label', displayName: 'Most recent first' },
        { value: 'rating-asc', displayName: 'Rating: low to high' },
      ];
      select.itemLabelGenerator = (item) => item.displayName;
      select.requestContentUpdate();

      const items = select._menuElement.querySelectorAll('vaadin-select-item');
      expect(items[0].textContent).to.equal('Explicit label');
      expect(items[1].textContent).to.equal('Rating: low to high');
    });

    it('should not use itemLabelGenerator for separator items', () => {
      select.items = [
        { value: 'recent', displayName: 'Most recent first' },
        { component: 'hr' },
        { value: 'rating-asc', displayName: 'Rating: low to high' },
      ];
      select.itemLabelGenerator = (item) => item.displayName;
      select.requestContentUpdate();

      const items = select._menuElement.querySelectorAll('vaadin-select-item, hr');
      expect(items[0].textContent).to.equal('Most recent first');
      expect(items[1].tagName).to.equal('HR');
      expect(items[2].textContent).to.equal('Rating: low to high');
    });

    it('should handle custom label with complex data', () => {
      select.items = [
        { id: 1, name: 'John', surname: 'Doe', age: 30 },
        { id: 2, name: 'Jane', surname: 'Smith', age: 25 },
        { id: 3, name: 'Bob', surname: 'Johnson', age: 35 },
      ];
      select.itemLabelGenerator = (item) => `${item.name} ${item.surname} (${item.age})`;
      select.itemValuePath = 'id';
      select.requestContentUpdate();

      const items = select._menuElement.querySelectorAll('vaadin-select-item');
      expect(items[0].textContent).to.equal('John Doe (30)');
      expect(items[1].textContent).to.equal('Jane Smith (25)');
      expect(items[2].textContent).to.equal('Bob Johnson (35)');
    });

    it('should update dropdown when itemLabelGenerator is changed', () => {
      select.itemLabelGenerator = (item) => item.value;
      select.requestContentUpdate();

      let items = select._menuElement.querySelectorAll('vaadin-select-item');
      expect(items[0].textContent).to.equal('recent');

      select.itemLabelGenerator = (item) => item.displayName;
      select.requestContentUpdate();

      items = select._menuElement.querySelectorAll('vaadin-select-item');
      expect(items[0].textContent).to.equal('Most recent first');
    });
  });
});
