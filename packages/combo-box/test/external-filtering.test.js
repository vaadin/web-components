import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getFocusedItemIndex, setInputValue } from './helpers.js';

describe('external filtering', () => {
  let comboBox, overlay;

  describe('basic', () => {
    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
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

    it('should remove focus while loading', () => {
      setInputValue(comboBox, 'foo');
      comboBox.filteredItems = ['foo'];
      expect(getFocusedItemIndex(comboBox)).to.equal(0);

      comboBox.loading = true;

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
      comboBox.close();

      setInputValue(comboBox, 'bar');

      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not hide the overlay while loading', () => {
      setInputValue(comboBox, 'foo');

      comboBox.loading = true;

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

    it('should not perform measurements when loading changes if not opened', () => {
      const measureSpy = sinon.spy(comboBox.inputElement, 'getBoundingClientRect');
      comboBox.loading = true;

      expect(measureSpy.called).to.be.false;
    });
  });

  describe('filtered items attribute', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-combo-box filtered-items='["a", "b", "c"]' value='b'></vaadin-combo-box>`);
    });

    it('should not throw when passing filteredItems and value as attributes', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });
  });

  describe('value is set after', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
      comboBox.filteredItems = ['foo', 'bar'];
      comboBox.value = 'foo';
    });

    it('should have the value item focused when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
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

    it('should commit the empty value', async () => {
      setInputValue(comboBox, '');
      enter(comboBox.inputElement);
      expect(comboBox.value).to.equal('');
    });
  });

  describe('value is set before', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-combo-box value="foo"></vaadin-combo-box>`);
      comboBox.filteredItems = ['foo', 'bar'];
    });

    it('should have the selected item', () => {
      expect(comboBox.selectedItem).to.equal('foo');
    });

    it('should have the input value', () => {
      expect(comboBox.inputElement.value).to.equal('foo');
    });

    it('should have the value item focused when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
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
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-combo-box auto-open-disabled value="bar"></vaadin-combo-box>`);
      comboBox.filteredItems = ['foo', 'bar'];
    });

    it('should have the selected item', () => {
      expect(comboBox.selectedItem).to.equal('bar');
    });

    it('should have the input value', () => {
      expect(comboBox.inputElement.value).to.equal('bar');
    });

    it('should have the value item focused when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should have the filtered item focused when opened after changing the filter', () => {
      setInputValue(comboBox, 'foo');
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should commit the filtered value', async () => {
      setInputValue(comboBox, 'foo');
      enter(comboBox.inputElement);
      expect(comboBox.value).to.equal('foo');
    });

    it('should have no item focused when opened after clearing the filter', () => {
      setInputValue(comboBox, '');
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should commit an empty value', async () => {
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

    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
      comboBox.selectedItem = items[0];
      comboBox.filteredItems = items;
    });

    it('should set component value based on selected item', () => {
      expect(comboBox.value).to.equal('0');
    });

    it('should set input value based on selected item', () => {
      expect(comboBox.inputElement.value).to.equal('Item 0');
    });

    it('should have the correct item focused when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });
  });
});
