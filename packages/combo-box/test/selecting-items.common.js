import { expect } from '@esm-bundle/chai';
import { aTimeout, fire, fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { clickItem, getAllItems, getFirstItem, onceScrolled, scrollToIndex, setInputValue } from './helpers.js';

describe('selecting items', () => {
  let comboBox;
  let valueChangedSpy, selectedItemChangedSpy, selectionChangedSpy, changeSpy;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box style="width: 320px"></vaadin-combo-box>');
    await nextRender();
    comboBox.items = ['foo', 'bar'];

    valueChangedSpy = sinon.spy();
    comboBox.addEventListener('value-changed', valueChangedSpy);

    selectedItemChangedSpy = sinon.spy();
    comboBox.addEventListener('selected-item-changed', selectedItemChangedSpy);

    selectionChangedSpy = sinon.spy();
    comboBox._scroller.addEventListener('selection-changed', selectionChangedSpy);

    changeSpy = sinon.spy();
    comboBox.addEventListener('change', changeSpy);
  });

  it('should stop click events from bubbling outside the overlay', () => {
    const clickSpy = sinon.spy();
    document.addEventListener('click', clickSpy);
    comboBox._scroller.click();
    document.removeEventListener('click', clickSpy);
    expect(clickSpy.calledOnce).not.to.be.true;
  });

  it('should fire `selection-changed` when clicked on an item', () => {
    comboBox.opened = true;
    clickItem(comboBox, 0);
    expect(selectionChangedSpy.calledOnce).to.be.true;
    expect(selectionChangedSpy.args[0][0].detail.item).to.eql(comboBox.items[0]);
  });

  it('should fire `selection-changed` after the scrolling grace period', async () => {
    comboBox.items = new Array(50).fill().map((_, idx) => `${idx}`);
    comboBox.opened = true;
    scrollToIndex(comboBox, 20);

    await onceScrolled(comboBox);

    clickItem(comboBox, 0);
    expect(selectionChangedSpy.calledOnce).to.be.true;
  });

  it('should select by using JS api', () => {
    comboBox.value = 'foo';

    comboBox.open();

    expect(comboBox.selectedItem).to.equal('foo');
    expect(comboBox._scroller.selectedItem).to.equal('foo');
    expect(comboBox.inputElement.value).to.equal('foo');
  });

  it('should close the dropdown on selection', () => {
    comboBox.open();

    clickItem(comboBox, 0);

    expect(comboBox.opened).to.equal(false);
  });

  it('should fire exactly one `value-changed` event', () => {
    comboBox.value = 'foo';
    expect(valueChangedSpy.callCount).to.equal(1);
  });

  it('should close the dropdown when reselecting the current value', () => {
    comboBox.value = 'foo';
    comboBox.open();
    clickItem(comboBox, 0);
    expect(comboBox.opened).to.be.false;
  });

  it('should not fire an event when reselecting the current value', () => {
    comboBox.value = 'foo';
    comboBox.open();
    valueChangedSpy.resetHistory();
    clickItem(comboBox, 0);
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
    const items = getAllItems(comboBox);

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
    const item = getFirstItem(comboBox);

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
      outsideClick();
    });

    it('should fire exactly one `change` event', () => {
      comboBox.open();
      comboBox.value = 'foo';
      outsideClick();

      expect(changeSpy.callCount).to.equal(1);
    });

    it('should not fire `change` event when not committing a value by closing', () => {
      comboBox.value = 'foo';

      expect(changeSpy.callCount).to.equal(0);
    });

    it('should fire on clear', () => {
      comboBox.value = 'foo';
      comboBox.$.clearButton.click();

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
      outsideClick();

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
      outsideClick();
    });

    it('should fire when selecting an item via click', () => {
      comboBox.open();
      clickItem(comboBox, 0);
      expect(changeSpy.callCount).to.equal(1);
    });
  });
});

describe('selecting a custom value', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box style="width: 320px" allow-custom-value></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'barbar'];
    comboBox.open();
    await aTimeout(0);
  });

  it('should select a value when closing when having a single exact match', () => {
    setInputValue(comboBox, 'barbar');

    outsideClick();

    expect(comboBox.value).to.eql('barbar');
  });

  it('should select a value when closing when having multiple matches', () => {
    setInputValue(comboBox, 'BAR');

    outsideClick();

    expect(comboBox.value).to.eql('bar');
  });

  it('should clear the selection when closing the overlay and input is cleared', () => {
    comboBox.value = 'foo';

    setInputValue(comboBox, '');

    outsideClick();

    expect(comboBox.value).to.be.empty;
    expect(comboBox.selectedItem).to.be.null;
    expect(comboBox.hasAttribute('has-value')).to.be.false;
  });

  it('should select a custom value', () => {
    comboBox.value = 'foobar';

    outsideClick();

    expect(comboBox.value).to.eql('foobar');
    expect(comboBox.selectedItem).to.be.null;
    expect(comboBox.inputElement.value).to.eql('foobar');
    expect(comboBox.hasAttribute('has-value')).to.be.true;
  });

  it('should clear the custom value on clear', () => {
    comboBox.value = 'foobar';

    setInputValue(comboBox, '');

    outsideClick();

    expect(comboBox.value).to.be.empty;
    expect(comboBox.selectedItem).to.be.null;
  });

  it('should allow changing value to existing item when custom value is set', () => {
    comboBox.value = 'foobar';

    outsideClick();

    comboBox.value = 'foo';
    expect(comboBox.value).to.eql('foo');
    expect(comboBox.selectedItem).to.eql('foo');
  });
});
