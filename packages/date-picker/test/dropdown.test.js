import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, mousedown, nextRender, oneEvent, touchstart } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { getFocusedCell, getOverlayContent, isFullscreen, monthsEqual, open, outsideClick } from './helpers.js';

describe('dropdown', () => {
  let datePicker, input, overlay;

  beforeEach(() => {
    datePicker = fixtureSync(
      `<div>
        <vaadin-date-picker></vaadin-date-picker>
        <input id="last-global-focusable" />
      </div>`,
    ).firstElementChild;
    input = datePicker.inputElement;
    overlay = datePicker.$.overlay;
  });

  it('should update position of the overlay after changing opened property', () => {
    datePicker.opened = true;
    expect(input.getBoundingClientRect().bottom).to.be.closeTo(overlay.getBoundingClientRect().top, 0.01);
  });

  it('should detach overlay on datePicker detach', () => {
    datePicker.open();
    datePicker.parentElement.removeChild(datePicker);
    expect(overlay.parentElement).to.not.be.ok;
  });

  describe('toggle button', () => {
    let toggleButton;

    beforeEach(() => {
      toggleButton = datePicker.shadowRoot.querySelector('[part="toggle-button"]');
    });

    it('should open by tapping the calendar icon', () => {
      toggleButton.click();
      expect(datePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should close on subsequent toggle button click', async () => {
      toggleButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      toggleButton.click();
      expect(datePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should prevent default for the toggle button mousedown', () => {
      const e = new CustomEvent('mousedown', { bubbles: true });
      const spy = sinon.spy(e, 'preventDefault');
      toggleButton.dispatchEvent(e);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('scroll to date', () => {
    it('should scroll to today by default', async () => {
      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(monthsEqual(scrolledDate, new Date())).to.be.true;
    });

    it('should scroll to initial position', async () => {
      datePicker.initialPosition = '2016-01-01';

      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(scrolledDate).to.be.eql(new Date(2016, 0, 1));
    });

    it('should scroll to selected value', async () => {
      datePicker.value = '2000-02-01';

      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(monthsEqual(scrolledDate, new Date(2000, 1, 1))).to.be.true;
    });

    it('should remember the initial position on reopen', async () => {
      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);
      await oneEvent(overlay, 'vaadin-overlay-open');
      const initialPosition = overlayContent.initialPosition;

      datePicker.close();
      await nextRender();

      datePicker.open();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlayContent.initialPosition).to.be.eql(initialPosition);
    });

    it('should scroll to date on reopen', async () => {
      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);

      // We must scroll to initial position on reopen because
      // scrollTop can be reset while the dropdown is closed.
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(spy.called).to.be.true;

      datePicker.close();
      await nextRender();
      spy.resetHistory();

      await open(datePicker);
      expect(spy.called).to.be.true;
    });

    it('should scroll to min date when today is not allowed', async () => {
      datePicker.min = '2100-01-01';

      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(scrolledDate).to.be.eql(new Date(2100, 0, 1));
    });

    it('should scroll to max date when today is not allowed', async () => {
      datePicker.max = '2000-01-01';

      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(scrolledDate).to.be.eql(new Date(2000, 0, 1));
    });

    it('should scroll to initial position even when not allowed', async () => {
      datePicker.min = '2016-01-01';
      datePicker.max = '2016-12-31';

      datePicker.initialPosition = '2015-01-01';

      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(scrolledDate).to.be.eql(new Date(2015, 0, 1));
    });
  });

  describe('outside click', () => {
    it('should restore focus to the input on outside click', async () => {
      input.focus();
      await open(datePicker);
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should focus the input on outside click', async () => {
      expect(document.activeElement).to.equal(document.body);
      await open(datePicker);
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should restore focus-ring attribute set before opening on outside click', async () => {
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });
      await open(datePicker);
      outsideClick();
      await aTimeout(0);
      expect(datePicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not remove focus-ring attribute set after opening on outside click', async () => {
      await open(datePicker);
      input.focus();
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      outsideClick();
      await aTimeout(0);
      expect(datePicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring attribute if it was not set before opening', async () => {
      await open(datePicker);
      outsideClick();
      await aTimeout(0);
      expect(datePicker.hasAttribute('focus-ring')).to.be.false;
    });

    it('should commit focused date on outside click', async () => {
      datePicker.value = '2001-01-01';
      await open(datePicker);
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      // Navigate to another date
      await sendKeys({ press: 'ArrowRight' });
      outsideClick();
      await aTimeout(0);
      expect(datePicker.value).to.equal('2001-01-02');
    });

    it('should commit focused date on outside click after deselecting', async () => {
      datePicker.value = '2001-01-01';
      await open(datePicker);
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      // De-select the selected date
      await sendKeys({ press: 'Space' });
      // Navigate to another date
      await sendKeys({ press: 'ArrowRight' });
      outsideClick();
      await aTimeout(0);
      expect(datePicker.value).to.equal('2001-01-02');
    });
  });

  describe('date tap', () => {
    function dateTap() {
      const content = getOverlayContent(datePicker);
      const date = getFocusedCell(content);
      mousedown(date);
      date.focus();
      date.click();
    }

    it('should close the overlay on date tap', async () => {
      input.focus();
      await open(datePicker);

      dateTap();
      await aTimeout(0);

      expect(datePicker.opened).to.be.false;
    });

    it('should restore focus to the input on date tap', async () => {
      input.focus();
      await open(datePicker);

      dateTap();
      await aTimeout(0);

      expect(document.activeElement).to.equal(input);
    });

    it('should restore focus-ring attribute set before opening on date tap', async () => {
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });
      await open(datePicker);

      dateTap();
      await aTimeout(0);

      expect(datePicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not remove focus-ring attribute after opening on date tap', async () => {
      await open(datePicker);
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });

      dateTap();
      await aTimeout(0);

      expect(datePicker.hasAttribute('focus-ring')).to.be.true;
    });
  });

  describe('virtual keyboard', () => {
    it('should disable virtual keyboard on close', async () => {
      await open(datePicker);
      datePicker.close();
      expect(input.inputMode).to.equal('none');
    });

    it('should re-enable virtual keyboard on touchstart', async () => {
      await open(datePicker);
      datePicker.close();
      touchstart(datePicker);
      expect(input.inputMode).to.equal('');
    });

    it('should re-enable virtual keyboard on blur', async () => {
      await open(datePicker);
      datePicker.close();
      await sendKeys({ press: 'Tab' });
      expect(input.inputMode).to.equal('');
    });
  });

  describe('sizing', () => {
    beforeEach(() => {
      const viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0');
      document.getElementsByTagName('head')[0].appendChild(viewport);
      datePicker._fullscreenMediaQuery = 'max-width: 520px';
    });

    it('should select fullscreen/desktop mode', (done) => {
      setTimeout(() => {
        datePicker.open();
        datePicker.$.overlay.addEventListener('vaadin-overlay-open', () => {
          const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
          const fullscreen = viewportWidth < 520;

          expect(isFullscreen(datePicker)).to.equal(fullscreen);
          done();
        });
      });
    });
  });
});
