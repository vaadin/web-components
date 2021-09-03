import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { fixtureSync } from '@vaadin/testing-helpers';
import { onceOpened } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('filtering items', () => {
  let comboBox;

  function getFilteredItems() {
    return comboBox.$.overlay._items;
  }

  function setInputValue(value) {
    comboBox.inputElement.value = value;
    comboBox.inputElement.dispatchEvent(new CustomEvent('input'));
  }

  function getInputValue() {
    return comboBox.inputElement.value;
  }

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
  });

  describe('setting the input field value', () => {
    it('should open the popup if closed', () => {
      comboBox.close();

      setInputValue('foo');

      expect(comboBox.opened).to.equal(true);
    });

    it('should not open the popup if closed and autoOpenDisabled is true', () => {
      comboBox.autoOpenDisabled = true;
      comboBox.close();

      setInputValue('foo');

      expect(comboBox.opened).to.equal(false);
    });

    it('should filter items when filter is changed regardless of autoOpenDisabled', () => {
      comboBox.autoOpenDisabled = true;
      comboBox.close();

      comboBox.value = 'foo';
      comboBox.open();
      setInputValue('foo ');

      expect(getFilteredItems()).to.be.empty;
    });

    it('should open the popup when the value of the input field is set to none', () => {
      comboBox.value = 'foo';
      comboBox.close();
      expect(comboBox.opened).to.equal(false);

      setInputValue('');

      expect(comboBox.opened).to.equal(true);
    });

    it('should not open the popup when the value of the input field is set to none and autoOpenDisabled is true', () => {
      comboBox.autoOpenDisabled = true;
      comboBox.value = 'foo';
      comboBox.close();
      expect(comboBox.opened).to.equal(false);

      setInputValue('');

      expect(comboBox.opened).to.equal(false);
    });

    it('should not change the value of the combobox', () => {
      comboBox.value = 'foo';
      setInputValue('bar');
      expect(comboBox.value).to.equal('foo');
    });

    it('should set the combobox value when closing', () => {
      comboBox.value = 'foo';
      setInputValue('bar');

      comboBox.close();

      expect(comboBox.value).to.equal('bar');
    });

    it('should set the combobox value when closing case insensitively', () => {
      comboBox.value = 'foo';
      setInputValue('BAR');

      comboBox.close();

      expect(comboBox.value).to.equal('bar');
    });

    it('should be reverted to the combobox value when cancelled', () => {
      comboBox.value = 'foo';

      setInputValue('b');
      comboBox.cancel();

      expect(getInputValue()).to.equal('foo');
    });

    it('should be revert to the combobox value when selecting the same value', () => {
      comboBox.value = 'foo';

      setInputValue('FOO');
      comboBox.close();

      expect(getInputValue()).to.equal('foo');
    });
  });

  describe('focusing items while filtering', () => {
    it('should focus on an exact match', () => {
      setInputValue('bar');

      expect(comboBox._focusedIndex).to.eql(0);
    });

    it('should not scroll to selected value when filtering', (done) => {
      comboBox.value = 'baz';

      onceOpened(comboBox).then(() => {
        const spy = sinon.spy(comboBox.$.overlay, '_scrollIntoView');
        setInputValue('b');

        requestAnimationFrame(() => {
          expect(spy.firstCall.firstArg).to.eql(0);
          done();
        });
      });

      setInputValue('ba');
    });

    it('should update focus when opening with filling filter', () => {
      comboBox.close();

      setInputValue('bar');

      expect(comboBox.opened).to.be.true;
      expect(comboBox._focusedIndex).to.equal(0);
    });

    it('should reset focus when opening with filter cleared', () => {
      comboBox.value = 'bar';
      comboBox.close();

      setInputValue('');

      expect(comboBox.opened).to.be.true;
      expect(comboBox._focusedIndex).to.equal(-1);
    });
  });

  describe('filtering items', () => {
    it('should filter items using contains', () => {
      setInputValue('a');

      expect(getFilteredItems()).to.eql(['bar', 'baz']);
    });

    it('should filter out all items with a invalid filter', () => {
      setInputValue('qux');

      expect(getFilteredItems()).to.be.empty;
    });

    it('should be reset after closing the dropdown', () => {
      setInputValue('foo');

      comboBox.close();

      expect(comboBox.filter).to.be.empty;
    });

    it('should filter boolean', () => {
      comboBox.items = [true, false];

      setInputValue('t');

      expect(getFilteredItems()).to.eql([true]);
    });

    it('should show initial selection', () => {
      comboBox.value = 'foo';
      comboBox.open();

      expect(comboBox.$.overlay._selectedItem).to.eql('foo');
    });

    it('should not lose the selected value', () => {
      comboBox.value = 'foo';
      setInputValue('bar');

      expect(comboBox.$.overlay._selectedItem).to.eql('foo');
    });

    it('should ignore case', () => {
      setInputValue('FOO');

      expect(getFilteredItems()).to.eql(['foo']);
    });

    it('should focus filtered items on match case insensitively', () => {
      setInputValue('BA');

      expect(comboBox._focusedIndex).to.equal(-1);

      setInputValue('BAR');

      expect(comboBox._focusedIndex).to.equal(0);
    });

    it('should reset focus when filter changes', () => {
      setInputValue('BAR');
      setInputValue('BA');

      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should not filter with a null filter', () => {
      setInputValue(null);

      expect(getFilteredItems()).to.eql(['foo', 'bar', 'baz']);
    });

    it('should not throw an error when items arent set', () => {
      comboBox.items = null;

      setInputValue('foo');

      expect(getFilteredItems()).to.be.null;
    });

    it('should hide overlay when filtered items length is 0', () => {
      setInputValue('THIS IS NOT FOUND');

      expect(comboBox.opened && comboBox.$.overlay.$.dropdown.$.overlay.hidden).to.be.true;
    });
  });

  describe('external filtering', () => {
    beforeEach(() => {
      comboBox.items = undefined;
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
    });

    it('should set items to filteredItems', () => {
      comboBox.items = ['foo'];

      expect(comboBox.filteredItems).to.eql(['foo']);
    });

    it('should not filter items', () => {
      setInputValue('foo');

      expect(getFilteredItems()).to.eql(['foo', 'bar', 'baz']);
    });

    it('should remove focus while loading', () => {
      setInputValue('foo');
      comboBox.filteredItems = ['foo'];
      expect(comboBox._focusedIndex).to.eql(0);

      comboBox.loading = true;

      expect(comboBox._focusedIndex).to.eql(-1);
    });

    it('should focus on filtered value', () => {
      comboBox.filteredItems = ['foo'];
      setInputValue('bar');
      expect(comboBox._focusedIndex).to.eql(-1);

      comboBox.filteredItems = ['foo', 'bar', 'baz'];

      expect(comboBox._focusedIndex).to.eql(1);
    });

    it('should focus on value when filter is empty', () => {
      comboBox.value = 'bar';

      comboBox.filteredItems = ['foo', 'bar', 'baz'];

      expect(comboBox._focusedIndex).to.eql(1);
    });

    it('should update focus when opening with filling filter', () => {
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      comboBox.close();

      setInputValue('bar');

      expect(comboBox.opened).to.be.true;
      expect(comboBox._focusedIndex).to.equal(1);
    });

    it('should reset focus when opening with filter cleared', () => {
      comboBox.filteredItems = ['foo', 'bar', 'baz'];
      comboBox.value = 'bar';
      comboBox.close();

      setInputValue('');

      expect(comboBox.opened).to.be.true;
      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should not hide the overlay while loading', () => {
      setInputValue('foo');

      comboBox.loading = true;

      expect(comboBox.opened).to.be.true;
      expect(comboBox.$.overlay.hidden).to.be.false;
    });

    // FIXME(@platosha): Hiding does not play nice with lazy loading.
    // Should display a loading indicator instead.
    it.skip('should hide the scroller while loading', () => {
      setInputValue('foo');

      comboBox.loading = true;

      expect(comboBox.opened).to.be.true;
      expect(comboBox.$.overlay._scroller.hidden).to.be.true;
    });

    it('should refresh items after reassignment', () => {
      comboBox.filteredItems = ['foo'];

      expect(getFilteredItems()).to.eql(['foo']);
    });

    it('should toggle loading attributes to host and overlay', () => {
      comboBox.loading = true;
      expect(comboBox.hasAttribute('loading')).to.be.true;

      comboBox.open();
      expect(comboBox.$.overlay.$.dropdown.$.overlay.hasAttribute('loading')).to.be.true;

      comboBox.loading = false;
      expect(comboBox.hasAttribute('loading')).to.be.false;
      expect(comboBox.$.overlay.$.dropdown.$.overlay.hasAttribute('loading')).to.be.false;
    });

    it('should not notify resize the dropdown if not opened', () => {
      comboBox.open();
      comboBox.close();

      const resizeSpy = sinon.spy(comboBox.$.overlay.$.dropdown, 'notifyResize');
      comboBox.filteredItems = ['foo', 'bar', 'baz'];

      expect(resizeSpy.called).to.be.false;
    });

    it('should not re-position the overlay if not opened', () => {
      const repositionSpy = sinon.spy(comboBox, '_repositionOverlay');
      comboBox.filteredItems = ['foo', 'bar', 'baz'];

      expect(repositionSpy.called).to.be.false;
    });

    it('should not perform measurements when loading changes if not opened', () => {
      const measureSpy = sinon.spy(comboBox.inputElement, 'getBoundingClientRect');
      comboBox.loading = true;

      expect(measureSpy.called).to.be.false;
    });
  });

  describe('setting items when opened', () => {
    beforeEach(() => {
      comboBox.items = [];
    });

    it('should properly display all items in the selector', () => {
      comboBox.open();
      comboBox.filteredItems = Array.apply(null, Array(20)).map((_, i) => `item${i}`);
      flush();
      expect(comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item').length).to.equal(20);
    });
  });
});

describe('filtered items attribute', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-combo-box filtered-items='["a", "b", "c"]' value='b'></vaadin-combo-box>`);
  });

  it('should not throw when passing filteredItems and value as attributes', () => {
    expect(comboBox._focusedIndex).to.eql(1);
  });
});
