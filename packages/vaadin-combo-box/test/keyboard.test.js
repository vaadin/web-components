import { expect } from '@esm-bundle/chai';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import {
  aTimeout,
  fixtureSync,
  focusout,
  keyDownOn,
  arrowDownKeyDown,
  arrowUpKeyDown,
  enterKeyDown,
  escKeyDown,
  fire,
  isDesktopSafari
} from '@vaadin/testing-helpers';
import { onceScrolled } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('keyboard', () => {
  let comboBox;

  function filter(value) {
    comboBox.inputElement.value = value;
    fire(comboBox.inputElement, 'input');
  }

  function getFocusedIndex() {
    return comboBox._focusedIndex;
  }

  function inputChar(char) {
    const target = comboBox.inputElement;
    target.value += char;
    keyDownOn(target, char.charCodeAt(0));
    fire(target, 'input');
  }

  function inputText(text) {
    for (var i = 0; i < text.length; i++) {
      inputChar(text[i]);
    }
  }

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
  });

  describe('opening the overlay', () => {
    it('should open the overlay with arrow down and not focus any item', () => {
      arrowDownKeyDown(comboBox.inputElement);

      expect(comboBox.opened).to.equal(true);
      expect(getFocusedIndex()).to.equal(-1);
    });

    it('should open the overlay with arrow up and not focus any item', () => {
      arrowUpKeyDown(comboBox.inputElement);

      expect(comboBox.opened).to.equal(true);
      expect(getFocusedIndex()).to.equal(-1);
    });

    it('should have focus on the selected item after opened', () => {
      comboBox.value = 'foo';

      arrowDownKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(0);
    });
  });

  describe('navigating the items after overlay opened', () => {
    beforeEach((done) =>
      setTimeout(() => {
        arrowDownKeyDown(comboBox.inputElement);
        comboBox.inputElement.focus();
        done();
      })
    );

    it('should focus on the first item with arrow down', () => {
      arrowDownKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should focus on the last item with up arrow', () => {
      arrowUpKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(2);
    });

    it('should focus on the previous item with arrow up', () => {
      arrowDownKeyDown(comboBox.inputElement);
      arrowDownKeyDown(comboBox.inputElement);

      arrowUpKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should not go below the last item', () => {
      arrowDownKeyDown(comboBox.inputElement);
      arrowDownKeyDown(comboBox.inputElement);
      arrowDownKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(2);

      arrowDownKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(2);
    });

    it('should not remove focus', () => {
      arrowDownKeyDown(comboBox.inputElement);

      arrowUpKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should focus only on filtered items', () => {
      filter('foo');
      arrowDownKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(0);

      arrowDownKeyDown(comboBox.inputElement);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should tab to the next focusable', async () => {
      await sendKeys({ press: 'Tab' });

      expect(document.activeElement).to.equal(document.body);
    });

    describe('focusable items content', () => {
      let button;

      beforeEach(() => {
        button = document.createElement('button');
        button.textContent = 'Button';
      });

      afterEach(() => {
        button.remove();
      });

      it('should tab to the next focusable when items have focusable content', async () => {
        comboBox.renderer = (root) => (root.innerHTML = '<input>');
        document.body.appendChild(button);

        // Workaround Firefox sendKeys bug
        button.focus();
        comboBox.inputElement.focus();
        arrowDownKeyDown(comboBox.inputElement);

        await sendKeys({ press: 'Tab' });
        expect(document.activeElement).to.equal(button);
      });
    });
  });

  describe('selecting items', () => {
    beforeEach(async () => {
      comboBox.value = 'bar';

      comboBox.open();
      await aTimeout(1);
    });

    it('should select focused item with enter', async () => {
      arrowDownKeyDown(comboBox.inputElement);
      await aTimeout(1);
      enterKeyDown(comboBox.inputElement);
      await aTimeout(1);
      expect(comboBox.value).to.equal('baz');
    });

    it('should clear the selection with enter when input is cleared', () => {
      filter('');
      enterKeyDown(comboBox.inputElement);

      expect(comboBox.value).to.eql('');
    });

    it('should close the overlay with enter when custom values are allowed', () => {
      comboBox.allowCustomValue = true;
      filter('foobar');

      enterKeyDown(comboBox.inputElement);

      expect(comboBox.value).to.equal('foobar');
      expect(comboBox.opened).to.equal(false);
    });

    it('should stop propagation of the keyboard enter event', () => {
      const keydownSpy = sinon.spy();
      document.addEventListener('keydown', keydownSpy);
      enterKeyDown(comboBox.inputElement);
      expect(keydownSpy.called).to.be.false;
    });

    it('should not close the overlay with enter when custom values are not allowed', () => {
      filter('foobar');

      enterKeyDown(comboBox.inputElement);

      expect(comboBox.value).to.equal('bar');
      expect(comboBox.opened).to.equal(true);
    });

    it('should revert to the custom value after filtering', () => {
      comboBox.allowCustomValue = true;
      comboBox.value = 'foobar';
      filter('bar');
      escKeyDown(comboBox.inputElement);
      expect(comboBox.inputElement.value).to.eql('bar');
      escKeyDown(comboBox.inputElement);
      expect(comboBox.inputElement.value).to.equal('foobar');
    });

    it('should revert a non-listed value to the custom value after filtering', () => {
      comboBox.allowCustomValue = true;
      comboBox.value = 'foobar';
      filter('barbaz');
      escKeyDown(comboBox.inputElement);
      expect(comboBox.inputElement.value).to.equal('foobar');
    });

    it('should revert to the custom value after keyboar navigation', () => {
      comboBox.allowCustomValue = true;
      comboBox.value = 'foobar';
      arrowDownKeyDown(comboBox.inputElement);
      escKeyDown(comboBox.inputElement);
      expect(comboBox.inputElement.value).to.eql('foobar');
      escKeyDown(comboBox.inputElement);
      expect(comboBox.inputElement.value).to.equal('foobar');
    });

    it('should close the overlay with enter', () => {
      enterKeyDown(comboBox.inputElement);

      expect(comboBox.opened).to.equal(false);
    });

    it('should remove focus with escape', () => {
      comboBox._focusedIndex = 0;

      escKeyDown(comboBox.inputElement);

      expect(comboBox.opened).to.equal(true);
      expect(comboBox._focusedIndex).to.eql(-1);
    });

    it('should close the overlay with escape if there is no focus', () => {
      comboBox._focusedIndex = -1;

      escKeyDown(comboBox.inputElement);

      expect(comboBox.opened).to.equal(false);
    });

    it('escape key event should not be propagated', () => {
      const spy = sinon.spy();

      document.body.addEventListener('keydown', spy);
      escKeyDown(comboBox.inputElement);
      document.body.removeEventListener('keydown', spy);

      expect(spy.called).to.be.false;
    });

    it('should cancel typing with escape', () => {
      filter('baz');

      escKeyDown(comboBox.inputElement);

      expect(comboBox.value).to.equal('bar');
    });

    it('should select typed item', () => {
      filter('baz');

      enterKeyDown(comboBox.inputElement);

      expect(comboBox.value).to.equal('baz');
    });

    it('should reset the input value synchronously when keyboard navigating', () => {
      arrowDownKeyDown(comboBox.inputElement);
      expect(comboBox.inputElement.value).to.eql('');
    });

    it('should prefill the input field when navigating down', async () => {
      arrowDownKeyDown(comboBox.inputElement);
      await aTimeout(1);
      expect(comboBox.inputElement.value).to.eql('baz');
    });

    (isDesktopSafari ? it.skip : it)('should select the input field text when navigating down', async () => {
      arrowDownKeyDown(comboBox.inputElement);
      await aTimeout(1);
      expect(comboBox._nativeInput.selectionStart).to.eql(0);
      expect(comboBox._nativeInput.selectionEnd).to.eql(3);
    });

    it('should prefill the input field when navigating up', async () => {
      arrowUpKeyDown(comboBox.inputElement);
      await aTimeout(1);
      expect(comboBox.inputElement.value).to.eql('foo');
    });

    it('should not prefill the input when there are no items to navigate', async () => {
      filter('invalid filter');

      arrowDownKeyDown(comboBox.inputElement);
      await aTimeout(1);
      expect(comboBox.inputElement.value).to.eql('invalid filter');
    });

    (isDesktopSafari ? it.skip : it)('should select the input field text when navigating up', async () => {
      arrowUpKeyDown(comboBox.inputElement);
      await aTimeout(1);
      expect(comboBox._nativeInput.selectionStart).to.eql(0);
      expect(comboBox._nativeInput.selectionEnd).to.eql(3);
    });

    it('should revert back to filter with escape', async () => {
      filter('b');

      arrowDownKeyDown(comboBox.inputElement);
      await aTimeout(1);
      expect(comboBox.inputElement.value).to.eql('bar');
      escKeyDown(comboBox.inputElement);
      expect(comboBox.inputElement.value).to.eql('b');
    });

    it('should remove selection from the input value when reverting', () => {
      filter('b');
      arrowDownKeyDown(comboBox.inputElement);
      escKeyDown(comboBox.inputElement);

      expect(comboBox.inputElement.selectionStart).to.eql(comboBox.inputElement.selectionEnd);
    });

    it('should revert back to value if there is no filter', () => {
      arrowDownKeyDown(comboBox.inputElement);

      escKeyDown(comboBox.inputElement);

      expect(comboBox.inputElement.value).to.eql('bar');
    });

    it('should keep selected item on escape when custom value allowed', () => {
      comboBox.allowCustomValue = true;
      escKeyDown(comboBox.inputElement);
      escKeyDown(comboBox.inputElement);
      expect(comboBox.selectedItem).to.eql('bar');
    });

    it('should remove selection from the input value selecting value', async () => {
      arrowDownKeyDown(comboBox.inputElement);
      await aTimeout(1);
      enterKeyDown(comboBox.inputElement);

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

      arrowDownKeyDown(comboBox.inputElement);

      expect(selector.firstVisibleIndex).to.eql(1);
    });

    it('should scroll up after reaching the first visible item', () => {
      comboBox._focusedIndex = 1;
      selector.scrollToIndex(1);
      expect(selector.firstVisibleIndex).to.eql(1);

      arrowUpKeyDown(comboBox.inputElement);

      expect(selector.firstVisibleIndex).to.eql(0);
    });

    it('should scroll to first visible when navigating down above viewport', () => {
      comboBox._focusedIndex = 5;
      selector.scrollToIndex(50);

      arrowDownKeyDown(comboBox.inputElement);

      expect(selector.firstVisibleIndex).to.eql(6);
    });

    it('should scroll to first visible when navigating up above viewport', () => {
      comboBox._focusedIndex = 5;
      selector.scrollToIndex(50);

      arrowUpKeyDown(comboBox.inputElement);

      expect(selector.firstVisibleIndex).to.eql(4);
    });

    it('should scroll to last visible when navigating up below viewport', () => {
      comboBox._focusedIndex = 50;
      selector.scrollToIndex(0);
      expect(selector.firstVisibleIndex).to.eql(0);

      arrowUpKeyDown(comboBox.inputElement);

      expect(selector.firstVisibleIndex).to.eql(49 - comboBox.$.overlay._visibleItemsCount() + 1);
    });

    it('should scroll to last visible when navigating down below viewport', () => {
      comboBox._focusedIndex = 50;
      selector.scrollToIndex(0);
      expect(selector.firstVisibleIndex).to.eql(0);

      arrowDownKeyDown(comboBox.inputElement);

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
      arrowDownKeyDown(comboBox.inputElement);
      expect(comboBox.opened).to.equal(true);
    });

    it('should open the overlay with arrow up', () => {
      arrowUpKeyDown(comboBox.inputElement);
      expect(comboBox.opened).to.equal(true);
    });

    it('should apply input value on focusout if input valid', () => {
      inputText('FOO');
      focusout(comboBox);
      expect(comboBox._inputElementValue).to.equal('foo');
      expect(comboBox.value).to.equal('foo');
    });

    it('should apply input value on enter if input valid', () => {
      inputText('FOO');
      enterKeyDown(comboBox.inputElement);
      expect(comboBox._inputElementValue).to.equal('foo');
      expect(comboBox.value).to.equal('foo');
    });

    it('should not apply input value on enter if input invalid', () => {
      inputText('quux');
      enterKeyDown(comboBox.inputElement);
      expect(comboBox._inputElementValue).to.equal('quux');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on focusout if input invalid', () => {
      inputText('quux');
      focusout(comboBox);
      expect(comboBox._inputElementValue).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on esc if input valid', () => {
      inputText('foo');
      escKeyDown(comboBox.inputElement);
      expect(comboBox._inputElementValue).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on esc if input invalid', () => {
      inputText('quux');
      escKeyDown(comboBox.inputElement);
      expect(comboBox._inputElementValue).to.equal('');
      expect(comboBox.value).to.equal('');
    });
  });
});
