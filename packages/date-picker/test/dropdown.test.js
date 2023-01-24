import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, mousedown, nextRender, oneEvent, touchstart } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { getFocusedCell, getOverlayContent, isFullscreen, monthsEqual, open, outsideClick } from './helpers.js';

describe('dropdown', () => {
  let datepicker, input, overlay;

  beforeEach(() => {
    datepicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    input = datepicker.inputElement;
    overlay = datepicker.$.overlay;
  });

  it('should update position of the overlay after changing opened property', () => {
    datepicker.opened = true;
    expect(input.getBoundingClientRect().bottom).to.be.closeTo(overlay.getBoundingClientRect().top, 0.01);
  });

  it('should detach overlay on datepicker detach', () => {
    datepicker.open();
    datepicker.parentElement.removeChild(datepicker);
    expect(overlay.parentElement).to.not.be.ok;
  });

  describe('toggle button', () => {
    let toggleButton;

    beforeEach(() => {
      toggleButton = datepicker.shadowRoot.querySelector('[part="toggle-button"]');
    });

    it('should open by tapping the calendar icon', () => {
      toggleButton.click();
      expect(datepicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should close on subsequent toggle button click', async () => {
      toggleButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      toggleButton.click();
      expect(datepicker.opened).to.be.false;
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
      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(monthsEqual(scrolledDate, new Date())).to.be.true;
    });

    it('should scroll to initial position', async () => {
      datepicker.initialPosition = '2016-01-01';

      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(scrolledDate).to.be.eql(new Date(2016, 0, 1));
    });

    it('should scroll to selected value', async () => {
      datepicker.value = '2000-02-01';

      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(monthsEqual(scrolledDate, new Date(2000, 1, 1))).to.be.true;
    });

    it('should remember the initial position on reopen', async () => {
      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);
      await oneEvent(overlay, 'vaadin-overlay-open');
      const initialPosition = overlayContent.initialPosition;

      datepicker.close();
      await nextRender();

      datepicker.open();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlayContent.initialPosition).to.be.eql(initialPosition);
    });

    it('should scroll to date on reopen', async () => {
      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);

      // We must scroll to initial position on reopen because
      // scrollTop can be reset while the dropdown is closed.
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(spy.called).to.be.true;

      datepicker.close();
      await nextRender();
      spy.resetHistory();

      await open(datepicker);
      expect(spy.called).to.be.true;
    });

    it('should scroll to min date when today is not allowed', async () => {
      datepicker.min = '2100-01-01';

      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(scrolledDate).to.be.eql(new Date(2100, 0, 1));
    });

    it('should scroll to max date when today is not allowed', async () => {
      datepicker.max = '2000-01-01';

      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(scrolledDate).to.be.eql(new Date(2000, 0, 1));
    });

    it('should scroll to initial position even when not allowed', async () => {
      datepicker.min = '2016-01-01';
      datepicker.max = '2016-12-31';

      datepicker.initialPosition = '2015-01-01';

      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);
      const spy = sinon.spy(overlayContent, 'scrollToDate');
      await oneEvent(overlay, 'vaadin-overlay-open');

      const scrolledDate = spy.firstCall.args[0];
      expect(scrolledDate).to.be.eql(new Date(2015, 0, 1));
    });
  });

  describe('outside click', () => {
    it('should restore focus to the input on outside click', async () => {
      input.focus();
      await open(datepicker);
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should focus the input on outside click', async () => {
      expect(document.activeElement).to.equal(document.body);
      await open(datepicker);
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should restore focus-ring attribute set before opening on outside click', async () => {
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });
      await open(datepicker);
      outsideClick();
      await aTimeout(0);
      expect(datepicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not remove focus-ring attribute set after opening on outside click', async () => {
      await open(datepicker);
      input.focus();
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      outsideClick();
      await aTimeout(0);
      expect(datepicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring attribute if it was not set before opening', async () => {
      await open(datepicker);
      outsideClick();
      await aTimeout(0);
      expect(datepicker.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('date tap', () => {
    function dateTap() {
      const content = getOverlayContent(datepicker);
      const date = getFocusedCell(content);
      mousedown(date);
      date.focus();
      date.click();
    }

    it('should close the overlay on date tap', async () => {
      input.focus();
      await open(datepicker);

      dateTap();
      await aTimeout(0);

      expect(datepicker.opened).to.be.false;
    });

    it('should restore focus to the input on date tap', async () => {
      input.focus();
      await open(datepicker);

      dateTap();
      await aTimeout(0);

      expect(document.activeElement).to.equal(input);
    });

    it('should restore focus-ring attribute set before opening on date tap', async () => {
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });
      await open(datepicker);

      dateTap();
      await aTimeout(0);

      expect(datepicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not remove focus-ring attribute after opening on date tap', async () => {
      await open(datepicker);
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });

      dateTap();
      await aTimeout(0);

      expect(datepicker.hasAttribute('focus-ring')).to.be.true;
    });
  });

  describe('virtual keyboard', () => {
    it('should disable virtual keyboard on close', async () => {
      await open(datepicker);
      datepicker.close();
      expect(input.inputMode).to.equal('none');
    });

    it('should re-enable virtual keyboard on touchstart', async () => {
      await open(datepicker);
      datepicker.close();
      touchstart(datepicker);
      expect(input.inputMode).to.equal('');
    });

    it('should re-enable virtual keyboard on blur', async () => {
      await open(datepicker);
      datepicker.close();
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
      datepicker._fullscreenMediaQuery = 'max-width: 520px';
    });

    it('should select fullscreen/desktop mode', (done) => {
      setTimeout(() => {
        datepicker.open();
        datepicker.$.overlay.addEventListener('vaadin-overlay-open', () => {
          const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
          const fullscreen = viewportWidth < 520;

          expect(isFullscreen(datepicker)).to.equal(fullscreen);
          done();
        });
      });
    });
  });
});
