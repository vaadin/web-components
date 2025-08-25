import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems, getChips, getFirstItem, setInputValue } from './helpers.js';

describe('items', () => {
  let comboBox;

  describe('renderer', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
      await nextRender();
      comboBox.items = ['foo', 'bar', 'baz'];
    });

    it('should pass the "root", "owner", "model" arguments to the renderer', () => {
      const spy = sinon.spy();
      comboBox.renderer = spy;
      comboBox.opened = true;

      const [root, owner, model] = spy.firstCall.args;

      expect(root.localName).to.equal('vaadin-multi-select-combo-box-item');
      expect(owner).to.eql(comboBox);
      expect(model).to.deep.equal({
        item: 'foo',
        index: 0,
        focused: false,
        selected: false,
      });
    });

    it('should use renderer when it is defined', () => {
      comboBox.renderer = (root, _, model) => {
        const textNode = document.createTextNode(`${model.item} ${model.index}`);
        root.appendChild(textNode);
      };
      comboBox.opened = true;

      expect(getFirstItem(comboBox).textContent.trim()).to.equal('foo 0');
    });

    it('should run renderers when requesting content update', () => {
      comboBox.renderer = sinon.spy();
      comboBox.opened = true;

      expect(comboBox.renderer.callCount).to.be.equal(comboBox.items.length);

      comboBox.renderer.resetHistory();
      comboBox.requestContentUpdate();

      expect(comboBox.renderer.callCount).to.be.equal(comboBox.items.length);
    });

    it('should not throw if requestContentUpdate() called before attached', () => {
      const combo = document.createElement('vaadin-multi-select-combo-box');
      expect(() => {
        combo.requestContentUpdate();
      }).to.not.throw(Error);
    });

    it('should render the item label when removing the renderer', () => {
      comboBox.renderer = (root, _, model) => {
        root.textContent = model.item.toUpperCase();
      };
      comboBox.opened = true;

      expect(getFirstItem(comboBox).textContent).to.equal('FOO');

      comboBox.renderer = null;

      expect(getFirstItem(comboBox).textContent).to.equal('foo');
    });

    it('should clear the old content after assigning a new renderer', () => {
      comboBox.opened = true;
      comboBox.renderer = () => {};
      expect(getFirstItem(comboBox).textContent).to.equal('');
    });
  });

  describe('itemClassNameGenerator', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
      await nextRender();
      comboBox.autoExpandHorizontally = true;
      comboBox.items = ['foo', 'bar', 'baz'];
    });

    it('should set class name on dropdown items', async () => {
      comboBox.itemClassNameGenerator = (item) => `item-${item}`;
      comboBox.open();
      await nextRender();
      const items = getAllItems(comboBox);
      expect(items[0].className).to.equal('item-foo');
      expect(items[1].className).to.equal('item-bar');
      expect(items[2].className).to.equal('item-baz');
    });

    it('should remove item class name when return value is empty string', async () => {
      comboBox.itemClassNameGenerator = (item) => `item-${item}`;
      comboBox.open();
      await nextRender();

      comboBox.close();
      comboBox.itemClassNameGenerator = () => '';

      comboBox.open();
      await nextRender();

      const items = getAllItems(comboBox);
      expect(items[0].className).to.equal('');
      expect(items[1].className).to.equal('');
      expect(items[2].className).to.equal('');
    });

    it('should remove item class name when generator is set to null', async () => {
      comboBox.itemClassNameGenerator = (item) => `item-${item}`;
      comboBox.open();
      await nextRender();

      comboBox.close();
      comboBox.itemClassNameGenerator = null;

      comboBox.open();
      await nextRender();

      const items = getAllItems(comboBox);
      expect(items[0].className).to.equal('');
      expect(items[1].className).to.equal('');
      expect(items[2].className).to.equal('');
    });

    it('should set class name on the selected item chips', async () => {
      comboBox.itemClassNameGenerator = (item) => item;
      comboBox.selectedItems = ['foo', 'bar'];
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].className).to.equal('foo');
      expect(chips[2].className).to.equal('bar');
    });

    it('should set chip class name when generator set after selecting', async () => {
      comboBox.selectedItems = ['foo', 'bar'];
      await nextRender();

      comboBox.itemClassNameGenerator = (item) => item;
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].className).to.equal('foo');
      expect(chips[2].className).to.equal('bar');
    });

    it('should remove chip class name when generator returns empty string', async () => {
      comboBox.itemClassNameGenerator = (item) => item;
      comboBox.selectedItems = ['foo', 'bar'];
      await nextRender();

      comboBox.itemClassNameGenerator = () => '';
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].className).to.equal('');
      expect(chips[2].className).to.equal('');
    });

    it('should remove chip class name when generator is set to null', async () => {
      comboBox.itemClassNameGenerator = (item) => item;
      comboBox.selectedItems = ['foo', 'bar'];
      await nextRender();

      comboBox.itemClassNameGenerator = null;
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].className).to.equal('');
      expect(chips[2].className).to.equal('');
    });
  });

  describe('itemLabelGenerator', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-multi-select-combo-box
          auto-expand-horizontally
          item-id-path="id"
        ></vaadin-multi-select-combo-box>
      `);
      comboBox.items = [
        { id: 1, name: 'John', surname: 'Doe', age: 30 },
        { id: 2, name: 'Jane', surname: 'Smith', age: 25 },
        { id: 3, name: 'Bob', surname: 'Johnson', age: 35 },
      ];
      comboBox.itemLabelGenerator = (item) => `${item.name} ${item.surname}`;
      await nextRender();
    });

    it('should generate items text content using itemLabelGenerator', async () => {
      comboBox.open();
      await nextRender();

      const items = getAllItems(comboBox);
      expect(items[0].textContent).to.equal('John Doe');
      expect(items[1].textContent).to.equal('Jane Smith');
      expect(items[2].textContent).to.equal('Bob Johnson');
    });

    it('should generate chips text content using itemLabelGenerator', async () => {
      comboBox.selectedItems = [comboBox.items[0], comboBox.items[1]];
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].label).to.equal('John Doe');
      expect(chips[2].label).to.equal('Jane Smith');
    });

    it('should filter items using generated label', () => {
      setInputValue(comboBox, 'john');

      expect(comboBox.filteredItems.length).to.equal(2);
      expect(comboBox.filteredItems[0]).to.deep.equal(comboBox.items[0]);
      expect(comboBox.filteredItems[1]).to.deep.equal(comboBox.items[2]);
    });

    it('should use itemLabelGenerator over itemLabelPath', async () => {
      comboBox.itemLabelPath = 'surname';
      comboBox.itemLabelGenerator = (item) => item.name;
      comboBox.open();
      await nextRender();

      const items = getAllItems(comboBox);
      expect(items[0].textContent).to.equal('John');
      expect(items[1].textContent).to.equal('Jane');
    });

    it('should accept empty string returned from itemLabelGenerator', async () => {
      comboBox.itemLabelGenerator = (item) => (item.id === 2 ? '' : `${item.name} ${item.surname}`);
      comboBox.open();
      await nextRender();

      const items = getAllItems(comboBox);
      expect(items[0].textContent).to.equal('John Doe');
      expect(items[1].textContent).to.equal('');
      expect(items[2].textContent).to.equal('Bob Johnson');
    });

    it('should update dropdown items when itemLabelGenerator changes', async () => {
      comboBox.open();
      await nextRender();

      expect(getFirstItem(comboBox).textContent).to.equal('John Doe');

      comboBox.itemLabelGenerator = (item) => `${item.name} (${item.age})`;
      await nextRender();

      expect(getFirstItem(comboBox).textContent).to.equal('John (30)');
    });

    it('should update chips when itemLabelGenerator changes', async () => {
      comboBox.selectedItems = [comboBox.items[0]];
      await nextRender();

      expect(getChips(comboBox)[1].label).to.equal('John Doe');

      comboBox.itemLabelGenerator = (item) => `${item.name} (${item.age})`;
      await nextRender();

      expect(getChips(comboBox)[1].label).to.equal('John (30)');
    });
  });
});
