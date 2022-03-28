import { expect } from '@esm-bundle/chai';
import {
  arrowDownKeyDown,
  arrowUpKeyDown,
  aTimeout,
  enterKeyDown,
  escKeyDown,
  fire,
  fixtureSync,
  focusout,
  keyboardEventFor,
  keyDownOn,
  nextFrame
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import { getViewportItems, getVisibleItemsCount, onceScrolled, scrollToIndex } from './helpers.js';

describe('keyboard', () => {
  let comboBox, input;

  function filter(value) {
    input.value = value;
    fire(input, 'input');
  }

  function getFocusedIndex() {
    return comboBox._focusedIndex;
  }

  function inputChar(char) {
    const target = input;
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
    input = comboBox.inputElement;
  });

  describe('opening the overlay', () => {
    it('should open the overlay with arrow down and not focus any item', () => {
      arrowDownKeyDown(input);

      expect(comboBox.opened).to.equal(true);
      expect(getFocusedIndex()).to.equal(-1);
    });

    it('should open the overlay with arrow up and not focus any item', () => {
      arrowUpKeyDown(input);

      expect(comboBox.opened).to.equal(true);
      expect(getFocusedIndex()).to.equal(-1);
    });

    it('should have focus on the selected item after opened', () => {
      comboBox.value = 'foo';

      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should propagate escape key event if dropdown is closed', () => {
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const keyDownSpy = sinon.spy(event, 'stopPropagation');
      input.dispatchEvent(event);
      expect(keyDownSpy.called).to.be.false;
    });

    it('should not propagate esc keydown event when overlay is closed, clear button is visible and value is not empty', () => {
      comboBox.value = 'bar';
      comboBox.clearButtonVisible = true;

      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const keyDownSpy = sinon.spy(event, 'stopPropagation');
      input.dispatchEvent(event);
      expect(keyDownSpy.called).to.be.true;
    });
  });

  describe('navigating after overlay opened', () => {
    beforeEach(async () => {
      await aTimeout(0);
      input.focus();
      arrowDownKeyDown(input);
    });

    it('should focus on the first item with arrow down', () => {
      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should focus on the last item with up arrow', () => {
      arrowUpKeyDown(input);

      expect(getFocusedIndex()).to.equal(2);
    });

    it('should focus on the previous item with arrow up', () => {
      arrowDownKeyDown(input);
      arrowDownKeyDown(input);

      arrowUpKeyDown(input);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should not go below the last item', () => {
      arrowDownKeyDown(input);
      arrowDownKeyDown(input);
      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(2);

      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(2);
    });

    it('should not remove focus', () => {
      arrowDownKeyDown(input);

      arrowUpKeyDown(input);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should focus only on filtered items', () => {
      filter('foo');
      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(0);

      arrowDownKeyDown(input);

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
        input.focus();
        arrowDownKeyDown(input);

        await aTimeout(0);

        await sendKeys({ press: 'Tab' });
        expect(document.activeElement).to.equal(button);
      });
    });
  });

  describe('selecting items', () => {
    describe('auto-open', () => {
      beforeEach(async () => {
        comboBox.value = 'bar';

        comboBox.focus();
        comboBox.open();
        await aTimeout(1);
      });

      it('should select focused item with enter', async () => {
        arrowDownKeyDown(input);
        await aTimeout(1);
        enterKeyDown(input);
        await aTimeout(1);
        expect(comboBox.value).to.equal('baz');
      });

      it('should clear the selection with enter when input is cleared', () => {
        filter('');
        enterKeyDown(input);

        expect(comboBox.value).to.eql('');
      });

      it('should close the overlay with enter when custom values are allowed', () => {
        comboBox.allowCustomValue = true;
        filter('foobar');

        enterKeyDown(input);

        expect(comboBox.value).to.equal('foobar');
        expect(comboBox.opened).to.equal(false);
      });

      it('should stop propagation of the keyboard enter event when dropdown is opened', () => {
        const keydownSpy = sinon.spy();
        document.addEventListener('keydown', keydownSpy);
        enterKeyDown(input);
        expect(keydownSpy.called).to.be.false;
      });

      it('should stop propagation of the keyboard enter event when input value is invalid', () => {
        filter('foobar');
        const keydownSpy = sinon.spy();
        document.addEventListener('keydown', keydownSpy);
        enterKeyDown(input);
        expect(keydownSpy.called).to.be.false;
      });

      it('should not close the overlay with enter when custom values are not allowed', () => {
        filter('foobar');

        enterKeyDown(input);

        expect(comboBox.value).to.equal('bar');
        expect(comboBox.opened).to.equal(true);
      });

      it('should revert to the custom value after filtering', () => {
        comboBox.allowCustomValue = true;
        comboBox.value = 'foobar';
        filter('bar');
        escKeyDown(input);
        expect(input.value).to.eql('bar');
        escKeyDown(input);
        expect(input.value).to.equal('foobar');
      });

      it('should revert a non-listed value to the custom value after filtering', () => {
        comboBox.allowCustomValue = true;
        comboBox.value = 'foobar';
        filter('barbaz');
        escKeyDown(input);
        expect(input.value).to.equal('foobar');
      });

      it('should revert to the custom value after keyboard navigation', () => {
        comboBox.allowCustomValue = true;
        comboBox.value = 'foobar';
        arrowDownKeyDown(input);
        escKeyDown(input);
        expect(input.value).to.eql('foobar');
        escKeyDown(input);
        expect(input.value).to.equal('foobar');
      });

      it('should close the overlay with enter', () => {
        enterKeyDown(input);

        expect(comboBox.opened).to.equal(false);
      });

      it('should remove focus with escape', () => {
        comboBox._focusedIndex = 0;

        escKeyDown(input);

        expect(comboBox.opened).to.equal(true);
        expect(comboBox._focusedIndex).to.eql(-1);
      });

      it('should close the overlay with escape if there is no focus', () => {
        comboBox._focusedIndex = -1;

        escKeyDown(input);

        expect(comboBox.opened).to.equal(false);
      });

      it('escape key event should not be propagated', () => {
        const spy = sinon.spy();

        document.body.addEventListener('keydown', spy);
        escKeyDown(input);
        document.body.removeEventListener('keydown', spy);

        expect(spy.called).to.be.false;
      });

      it('should cancel typing with escape', () => {
        filter('baz');

        escKeyDown(input);

        expect(comboBox.value).to.equal('bar');
      });

      it('should select typed item', () => {
        filter('baz');

        enterKeyDown(input);

        expect(comboBox.value).to.equal('baz');
      });

      it('should prefill the input field when navigating down', () => {
        arrowDownKeyDown(input);
        expect(input.value).to.eql('baz');
      });

      it('should select the input field text when navigating down', () => {
        arrowDownKeyDown(input);
        expect(input.selectionStart).to.eql(0);
        expect(input.selectionEnd).to.eql(3);
      });

      it('should prefill the input field when navigating up', () => {
        arrowUpKeyDown(input);
        expect(input.value).to.eql('foo');
      });

      it('should not prefill the input when there are no items to navigate', () => {
        filter('invalid filter');

        arrowDownKeyDown(input);
        expect(input.value).to.eql('invalid filter');
      });

      it('should select the input field text when navigating up', () => {
        arrowUpKeyDown(input);
        expect(input.selectionStart).to.eql(0);
        expect(input.selectionEnd).to.eql(3);
      });

      it('should revert back to filter with escape', async () => {
        filter('b');

        arrowDownKeyDown(input);
        await aTimeout(1);
        expect(input.value).to.eql('bar');
        escKeyDown(input);
        expect(input.value).to.eql('b');
      });

      it('should remove selection from the input value when reverting', () => {
        filter('b');
        arrowDownKeyDown(input);
        escKeyDown(input);

        expect(input.selectionStart).to.eql(input.selectionEnd);
      });

      it('should revert back to value if there is no filter', () => {
        arrowDownKeyDown(input);

        escKeyDown(input);

        expect(input.value).to.eql('bar');
      });

      it('should keep selected item on escape when custom value allowed', () => {
        comboBox.allowCustomValue = true;
        escKeyDown(input);
        escKeyDown(input);
        expect(comboBox.selectedItem).to.eql('bar');
      });

      it('should remove selection from the input value selecting value', async () => {
        arrowDownKeyDown(input);
        await aTimeout(1);
        enterKeyDown(input);

        expect(input.selectionStart).to.eql(3);
        expect(input.selectionEnd).to.eql(3);
      });

      it('should not clear the value on esc if clear button is not visible', () => {
        escKeyDown(input);
        expect(comboBox.value).to.equal('bar');
      });

      it('should clear the value on esc if clear button is visible', () => {
        comboBox.close();
        comboBox.clearButtonVisible = true;
        escKeyDown(input);
        expect(comboBox.value).to.equal('');
      });

      it('should not clear the value on esc if the overlay is open', () => {
        comboBox.clearButtonVisible = true;
        comboBox.opened = true;
        escKeyDown(input);
        expect(comboBox.value).to.equal('bar');
      });
    });

    describe('auto-open disabled', () => {
      beforeEach(async () => {
        comboBox.autoOpenDisabled = true;
        comboBox.focus();
        await aTimeout(1);
      });

      it('should stop propagation of the keyboard enter event when input value is invalid', () => {
        filter('foobar');
        const keydownSpy = sinon.spy();
        document.addEventListener('keydown', keydownSpy);
        enterKeyDown(input);
        expect(keydownSpy.called).to.be.false;
      });

      it('should not stop propagation of the keyboard enter event when input has a predefined option', async () => {
        filter('foo');
        expect(comboBox.opened).to.be.false;
        const keydownSpy = sinon.spy();
        document.addEventListener('keydown', keydownSpy);
        enterKeyDown(input);
        expect(keydownSpy.called).to.be.true;
      });

      it('should not stop propagation of the keyboard enter event when input has a custom value', () => {
        comboBox.allowCustomValue = true;
        filter('foobar');
        const keydownSpy = sinon.spy();
        document.addEventListener('keydown', keydownSpy);
        enterKeyDown(input);
        expect(keydownSpy.called).to.be.true;
      });

      it('should not stop propagation of the keyboard enter event when input is empty', () => {
        comboBox.allowCustomValue = true;
        filter('');
        const keydownSpy = sinon.spy();
        document.addEventListener('keydown', keydownSpy);
        enterKeyDown(input);
        expect(keydownSpy.called).to.be.true;
      });
    });
  });

  describe('scrolling items', () => {
    beforeEach(async () => {
      const items = [];

      for (let i = 0; i < 100; i++) {
        items.push(i.toString());
      }

      comboBox.open();
      comboBox.items = items;

      await aTimeout(1);
    });

    it('should scroll down after reaching the last visible item', () => {
      scrollToIndex(comboBox, 0);
      comboBox._focusedIndex = getVisibleItemsCount(comboBox) - 1;
      expect(getViewportItems(comboBox)[0].index).to.eql(0);

      arrowDownKeyDown(input);

      expect(getViewportItems(comboBox)[0].index).to.eql(1);
    });

    it('should scroll up after reaching the first visible item', async () => {
      comboBox._focusedIndex = 2;
      scrollToIndex(comboBox, 2);
      await nextFrame();

      expect(getViewportItems(comboBox)[0].index).to.eql(2);

      arrowUpKeyDown(input);

      expect(getViewportItems(comboBox)[0].index).to.eql(1);
    });

    it('should scroll to first visible when navigating down above viewport', () => {
      comboBox._focusedIndex = 5;
      scrollToIndex(comboBox, 50);

      arrowDownKeyDown(input);

      expect(getViewportItems(comboBox)[0].index).to.eql(6);
    });

    it('should scroll to first visible when navigating up above viewport', () => {
      comboBox._focusedIndex = 5;
      scrollToIndex(comboBox, 50);

      arrowUpKeyDown(input);

      expect(getViewportItems(comboBox)[0].index).to.eql(4);
    });

    it('should scroll to last visible when navigating up below viewport', () => {
      comboBox._focusedIndex = 50;
      scrollToIndex(comboBox, 0);
      expect(getViewportItems(comboBox)[0].index).to.eql(0);

      arrowUpKeyDown(input);

      expect(getViewportItems(comboBox)[0].index).to.eql(49 - getVisibleItemsCount(comboBox) + 1);
    });

    it('should scroll to last visible when navigating down below viewport', () => {
      comboBox._focusedIndex = 50;
      scrollToIndex(comboBox, 0);
      expect(getViewportItems(comboBox)[0].index).to.eql(0);

      arrowDownKeyDown(input);

      expect(getViewportItems(comboBox)[0].index).to.eql(51 - getVisibleItemsCount(comboBox) + 1);
    });

    it('should scroll to start if no items focused when opening overlay', async () => {
      scrollToIndex(comboBox, 50);
      comboBox.close();

      comboBox.open();
      await aTimeout(0);

      expect(getViewportItems(comboBox)[0].index).to.eql(0);
    });

    it('should scroll to focused item when opening overlay', async () => {
      scrollToIndex(comboBox, 0);
      comboBox.close();
      comboBox.value = '50';

      comboBox.open();

      await onceScrolled(comboBox);
      expect(getViewportItems(comboBox)[0].index).to.be.within(50 - getVisibleItemsCount(comboBox), 50);
    });
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      comboBox.autoOpenDisabled = true;
    });

    it('should open the overlay with arrow down', () => {
      arrowDownKeyDown(input);
      expect(comboBox.opened).to.equal(true);
    });

    it('should open the overlay with arrow up', () => {
      arrowUpKeyDown(input);
      expect(comboBox.opened).to.equal(true);
    });

    it('should apply input value on focusout if input valid', () => {
      inputText('FOO');
      focusout(comboBox);
      expect(input.value).to.equal('foo');
      expect(comboBox.value).to.equal('foo');
    });

    it('should apply input value on enter if input valid', () => {
      inputText('FOO');
      enterKeyDown(input);
      expect(input.value).to.equal('foo');
      expect(comboBox.value).to.equal('foo');
    });

    it('should not apply input value on enter if input invalid', () => {
      inputText('quux');
      enterKeyDown(input);
      expect(input.value).to.equal('quux');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on focusout if input invalid', () => {
      inputText('quux');
      focusout(comboBox);
      expect(input.value).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on esc if input valid', () => {
      inputText('foo');
      escKeyDown(input);
      expect(input.value).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on esc if input invalid', () => {
      inputText('quux');
      escKeyDown(input);
      expect(input.value).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert changed input value on esc if clear button is visible', () => {
      comboBox.value = 'bar';
      comboBox.clearButtonVisible = true;
      inputText('foo');
      escKeyDown(input);
      expect(input.value).to.equal('bar');
      expect(comboBox.value).to.equal('bar');
    });

    it('should clear the value on esc if clear button is visible', () => {
      comboBox.value = 'bar';
      comboBox.clearButtonVisible = true;
      escKeyDown(input);
      expect(comboBox.value).to.equal('');
    });

    it('should not clear the value on esc if the overlay is open', () => {
      comboBox.value = 'bar';
      comboBox.clearButtonVisible = true;
      comboBox.opened = true;
      escKeyDown(input);
      expect(comboBox.value).to.equal('bar');
    });

    it('should not propagate when input value is not empty', () => {
      inputText('foo');

      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const keyDownSpy = sinon.spy(event, 'stopPropagation');
      input.dispatchEvent(event);
      expect(keyDownSpy.called).to.be.true;
    });
  });
});
