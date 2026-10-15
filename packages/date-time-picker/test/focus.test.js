import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement, setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, focusin, focusout, nextRender, tap } from '@vaadin/testing-helpers';
import '../src/vaadin-date-time-picker.js';
import { getFocusableCell, open, untilOverlayRendered } from '@vaadin/date-picker/test/helpers.js';

describe('focus', () => {
  let dateTimePicker;
  let datePicker;
  let timePicker;

  beforeEach(async () => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
    await nextRender();
    datePicker = dateTimePicker.querySelector('[slot="date-picker"]');
    timePicker = dateTimePicker.querySelector('[slot="time-picker"]');
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('focused', () => {
    it('should set focused attribute on date-picker focusin', () => {
      focusin(datePicker);
      expect(dateTimePicker.hasAttribute('focused')).to.be.true;
    });

    it('should set focused attribute on time-picker focusin', () => {
      focusin(timePicker);
      expect(dateTimePicker.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on focusout', () => {
      datePicker.focus();
      datePicker.blur();
      expect(dateTimePicker.hasAttribute('focused')).to.be.false;
    });

    it('should not remove focused attribute when moving focus to time-picker', () => {
      focusin(datePicker);
      focusout(datePicker, timePicker.inputElement);
      expect(dateTimePicker.hasAttribute('focused')).to.be.true;
    });

    it('should not remove focused attribute when moving focus to date-picker', () => {
      focusin(timePicker);
      focusout(timePicker, datePicker.inputElement);
      expect(dateTimePicker.hasAttribute('focused')).to.be.true;
    });

    it('should not remove focused attribute when moving focus to overlay', async () => {
      focusin(datePicker);
      datePicker.open();
      await nextRender();
      focusout(datePicker, datePicker._overlayContent);
      expect(dateTimePicker.hasAttribute('focused')).to.be.true;
    });
  });

  describe('date-picker focused', () => {
    it('should remove focused attribute on time-picker click', async () => {
      await sendMouseToElement({ type: 'click', element: datePicker.inputElement });
      await nextRender();
      expect(datePicker.hasAttribute('focused')).to.be.true;

      await sendMouseToElement({ type: 'click', element: timePicker.inputElement });
      expect(datePicker.hasAttribute('focused')).to.be.false;
    });

    it('should remove focus-ring attribute on time-picker click', async () => {
      // Focus the date-picker with the keyboard
      await sendKeys({ press: 'Tab' });
      // Open the overlay with the keyboard
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();
      expect(datePicker.hasAttribute('focus-ring')).to.be.true;

      await sendMouseToElement({ type: 'click', element: timePicker.inputElement });
      expect(datePicker.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('time-picker focused', () => {
    beforeEach(() => {
      // Disable auto-open to make tests more reliable by only moving
      // focus on mousedown (and not the date-picker overlay opening).
      dateTimePicker.autoOpenDisabled = true;
    });

    it('should remove focused attribute on date-picker click', async () => {
      await sendMouseToElement({ type: 'click', element: timePicker.inputElement });
      // Open the overlay with the keyboard
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();
      expect(timePicker.hasAttribute('focused')).to.be.true;

      await sendMouseToElement({ type: 'click', element: datePicker.inputElement });
      expect(timePicker.hasAttribute('focused')).to.be.false;
    });

    it('should remove focus-ring attribute on date-picker click', async () => {
      // Focus the time-picker with the keyboard
      datePicker.focus();
      await sendKeys({ press: 'Tab' });
      // Open the overlay with the keyboard
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();
      expect(timePicker.hasAttribute('focus-ring')).to.be.true;

      await sendMouseToElement({ type: 'click', element: datePicker.inputElement });
      expect(timePicker.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('fullscreen', () => {
    let width, height;

    before(() => {
      width = window.innerWidth;
      height = window.innerHeight;
    });

    beforeEach(async () => {
      await setViewport({ width: 420, height });
      await nextRender();
    });

    afterEach(async () => {
      await setViewport({ width, height });
    });

    // Real mouse click outside fullscreen overlay rather than outsideClick() which moves focus to the body
    async function clickOutside() {
      const { top } = datePicker.$.overlay.getBoundingClientRect();
      await sendMouse({ type: 'click', position: [200, Math.round(top / 2)] });
    }

    it('should remove focused attribute when closing date overlay on outside click', async () => {
      await open(datePicker);
      expect(dateTimePicker.hasAttribute('focused')).to.be.true;

      await clickOutside();
      await nextRender();

      expect(dateTimePicker.hasAttribute('focused')).to.be.false;
      expect(datePicker.hasAttribute('focused')).to.be.false;
    });

    it('should remove focused attribute when closing date overlay on date click', async () => {
      await open(datePicker);
      expect(dateTimePicker.hasAttribute('focused')).to.be.true;

      tap(getFocusableCell(datePicker));
      await nextRender();

      expect(dateTimePicker.hasAttribute('focused')).to.be.false;
    });

    it('should keep focused attribute when closing date overlay on Esc', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(datePicker);

      await sendKeys({ press: 'Escape' });
      await nextRender();

      expect(dateTimePicker.hasAttribute('focused')).to.be.true;
      expect(dateTimePicker.hasAttribute('focus-ring')).to.be.true;
    });
  });
});
