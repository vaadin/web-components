import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { onceScrolled } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('keyboard', () => {
  let comboBox;

  function filter(value) {
    comboBox.inputElement.value = value;
    comboBox.inputElement.dispatchEvent(new CustomEvent('input'));
  }

  function getFocusedIndex() {
    return comboBox._focusedIndex;
  }

  function inputChar(char) {
    const target = comboBox.inputElement;
    target.value += char;
    keyDownOn(target, char.charCodeAt(0));
    target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
  }

  function inputText(text) {
    for (var i = 0; i < text.length; i++) {
      inputChar(text[i]);
    }
  }

  function arrowDown() {
    keyDownOn(comboBox.inputElement, 40);
  }

  function arrowUp() {
    keyDownOn(comboBox.inputElement, 38);
  }

  function enter() {
    keyDownOn(comboBox.inputElement, 13);
  }

  function esc() {
    keyDownOn(comboBox.inputElement, 27);
  }

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
  });

  describe('opening the overlay', () => {
    it('should open the overlay with arrow down and not focus any item', () => {
      arrowDown();

      expect(comboBox.opened).to.equal(true);
      expect(getFocusedIndex()).to.equal(-1);
    });

    it('should open the overlay with arrow up and not focus any item', () => {
      arrowUp();

      expect(comboBox.opened).to.equal(true);
      expect(getFocusedIndex()).to.equal(-1);
    });

    it('should have focus on the selected item after opened', () => {
      comboBox.value = 'foo';

      arrowDown();

      expect(getFocusedIndex()).to.equal(0);
    });
  });

  describe('navigating the items after overlay opened', () => {
    beforeEach((done) =>
      setTimeout(() => {
        arrowDown();
        done();
      })
    );

    it('should focus on the first item with arrow down', () => {
      arrowDown();

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should focus on the last item with up arrow', () => {
      arrowUp();

      expect(getFocusedIndex()).to.equal(2);
    });

    it('should focus on the previous item with arrow up', () => {
      arrowDown();
      arrowDown();

      arrowUp();

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should not go below the last item', () => {
      arrowDown();
      arrowDown();
      arrowDown();

      expect(getFocusedIndex()).to.equal(2);

      arrowDown();

      expect(getFocusedIndex()).to.equal(2);
    });

    it('should not remove focus', () => {
      arrowDown();

      arrowUp();

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should focus only on filtered items', () => {
      filter('foo');
      arrowDown();

      expect(getFocusedIndex()).to.equal(0);

      arrowDown();

      expect(getFocusedIndex()).to.equal(0);
    });
  });

  describe('selecting items', () => {
    beforeEach(async () => {
      comboBox.value = 'bar';

      comboBox.open();
      await aTimeout(1);
    });

    it('should select focused item with enter', async () => {
      arrowDown();
      await aTimeout(1);
      enter();
      await aTimeout(1);
      expect(comboBox.value).to.equal('baz');
    });

    it('should clear the selection with enter when input is cleared', () => {
      filter('');
      enter();

      expect(comboBox.value).to.eql('');
    });

    it('should close the overlay with enter when custom values are allowed', () => {
      comboBox.allowCustomValue = true;
      filter('foobar');

      enter();

      expect(comboBox.value).to.equal('foobar');
      expect(comboBox.opened).to.equal(false);
    });

    it('should stop propagation of the keyboard enter event', () => {
      const keydownSpy = sinon.spy();
      document.addEventListener('keydown', keydownSpy);
      enter();
      expect(keydownSpy.called).to.be.false;
    });

    it('should not close the overlay with enter when custom values are not allowed', () => {
      filter('foobar');

      enter();

      expect(comboBox.value).to.equal('bar');
      expect(comboBox.opened).to.equal(true);
    });

    it('should revert to the custom value after filtering', () => {
      comboBox.allowCustomValue = true;
      comboBox.value = 'foobar';
      filter('bar');
      esc();
      expect(comboBox.inputElement.value).to.eql('bar');
      esc();
      expect(comboBox.inputElement.value).to.equal('foobar');
    });

    it('should revert a non-listed value to the custom value after filtering', () => {
      comboBox.allowCustomValue = true;
      comboBox.value = 'foobar';
      filter('barbaz');
      esc();
      expect(comboBox.inputElement.value).to.equal('foobar');
    });

    it('should revert to the custom value after keyboar navigation', () => {
      comboBox.allowCustomValue = true;
      comboBox.value = 'foobar';
      arrowDown();
      esc();
      expect(comboBox.inputElement.value).to.eql('foobar');
      esc();
      expect(comboBox.inputElement.value).to.equal('foobar');
    });

    it('should close the overlay with enter', () => {
      enter();

      expect(comboBox.opened).to.equal(false);
    });

    it('should remove focus with escape', () => {
      comboBox._focusedIndex = 0;

      esc();

      expect(comboBox.opened).to.equal(true);
      expect(comboBox._focusedIndex).to.eql(-1);
    });

    it('should close the overlay with escape if there is no focus', () => {
      comboBox._focusedIndex = -1;

      esc();

      expect(comboBox.opened).to.equal(false);
    });

    it('escape key event should not be propagated', () => {
      const listener = document.body.addEventListener('keydown', (e) => {
        if (e.keyCode == 27) {
          throw new Error('Escape key was propagated to body');
        }
      });

      esc();

      document.body.removeEventListener('keydown', listener);
    });

    it('click event should not be propagated', () => {
      const listener = document.body.addEventListener('click', () => {
        throw new Error('Click event was propagated to body');
      });

      comboBox.$.overlay._selector
        .querySelector('vaadin-combo-box-item')
        .dispatchEvent(new CustomEvent('click', { composed: true, bubbles: true }));

      document.body.removeEventListener('click', listener);
    });

    it('click event should not be propagated', () => {
      const listener = document.body.addEventListener('click', () => {
        throw new Error('Click event was propagated to body');
      });

      comboBox.$.overlay._selector
        .querySelector('vaadin-combo-box-item')
        .dispatchEvent(new CustomEvent('click', { composed: true, bubbles: true }));

      document.body.removeEventListener('click', listener);
    });

    it('should cancel typing with escape', () => {
      filter('baz');

      esc();

      expect(comboBox.value).to.equal('bar');
    });

    it('should select typed item', () => {
      filter('baz');

      enter();

      expect(comboBox.value).to.equal('baz');
    });

    it('should reset the input value synchronously when keyboard navigating', () => {
      arrowDown();
      expect(comboBox.inputElement.value).to.eql('');
    });

    it('should prefill the input field when navigating down', async () => {
      arrowDown();
      await aTimeout(1);
      expect(comboBox.inputElement.value).to.eql('baz');
    });

    const isSafari = /Safari/i.test(navigator.userAgent);
    (isSafari ? it.skip : it)('should select the input field text when navigating down', async () => {
      arrowDown();
      await aTimeout(1);
      expect(comboBox._nativeInput.selectionStart).to.eql(0);
      expect(comboBox._nativeInput.selectionEnd).to.eql(3);
    });

    it('should prefill the input field when navigating up', async () => {
      arrowUp();
      await aTimeout(1);
      expect(comboBox.inputElement.value).to.eql('foo');
    });

    it('should not prefill the input when there are no items to navigate', async () => {
      filter('invalid filter');

      arrowDown();
      await aTimeout(1);
      expect(comboBox.inputElement.value).to.eql('invalid filter');
    });

    (isSafari ? it.skip : it)('should select the input field text when navigating up', async () => {
      arrowUp();
      await aTimeout(1);
      expect(comboBox._nativeInput.selectionStart).to.eql(0);
      expect(comboBox._nativeInput.selectionEnd).to.eql(3);
    });

    it('should revert back to filter with escape', async () => {
      filter('b');

      arrowDown();
      await aTimeout(1);
      expect(comboBox.inputElement.value).to.eql('bar');
      esc();
      expect(comboBox.inputElement.value).to.eql('b');
    });

    it('should remove selection from the input value when reverting', () => {
      filter('b');
      arrowDown();
      esc();

      expect(comboBox.inputElement.selectionStart).to.eql(comboBox.inputElement.selectionEnd);
    });

    it('should revert back to value if there is no filter', () => {
      arrowDown();

      esc();

      expect(comboBox.inputElement.value).to.eql('bar');
    });

    it('should keep selected item on escape when custom value allowed', () => {
      comboBox.allowCustomValue = true;
      esc();
      esc();
      expect(comboBox.selectedItem).to.eql('bar');
    });

    it('should remove selection from the input value selecting value', async () => {
      arrowDown();
      await aTimeout(1);
      enter();

      expect(comboBox._nativeInput.selectionStart).to.eql(3);
      expect(comboBox._nativeInput.selectionEnd).to.eql(3);
    });
  });

  describe('scrolling items', () => {
    let selector;

    beforeEach(async () => {
      const items = [];

      for (let i = 0; i < 100; i++) {
        items.push(i.toString());
      }

      comboBox.open();
      selector = comboBox.$.overlay._selector;
      comboBox.items = items;

      await aTimeout(1);
    });

    it('should scroll down after reaching the last visible item', () => {
      selector.scrollToIndex(0);
      comboBox._focusedIndex = comboBox.$.overlay._visibleItemsCount() - 1;
      expect(selector.firstVisibleIndex).to.eql(0);

      arrowDown();

      expect(selector.firstVisibleIndex).to.eql(1);
    });

    it('should scroll up after reaching the first visible item', () => {
      comboBox._focusedIndex = 1;
      selector.scrollToIndex(1);
      expect(selector.firstVisibleIndex).to.eql(1);

      arrowUp();

      expect(selector.firstVisibleIndex).to.eql(0);
    });

    it('should scroll to first visible when navigating down above viewport', () => {
      comboBox._focusedIndex = 5;
      selector.scrollToIndex(50);

      arrowDown();

      expect(selector.firstVisibleIndex).to.eql(6);
    });

    it('should scroll to first visible when navigating up above viewport', () => {
      comboBox._focusedIndex = 5;
      selector.scrollToIndex(50);

      arrowUp();

      expect(selector.firstVisibleIndex).to.eql(4);
    });

    it('should scroll to last visible when navigating up below viewport', () => {
      comboBox._focusedIndex = 50;
      selector.scrollToIndex(0);
      expect(selector.firstVisibleIndex).to.eql(0);

      arrowUp();

      expect(selector.firstVisibleIndex).to.eql(49 - comboBox.$.overlay._visibleItemsCount() + 1);
    });

    it('should scroll to last visible when navigating down below viewport', () => {
      comboBox._focusedIndex = 50;
      selector.scrollToIndex(0);
      expect(selector.firstVisibleIndex).to.eql(0);

      arrowDown();

      expect(selector.firstVisibleIndex).to.eql(51 - comboBox.$.overlay._visibleItemsCount() + 1);
    });

    it('should scroll to start if no items focused when opening overlay', async () => {
      selector.scrollToIndex(50);
      comboBox.close();

      comboBox.open();
      await aTimeout(0);
      expect(selector.firstVisibleIndex).to.eql(0);
    });

    it('should scroll to focused item when opening overlay', async () => {
      selector.scrollToIndex(0);
      comboBox.close();
      comboBox.value = '50';

      comboBox.open();

      await onceScrolled(comboBox.$.overlay._scroller);
      expect(selector.firstVisibleIndex).to.be.within(50 - comboBox.$.overlay._visibleItemsCount(), 50);
    });
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      comboBox.autoOpenDisabled = true;
    });

    it('should open the overlay with arrow down', () => {
      arrowDown();
      expect(comboBox.opened).to.equal(true);
    });

    it('should open the overlay with arrow up', () => {
      arrowUp();
      expect(comboBox.opened).to.equal(true);
    });

    it('should apply input value on focusout if input valid', () => {
      inputText('FOO');
      comboBox.dispatchEvent(new Event('focusout'));
      expect(comboBox._inputElementValue).to.equal('foo');
      expect(comboBox.value).to.equal('foo');
    });

    it('should apply input value on enter if input valid', () => {
      inputText('FOO');
      enter();
      expect(comboBox._inputElementValue).to.equal('foo');
      expect(comboBox.value).to.equal('foo');
    });

    it('should not apply input value on enter if input invalid', () => {
      inputText('quux');
      enter();
      expect(comboBox._inputElementValue).to.equal('quux');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on focusout if input invalid', () => {
      inputText('quux');
      comboBox.dispatchEvent(new Event('focusout'));
      expect(comboBox._inputElementValue).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on esc if input valid', () => {
      inputText('foo');
      esc();
      expect(comboBox._inputElementValue).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on esc if input invalid', () => {
      inputText('quux');
      esc();
      expect(comboBox._inputElementValue).to.equal('');
      expect(comboBox.value).to.equal('');
    });
  });
});
