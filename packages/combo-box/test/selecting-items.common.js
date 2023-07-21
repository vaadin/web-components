import { expect } from '@esm-bundle/chai';
import { aTimeout, fire, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { clickItem, getAllItems, onceScrolled, scrollToIndex, setInputValue } from './helpers.js';

describe('selecting items', () => {
  let comboBox;
  let valueChangedSpy, selectedItemChangedSpy, selectionChangedSpy, changeSpy;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box style="width: 320px"></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar'];
    await nextRender();

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

  it('should fire `selection-changed` when clicked on an item', async () => {
    comboBox.opened = true;
    await nextUpdate(comboBox);
    clickItem(comboBox, 0);
    expect(selectionChangedSpy.calledOnce).to.be.true;
    expect(selectionChangedSpy.args[0][0].detail.item).to.eql(comboBox.items[0]);
  });

  it('should fire `selection-changed` after the scrolling grace period', async () => {
    const items = [];
    for (let i = 1; i < 50; i++) {
      items.push(i);
    }
    comboBox.items = items;

    comboBox.opened = true;
    await nextUpdate(comboBox);

    scrollToIndex(comboBox, 20);

    await onceScrolled(comboBox);

    clickItem(comboBox, 0);
    expect(selectionChangedSpy.calledOnce).to.be.true;
  });

  it('should select by using JS api', async () => {
    comboBox.value = 'foo';

    comboBox.open();
    await nextUpdate(comboBox);

    expect(comboBox.selectedItem).to.equal('foo');
    expect(comboBox._scroller.selectedItem).to.equal('foo');
    expect(comboBox.inputElement.value).to.equal('foo');
  });

  it('should close the dropdown on selection', async () => {
    comboBox.open();
    await nextUpdate(comboBox);

    clickItem(comboBox, 0);
    await nextUpdate(comboBox);

    expect(comboBox.opened).to.equal(false);
  });

  it('should fire exactly one `value-changed` event', async () => {
    comboBox.value = 'foo';
    await nextUpdate(comboBox);
    expect(valueChangedSpy.callCount).to.equal(1);
  });

  it('should close the dropdown when reselecting the current value', async () => {
    comboBox.value = 'foo';
    comboBox.open();
    await nextUpdate(comboBox);
    clickItem(comboBox, 0);
    await nextUpdate(comboBox);
    expect(comboBox.opened).to.be.false;
  });

  it('should not fire an event when reselecting the current value', async () => {
    comboBox.value = 'foo';
    comboBox.open();
    await nextUpdate(comboBox);
    valueChangedSpy.resetHistory();
    clickItem(comboBox, 0);
    await nextUpdate(comboBox);
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

  it('should be possible to set selectedItem before attaching to the DOM', async () => {
    const clone = comboBox.cloneNode(true);
    clone.items = ['foo', 'bar'];
    clone.selectedItem = 'foo';
    comboBox.parentElement.appendChild(clone);
    await nextUpdate(comboBox);
    expect(clone.value).to.equal('foo');
    clone.remove();
  });

  it('should be possible to set selectedItem after attaching to the DOM and before setting items', async () => {
    const clone = comboBox.cloneNode(true);
    comboBox.parentElement.appendChild(clone);
    clone.selectedItem = 'foo';
    clone.items = ['foo', 'bar'];
    await nextUpdate(comboBox);
    expect(clone.value).to.equal('foo');
    clone.remove();
  });

  describe('value-changed listener', () => {
    let items;

    beforeEach(async () => {
      comboBox.open();
      await nextRender();
      items = getAllItems(comboBox);
    });

    it('should allow changing the value in value-changed listener', (done) => {
      comboBox.addEventListener('value-changed', () => {
        if (comboBox.value === 'foo') {
          comboBox.value = 'bar';
          setTimeout(() => {
            comboBox.open();
            // Wait for re-opening
            requestAnimationFrame(() => {
              expect(comboBox.value).to.eql('bar');
              expect(comboBox.selectedItem).to.eql('bar');
              expect(items[0].selected).to.be.false;
              expect(items[1].selected).to.be.true;
              done();
            });
          });
        }
      });
      items[0].click();
    });

    it('should allow clearing the value in value-changed listener', (done) => {
      comboBox.addEventListener('value-changed', () => {
        if (comboBox.value) {
          comboBox.value = '';
          setTimeout(() => {
            expect(comboBox.value).to.eql('');
            expect(comboBox.selectedItem).not.to.be.ok;
            expect(items[0].selected).to.be.false;
            expect(comboBox.hasAttribute('has-value')).to.be.false;
            done();
          });
        }
      });
      items[0].click();
    });
  });

  describe('`change` event', () => {
    it('should fire `value-changed` and `selected-item-changed` before `changed`', (done) => {
      comboBox.addEventListener('change', () => {
        expect(valueChangedSpy.called).to.be.true;
        expect(selectedItemChangedSpy.called).to.be.true;
        done();
      });

      comboBox.open();

      requestAnimationFrame(() => {
        comboBox.value = 'foo';

        requestAnimationFrame(() => {
          comboBox.close();
        });
      });
    });

    it('should fire exactly one `change` event', async () => {
      comboBox.open();
      await nextUpdate(comboBox);
      comboBox.value = 'foo';

      comboBox.close();
      await nextUpdate(comboBox);

      expect(changeSpy.callCount).to.equal(1);
    });

    it('should not fire `change` event when not committing a value by closing', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);
      expect(changeSpy.callCount).to.equal(0);
    });

    it('should fire on clear', () => {
      comboBox.value = 'foo';
      comboBox.$.clearButton.click();

      expect(changeSpy.callCount).to.equal(1);
    });

    it('should not fire until close', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      comboBox.open();
      await nextUpdate(comboBox);

      comboBox.value = 'bar';
      await nextUpdate(comboBox);

      expect(changeSpy.callCount).to.equal(0);
    });

    it('should not fire on cancel', async () => {
      comboBox.open();
      comboBox.value = 'foo';
      await nextUpdate(comboBox);
      comboBox.cancel();
      await nextUpdate(comboBox);

      expect(changeSpy.callCount).to.equal(0);
    });

    it('should not fire for changes when closed', async () => {
      comboBox.value = 'foo';

      comboBox.open();
      await nextUpdate(comboBox);

      comboBox.close();
      await nextUpdate(comboBox);

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

    it('should fire when selecting an item via click', async () => {
      comboBox.open();
      await nextUpdate(comboBox);
      clickItem(comboBox, 0);
      await nextUpdate(comboBox);
      expect(changeSpy.callCount).to.equal(1);
    });
  });
});

describe('clearing a selection', () => {
  let comboBox, clearIcon;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box style="width: 320px" clear-button-visible></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar'];
    comboBox.value = 'foo';
    await nextRender();
    clearIcon = comboBox.$.clearButton;
  });

  it('should show the clearing icon only when comboBox has value', async () => {
    expect(window.getComputedStyle(clearIcon).display).not.to.contain('none');
    comboBox.value = '';
    await nextUpdate(comboBox);
    expect(window.getComputedStyle(clearIcon).display).to.contain('none');
  });

  it('should clear the selection when clicking on the icon', async () => {
    comboBox.open();
    await nextUpdate(comboBox);

    clearIcon.click();

    expect(comboBox.value).to.eql('');
    expect(comboBox._scroller.selectedItem).to.be.null;
    expect(comboBox.selectedItem).to.be.null;
  });

  it('should not close the dropdown after clearing a selection', async () => {
    comboBox.open();
    await nextUpdate(comboBox);

    clearIcon.click();

    expect(comboBox.opened).to.eql(true);
  });

  it('should de-select dropdown item after clearing a selection', async () => {
    comboBox.open();
    await nextUpdate(comboBox);

    const item = document.querySelector('vaadin-combo-box-item');
    expect(item.hasAttribute('selected')).to.be.true;

    clearIcon.click();
    await nextUpdate(comboBox);
    expect(item.hasAttribute('selected')).to.be.false;
  });

  it('should not open the dropdown after clearing a selection', async () => {
    clearIcon.click();
    await nextUpdate(comboBox);

    expect(comboBox.opened).to.eql(false);
  });

  it('should prevent mousedown event to avoid input blur', async () => {
    comboBox.open();
    await nextUpdate(comboBox);

    const event = new CustomEvent('mousedown', { cancelable: true });
    clearIcon.dispatchEvent(event);

    expect(event.defaultPrevented).to.be.true;
  });
});

describe('selecting a custom value', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box style="width: 320px" allow-custom-value></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'barbar'];
    await nextRender();
    comboBox.open();
    await aTimeout(0);
  });

  it('should select a value when closing when having a single exact match', async () => {
    setInputValue(comboBox, 'barbar');
    await nextUpdate(comboBox);

    comboBox.close();
    await nextUpdate(comboBox);

    expect(comboBox.value).to.eql('barbar');
  });

  it('should select a value when closing when having multiple matches', async () => {
    setInputValue(comboBox, 'BAR');
    await nextUpdate(comboBox);

    comboBox.close();
    await nextUpdate(comboBox);

    expect(comboBox.value).to.eql('bar');
  });

  it('should clear the selection when closing the overlay and input is cleared', async () => {
    comboBox.value = 'foo';
    await nextUpdate(comboBox);

    setInputValue(comboBox, '');
    await nextUpdate(comboBox);

    comboBox.close();
    await nextUpdate(comboBox);

    expect(comboBox.value).to.be.empty;
    expect(comboBox.selectedItem).to.be.null;
    expect(comboBox.hasAttribute('has-value')).to.be.false;
  });

  it('should select a custom value', async () => {
    comboBox.value = 'foobar';
    await nextUpdate(comboBox);

    comboBox.close();
    await nextUpdate(comboBox);

    expect(comboBox.value).to.eql('foobar');
    expect(comboBox.selectedItem).to.be.null;
    expect(comboBox.inputElement.value).to.eql('foobar');
    expect(comboBox.hasAttribute('has-value')).to.be.true;
  });

  it('should clear the custom value on clear', async () => {
    comboBox.value = 'foobar';
    await nextUpdate(comboBox);

    setInputValue(comboBox, '');
    await nextUpdate(comboBox);

    comboBox.close();
    await nextUpdate(comboBox);

    expect(comboBox.value).to.be.empty;
    expect(comboBox.selectedItem).to.be.null;
  });

  it('should allow changing value to existing item when custom value is set', async () => {
    comboBox.value = 'foobar';
    await nextUpdate(comboBox);

    comboBox.close();
    await nextUpdate(comboBox);

    comboBox.value = 'foo';
    await nextUpdate(comboBox);
    expect(comboBox.value).to.eql('foo');
    expect(comboBox.selectedItem).to.eql('foo');
  });
});
