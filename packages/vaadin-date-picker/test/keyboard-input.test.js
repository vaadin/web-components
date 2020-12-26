import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixture } from '@open-wc/testing-helpers';
import {
  focus,
  keyDownOn,
  pressAndReleaseKeyOn,
  pressEnter,
  tap
} from '@polymer/iron-test-helpers/mock-interactions.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';
import { click, getOverlayContent, ios, listenForEvent, open } from './common.js';

(ios ? describe.skip : describe)('keyboard input', () => {
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

  function arrowDown() {
    keyDownOn(target, 40);
  }

  function arrowRight() {
    keyDownOn(target, 39);
  }

  function arrowUp() {
    keyDownOn(target, 38);
  }

  function arrowLeft() {
    keyDownOn(target, 37);
  }

  function enter() {
    pressEnter(target);
  }

  function esc() {
    keyDownOn(target, 27);
  }

  function focusedDate() {
    return getOverlayContent(datepicker).focusedDate;
  }

  beforeEach(async () => {
    datepicker = await fixture('<vaadin-date-picker></vaadin-date-picker>');
    target = datepicker._inputElement;
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

    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', () => {
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

  it('should select focused date on enter', (done) => {
    inputText('1/1/2001');

    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      expect(datepicker.value).to.equal('2001-01-01');
      done();
    });

    enter();
  });

  it('should not select a date on enter if input invalid', (done) => {
    open(datepicker, () => {
      inputText('foo');
      enter();
    });
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      expect(datepicker.invalid).to.be.true;
      expect(datepicker.value).to.equal('');
      expect(target.value).to.equal('foo');
      done();
    });
  });

  it('should display focused date while overlay focused', () => {
    inputText('1/2/2000');
    arrowDown();
    expect(target.value).not.to.equal('1/2/2000');
  });

  it('should not forward keys after close', (done) => {
    inputText('1/2/2000');
    arrowDown();
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      const focused = focusedDate();
      arrowRight();
      expect(focusedDate()).to.eql(focused);
      done();
    });
    enter();
  });

  it('should not open with wrong keys', () => {
    arrowRight();
    expect(datepicker.opened).not.to.be.ok;
  });

  it('should not forward keys after reopen', (done) => {
    inputText('1/2/2000');
    arrowDown();

    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      const focused = focusedDate();
      arrowRight();
      expect(focusedDate()).to.eql(focused);
      done();
    });

    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      inputText('0');
    });
    enter();
  });

  it('should not forward after user changes input', (done) => {
    inputText('1/2/2000');
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      arrowDown();
      // Forwarding keys to overlay
      target.value = '';
      inputText('foo');
      // Keys shouldn't get forwarded anymore
      const focused = focusedDate();
      arrowRight();
      expect(focusedDate()).to.eql(focused);
      done();
    });
  });

  it('should not forward after input tap', (done) => {
    open(datepicker, () => {
      arrowDown();
      const focused = focusedDate();
      target.dispatchEvent(new CustomEvent('tap', { bubbles: true, composed: true }));
      arrowLeft();
      expect(focusedDate()).to.eql(focused);
      done();
    });
  });

  it('should reflect focused date to input', (done) => {
    datepicker.value = '2000-01-01';

    arrowDown();
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      arrowDown();
      expect(datepicker._inputValue).to.equal('1/8/2000');
      done();
    });
  });

  it('should not reflect focused date on open', (done) => {
    arrowDown();
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      expect(datepicker._inputValue).to.equal('');
      done();
    });
  });

  it('should stop key event bubbles from overlay', (done) => {
    datepicker.value = '2000-01-01';

    arrowDown();
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      arrowDown();
      target = getOverlayContent(datepicker);
      arrowDown();
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

  it('should validate on close', (done) => {
    open(datepicker, () => {
      const spy = sinon.spy(datepicker, 'validate');

      listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
        expect(spy.called).to.be.true;
        done();
      });

      datepicker.close();
    });
  });

  it('should validate on blur when not opened', (done) => {
    inputText('foo');
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      // wait for overlay to finish closing
      afterNextRender(datepicker, () => {
        target.value = '';
        const spy = sinon.spy(datepicker, 'validate');
        datepicker.dispatchEvent(new Event('blur'));
        expect(spy.callCount).to.equal(1);
        expect(datepicker.invalid).to.be.false;
        done();
      });
    });
    datepicker.close();
  });

  it('should validate on clear button', (done) => {
    datepicker.clearButtonVisible = true;
    const clearButton = target.shadowRoot.querySelector('[part="clear-button"]');
    inputText('foo');
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      // wait for overlay to finish closing. Without this, clear button click
      // will trigger "close()" again, which will result in infinite loop.
      afterNextRender(datepicker, () => {
        click(clearButton);
        expect(datepicker.invalid).to.equal(false);
        done();
      });
    });
    datepicker.close();
  });

  it('should empty value with false input', (done) => {
    datepicker.value = '2000-01-01';
    target.value = '';
    inputText('foo');
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      expect(datepicker.value).to.equal('');
      done();
    });
    datepicker.close();
  });

  it('should be invalid with false input', (done) => {
    datepicker.value = '2000-01-01';
    target.value = '';
    inputText('foo');
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      expect(datepicker.invalid).to.be.true;
      done();
    });
    datepicker.close();
  });

  it('should clear selection on close', (done) => {
    open(datepicker, () => {
      arrowDown();
      datepicker.close();
    });
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
      expect(target.selectionStart).to.equal(target.selectionEnd);
      done();
    });
  });

  it('should not throw on enter before opening overlay', () => {
    expect(() => {
      datepicker.focus();
      enter();
    }).not.to.throw(Error);
  });

  describe('no parseDate', () => {
    beforeEach(() => {
      datepicker.set('i18n.parseDate', null);
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

    it('should select focused date on close', (done) => {
      open(datepicker, () => datepicker.close());
      listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
        expect(datepicker._selectedDate).to.equal(datepicker._focusedDate);
        done();
      });
    });
  });

  it('should not forward up/down to overlay when closed', (done) => {
    arrowUp();
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', () => {
      expect(datepicker._focusedDate.getDate()).to.eql(new Date().getDate());
      done();
    });
  });

  it('should forward up/down to overlay', (done) => {
    open(datepicker, () => {
      arrowUp();
      expect(datepicker._focusedDate.getDate()).not.to.eql(new Date().getDate());
      done();
    });
  });

  describe('esc behavior', () => {
    it('should close the overlay on esc', (done) => {
      open(datepicker, esc);
      listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => done());
    });

    it('should revert input value on esc', (done) => {
      datepicker.value = '2000-01-01';
      open(datepicker, () => {
        inputText('1/2/2000');
        arrowDown();
        arrowDown();
        esc();
        expect(target.value).to.equal('1/1/2000');
        done();
      });
    });

    it('should revert input value on esc (empty)', (done) => {
      datepicker.value = '';
      open(datepicker, () => {
        inputText('1/2/2000');
        arrowDown();
        arrowDown();
        esc();
        expect(target.value).to.equal('');
        done();
      });
    });

    it('should cancel on overlay content esc', (done) => {
      datepicker.value = '';
      open(datepicker, () => {
        inputText('1/2/2000 ');
        arrowDown();
        arrowDown();
        const overlayContent = datepicker.$.overlay.content.querySelector('vaadin-date-picker-overlay-content').$
          .monthScroller;
        target = overlayContent;
        esc();
        expect(datepicker.opened).to.be.false;
        expect(datepicker.value).not.to.be.ok;
        done();
      });
    });

    it('should not change value on esc', (done) => {
      datepicker.value = '2000-01-01';
      open(datepicker, () => {
        inputText('1/2/2000');
        arrowDown();
        arrowDown();
        esc();
      });
      listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
        expect(datepicker.value).to.equal('2000-01-01');
        done();
      });
    });

    it('should not change value on esc (empty)', (done) => {
      datepicker.value = '';
      open(datepicker, () => {
        inputText('1/2/2000');
        arrowDown();
        arrowDown();
        esc();
      });
      listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
        expect(datepicker.value).to.equal('');
        done();
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
      expect(datepicker._inputElement.hasAttribute('focused')).to.equal(false);
    });

    it('should focus the input on esc', () => {
      arrowDown();
      esc();
      expect(datepicker._inputElement.hasAttribute('focused')).to.be.true;
    });

    it('should focus the input on date tap', () => {
      arrowDown();
      overlayContent.dispatchEvent(new CustomEvent('date-tap', { bubbles: true, composed: true }));
      expect(datepicker._inputElement.hasAttribute('focused')).to.be.true;
    });

    it('should focus the input on date cancel', () => {
      arrowDown();
      tap(overlayContent.$.cancelButton);
      expect(datepicker._inputElement.hasAttribute('focused')).to.be.true;
    });

    it('should focus cancel on input shift tab', (done) => {
      open(datepicker, () => {
        focus(datepicker._inputElement);
        pressAndReleaseKeyOn(datepicker._inputElement, 9, 'shift');
        expect(overlayContent.$.cancelButton.hasAttribute('focused')).to.be.true;
        done();
      });
    });

    it('should focus input in cancel tab', (done) => {
      open(datepicker, () => {
        focus(overlayContent.$.cancelButton);

        const spy = sinon.spy(datepicker, '_focus');
        pressAndReleaseKeyOn(overlayContent.$.cancelButton, 9);
        setTimeout(() => {
          expect(spy.called).to.be.true;
          done();
        }, 1);
      });
    });

    it('should keep focused attribute in focusElement when the focus moves to the overlay', (done) => {
      open(datepicker, () => {
        tap(overlayContent);
        datepicker.focusElement.blur();
        expect(datepicker.focusElement.hasAttribute('focused')).to.be.false;

        focus(overlayContent);
        expect(datepicker.focusElement.hasAttribute('focused')).to.be.true;
        done();
      });
    });

    it('should not reveal the focused date on tap', (done) => {
      open(datepicker, () => {
        const spy = sinon.spy(overlayContent, 'revealDate');
        tap(overlayContent);
        focus(overlayContent);
        setTimeout(() => {
          expect(spy.called).to.be.false;
          done();
        }, 1);
      });
    });

    it('should reveal the focused date on tab focus from input', (done) => {
      open(datepicker, () => {
        const spy = sinon.spy(overlayContent, 'revealDate');
        pressAndReleaseKeyOn(datepicker._inputElement, 9);
        expect(spy.called).to.be.true;
        done();
      });
    });

    it('should reveal the focused date on shift-tab focus from today button', (done) => {
      open(datepicker, () => {
        const spy = sinon.spy(overlayContent, 'revealDate');
        pressAndReleaseKeyOn(overlayContent.$.todayButton, 9, 'shift');
        focus(overlayContent);
        setTimeout(() => {
          expect(spy.called).to.be.true;
          done();
        }, 1);
      });
    });

    it('should not focus overlay on key-input', (done) => {
      const spy = sinon.spy(datepicker.$.overlay, 'focus');

      listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', () => {
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
      enter();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on user arrow input commit', () => {
      arrowDown();
      arrowDown();
      enter();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change clear button click', () => {
      datepicker.clearButtonVisible = true;
      const clearButton = datepicker._inputElement.shadowRoot.querySelector('[part="clear-button"]');
      datepicker.value = '2000-01-01';
      click(clearButton);
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
      enter();
      expect(spy.called).to.be.false;
    });

    it('should not fire change on revert', () => {
      datepicker.value = '2000-01-01';
      esc();
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

    it('should set datepicker value on blur', () => {
      inputText('1/1/2000');
      datepicker.dispatchEvent(new Event('blur'));
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should not be invalid on blur if valid date is entered', () => {
      inputText('1/1/2000');
      datepicker.dispatchEvent(new Event('blur'));
      expect(datepicker.invalid).not.to.be.true;
    });

    it('should validate on blur only once', () => {
      inputText('foo');
      const spy = sinon.spy(datepicker, 'validate');
      datepicker.dispatchEvent(new Event('blur'));
      expect(spy.callCount).to.equal(1);
      expect(datepicker.invalid).to.be.true;
    });

    it('should revert input value on esc when overlay not initialized', () => {
      inputText('1/1/2000');
      esc();
      expect(datepicker._inputValue).to.equal('');
      expect(datepicker.value).to.equal('');
    });

    it('should revert input value on esc when overlay has been initialized', () => {
      datepicker.open();
      datepicker.close();
      inputText('1/1/2000');
      esc();
      expect(datepicker.value).to.equal('');
    });

    it('should not revert input value on esc after selected value is removed', () => {
      datepicker.open();
      inputText('1/1/2000');
      datepicker.close();
      target.value = '';
      esc();
      expect(datepicker.value).to.equal('');
    });

    it('should apply the input value on enter when overlay not initialized', () => {
      inputText('1/1/2000');
      enter();
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should apply input value on enter when overlay has been initialized', () => {
      datepicker.open();
      datepicker.close();
      inputText('1/1/2000');
      enter();
      expect(datepicker.value).to.equal('2000-01-01');
    });

    it('should be invalid on enter with false input', () => {
      inputText('foo');
      enter();
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
      beforeEach((done) => {
        open(datepicker, () => {
          inputText('01/02/20');
          done();
        });
      });

      it('should validate without change on Esc', (done) => {
        listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
          // wait for overlay to finish closing
          afterNextRender(datepicker, () => {
            expect(validateSpy.calledOnce).to.be.true;
            expect(changeSpy.called).to.be.false;
            done();
          });
        });

        esc();
      });

      it('should change after validate on overlay close', (done) => {
        listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
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
        listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
          // wait for overlay to finish closing
          afterNextRender(datepicker, () => {
            expect(validateSpy.calledOnce).to.be.true;
            expect(changeSpy.calledOnce).to.be.true;
            expect(changeSpy.calledAfter(validateSpy)).to.be.true;
            done();
          });
        });

        enter();
      });
    });

    describe('overlay is closed, value is set', () => {
      beforeEach((done) => {
        open(datepicker, () => {
          inputText('01/02/20');
          listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', () => {
            // wait for overlay to finish closing
            afterNextRender(datepicker, () => {
              datepicker._focus();
              done();
            });
          });

          datepicker.close();
          validateSpy.resetHistory();
          changeSpy.resetHistory();
        });
      });

      it('should change after validate on clear button click', () => {
        datepicker.clearButtonVisible = true;
        click(target.shadowRoot.querySelector('[part="clear-button"]'));
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should change after validate on Esc with clear button', () => {
        datepicker.clearButtonVisible = true;
        esc();
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should neither change nor validate on Esc without clear button', () => {
        esc();
        expect(validateSpy.called).to.be.false;
        expect(changeSpy.called).to.be.false;
      });

      it('should change after validate on Backspace & Enter', () => {
        target.value = '';
        target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        enter();
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should change after validate on Backspace & Esc', () => {
        target.value = '';
        target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        esc();
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
        enter();
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should validate on Enter when value is the same', () => {
        enter();
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should validate on Enter when invalid', () => {
        inputText('foo');
        enter();
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should validate on blur', () => {
        datepicker.dispatchEvent(new Event('blur'));
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.called).to.be.false;
      });

      it('should neither change nor validate on Esc', () => {
        inputText('01/02/20');
        esc();
        expect(validateSpy.called).to.be.false;
        expect(changeSpy.called).to.be.false;
      });

      describe('value is set', () => {
        beforeEach(() => {
          inputText('01/02/20');
          enter();
          validateSpy.resetHistory();
          changeSpy.resetHistory();
          datepicker._focusAndSelect();
        });

        it('should change after validate on Esc with clear button', () => {
          datepicker.clearButtonVisible = true;
          esc();
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should neither change nor validate on Esc without clear button', () => {
          esc();
          expect(validateSpy.called).to.be.false;
          expect(changeSpy.called).to.be.false;
        });

        it('should change after validate on Backspace & Enter', () => {
          target.value = '';
          target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
          enter();
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should change after validate on Backspace & Esc', () => {
          target.value = '';
          target.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
          esc();
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });

        it('should change after validate on Backspace & blur', () => {
          target.value = '';
          target.dispatchEvent(new CustomEvent('change', { bubbles: true }));
          datepicker.dispatchEvent(new Event('blur'));
          expect(validateSpy.calledOnce).to.be.true;
          expect(changeSpy.calledOnce).to.be.true;
          expect(changeSpy.calledAfter(validateSpy)).to.be.true;
        });
      });
    });
  });
});
