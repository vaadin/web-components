import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, click, fixtureSync, fire } from '@vaadin/testing-helpers';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { scrollToIndex } from './helpers.js';

describe('selecting items', () => {
  let comboBox;
  let valueChangedSpy, selectedItemChangedSpy, selectionChangedSpy, changeSpy;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box style="width: 320px"></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar'];

    valueChangedSpy = sinon.spy();
    comboBox.addEventListener('value-changed', valueChangedSpy);

    selectedItemChangedSpy = sinon.spy();
    comboBox.addEventListener('selected-item-changed', selectedItemChangedSpy);

    selectionChangedSpy = sinon.spy();
    comboBox.$.overlay.addEventListener('selection-changed', selectionChangedSpy);

    changeSpy = sinon.spy();
    comboBox.addEventListener('change', changeSpy);
  });

  it('should stop click events from bubbling outside the overlay', () => {
    comboBox.open();
    comboBox.close();

    const clickSpy = sinon.spy();
    document.addEventListener('click', clickSpy);
    click(comboBox.$.overlay._selector);
    document.removeEventListener('click', clickSpy);
    expect(clickSpy.calledOnce).not.to.be.true;
  });

  it('should fire `selection-changed` when clicked on an item', () => {
    comboBox.opened = true;
    flush();
    click(comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item'));
    expect(selectionChangedSpy.calledOnce).to.be.true;
    expect(selectionChangedSpy.args[0][0].detail.item).to.eql(comboBox.items[0]);
  });

  it('should fire `selection-changed` after the scrolling grace period', (done) => {
    comboBox.open();
    comboBox.close();

    const items = [];
    for (let i = 1; i < 50; i++) {
      items.push(i);
    }
    comboBox.items = items;

    comboBox.opened = true;

    function listener() {
      // Ensure the listener is invoked only once. Otherwise, `done()` might
      // be called multiple times, which produces error for the test.
      comboBox.$.overlay._scroller.removeEventListener('scroll', listener);

      setTimeout(() => {
        const firstItem = comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');
        click(firstItem);

        expect(selectionChangedSpy.calledOnce).to.be.true;
        done();
      }, 500);
    }

    // Scroll start could delay, for example, with full SD polyfill
    comboBox.$.overlay._scroller.addEventListener('scroll', listener);

    scrollToIndex(comboBox, 20);
  });

  it('should select by using JS api', () => {
    comboBox.value = 'foo';

    comboBox.open();

    expect(comboBox.selectedItem).to.equal('foo');
    expect(comboBox.$.overlay._selectedItem).to.equal('foo');
    expect(comboBox.inputElement.value).to.equal('foo');
  });

  it('should close the dropdown on selection', () => {
    comboBox.open();
    flush();

    comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item').click();

    expect(comboBox.opened).to.equal(false);
  });

  it('should fire exactly one `value-changed` event', () => {
    comboBox.value = 'foo';
    expect(valueChangedSpy.callCount).to.equal(1);
  });

  it('should close the dropdown when reselecting the current value', () => {
    comboBox.value = 'foo';
    comboBox.open();
    fire(comboBox.$.overlay, 'selection-changed', { item: comboBox.items[0] });
    expect(comboBox.opened).to.be.false;
  });

  it('should not fire an event when reselecting the current value', () => {
    comboBox.value = 'foo';
    valueChangedSpy.resetHistory();
    fire(comboBox.$.overlay, 'selection-changed', { item: comboBox.items[0] });
    expect(valueChangedSpy.callCount).to.equal(0);
  });

  it('should not throw an error if value was undefined', () => {
    comboBox.allowCustomValue = true;
    comboBox.value = undefined;
    expect(() => {
      comboBox.open();
      comboBox.close();
    }).to.not.throw(Error);
  });

  it('should be possible to set selectedItem before attaching to the DOM', () => {
    const clone = comboBox.cloneNode(true);
    clone.items = ['foo', 'bar'];
    clone.selectedItem = 'foo';
    comboBox.parentElement.appendChild(clone);
    expect(clone.value).to.equal('foo');
    clone.remove();
  });

  it('should be possible to set selectedItem after attaching to the DOM and before setting items', () => {
    const clone = comboBox.cloneNode(true);
    comboBox.parentElement.appendChild(clone);
    clone.selectedItem = 'foo';
    clone.items = ['foo', 'bar'];
    expect(clone.value).to.equal('foo');
    clone.remove();
  });

  it('should allow changing the value in value-changed listener', (done) => {
    comboBox.open();
    const items = comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item');

    comboBox.addEventListener('value-changed', () => {
      if (comboBox.value === 'foo') {
        comboBox.value = 'bar';
        setTimeout(() => {
          comboBox.open();
          expect(comboBox.value).to.eql('bar');
          expect(comboBox.selectedItem).to.eql('bar');
          expect(items[0].selected).to.be.false;
          expect(items[1].selected).to.be.true;
          done();
        });
      }
    });
    items[0].click();
  });

  it('should allow clearing the value in value-changed listener', (done) => {
    comboBox.open();
    const item = comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');

    comboBox.addEventListener('value-changed', () => {
      if (comboBox.value) {
        comboBox.value = '';
        setTimeout(() => {
          expect(comboBox.value).to.eql('');
          expect(comboBox.selectedItem).not.to.be.ok;
          expect(item.selected).to.be.false;
          expect(comboBox.hasAttribute('has-value')).to.be.false;
          done();
        });
      }
    });
    item.click();
  });

  describe('`change` event', () => {
    it('should fire `value-changed` and `selected-item-changed` before `changed`', (done) => {
      comboBox.addEventListener('change', () => {
        expect(valueChangedSpy.called).to.be.true;
        expect(selectedItemChangedSpy.called).to.be.true;
        done();
      });

      comboBox.open();
      comboBox.value = 'foo';
      comboBox.close();
    });

    it('should fire exactly one `change` event', () => {
      comboBox.open();
      comboBox.value = 'foo';
      comboBox.close();

      expect(changeSpy.callCount).to.equal(1);
    });

    it('should not fire `change` event when not commiting a value by closing', () => {
      comboBox.value = 'foo';

      expect(changeSpy.callCount).to.equal(0);
    });

    it('should fire on clear', () => {
      comboBox.value = 'foo';
      click(comboBox.$.input.$.clearButton);

      expect(changeSpy.callCount).to.equal(1);
    });

    it('should not fire until close', () => {
      comboBox.value = 'foo';
      comboBox.open();
      comboBox.value = 'bar';

      expect(changeSpy.callCount).to.equal(0);
    });

    it('should not fire on cancel', () => {
      comboBox.open();
      comboBox.value = 'foo';
      comboBox.cancel();

      expect(changeSpy.callCount).to.equal(0);
    });

    it('should not fire for changes when closed', () => {
      comboBox.value = 'foo';

      comboBox.open();
      comboBox.close();

      expect(changeSpy.callCount).to.equal(0);
    });

    it('should stop input `change` event from bubbling', () => {
      fire(comboBox.inputElement, 'change');

      expect(changeSpy.callCount).to.equal(0);
    });

    it('should not set composed flag to true on `change` event', (done) => {
      comboBox.addEventListener('change', (e) => {
        expect(e.composed).to.be.false;
        done();
      });

      comboBox.open();
      comboBox.value = 'foo';
      comboBox.close();
    });

    it('should fire when selecting an item via click', () => {
      comboBox.open();
      const firstItem = comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');
      click(firstItem);

      expect(changeSpy.callCount).to.equal(1);
    });
  });
});

describe('clearing a selection', () => {
  let comboBox;

  let clearIcon;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box style="width: 320px" clear-button-visible></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar'];
    comboBox.value = 'foo';
    clearIcon = comboBox.inputElement.$.clearButton;
  });

  it('should show the clearing icon only when comboBox has value', () => {
    expect(window.getComputedStyle(clearIcon).display).not.to.contain('none');

    comboBox.value = '';
    expect(window.getComputedStyle(clearIcon).display).to.contain('none');
  });

  it('should clear the selection when clicking on the icon', () => {
    comboBox.open();

    click(clearIcon);

    expect(comboBox.value).to.eql('');
    expect(comboBox.$.overlay._selectedItem).to.be.null;
    expect(comboBox.selectedItem).to.be.null;
  });

  it('should not close the dropdown after clearing a selection', () => {
    comboBox.open();

    click(clearIcon);

    expect(comboBox.opened).to.eql(true);
  });

  it('should not open the dropdown after clearing a selection', () => {
    click(clearIcon);

    expect(comboBox.opened).to.eql(false);
  });

  it('should cancel click event to avoid input blur', () => {
    comboBox.open();

    const event = click(clearIcon);

    expect(event.defaultPrevented).to.eql(true);
  });
});

describe('selecting a custom value', () => {
  let comboBox;

  function filter(value) {
    comboBox.inputElement.value = value;
    fire(comboBox.inputElement, 'input');
  }

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box style="width: 320px" allow-custom-value></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'barbar'];
    comboBox.open();
    await aTimeout(0);
  });

  it('should select a value when closing when having a single exact match', () => {
    filter('barbar');

    comboBox.close();

    expect(comboBox.value).to.eql('barbar');
  });

  it('should select a value when closing when having multiple matches', () => {
    filter('BAR');

    comboBox.close();

    expect(comboBox.value).to.eql('bar');
  });

  it('should clear the selection when closing the overlay and input is cleared', () => {
    comboBox.value = 'foo';

    filter('');

    comboBox.close();

    expect(comboBox.value).to.be.empty;
    expect(comboBox.selectedItem).to.be.null;
    expect(comboBox.hasAttribute('has-value')).to.be.false;
  });

  it('should select a custom value', () => {
    comboBox.value = 'foobar';

    comboBox.close();

    expect(comboBox.value).to.eql('foobar');
    expect(comboBox.selectedItem).to.be.null;
    expect(comboBox._inputElementValue).to.eql('foobar');
    expect(comboBox.hasAttribute('has-value')).to.be.true;
  });

  it('should clear the custom value on clear', () => {
    comboBox.value = 'foobar';

    filter('');

    comboBox.close();

    expect(comboBox.value).to.be.empty;
    expect(comboBox.selectedItem).to.be.null;
  });

  it('should allow changing value to existing item when custom value is set', () => {
    comboBox.value = 'foobar';

    comboBox.close();

    comboBox.value = 'foo';
    expect(comboBox.value).to.eql('foo');
    expect(comboBox.selectedItem).to.eql('foo');
  });
});
