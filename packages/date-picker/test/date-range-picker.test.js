import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
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

    it('should clear the end when picking a new start', async () => {
      await openFrom(startInput);
      await pick(12);
      expect(picker.startValue).to.equal('2026-03-12');
      expect(picker.endValue).to.equal('');
      expect(getParts(15)).to.not.include('range-end');
    });

    it('should restore the range on Escape', async () => {
      await openFrom(startInput);
      await pick(12);
      await sendKeys({ press: 'Escape' });
      expect(picker.opened).to.be.false;
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('2026-03-15');
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

    it('should require both dates when required', () => {
      picker.required = true;
      picker.startValue = '2026-03-10';
      expect(picker.checkValidity()).to.be.false;
      picker.endValue = '2026-03-12';
      expect(picker.checkValidity()).to.be.true;
    });
  });
});
