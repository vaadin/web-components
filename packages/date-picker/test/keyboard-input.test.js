import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  arrowLeft,
  arrowRight,
  arrowUp,
  aTimeout,
  click,
  enter,
  fixtureSync,
  isIOS,
  keyDownOn,
  listenOnce,
  nextRender,
  tab,
  tap
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { close, getOverlayContent, open } from './common.js';

(isIOS ? describe.skip : describe)('keyboard input', () => {
  let target;
  let datepicker;

  function inputChar(char) {
    target.value += char;
    keyDownOn(target, char.charCodeAt(0));
    target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
  }

  function inputText(text) {
    for (var i = 0; i < text.length; i++) {
      inputChar(text[i]);
    }
  }

  function closeWithEnter() {
    return new Promise((resolve) => {
      listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', resolve);
      enter(target);
    });
  }

  function focusedDate() {
    return getOverlayContent(datepicker).focusedDate;
  }

  beforeEach(() => {
    datepicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    target = datepicker.inputElement;
  });

  it('should not focus with invalid date', () => {
    inputChar('j');
    expect(focusedDate()).not.to.be.ok;
  });

  it('should focus parsed date', () => {
    inputText('1/20/2000');

    expect(focusedDate().getMonth()).to.equal(0);
    expect(focusedDate().getDate()).to.equal(20);
  });

  it('should change focused date on input when closed', (done) => {
    datepicker.value = '2000-01-01';

    datepicker._inputValue = '1/30/2000';
    target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));

    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      expect(focusedDate().getDate()).to.equal(30);
      done();
    });
  });

  it('should update focus on input change', () => {
    inputText('1/20/20');
    inputText('17');

    expect(focusedDate().getMonth()).to.equal(0);
    expect(focusedDate().getFullYear()).to.equal(2017);
  });

  it('should select focused date on enter', async () => {
    inputText('1/1/2001');
    await closeWithEnter();
    expect(datepicker.value).to.equal('2001-01-01');
  });

  it('should not select a date on enter if input invalid', async () => {
    await open(datepicker);
    inputText('foo');
    await closeWithEnter();
    expect(datepicker.opened).to.be.false;
    expect(datepicker.invalid).to.be.true;
    expect(datepicker.value).to.equal('');
    expect(target.value).to.equal('foo');
  });

  it('should display focused date while overlay focused', () => {
    inputText('1/2/2000');
    arrowDown(target);
    expect(target.value).not.to.equal('1/2/2000');
  });

  it('should not forward keys after close', async () => {
    inputText('1/2/2000');
    arrowDown(target);
    await closeWithEnter();
    const focused = focusedDate();
    arrowRight(target);
    expect(focusedDate()).to.eql(focused);
  });

  it('should not open with wrong keys', () => {
    arrowRight(target);
    expect(datepicker.opened).not.to.be.ok;
  });

  it('should not forward keys after reopen', (done) => {
    inputText('1/2/2000');
    arrowDown(target);

    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      const focused = focusedDate();
      arrowRight(target);
      expect(focusedDate()).to.eql(focused);
      done();
    });

    listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      inputText('0');
    });
    enter(target);
  });

  it('should not forward after user changes input', (done) => {
    inputText('1/2/2000');
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      arrowDown(target);
      // Forwarding keys to overlay
      target.value = '';
      inputText('foo');
      // Keys shouldn't get forwarded anymore
      const focused = focusedDate();
      arrowRight(target);
      expect(focusedDate()).to.eql(focused);
      done();
    });
  });

  it('should not forward after input tap', async () => {
    await open(datepicker);
    arrowDown(target);
    const focused = focusedDate();
    target.dispatchEvent(new CustomEvent('tap', { bubbles: true, composed: true }));
    arrowLeft(target);
    expect(focusedDate()).to.eql(focused);
  });

  it('should reflect focused date to input', (done) => {
    datepicker.value = '2000-01-01';

    arrowDown(target);
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      arrowDown(target);
      expect(datepicker._inputValue).to.equal('1/8/2000');
      done();
    });
  });

  it('should not reflect focused date on open', (done) => {
    arrowDown(target);
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      expect(datepicker._inputValue).to.equal('');
      done();
    });
  });

  it('should stop key event bubbles from overlay', (done) => {
    datepicker.value = '2000-01-01';

    arrowDown(target);
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      arrowDown(target);
      target = getOverlayContent(datepicker);
      arrowDown(target);
      expect(datepicker._inputValue).to.equal('1/15/2000');
      done();
    });
  });

  it('should update focused date on select', () => {
    datepicker.value = '2000-01-01';
    expect(focusedDate().getMonth()).to.equal(0);
    expect(focusedDate().getDate()).to.equal(1);
    expect(focusedDate().getFullYear()).to.equal(2000);
  });

  it('should validate on close', async () => {
    await open(datepicker);
    const spy = sinon.spy(datepicker, 'validate');
    await close(datepicker);
    expect(spy.called).to.be.true;
  });

  it('should validate on blur when not opened', async () => {
    inputText('foo');
    await close(datepicker);
    // wait for overlay to finish closing
    await nextRender(datepicker);
    target.value = '';
    const spy = sinon.spy(datepicker, 'validate');
    target.dispatchEvent(new Event('blur'));
    expect(spy.callCount).to.equal(1);
    expect(datepicker.invalid).to.be.false;
  });

  it('should validate on clear button', async () => {
    datepicker.clearButtonVisible = true;
    inputText('foo');
    await close(datepicker);
    // wait for overlay to finish closing. Without this, clear button click
    // will trigger "close()" again, which will result in infinite loop.
    await nextRender(datepicker);
    const spy = sinon.spy(datepicker, 'validate');
    click(datepicker.$.clearButton);
    expect(spy.callCount).to.equal(1);
    expect(datepicker.invalid).to.be.false;
  });

  it('should empty value with false input', async () => {
    datepicker.value = '2000-01-01';
    target.value = '';
    inputText('foo');
    await close(datepicker);
    expect(datepicker.value).to.equal('');
  });

  it('should be invalid with false input', async () => {
    datepicker.value = '2000-01-01';
    target.value = '';
    inputText('foo');
    await close(datepicker);
    expect(datepicker.invalid).to.be.true;
  });

  it('should clear selection on close', async () => {
    await open(datepicker);
    arrowDown(target);
    await close(datepicker);
    expect(target.selectionStart).to.equal(target.selectionEnd);
  });

  it('should not throw on enter before opening overlay', () => {
    expect(() => {
      datepicker.focus();
      enter(target);
    }).not.to.throw(Error);
  });

  describe('no parseDate', () => {
    beforeEach(() => {
      datepicker.i18n = {
        ...datepicker.i18n,
        parseDate: null
      };
    });

    it('should prevent key input', () => {
      const e = new CustomEvent('keydown', {
        bubbles: true,
        composed: true
      });

      const spy = sinon.spy(e, 'preventDefault');
      datepicker._nativeInput.dispatchEvent(e);
      expect(spy.called).to.be.true;
    });

    it('should select focused date on close', async () => {
      await open(datepicker);
      await close(datepicker);
      expect(datepicker._selectedDate).to.equal(datepicker._focusedDate);
    });
  });

  it('should not forward up/down to overlay when closed', (done) => {
    arrowUp(target);
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      expect(datepicker._focusedDate.getDate()).to.eql(new Date().getDate());
      done();
    });
  });

  it('should forward up/down to overlay', async () => {
    await open(datepicker);
    arrowUp(target);
    expect(datepicker._focusedDate.getDate()).not.to.eql(new Date().getDate());
  });

  describe('focus modes', () => {
    let overlayContent;

    beforeEach(async () => {
      overlayContent = getOverlayContent(datepicker);
      // As a side effect, getOverlayContent opens and closes the dropdown.
      // Since closing the dropdown focuses the input, we need to blur explicilty
      // to reset the state.
      datepicker.blur();
    });

    it('should be tabbable', () => {
      expect(parseInt(overlayContent.getAttribute('tabindex'), 10)).to.equal(0);
      expect(datepicker.hasAttribute('focused')).to.be.false;
    });

    it('should focus cancel on input shift tab', async () => {
      await open(datepicker);
      datepicker.inputElement.focus();
      tab(datepicker.inputElement, ['shift']);
      expect(overlayContent.$.cancelButton.hasAttribute('focused')).to.be.true;
    });

    it('should focus input in cancel tab', async () => {
      await open(datepicker);
      overlayContent.$.cancelButton.focus();

      const spy = sinon.spy(datepicker, '_focus');
      tab(overlayContent.$.cancelButton);
      await aTimeout(1);
      expect(spy.called).to.be.true;
    });

    it('should not reveal the focused date on tap', async () => {
      await open(datepicker);
      const spy = sinon.spy(overlayContent, 'revealDate');
      tap(overlayContent);
      overlayContent.focus();
      await aTimeout(1);
      expect(spy.called).to.be.false;
    });

    it('should reveal the focused date on tab focus from input', async () => {
      await open(datepicker);
      const spy = sinon.spy(overlayContent, 'revealDate');
      tab(datepicker.inputElement);
      expect(spy.called).to.be.true;
    });

    it('should reveal the focused date on shift-tab focus from today button', async () => {
      await open(datepicker);
      const spy = sinon.spy(overlayContent, 'revealDate');
      tab(overlayContent.$.todayButton, ['shift']);
      overlayContent.focus();
      await aTimeout(1);
      expect(spy.called).to.be.true;
    });

    it('should not focus overlay on key-input', (done) => {
      const spy = sinon.spy(datepicker.$.overlay, 'focus');

      listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', () => {
        expect(spy.called).to.be.false;
        done();
      });

      inputText('1');
    });
  });
});
