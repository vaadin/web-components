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
    // Most tests cover picking the start and the end separately, by clicking either
    // input. The default, picking the whole range from any click, has its own tests.
    picker.separateDatePicking = true;
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

    [
      { from: 'end', day: 20 },
      { from: 'end', day: 5 },
      { from: 'start', day: 12 },
      { from: 'start', day: 20 },
    ].forEach(({ from, day }) => {
      it(`should keep the range on display and hint at ${day} when hovering it from the ${from} input`, async () => {
        await openFrom(from === 'start' ? startInput : endInput);
        await sendMouseToElement({ type: 'move', element: getCell(day) });
        expect(getParts(day)).to.include('range-hint');
        expect(getParts(day)).to.not.include.members(['range-start', 'range-end']);
        expect(getParts(10)).to.include.members(['range-start', 'in-range']);
        expect(getParts(15)).to.include.members(['range-end', 'in-range']);
      });
    });

    it('should keep the range on display and hint at the date focused with the keyboard', async () => {
      endInput.focus();
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(picker);
      await sendKeys({ press: 'ArrowRight' });
      await untilOverlayRendered(picker);
      expect(getParts(16)).to.include('range-hint');
      expect(getParts(16)).to.not.include('range-end');
      expect(getParts(15)).to.include.members(['range-end', 'in-range']);
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

    it('should close and keep a picked start on Escape', async () => {
      await openFrom(startInput);
      await pick(20);
      await sendKeys({ press: 'Escape' });
      expect(picker.opened).to.be.false;
      expect(picker.startValue).to.equal('2026-03-20');
      expect(picker.endValue).to.equal('');
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

  describe('dragging', () => {
    function center(day) {
      const rect = getCell(day).getBoundingClientRect();
      return [Math.round(rect.left + rect.width / 2), Math.round(rect.top + rect.height / 2)];
    }

    async function drag(from, to, { release = true, via = [] } = {}) {
      await sendMouse({ type: 'move', position: center(from) });
      await sendMouse({ type: 'down' });
      for (const day of [...via, to]) {
        await sendMouse({ type: 'move', position: center(day) });
      }
      if (release) {
        await sendMouse({ type: 'up' });
        await untilOverlayRendered(picker);
      }
    }

    describe('with an empty range', () => {
      beforeEach(async () => {
        await openFrom(startInput);
      });

      it('should select the dragged range, close the overlay and fire change once', async () => {
        const spy = sinon.spy();
        picker.addEventListener('change', spy);
        await drag(8, 16);
        expect(picker.startValue).to.equal('2026-03-08');
        expect(picker.endValue).to.equal('2026-03-16');
        expect(picker.opened).to.be.false;
        expect(spy).to.be.calledOnce;
      });

      it('should select the range when dragging backwards', async () => {
        await drag(20, 5);
        expect(picker.startValue).to.equal('2026-03-05');
        expect(picker.endValue).to.equal('2026-03-20');
      });

      it('should preview the dragged range before releasing', async () => {
        await drag(8, 12, { release: false });
        expect(getParts(8)).to.include('range-start');
        expect(getParts(10)).to.include('in-range');
        expect(getParts(12)).to.include.members(['range-end', 'range-editing']);
        expect(picker.startValue).to.equal('');
        await sendMouse({ type: 'up' });
      });

      it('should not use a disabled date as an end of the range', async () => {
        picker.isDateDisabled = (date) => date.day === 16;
        // The range keeps the last allowed date the pointer was on.
        await drag(8, 16, { via: [15] });
        expect(picker.startValue).to.equal('2026-03-08');
        expect(picker.endValue).to.equal('2026-03-15');
      });

      it('should treat a press and release on the same date as a pick', async () => {
        await drag(8, 8);
        expect(picker.startValue).to.equal('2026-03-08');
        expect(picker.endValue).to.equal('');
        expect(picker.opened).to.be.true;
      });

      it('should move a picked start by dragging it and keep picking the end', async () => {
        await pick(8);
        await drag(8, 12);
        expect(picker.startValue).to.equal('2026-03-12');
        expect(picker.endValue).to.equal('');
        expect(picker.opened).to.be.true;
        expect(document.activeElement).to.equal(endInput);

        await pick(15);
        expect(picker.startValue).to.equal('2026-03-12');
        expect(picker.endValue).to.equal('2026-03-15');
        expect(picker.opened).to.be.false;
      });

      it('should not ignore a pick after a drag', async () => {
        await drag(8, 16);
        await openFrom(startInput);
        await pick(10);
        expect(picker.startValue).to.equal('2026-03-10');
        expect(picker.endValue).to.equal('2026-03-16');
      });
    });

    describe('with an existing range', () => {
      beforeEach(async () => {
        picker.startValue = '2026-03-10';
        picker.endValue = '2026-03-15';
        await openFrom(startInput);
      });

      it('should move the end when dragging it and keep the overlay open', async () => {
        const spy = sinon.spy();
        picker.addEventListener('change', spy);
        await drag(15, 20);
        expect(picker.startValue).to.equal('2026-03-10');
        expect(picker.endValue).to.equal('2026-03-20');
        expect(picker.opened).to.be.true;

        // Closing manually keeps the moved range.
        await sendKeys({ press: 'Escape' });
        expect(picker.opened).to.be.false;
        expect(picker.endValue).to.equal('2026-03-20');
        expect(spy).to.be.calledOnce;
      });

      it('should move the start when dragging it', async () => {
        await drag(10, 12);
        expect(picker.startValue).to.equal('2026-03-12');
        expect(picker.endValue).to.equal('2026-03-15');
        expect(picker.opened).to.be.true;
      });

      it('should turn the range around when dragging the start past the end', async () => {
        await drag(10, 20);
        expect(picker.startValue).to.equal('2026-03-15');
        expect(picker.endValue).to.equal('2026-03-20');
      });

      it('should mark the dragged end as being edited', async () => {
        await drag(15, 18, { release: false });
        expect(getParts(18)).to.include.members(['range-end', 'range-editing']);
        expect(getParts(10)).to.not.include('range-editing');
        await sendMouse({ type: 'up' });
      });

      it('should select a new range when dragging from a date inside the range', async () => {
        await drag(12, 25);
        expect(picker.startValue).to.equal('2026-03-12');
        expect(picker.endValue).to.equal('2026-03-25');
      });
    });
  });

  describe('picking the whole range from any click', () => {
    beforeEach(() => {
      picker.separateDatePicking = false;
    });

    async function clickInput(input) {
      await sendMouseToElement({ type: 'click', element: input });
      await untilOverlayRendered(picker);
    }

    it('should start from the start date when clicking the end input of an empty field', async () => {
      await clickInput(endInput);
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(startInput);
      expect(picker.getAttribute('active-part')).to.equal('start');

      await pick(10);
      expect(document.activeElement).to.equal(endInput);
      await pick(15);
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('2026-03-15');
      expect(picker.opened).to.be.false;
    });

    it('should pick the start and then the end when clicking an input of a filled field', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      await clickInput(startInput);
      await pick(9);
      expect(picker.opened).to.be.true;
      await pick(14);
      expect(picker.startValue).to.equal('2026-03-09');
      expect(picker.endValue).to.equal('2026-03-14');
      expect(picker.opened).to.be.false;
    });

    it('should edit only the end when moving to the end input with the keyboard', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      startInput.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(endInput);
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(picker);
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Enter' });
      await untilOverlayRendered(picker);
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('2026-03-16');
      expect(picker.opened).to.be.false;
    });

    it('should not redirect focus when clicking the end input while the overlay is open', async () => {
      await clickInput(startInput);
      await sendMouseToElement({ type: 'click', element: endInput });
      expect(document.activeElement).to.equal(endInput);
      expect(picker.getAttribute('active-part')).to.equal('end');
    });
  });

  describe('single input', () => {
    beforeEach(async () => {
      picker.singleInput = true;
      await nextRender();
    });

    it('should show only the start input and hide the end input and the separator', () => {
      expect(getComputedStyle(endInput).display).to.equal('none');
      expect(getComputedStyle(picker.shadowRoot.querySelector('[part="separator"]')).display).to.equal('none');
      expect(getComputedStyle(startInput).display).to.not.equal('none');
    });

    it('should show the whole range in the input', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      await nextRender();
      expect(startInput.value).to.equal('3/10/2026 – 3/15/2026');
    });

    it('should pick the start and then the end from the calendar, keeping focus in the input', async () => {
      await openFrom(startInput);
      await pick(10);
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(startInput);
      expect(startInput.value).to.equal('3/10/2026 –');
      await pick(15);
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('2026-03-15');
      expect(startInput.value).to.equal('3/10/2026 – 3/15/2026');
      expect(picker.opened).to.be.false;
    });

    it('should pick the whole range also when the range has a value', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      await openFrom(startInput);
      await pick(12);
      expect(picker.opened).to.be.true;
      await pick(13);
      expect(picker.startValue).to.equal('2026-03-12');
      expect(picker.endValue).to.equal('2026-03-13');
    });

    ['3/10/2026 – 3/15/2026', '3/10/2026 - 3/15/2026', '3/10/2026 to 3/15/2026'].forEach((text) => {
      it(`should commit a typed range: "${text}"`, async () => {
        startInput.focus();
        startInput.value = text;
        await sendKeys({ press: 'Enter' });
        expect(picker.startValue).to.equal('2026-03-10');
        expect(picker.endValue).to.equal('2026-03-15');
        expect(startInput.value).to.equal('3/10/2026 – 3/15/2026');
      });
    });

    it('should commit a typed start without an end', async () => {
      startInput.focus();
      startInput.value = '3/10/2026';
      await sendKeys({ press: 'Enter' });
      expect(picker.startValue).to.equal('2026-03-10');
      expect(picker.endValue).to.equal('');
    });

    it('should keep unparsable text and be invalid', async () => {
      startInput.focus();
      startInput.value = '3/10/2026 – foo';
      await sendKeys({ press: 'Enter' });
      expect(picker.startValue).to.equal('');
      expect(startInput.value).to.equal('3/10/2026 – foo');
      expect(picker.invalid).to.be.true;
    });

    it('should name the input after the range', () => {
      expect(startInput.getAttribute('aria-label')).to.equal('Date range');
    });

    it('should combine the placeholders', async () => {
      picker.startPlaceholder = 'Departure';
      picker.endPlaceholder = 'Return';
      await nextRender();
      expect(startInput.placeholder).to.equal('Departure – Return');
    });

    it('should switch back to separate inputs', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      await nextRender();
      picker.singleInput = false;
      await nextRender();
      expect(startInput.value).to.equal('3/10/2026');
      expect(endInput.value).to.equal('3/15/2026');
      expect(getComputedStyle(endInput).display).to.not.equal('none');
    });
  });

  describe('picking with the calendar button', () => {
    async function openWithButton() {
      const toggle = picker.shadowRoot.querySelector('[part~="toggle-button"]');
      await sendMouseToElement({ type: 'click', element: toggle });
      await untilOverlayRendered(picker);
    }

    beforeEach(() => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
    });

    it('should pick the start and then the end, even when the start alone would keep the range valid', async () => {
      await openWithButton();
      await pick(9);
      expect(picker.startValue).to.equal('2026-03-09');
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(endInput);

      await pick(14);
      expect(picker.startValue).to.equal('2026-03-09');
      expect(picker.endValue).to.equal('2026-03-14');
      expect(picker.opened).to.be.false;
    });

    it('should clear the end when the picked start is after it', async () => {
      await openWithButton();
      await pick(20);
      expect(picker.endValue).to.equal('');
      expect(picker.opened).to.be.true;
    });

    it('should change only the start again when later opened from the start input', async () => {
      await openWithButton();
      await sendKeys({ press: 'Escape' });
      await openFrom(startInput);
      await pick(9);
      expect(picker.startValue).to.equal('2026-03-09');
      expect(picker.endValue).to.equal('2026-03-15');
      expect(picker.opened).to.be.false;
    });
  });

  describe('picking the end first', () => {
    beforeEach(async () => {
      await openFrom(endInput);
      await pick(20);
    });

    it('should set the end, keep the overlay open and move focus to the start input', () => {
      expect(picker.endValue).to.equal('2026-03-20');
      expect(picker.startValue).to.equal('');
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(startInput);
      expect(picker.getAttribute('active-part')).to.equal('start');
    });

    it('should keep the end and close the overlay when picking a start before it', async () => {
      await pick(12);
      expect(picker.startValue).to.equal('2026-03-12');
      expect(picker.endValue).to.equal('2026-03-20');
      expect(picker.opened).to.be.false;
    });

    it('should clear the end and continue with the end when picking a start after it', async () => {
      await pick(25);
      expect(picker.startValue).to.equal('2026-03-25');
      expect(picker.endValue).to.equal('');
      expect(picker.opened).to.be.true;
      expect(document.activeElement).to.equal(endInput);
    });

    it('should not fire change before the range is complete', async () => {
      const spy = sinon.spy();
      picker.addEventListener('change', spy);
      await pick(12);
      expect(spy).to.be.calledOnce;
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

  describe('clear button', () => {
    let clearButton;

    beforeEach(async () => {
      picker.clearButtonVisible = true;
      await nextRender();
      clearButton = picker.shadowRoot.querySelector('[part~="clear-button"]');
    });

    it('should have a single clear button', () => {
      expect(picker.shadowRoot.querySelectorAll('[part~="clear-button"]').length).to.equal(1);
    });

    it('should show the clear button when either date is set', async () => {
      const isVisible = () => getComputedStyle(clearButton).display !== 'none';
      expect(isVisible()).to.be.false;

      picker.endValue = '2026-03-15';
      await nextRender();
      expect(isVisible()).to.be.true;
    });

    it('should clear both dates and fire change once on click', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      await nextRender();
      const spy = sinon.spy();
      picker.addEventListener('change', spy);
      await sendMouseToElement({ type: 'click', element: clearButton });
      expect(picker.startValue).to.equal('');
      expect(picker.endValue).to.equal('');
      expect(startInput.value).to.equal('');
      expect(endInput.value).to.equal('');
      expect(spy).to.be.calledOnce;
    });

    it('should not open the overlay on click', async () => {
      picker.startValue = '2026-03-10';
      await nextRender();
      await sendMouseToElement({ type: 'click', element: clearButton });
      expect(picker.opened).to.be.not.ok;
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

    it('should highlight the input whose date a pick sets while the overlay is open', async () => {
      const background = (input) => getComputedStyle(input).backgroundColor;
      const idle = background(startInput);
      await openFrom(startInput);
      expect(background(startInput)).to.not.equal(idle);
      expect(background(endInput)).to.equal(idle);

      endInput.focus();
      await nextRender();
      expect(background(endInput)).to.not.equal(idle);
      expect(background(startInput)).to.equal(idle);
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
    it('should name the inputs after their part only, as the group carries the label', async () => {
      picker.label = 'Trip dates';
      await nextRender();
      expect(startInput.getAttribute('aria-label')).to.equal('Start date');
      expect(endInput.getAttribute('aria-label')).to.equal('End date');
    });

    it('should toggle aria-required on both inputs', async () => {
      picker.required = true;
      await nextRender();
      expect(startInput.getAttribute('aria-required')).to.equal('true');
      expect(endInput.getAttribute('aria-required')).to.equal('true');

      picker.required = false;
      await nextRender();
      expect(startInput.hasAttribute('aria-required')).to.be.false;
      expect(endInput.hasAttribute('aria-required')).to.be.false;
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
