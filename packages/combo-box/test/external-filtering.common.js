import { expect } from '@esm-bundle/chai';
import { aTimeout, enter, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { getFocusedItemIndex, setInputValue } from './helpers.js';

describe('external filtering', () => {
  let comboBox, overlay;

  describe('basic', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      await nextRender();
      overlay = comboBox.$.overlay;
    });

    it('should set items to filteredItems', async () => {
      comboBox.items = ['foo'];
      await nextUpdate(comboBox);
      expect(comboBox.filteredItems).to.eql(['foo']);
    });

    it('should not filter items', async () => {
      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);
      expect(comboBox._scroller.items).to.eql(['foo', 'bar', 'baz']);
    });

    it('should remove focus while loading', async () => {
      setInputValue(comboBox, 'foo');
      comboBox.filteredItems = ['foo'];
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(0);

      comboBox.loading = true;
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should focus on filtered value', async () => {
      comboBox.filteredItems = ['foo'];
      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);

      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should update focus when opening with filling filter', async () => {
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not hide the overlay while loading', async () => {
      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      comboBox.loading = true;
      await nextUpdate(comboBox);

      expect(comboBox.opened).to.be.true;
      expect(comboBox.$.overlay.hasAttribute('hidden')).to.be.false;
    });

    // FIXME(@platosha): Hiding does not play nice with lazy loading.
    // Should display a loading indicator instead.
    it.skip('should hide the scroller while loading', () => {
      setInputValue(comboBox, 'foo');

      comboBox.loading = true;

      expect(comboBox.opened).to.be.true;
      expect(comboBox._scroller.hidden).to.be.true;
    });

    it('should refresh items after reassignment', async () => {
      comboBox.opened = true;
      await nextUpdate(comboBox);

      comboBox.filteredItems = ['foo'];
      await nextUpdate(comboBox);

      expect(comboBox._scroller.items).to.eql(['foo']);
    });

    it('should toggle loading attributes to host and overlay', async () => {
      comboBox.loading = true;
      await nextUpdate(comboBox);
      expect(comboBox.hasAttribute('loading')).to.be.true;
      expect(overlay.hasAttribute('loading')).to.be.true;

      comboBox.loading = false;
      await nextUpdate(comboBox);
      expect(comboBox.hasAttribute('loading')).to.be.false;
      expect(overlay.hasAttribute('loading')).to.be.false;
    });

    it('should not perform measurements when loading changes if not opened', async () => {
      const measureSpy = sinon.spy(comboBox.inputElement, 'getBoundingClientRect');
      comboBox.loading = true;
      await nextUpdate(comboBox);

      expect(measureSpy.called).to.be.false;
    });
  });

  describe('filtered items attribute', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box filtered-items='["a", "b", "c"]' value='b'></vaadin-combo-box>`);
      await nextRender();
    });

    it('should not throw when passing filteredItems and value as attributes', async () => {
      comboBox.open();
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });
  });

  describe('value is set after', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
      comboBox.filteredItems = ['foo', 'bar'];
      await nextRender();
      comboBox.value = 'foo';
      await nextUpdate(comboBox);
    });

    it('should not have the value item focused when opened', async () => {
      comboBox.open();
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should have the filtered item focused when opened on changing the filter', async () => {
      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);
      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should commit the filtered value', async () => {
      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);

      enter(comboBox.inputElement);
      await nextUpdate(comboBox);

      expect(comboBox.value).to.equal('bar');
    });

    it('should have no item focused when opened on clearing the filter', async () => {
      setInputValue(comboBox, '');
      await nextUpdate(comboBox);
      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should commit the empty value', async () => {
      setInputValue(comboBox, '');
      await nextUpdate(comboBox);

      enter(comboBox.inputElement);
      await nextUpdate(comboBox);

      expect(comboBox.value).to.equal('');
    });
  });

  describe('value is set before', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box value="foo"></vaadin-combo-box>`);
      await nextRender();
      comboBox.filteredItems = ['foo', 'bar'];
      await nextUpdate(comboBox);
    });

    it('should have the selected item', () => {
      expect(comboBox.selectedItem).to.equal('foo');
    });

    it('should have the input value', () => {
      expect(comboBox.inputElement.value).to.equal('foo');
    });

    it('should not have the value item focused when opened', async () => {
      comboBox.open();
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    // See https://github.com/vaadin/web-components/issues/2615
    it('should not reset value after blur when set as html attribute', async () => {
      comboBox.value = '';
      await nextUpdate(comboBox);
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
      await nextUpdate(comboBox);
    });

    it('should have the selected item', () => {
      expect(comboBox.selectedItem).to.equal('bar');
    });

    it('should have the input value', () => {
      expect(comboBox.inputElement.value).to.equal('bar');
    });

    it('should not have the value item focused when opened', async () => {
      comboBox.open();
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should have the filtered item focused when opened after changing the filter', async () => {
      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);
      comboBox.open();
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should commit the filtered value', async () => {
      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);
      enter(comboBox.inputElement);
      await nextUpdate(comboBox);
      expect(comboBox.value).to.equal('foo');
    });

    it('should have no item focused when opened after clearing the filter', async () => {
      setInputValue(comboBox, '');
      await nextUpdate(comboBox);
      comboBox.open();
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should commit an empty value', async () => {
      setInputValue(comboBox, '');
      await nextUpdate(comboBox);
      enter(comboBox.inputElement);
      await nextUpdate(comboBox);
      expect(comboBox.value).to.equal('');
    });

    it('should commit a custom value when custom values are allowed', async () => {
      comboBox.allowCustomValue = true;
      setInputValue(comboBox, 'custom');
      await nextUpdate(comboBox);
      enter(comboBox.inputElement);
      await nextUpdate(comboBox);
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
      comboBox.selectedItem = items[0];
      await nextRender();
      comboBox.filteredItems = items;
      await nextUpdate(comboBox);
    });

    it('should set component value based on selected item', () => {
      expect(comboBox.value).to.equal('0');
    });

    it('should set input value based on selected item', () => {
      expect(comboBox.inputElement.value).to.equal('Item 0');
    });

    it('should not have the correct item focused when opened', async () => {
      comboBox.open();
      await nextUpdate(comboBox);
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });
  });
});
