import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
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
      overlay = comboBox.$.dropdown.$.overlay;
    });

    it('should set items to filteredItems', () => {
      comboBox.items = ['foo'];

      expect(comboBox.filteredItems).to.eql(['foo']);
    });

    it('should not filter items', () => {
      setInputValue(comboBox, 'foo');

      expect(comboBox._getOverlayItems()).to.eql(['foo', 'bar', 'baz']);
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

    it('should focus on value when opened', () => {
      comboBox.value = 'bar';
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      comboBox.open();

      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should update focus when opening with filling filter', () => {
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      comboBox.close();

      setInputValue(comboBox, 'bar');

      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should reset focus when opening with filter cleared', () => {
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      comboBox.value = 'bar';
      comboBox.close();

      setInputValue(comboBox, '');

      expect(comboBox.opened).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should not hide the overlay while loading', () => {
      setInputValue(comboBox, 'foo');

      comboBox.loading = true;

      expect(comboBox.opened).to.be.true;
      expect(comboBox.$.dropdown.hidden).to.be.false;
    });

    // FIXME(@platosha): Hiding does not play nice with lazy loading.
    // Should display a loading indicator instead.
    it.skip('should hide the scroller while loading', () => {
      setInputValue(comboBox, 'foo');

      comboBox.loading = true;

      expect(comboBox.opened).to.be.true;
      expect(comboBox.$.dropdown._scroller.hidden).to.be.true;
    });

    it('should refresh items after reassignment', () => {
      comboBox.filteredItems = ['foo'];

      expect(comboBox._getOverlayItems()).to.eql(['foo']);
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

  describe('value attribute', () => {
    let comboBox, input;

    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-combo-box value="foo"></vaadin-combo-box>`);
      input = comboBox.inputElement;
    });

    it('should be able to be set before filtered items', () => {
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      expect(comboBox.selectedItem).to.eql('foo');
      expect(input.value).to.eql('foo');
    });

    // see https://github.com/vaadin/web-components/issues/2615
    it('should not reset value after blur when set as html attribute', () => {
      comboBox.filteredItems = ['foo'];
      comboBox.value = '';
      comboBox.focus();
      comboBox.blur();
      expect(comboBox.value).to.equal('');
    });
  });

  describe('autoOpenDisabled', () => {
    let comboBox;

    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-combo-box auto-open-disabled value="bar"></vaadin-combo-box>`);
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
    });

    it('should focus the correct item when opened', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });
  });
});
