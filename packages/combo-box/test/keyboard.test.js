import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import {
  arrowDownKeyDown,
  arrowUpKeyDown,
  aTimeout,
  enterKeyDown,
  escKeyDown,
  fixtureSync,
  keyboardEventFor,
  nextFrame,
  nextRender,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import { getViewportItems, getVisibleItemsCount, scrollToIndex, setInputValue } from './helpers.js';

describe('keyboard', () => {
  let comboBox, input, lastGlobalFocusable;

  function getFocusedIndex() {
    return comboBox._focusedIndex;
  }

  beforeEach(async () => {
    [comboBox, lastGlobalFocusable] = fixtureSync(
      `<div>
        <vaadin-combo-box></vaadin-combo-box>
        <input id="last-global-focusable" />
      </div>`,
    ).children;

    await nextRender();
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox.inputElement;
  });

  describe('opening the overlay', () => {
    it('should not focus any item when opened with Arrow Down key', () => {
      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(-1);
    });

    it('should not focus any item when opened with Arrow Up key', () => {
      arrowUpKeyDown(input);

      expect(getFocusedIndex()).to.equal(-1);
    });

    it('should not focus on the selected item after opened', () => {
      comboBox.value = 'foo';

      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(-1);
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
      setInputValue(comboBox, 'foo');
      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(0);

      arrowDownKeyDown(input);

      expect(getFocusedIndex()).to.equal(0);
    });

    it('should tab to the next focusable', async () => {
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(lastGlobalFocusable);
    });

    describe('focusable items content', () => {
      it('should tab to the next focusable when items have focusable content', async () => {
        comboBox.renderer = (root) => {
          root.innerHTML = '<input>';
        };

        input.focus();
        arrowDownKeyDown(input);

        await aTimeout(0);

        await sendKeys({ press: 'Tab' });
        expect(document.activeElement).to.equal(lastGlobalFocusable);
      });
    });
  });

  describe('selecting items', () => {
    const verifyEnterKeyPropagation = (allowPropagation) => {
      const enterEvent = keyboardEventFor('keydown', 13, [], 'Enter');
      const stopPropagationSpy = sinon.spy(enterEvent, 'stopPropagation');
      input.dispatchEvent(enterEvent);
      expect(stopPropagationSpy.called).to.equal(!allowPropagation);
    };

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
        // keyboard navigation starts from the top
        expect(comboBox.value).to.equal('foo');
      });

      it('should clear the selection with enter when input is cleared', () => {
        setInputValue(comboBox, '');
        enterKeyDown(input);

        expect(comboBox.value).to.eql('');
      });

      it('should close the overlay with enter when custom values are allowed', () => {
        comboBox.allowCustomValue = true;
        setInputValue(comboBox, 'foobar');

        enterKeyDown(input);

        expect(comboBox.value).to.equal('foobar');
        expect(comboBox.opened).to.equal(false);
      });

      it('should stop propagation of the keyboard enter event when dropdown is opened', () => {
        verifyEnterKeyPropagation(false);
      });

      it('should stop propagation of the keyboard enter event when input value is invalid', () => {
        setInputValue(comboBox, 'foobar');

        verifyEnterKeyPropagation(false);
      });

      it('should propagate keyboard enter event after entering an unknown option when custom values are allowed', () => {
        comboBox.allowCustomValue = true;
        setInputValue(comboBox, 'foobar');
        enterKeyDown(input);

        verifyEnterKeyPropagation(true);
      });

      it('should propagate keyboard enter event if filtered items are cleared after selecting a predefined option', () => {
        setInputValue(comboBox, 'foo');
        enterKeyDown(input);
        // Simulate user or data provider mixin resetting filtered items after closing overlay
        comboBox.filteredItems = [];
        expect(comboBox._focusedIndex).to.equal(-1);

        verifyEnterKeyPropagation(true);
      });

      it('should propagate keyboard enter event after clearing the value', () => {
        setInputValue(comboBox, 'foo');
        enterKeyDown(input);

        setInputValue(comboBox, '');
        enterKeyDown(input);

        verifyEnterKeyPropagation(true);
      });

      it('should not close the overlay with enter when custom values are not allowed', () => {
        setInputValue(comboBox, 'foobar');

        enterKeyDown(input);

        expect(comboBox.value).to.equal('bar');
        expect(comboBox.opened).to.equal(true);
      });

      it('should revert to the custom value after filtering', () => {
        comboBox.allowCustomValue = true;
        comboBox.value = 'foobar';
        setInputValue(comboBox, 'bar');
        escKeyDown(input);
        expect(input.value).to.eql('bar');
        escKeyDown(input);
        expect(input.value).to.equal('foobar');
      });

      it('should revert a non-listed value to the custom value after filtering', () => {
        comboBox.allowCustomValue = true;
        comboBox.value = 'foobar';
        setInputValue(comboBox, 'barbaz');
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
        setInputValue(comboBox, 'baz');

        escKeyDown(input);

        expect(comboBox.value).to.equal('bar');
      });

      it('should select typed item', () => {
        setInputValue(comboBox, 'baz');

        enterKeyDown(input);

        expect(comboBox.value).to.equal('baz');
      });

      it('should prefill the input field when navigating down', () => {
        arrowDownKeyDown(input);
        expect(input.value).to.eql('foo');
      });

      it('should select the input field text when navigating down', () => {
        arrowDownKeyDown(input);
        expect(input.selectionStart).to.eql(0);
        expect(input.selectionEnd).to.eql(3);
      });

      it('should prefill the input field when navigating up', () => {
        arrowUpKeyDown(input);
        expect(input.value).to.eql('baz');
      });

      it('should not prefill the input when there are no items to navigate', () => {
        setInputValue(comboBox, 'invalid filter');

        arrowDownKeyDown(input);
        expect(input.value).to.eql('invalid filter');
      });

      it('should select the input field text when navigating up', () => {
        arrowUpKeyDown(input);
        expect(input.selectionStart).to.eql(0);
        expect(input.selectionEnd).to.eql(3);
      });

      it('should revert back to filter with escape', async () => {
        setInputValue(comboBox, 'b');

        arrowDownKeyDown(input);
        await aTimeout(1);
        expect(input.value).to.eql('bar');
        escKeyDown(input);
        expect(input.value).to.eql('b');
      });

      it('should remove selection from the input value when reverting', () => {
        setInputValue(comboBox, 'b');
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
        setInputValue(comboBox, 'foobar');

        verifyEnterKeyPropagation(false);
      });

      it('should propagate the keyboard enter event when input has a predefined option', () => {
        setInputValue(comboBox, 'foo');
        expect(comboBox.opened).to.be.false;

        verifyEnterKeyPropagation(true);
      });

      it('should propagate keyboard enter event if filtered items are cleared after selecting a predefined option', () => {
        setInputValue(comboBox, 'foo');
        enterKeyDown(input);
        // Simulate user or data provider mixin resetting filtered items after closing overlay
        comboBox.filteredItems = [];
        expect(comboBox._focusedIndex).to.equal(-1);

        verifyEnterKeyPropagation(true);
      });

      it('should propagate the keyboard enter event when input has a custom value', () => {
        comboBox.allowCustomValue = true;
        setInputValue(comboBox, 'foobar');

        verifyEnterKeyPropagation(true);
      });

      it('should propagate the keyboard enter event when input is empty', () => {
        comboBox.allowCustomValue = true;
        setInputValue(comboBox, '');

        verifyEnterKeyPropagation(true);
      });
    });
  });

  describe('scrolling items', () => {
    beforeEach(async () => {
      fixtureSync(`
        <style>
          vaadin-combo-box-item {
            min-height: 36px;
          }
        </style>
      `);
      comboBox.open();
      comboBox.items = new Array(100).fill().map((_, idx) => `${idx}`);
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
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      comboBox.autoOpenDisabled = true;
      input.focus();
    });

    it('should open the overlay with arrow down', () => {
      arrowDownKeyDown(input);
      expect(comboBox.opened).to.equal(true);
    });

    it('should open the overlay with arrow up', () => {
      arrowUpKeyDown(input);
      expect(comboBox.opened).to.equal(true);
    });

    it('should apply input value on focusout if input valid', async () => {
      await sendKeys({ type: 'FOO' });
      input.blur();
      expect(input.value).to.equal('foo');
      expect(comboBox.value).to.equal('foo');
    });

    it('should apply input value on enter if input valid', async () => {
      await sendKeys({ type: 'FOO' });
      await sendKeys({ press: 'Enter' });
      expect(input.value).to.equal('foo');
      expect(comboBox.value).to.equal('foo');
    });

    it('should not apply input value on enter if input invalid', async () => {
      await sendKeys({ type: 'quux' });
      await sendKeys({ press: 'Enter' });
      expect(input.value).to.equal('quux');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on focusout if input invalid', async () => {
      await sendKeys({ type: 'quux' });
      input.blur();
      expect(input.value).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on esc if input valid', async () => {
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Escape' });
      expect(input.value).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert input value on esc if input invalid', async () => {
      await sendKeys({ type: 'quux' });
      await sendKeys({ press: 'Escape' });
      expect(input.value).to.equal('');
      expect(comboBox.value).to.equal('');
    });

    it('should revert changed input value on esc if clear button is visible', async () => {
      comboBox.value = 'bar';
      comboBox.clearButtonVisible = true;
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Escape' });
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

    it('should not clear the value on esc when readonly', () => {
      comboBox.value = 'bar';
      comboBox.clearButtonVisible = true;
      comboBox.readonly = true;
      escKeyDown(input);
      expect(comboBox.value).to.equal('bar');
    });

    it('should not propagate when input value is not empty', async () => {
      await sendKeys({ type: 'foo' });

      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const keyDownSpy = sinon.spy(event, 'stopPropagation');
      input.dispatchEvent(event);
      expect(keyDownSpy.called).to.be.true;
    });
  });

  describe('enter key behavior', () => {
    let keydownEvent;

    beforeEach(() => {
      // Fake a keydown event to mimic form submit.
      keydownEvent = keyboardEventFor('keydown', 13, [], 'Enter');
    });

    it('should prevent default on open combobox', () => {
      comboBox.open();
      comboBox.dispatchEvent(keydownEvent);
      expect(keydownEvent.defaultPrevented).to.be.true;
    });

    it('should not prevent default on closed combobox', () => {
      comboBox.dispatchEvent(keydownEvent);
      expect(keydownEvent.defaultPrevented).to.be.false;
    });
  });

  describe('focused row visibility', () => {
    // Long-enough label that wraps to multiple lines under the default combo
    // overlay width — every 5th item makes the row taller than its neighbors
    // so `scrollIntoView`'s index-math heuristic overshoots and the focused
    // row lands outside the viewport without the rect-based correction.
    const LONG_LABEL = 'Long label that wraps to two or three lines making this row taller than its neighbors';
    const SIZE = 100;

    function buildItems(size = SIZE) {
      return Array.from({ length: size }, (_, i) => (i % 5 === 0 ? `${LONG_LABEL} ${i}` : `item ${i}`));
    }

    function getScrollerRect() {
      return comboBox._scroller.getBoundingClientRect();
    }

    function getFocusedItem() {
      return [...comboBox._scroller.children].find((el) => !el.hidden && el.index === comboBox._focusedIndex);
    }

    function expectFocusedItemInsideViewport(comboBox) {
      const focused = getFocusedItem();
      expect(focused, 'focused item is rendered').to.exist;
      const focusedRect = focused.getBoundingClientRect();
      const scrollerRect = getScrollerRect();
      const padding = comboBox._scroller._viewportTotalPaddingBottom;
      expect(Math.round(focusedRect.top)).to.be.at.least(Math.round(scrollerRect.top) - 1);
      expect(Math.round(focusedRect.bottom)).to.be.at.most(Math.round(scrollerRect.bottom) + padding + 1);
    }

    it('should keep target inside the viewport when stepping into a tall row', async () => {
      comboBox.style.setProperty('--vaadin-combo-box-overlay-max-height', '400px');
      comboBox.items = buildItems();
      comboBox.opened = true;
      await nextRender();

      // Step past several tall rows; the bug surfaces on transitions where a
      // tall row enters/leaves the viewport.
      for (let i = 0; i < 25; i++) {
        arrowDownKeyDown(input);
        await nextFrame();
        await nextFrame();
        expectFocusedItemInsideViewport(comboBox);
      }
    });

    it('should keep target inside the viewport with dataProvider across a page boundary', async () => {
      const dpSize = 500;
      const PAGE_SIZE = 50;
      const items = buildItems(dpSize);
      const pendingCallbacks = [];
      comboBox.style.setProperty('--vaadin-combo-box-overlay-max-height', '400px');
      // Outer beforeEach assigned `comboBox.items = ['foo', 'bar', 'baz']`;
      // clear it before switching to a dataProvider — they can't coexist.
      comboBox.items = undefined;
      comboBox.pageSize = PAGE_SIZE;
      comboBox.dataProvider = (params, callback) => {
        pendingCallbacks.push(() => {
          const slice = items.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize);
          callback(slice, dpSize);
        });
      };
      comboBox.opened = true;
      await nextRender();
      // Drain whatever pages the initial open requested.
      while (pendingCallbacks.length) {
        pendingCallbacks.shift()();
      }
      await nextFrame();

      // Walk past index 49 → 50 (first page boundary). Drain any new page
      // loads triggered by the scroll so the focused row resolves to a real
      // item before we assert. Regression guard for #4046's "every pageSize
      // items, focus drifts off" pattern.
      for (let i = 0; i <= 55; i++) {
        arrowDownKeyDown(input);
        await nextFrame();
        while (pendingCallbacks.length) {
          pendingCallbacks.shift()();
        }
        await nextFrame();
        await nextFrame();
        expectFocusedItemInsideViewport(comboBox);
      }
    });
  });
});
