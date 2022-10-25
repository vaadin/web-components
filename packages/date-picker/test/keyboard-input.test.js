import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  arrowLeft,
  arrowRight,
  arrowUp,
  aTimeout,
  click,
  enter,
  esc,
  fixtureSync,
  isIOS,
  keyDownOn,
  listenOnce,
  nextRender,
  tab,
  tap,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
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

  it('should open overlay on input', () => {
    inputChar('j');
    expect(datepicker.opened).to.be.true;
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
        parseDate: null,
      };
    });

    it('should prevent key input', () => {
      const e = new CustomEvent('keydown', {
        bubbles: true,
        composed: true,
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

  describe('esc behavior', () => {
    it('should close the overlay on esc', async () => {
      await open(datepicker);
      esc(target);
      await aTimeout(1);
      expect(datepicker.opened).to.be.false;
    });

    describe('empty', () => {
      beforeEach(async () => {
        datepicker.value = '';
        await open(datepicker);
      });

      it('should revert input value on esc when empty', () => {
        inputText('1/2/2000');
        arrowDown(target);
        arrowDown(target);
        esc(target);
        expect(target.value).to.equal('');
      });

      it('should cancel on overlay content esc', () => {
        inputText('1/2/2000 ');
        arrowDown(target);
        arrowDown(target);
        const overlayContent = datepicker.$.overlay.content.querySelector('vaadin-date-picker-overlay-content').$
          .monthScroller;
        target = overlayContent;
        esc(target);
        expect(datepicker.opened).to.be.false;
        expect(datepicker.value).not.to.be.ok;
      });

      it('should not change value on esc when empty', (done) => {
        inputText('1/2/2000');
        arrowDown(target);
        arrowDown(target);

        listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', () => {
          expect(datepicker.value).to.equal('');
          done();
        });

        esc(target);
      });
    });

    describe('with value', () => {
      beforeEach(async () => {
        datepicker.value = '2000-01-01';
        await open(datepicker);
      });

      it('should revert input value on esc', () => {
        inputText('1/2/2000');
        arrowDown(target);
        arrowDown(target);
        esc(target);
        expect(target.value).to.equal('1/1/2000');
      });

      it('should not change value on esc', (done) => {
        inputText('1/2/2000');
        arrowDown(target);
        arrowDown(target);

        listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', () => {
          expect(datepicker.value).to.equal('2000-01-01');
          done();
        });

        esc(target);
      });
    });
  });

  describe('default parser', () => {
    const today = new Date();

    it('should parse a single digit', () => {
      inputText('20');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(today.getFullYear());
      expect(result.getMonth()).to.equal(today.getMonth());
      expect(result.getDate()).to.equal(20);
    });

    it('should parse two digits', () => {
      inputText('6/20');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(today.getFullYear());
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(20);
    });

    it('should parse three digits', () => {
      inputText('6/20/1999');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(1999);
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(20);
    });

    it('should parse three digits with small year', () => {
      inputText('6/20/0099');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(99);
    });

    it('should parse three digits with short year', () => {
      inputText('6/20/99');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(1999);
    });

    it('should parse three digits with short year 2', () => {
      inputText('6/20/20');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(2020);
    });

    it('should parse three digits with short year 3', () => {
      inputText('6/20/1');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(2001);
    });

    it('should parse three digits with negative year', () => {
      inputText('6/20/-1');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(-1);
    });

    it('should parse in base 10', () => {
      inputText('09/09/09');
      const result = focusedDate();
      expect(result.getFullYear()).to.equal(2009);
      expect(result.getMonth()).to.equal(8);
      expect(result.getDate()).to.equal(9);
    });
  });

  describe('focus modes', () => {
    let overlayContent;

    beforeEach(() => (overlayContent = getOverlayContent(datepicker)));

    it('should be tabbable', () => {
      expect(parseInt(overlayContent.getAttribute('tabindex'), 10)).to.equal(0);
      expect(datepicker.hasAttribute('focused')).to.be.false;
    });

    it('should focus the input on esc', () => {
      arrowDown(target);
      esc(target);
      expect(datepicker.hasAttribute('focused')).to.be.true;
    });

    it('should focus the input on date tap', () => {
      arrowDown(target);
      overlayContent.dispatchEvent(new CustomEvent('date-tap', { bubbles: true, composed: true }));
      expect(datepicker.hasAttribute('focused')).to.be.true;
    });

    it('should focus the input on date cancel', () => {
      arrowDown(target);
      tap(overlayContent.$.cancelButton);
      expect(datepicker.hasAttribute('focused')).to.be.true;
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

    it('should keep focused attribute when the focus moves to the overlay', async () => {
      await open(datepicker);
      tap(overlayContent);
      datepicker.focusElement.blur();
      expect(datepicker.hasAttribute('focused')).to.be.false;

      overlayContent.focus();
      expect(datepicker.hasAttribute('focused')).to.be.true;
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

  describe('change event', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      datepicker.addEventListener('change', spy);
    });

    it('should fire change on user text input commit', () => {
      inputText('1/2/2000');
      enter(target);
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on user arrow input commit', () => {
      arrowDown(target);
      arrowDown(target);
      enter(target);
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change clear button click', () => {
      datepicker.clearButtonVisible = true;
      datepicker.value = '2000-01-01';
      click(datepicker.$.clearButton);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire change on focused date change', () => {
      inputText('1/2/2000');
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change', () => {
      datepicker.value = '2000-01-01';
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change when opened', () => {
      datepicker.open();
      datepicker.value = '2000-01-01';
      datepicker.close();
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change when text input changed', () => {
      inputText('1/2/2000');
      datepicker.value = '2000-01-01';
      datepicker.close();
      expect(spy.called).to.be.false;
    });

    it('should not fire change if the value was not changed', () => {
      datepicker.value = '2000-01-01';
      datepicker.open();
      enter(target);
      expect(spy.called).to.be.false;
    });

    it('should not fire change on revert', () => {
      datepicker.value = '2000-01-01';
      esc(target);
      expect(spy.called).to.be.false;
    });
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      datepicker.autoOpenDisabled = true;
    });

    it('should not open overlay on input', () => {
      inputChar('j');
      expect(datepicker.opened).not.to.be.true;
    });

    it('should focus parsed date when opening overlay', () => {
      inputText('1/20/2000');
      datepicker.open();

      expect(focusedDate().getMonth()).to.equal(0);
      expect(focusedDate().getDate()).to.equal(20);
    });

    it('should set datepicker value on blur', () => {
      inputText('1/1/2000');
      target.dispatchEvent(new Event('blur'));
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should not be invalid on blur if valid date is entered', () => {
      inputText('1/1/2000');
      target.dispatchEvent(new Event('blur'));
      expect(datepicker.invalid).not.to.be.true;
    });

    it('should validate on blur only once', () => {
      inputText('foo');
      const spy = sinon.spy(datepicker, 'validate');
      target.dispatchEvent(new Event('blur'));
      expect(spy.callCount).to.equal(1);
      expect(datepicker.invalid).to.be.true;
    });

    it('should revert input value on esc when overlay not initialized', () => {
      inputText('1/1/2000');
      esc(target);
      expect(datepicker._inputValue).to.equal('');
      expect(datepicker.value).to.equal('');
    });

    it('should revert input value on esc when overlay has been initialized', () => {
      datepicker.open();
      datepicker.close();
      inputText('1/1/2000');
      esc(target);
      expect(datepicker.value).to.equal('');
    });

    it('should not revert input value on esc after selected value is removed', () => {
      datepicker.open();
      inputText('1/1/2000');
      datepicker.close();
      target.value = '';
      esc(target);
      expect(datepicker.value).to.equal('');
    });

    it('should apply the input value on enter when overlay not initialized', () => {
      inputText('1/1/2000');
      enter(target);
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should apply input value on enter when overlay has been initialized', () => {
      datepicker.open();
      datepicker.close();
      inputText('1/1/2000');
      enter(target);
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should be invalid on enter with false input', () => {
      inputText('foo');
      enter(target);
      expect(datepicker.value).to.equal('');
      expect(datepicker.invalid).to.be.true;
    });
  });

  describe('change and validate sequence', () => {
    let validateSpy;
    let changeSpy;

    beforeEach(() => {
      validateSpy = sinon.spy(datepicker, 'validate');
      changeSpy = sinon.spy();
      datepicker.addEventListener('change', changeSpy);
    });

    describe('overlay is open and value selected', () => {
      beforeEach(async () => {
        await open(datepicker);
        inputText('01/02/20');
      });

      it('should validate without change on Esc', (done) => {
        listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', () => {
          // wait for overlay to finish closing
          afterNextRender(datepicker, () => {
            expect(validateSpy.calledOnce).to.be.true;
            expect(changeSpy.called).to.be.false;
            done();
          });
        });

        esc(target);
      });

      it('should change after validate on overlay close', (done) => {
        listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', () => {
          // wait for overlay to finish closing
          afterNextRender(datepicker, () => {
            expect(validateSpy.calledOnce).to.be.true;
            expect(changeSpy.calledOnce).to.be.true;
            expect(changeSpy.calledAfter(validateSpy)).to.be.true;
            done();
          });
        });

        datepicker.close();
      });

      it('should change after validate on Enter', (done) => {
        listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', () => {
          // wait for overlay to finish closing
          afterNextRender(datepicker, () => {
            expect(validateSpy.calledOnce).to.be.true;
            expect(changeSpy.calledOnce).to.be.true;
            expect(changeSpy.calledAfter(validateSpy)).to.be.true;
            done();
          });
        });

        enter(target);
      });
    });

    describe('overlay is closed, value is set', () => {
      beforeEach(async () => {
        await open(datepicker);
        inputText('01/02/20');
        await close(datepicker);
        validateSpy.resetHistory();
        changeSpy.resetHistory();
        // wait for overlay to finish closing
        await nextRender(datepicker);
        datepicker._focus();
      });

      it('should change after validate on clear button click', () => {
        datepicker.clearButtonVisible = true;
        click(datepicker.$.clearButton);
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should change after validate on Esc with clear button', () => {
        datepicker.clearButtonVisible = true;
        esc(target);
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should neither change nor validate on Esc without clear button', () => {
        esc(target);
        expect(validateSpy.called).to.be.false;
        expect(changeSpy.called).to.be.false;
      });

      it('should change after validate on Backspace & Enter', () => {
        target.value = '';
        target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        enter(target);
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should change after validate on Backspace & Esc', () => {
        target.value = '';
        target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        esc(target);
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });
    });

    describe('autoOpenDisabled true', () => {
      beforeEach(() => {
        datepicker.autoOpenDisabled = true;
      });

      it('should change after validate on Enter', () => {
        inputText('01/02/20');
        enter(target);
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should validate on Enter when value is the same', () => {
        enter(target);
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should validate on Enter when invalid', () => {
        inputText('foo');
        enter(target);
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should validate on blur', () => {
        target.dispatchEvent(new Event('blur'));
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should neither change nor validate on Esc', () => {
        inputText('01/02/20');
        esc(target);
        expect(validateSpy.called).to.be.false;
        expect(changeSpy.called).to.be.false;
      });

      describe('value is set', () => {
        beforeEach(() => {
          inputText('01/02/20');
          enter(target);
          validateSpy.resetHistory();
          changeSpy.resetHistory();
          datepicker._focusAndSelect();
        });

        it('should change after validate on Esc with clear button', () => {
          datepicker.clearButtonVisible = true;
          esc(target);
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should neither change nor validate on Esc without clear button', () => {
          esc(target);
          expect(validateSpy.called).to.be.false;
          expect(changeSpy.called).to.be.false;
        });

        it('should change after validate on Backspace & Enter', () => {
          target.value = '';
          target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
          enter(target);
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should change after validate on Backspace & Esc', () => {
          target.value = '';
          target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
          esc(target);
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should change after validate on Backspace & blur', () => {
          target.value = '';
          target.dispatchEvent(new CustomEvent('change', { bubbles: true }));
          target.dispatchEvent(new Event('blur'));
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });
      });
    });
  });
});
