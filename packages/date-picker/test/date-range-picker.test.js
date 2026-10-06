import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-range-picker.js';
import { getDateCell, getMonthCalendar, untilOverlayRendered } from './helpers.js';

describe('date-range-picker', () => {
  let picker, startInput, endInput;

  function getCell(day) {
    return getDateCell(getMonthCalendar(picker, 2026, 2), day);
  }

  function getParts(day) {
    return getCell(day).getAttribute('part').split(' ');
  }

  async function pick(day) {
    await sendMouseToElement({ type: 'click', element: getCell(day) });
    await untilOverlayRendered(picker);
  }

  async function openFrom(input) {
    input.focus();
    input.click();
    await untilOverlayRendered(picker);
  }

  beforeEach(async () => {
    picker = fixtureSync('<vaadin-date-range-picker></vaadin-date-range-picker>');
    await nextRender();
    [startInput, endInput] = picker.querySelectorAll('input');
    // Makes an empty range open the overlay at March 2026, the closest allowed month.
    picker.min = '2026-01-01';
    picker.max = '2026-03-31';
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('picking with an empty range', () => {
    beforeEach(async () => {
      await openFrom(startInput);
    });

    it('should set the start, keep the overlay open and move focus to the end input', async () => {
      await pick(10);
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('');
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(endInput);
      expect(picker.getAttribute('active-part')).to.equal('end');
    });

    it('should preview the range when hovering a date after the start', async () => {
      await pick(10);
      await sendMouseToElement({ type: 'move', element: getCell(13) });
      expect(getParts(10)).to.include.members(['range-start', 'in-range']);
      expect(getParts(12)).to.include('in-range');
      expect(getParts(13)).to.include.members(['range-end', 'in-range']);
      expect(getParts(14)).to.not.include('in-range');
    });

    it('should set the end, close the overlay and fire change when picking the end', async () => {
      const spy = sinon.spy();
      picker.addEventListener('change', spy);
      await pick(10);
      await pick(15);
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('2026-03-15');
      expect(picker.opened).to.be.false;
      expect(spy).to.be.calledOnce;
    });

    it('should set a new start when picking a date before the start', async () => {
      await pick(10);
      await pick(5);
      expect(picker.startValue).to.equal('2026-03-05');
      expect(picker.endValue).to.equal('');
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(endInput);
    });
  });

  describe('picking with an existing range', () => {
    beforeEach(() => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
    });

    it('should change only the end when opened from the end input', async () => {
      await openFrom(endInput);
      await pick(20);
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('2026-03-20');
    });

    it('should change only the start and close when the new start is not after the end', async () => {
      await openFrom(startInput);
      await pick(12);
      expect(picker.startValue).to.equal('2026-03-12');
      expect(picker.endValue).to.equal('2026-03-15');
      expect(picker.opened).to.be.false;
    });

    it('should clear the end and continue with the end when the new start is after the end', async () => {
      await openFrom(startInput);
      await pick(20);
      expect(picker.startValue).to.equal('2026-03-20');
      expect(picker.endValue).to.equal('');
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(endInput);
    });

    it('should not mark the previous end while previewing a new end', async () => {
      await openFrom(endInput);
      await sendMouseToElement({ type: 'move', element: getCell(20) });
      expect(getParts(20)).to.include.members(['range-end', 'selected']);
      expect(getParts(15)).to.not.include.members(['range-end']);
      expect(getParts(15)).to.not.include('selected');
    });

    it('should not mark the previous start while previewing a new start', async () => {
      await openFrom(startInput);
      await sendMouseToElement({ type: 'move', element: getCell(12) });
      expect(getParts(12)).to.include.members(['range-start', 'selected']);
      expect(getParts(15)).to.include('range-end');
      expect(getParts(10)).to.not.include('range-start');
      expect(getParts(10)).to.not.include('selected');
    });

    it('should not preview a new start after the end', async () => {
      await openFrom(startInput);
      await sendMouseToElement({ type: 'move', element: getCell(20) });
      expect(getParts(10)).to.include('range-start');
      expect(getParts(20)).to.not.include('range-start');
    });

    it('should mark the end being edited, depending on the focused input', async () => {
      await openFrom(endInput);
      expect(getParts(15)).to.include('range-editing');
      expect(getParts(10)).to.not.include('range-editing');

      startInput.focus();
      await untilOverlayRendered(picker);
      expect(getParts(10)).to.include('range-editing');
      expect(getParts(15)).to.not.include('range-editing');
    });

    it('should mark the previewed end as being edited', async () => {
      await openFrom(endInput);
      await sendMouseToElement({ type: 'move', element: getCell(20) });
      expect(getParts(20)).to.include('range-editing');
      expect(getParts(10)).to.not.include('range-editing');
    });

    it('should restore the range on Escape', async () => {
      await openFrom(startInput);
      await pick(20);
      await sendKeys({ press: 'Escape' });
      expect(picker.opened).to.be.false;
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('2026-03-15');
    });

    it('should restore the range on Cancel', async () => {
      await openFrom(startInput);
      await pick(20);
      await sendMouseToElement({ type: 'click', element: picker._overlayContent._cancelButton });
      expect(picker.opened).to.be.false;
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('2026-03-15');
    });

    it('should show both dates in the inputs', () => {
      expect(startInput.value).to.equal('3/10/2026');
      expect(endInput.value).to.equal('3/15/2026');
    });
  });

  describe('picking the end first', () => {
    it('should keep the end when picking a start before it afterwards', async () => {
      await openFrom(endInput);
      await pick(20);
      expect(picker.endValue).to.equal('2026-03-20');
      expect(picker.opened).to.be.false;

      await openFrom(startInput);
      await pick(12);
      expect(picker.startValue).to.equal('2026-03-12');
      expect(picker.endValue).to.equal('2026-03-20');
    });
  });

  describe('values', () => {
    it('should not fire change when setting values programmatically', () => {
      const spy = sinon.spy();
      picker.addEventListener('change', spy);
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      expect(spy).to.be.not.called;
    });

    it('should fire start-value-changed and end-value-changed when picking', async () => {
      const startSpy = sinon.spy();
      const endSpy = sinon.spy();
      picker.addEventListener('start-value-changed', startSpy);
      picker.addEventListener('end-value-changed', endSpy);
      await openFrom(startInput);
      await pick(10);
      expect(startSpy).to.be.calledOnce;
      await pick(12);
      expect(endSpy).to.be.calledOnce;
    });

    it('should ignore an unparsable value', () => {
      picker.startValue = 'foo';
      expect(startInput.value).to.equal('');
    });
  });

  describe('clear buttons', () => {
    let startClear, endClear;

    beforeEach(async () => {
      picker.clearButtonVisible = true;
      await nextRender();
      startClear = picker.shadowRoot.querySelector('[part~="start-clear-button"]');
      endClear = picker.shadowRoot.querySelector('[part~="end-clear-button"]');
    });

    it('should show each clear button only when its own date is set', async () => {
      const isVisible = (button) => getComputedStyle(button).display !== 'none';
      expect(isVisible(startClear)).to.be.false;
      expect(isVisible(endClear)).to.be.false;

      picker.endValue = '2026-03-15';
      await nextRender();
      expect(isVisible(startClear)).to.be.false;
      expect(isVisible(endClear)).to.be.true;

      picker.startValue = '2026-03-10';
      await nextRender();
      expect(isVisible(startClear)).to.be.true;
    });

    it('should clear only the start and fire change on start clear button click', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      await nextRender();
      const spy = sinon.spy();
      picker.addEventListener('change', spy);
      await sendMouseToElement({ type: 'click', element: startClear });
      expect(picker.startValue).to.equal('');
      expect(picker.endValue).to.equal('2026-03-15');
      expect(startInput.value).to.equal('');
      expect(spy).to.be.calledOnce;
    });

    it('should clear only the end on end clear button click', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      await nextRender();
      await sendMouseToElement({ type: 'click', element: endClear });
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('');
    });
  });

  describe('keyboard', () => {
    it('should clear both dates on Escape when the overlay is closed and the clear button is visible', async () => {
      picker.clearButtonVisible = true;
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      endInput.focus();
      await sendKeys({ press: 'Escape' });
      expect(picker.startValue).to.equal('');
      expect(picker.endValue).to.equal('');
    });

    it('should revert unparsed text on Escape when the clear button is not visible', async () => {
      picker.startValue = '2026-03-10';
      startInput.focus();
      startInput.value = 'foo';
      await sendKeys({ press: 'Escape' });
      expect(startInput.value).to.equal('3/10/2026');
      expect(picker.startValue).to.equal('2026-03-10');
    });

    it('should pick a range with the keyboard only', async () => {
      startInput.focus();
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(picker);
      expect(picker.opened).to.be.true;
      // Focus starts at the initial position, March 31 (max).
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'Enter' });
      await untilOverlayRendered(picker);
      expect(picker.startValue).to.equal('2026-03-30');
      expect(document.activeElement).to.equal(endInput);

      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(picker);
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Enter' });
      await untilOverlayRendered(picker);
      expect(picker.endValue).to.equal('2026-03-31');
      expect(picker.opened).to.be.false;
    });

    it('should move focus from the start input to the end input and into the calendar on Tab', async () => {
      await openFrom(startInput);
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(endInput);
      expect(picker.getAttribute('active-part')).to.equal('end');
      await sendKeys({ press: 'Tab' });
      await untilOverlayRendered(picker);
      const calendar = document.activeElement;
      expect(calendar.localName).to.equal('vaadin-month-calendar');
      expect(calendar.shadowRoot.activeElement.getAttribute('part')).to.include('date');
      expect(picker.opened).to.be.true;
    });

    it('should keep focus in the overlay on Shift+Tab from the start input', async () => {
      await openFrom(startInput);
      await sendKeys({ press: 'Shift+Tab' });
      expect(picker.opened).to.be.true;
      expect(picker._overlayContent.contains(document.activeElement)).to.be.true;
    });
  });

  describe('field frame', () => {
    let inputField;

    // Clicks the frame of the field, in its top padding, outside of the inputs.
    async function clickFrame(x) {
      const rect = inputField.getBoundingClientRect();
      await sendMouse({ type: 'click', position: [Math.round(x), Math.round(rect.top + 2)] });
      await untilOverlayRendered(picker);
    }

    beforeEach(() => {
      inputField = picker.shadowRoot.querySelector('[part="input-field"]');
    });

    it('should focus the start input and pick the start when clicking the frame next to the start input', async () => {
      await clickFrame(startInput.getBoundingClientRect().left + 4);
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(startInput);
      expect(picker.getAttribute('active-part')).to.equal('start');
      await pick(10);
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('');
      expect(picker.opened).to.be.true;
    });

    it('should focus the end input when clicking the frame next to the end input', async () => {
      await clickFrame(endInput.getBoundingClientRect().left + 4);
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(endInput);
      expect(picker.getAttribute('active-part')).to.equal('end');
    });
  });

  describe('state', () => {
    it('should not open when disabled', async () => {
      picker.disabled = true;
      picker.click();
      await nextRender();
      expect(picker.opened).to.be.not.ok;
    });

    it('should not open when read-only', async () => {
      picker.readonly = true;
      startInput.click();
      await nextRender();
      expect(picker.opened).to.be.not.ok;
    });

    it('should always focus the start input when opening with the calendar button', async () => {
      endInput.focus();
      endInput.blur();
      const toggle = picker.shadowRoot.querySelector('[part~="toggle-button"]');
      await sendMouseToElement({ type: 'click', element: toggle });
      await untilOverlayRendered(picker);
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(startInput);
      expect(picker.getAttribute('active-part')).to.equal('start');
    });

    it('should toggle aria-expanded on both inputs', async () => {
      expect(startInput.getAttribute('aria-expanded')).to.equal('false');
      await openFrom(startInput);
      expect(startInput.getAttribute('aria-expanded')).to.equal('true');
      expect(endInput.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should open the overlay at the month of the date being picked', async () => {
      picker.startValue = '2026-01-10';
      picker.endValue = '2026-03-15';
      await openFrom(endInput);
      expect(picker._overlayContent.focusedDate.getMonth()).to.equal(2);
    });
  });

  describe('accessibility', () => {
    it('should name the inputs after the label and the part', async () => {
      picker.label = 'Trip dates';
      await nextRender();
      expect(startInput.getAttribute('aria-label')).to.equal('Trip dates Start date');
      expect(endInput.getAttribute('aria-label')).to.equal('Trip dates End date');
    });

    it('should use the part names from i18n', async () => {
      picker.i18n = { startAccessibleName: 'Departure', endAccessibleName: 'Return' };
      await nextRender();
      expect(startInput.getAttribute('aria-label')).to.equal('Departure');
      expect(endInput.getAttribute('aria-label')).to.equal('Return');
    });

    it('should link the helper text to the group', async () => {
      picker.helperText = 'Pick both dates';
      await nextRender();
      const helper = picker.querySelector('[slot=helper]');
      expect(picker.getAttribute('aria-describedby')).to.include(helper.id);
    });

    it('should be a group labelled by the label', async () => {
      picker.label = 'Trip dates';
      await nextRender();
      const label = picker.querySelector('[slot=label]');
      expect(picker.getAttribute('role')).to.equal('group');
      expect(picker.getAttribute('aria-labelledby')).to.equal(label.id);
      expect(label.hasAttribute('for')).to.be.false;
    });
  });

  describe('validation', () => {
    it('should be invalid when the typed end is before the start', async () => {
      picker.startValue = '2026-03-10';
      endInput.focus();
      endInput.value = '3/5/2026';
      await sendKeys({ press: 'Enter' });
      expect(picker.endValue).to.equal('2026-03-05');
      expect(picker.invalid).to.be.true;
    });

    it('should be invalid when a date is outside of min and max', async () => {
      picker.startValue = '2025-12-10';
      startInput.focus();
      await sendKeys({ press: 'Enter' });
      expect(picker.checkValidity()).to.be.false;
    });

    it('should be invalid when a date is disabled', () => {
      picker.isDateDisabled = (date) => date.day === 10;
      picker.startValue = '2026-03-10';
      expect(picker.checkValidity()).to.be.false;
    });

    it('should be invalid with unparsable text', async () => {
      startInput.focus();
      startInput.value = 'foo';
      await sendKeys({ press: 'Enter' });
      expect(picker.startValue).to.equal('');
      expect(picker.invalid).to.be.true;
    });

    it('should commit typed text when focus leaves the field', () => {
      const spy = sinon.spy();
      picker.addEventListener('change', spy);
      startInput.focus();
      startInput.value = '3/10/2026';
      startInput.blur();
      expect(picker.startValue).to.equal('2026-03-10');
      expect(spy).to.be.calledOnce;
    });

    it('should require both dates when required', () => {
      picker.required = true;
      picker.startValue = '2026-03-10';
      expect(picker.checkValidity()).to.be.false;
      picker.endValue = '2026-03-12';
      expect(picker.checkValidity()).to.be.true;
    });
  });
});
