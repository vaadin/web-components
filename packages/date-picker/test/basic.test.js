import { expect } from '@esm-bundle/chai';
import { aTimeout, click, fixtureSync, makeSoloTouchEvent, nextRender, oneEvent, tap } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import * as settings from '@polymer/polymer/lib/utils/settings.js';
import { close, getOverlayContent, monthsEqual, open } from './common.js';

settings.setCancelSyntheticClickEvents(false);

async function touchTap(target) {
  const start = makeSoloTouchEvent('touchstart', null, target);
  const end = makeSoloTouchEvent('touchend', null, target);
  if (!start.defaultPrevented && !end.defaultPrevented) {
    target.click();
    target.focus();
  }
}

function isFocused(target) {
  return target.getRootNode().activeElement === target;
}

describe('basic features', () => {
  let datepicker, input, toggleButton;

  beforeEach(() => {
    datepicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    toggleButton = datepicker.shadowRoot.querySelector('[part="toggle-button"]');
    input = datepicker.inputElement;
  });

  it('should parse date components with varying number of digits', () => {
    const composeDate = (year, month, day) => {
      const date = new Date(0, 0);
      date.setFullYear(parseInt(year));
      date.setMonth(parseInt(month));
      date.setDate(parseInt(day));
      return date;
    };
    const parseDate = datepicker._parseDate;

    expect(parseDate('2017-11-11')).to.eql(composeDate('2017', '10', '11'));
    expect(parseDate('2016-1-1')).to.eql(composeDate('2016', '0', '1'));
    expect(parseDate('04-11-2')).to.eql(composeDate('04', '10', '2'));
  });

  it('should have default value', () => {
    expect(datepicker.value).to.equal('');
  });

  it('should notify value change', () => {
    const spy = sinon.spy();
    datepicker.addEventListener('value-changed', spy);
    datepicker.value = '2000-02-01';
    expect(spy.calledOnce).to.be.true;
  });

  it('should keep focused attribute when focus moves to overlay', async () => {
    datepicker.focus();
    await sendKeys({ press: 'ArrowDown' });
    expect(datepicker.hasAttribute('focused')).to.be.true;
  });

  it('should not blur when toggle button is clicked', async () => {
    const e = new CustomEvent('mousedown', { bubbles: true });
    const spy = sinon.spy(e, 'preventDefault');
    toggleButton.dispatchEvent(e);
    expect(spy.calledOnce).to.be.true;
  });

  it('should have focused attribute when closed and focused', async () => {
    datepicker.focus();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Escape' });
    expect(datepicker.hasAttribute('focused')).to.be.true;
  });

  it('should notify opened changed on open and close', async () => {
    const spy = sinon.spy();
    datepicker.addEventListener('opened-changed', spy);
    await open(datepicker);
    expect(spy.calledOnce).to.be.true;
    await close(datepicker);
    expect(spy.calledTwice).to.be.true;
  });

  it('should set opened to false with close call', async () => {
    await open(datepicker);
    await close(datepicker);
    expect(datepicker.opened).to.be.false;
  });

  it('should open on input tap', async () => {
    tap(input);
    await oneEvent(datepicker.$.overlay, 'vaadin-overlay-open');
  });

  it('should focus the input on touch tap', () => {
    touchTap(input);
    expect(isFocused(input)).to.be.true;
  });

  it('should pass the placeholder attribute to the input tag', () => {
    const placeholder = 'Pick a date';
    datepicker.set('placeholder', placeholder);
    expect(input.placeholder).to.be.equal(placeholder);
  });

  it('should scroll to today by default', async () => {
    const overlayContent = getOverlayContent(datepicker);
    const spy = sinon.spy(overlayContent, 'scrollToDate');
    await open(datepicker);
    expect(monthsEqual(spy.firstCall.args[0], new Date())).to.be.true;
  });

  it('should scroll to initial position', async () => {
    datepicker.initialPosition = '2016-01-01';
    const initialPositionDate = new Date(2016, 0, 1);

    const overlayContent = getOverlayContent(datepicker);
    const spy = sinon.spy(overlayContent, 'scrollToDate');

    await open(datepicker);
    expect(spy.firstCall.args[0]).to.eql(initialPositionDate);
  });

  it('should remember the original initial position on reopen', (done) => {
    datepicker.initialPosition = null;
    let initialPosition;

    datepicker.open();
    const overlayContent = getOverlayContent(datepicker);

    datepicker.$.overlay.addEventListener('vaadin-overlay-open', () => {
      if (initialPosition) {
        expect(overlayContent.initialPosition).to.eql(initialPosition);
        done();
      } else {
        initialPosition = overlayContent.initialPosition;
        datepicker.close();
        datepicker.open();
      }
    });
  });

  it('should scroll to selected value by default', async () => {
    const overlayContent = getOverlayContent(datepicker);
    const spy = sinon.spy(overlayContent, 'scrollToDate');
    datepicker.value = '2000-02-01';
    await open(datepicker);
    expect(monthsEqual(spy.firstCall.args[0], new Date(2000, 1, 1))).to.be.true;
  });

  it('should close on overlay date tap', async () => {
    await open(datepicker);
    const spy = sinon.spy(datepicker, 'close');
    const evt = new CustomEvent('date-tap', { detail: { date: new Date() }, bubbles: true, composed: true });
    getOverlayContent(datepicker).dispatchEvent(evt);
    expect(spy.called).to.be.true;
  });

  it('should lead zeros correctly', () => {
    datepicker.value = '+000300-02-01';
    expect(input.value).to.equal('2/1/0300');
  });

  it('should format display correctly', () => {
    datepicker.value = '2000-02-01';
    expect(input.value).to.equal('2/1/2000');
    datepicker.value = '1999-12-31';
    expect(input.value).to.equal('12/31/1999');
  });

  it('should format display correctly with sub 100 years', () => {
    datepicker.value = '+000001-02-01';
    expect(input.value).to.equal('2/1/0001');
    datepicker.value = '+000099-02-01';
    expect(input.value).to.equal('2/1/0099');
  });

  it('should open by tapping the calendar icon', async () => {
    tap(toggleButton);
    await oneEvent(datepicker.$.overlay, 'vaadin-overlay-open');
  });

  it('should close on subsequent toggle button click', () => {
    toggleButton.click();
    expect(datepicker.opened).to.be.true;

    toggleButton.click();
    expect(datepicker.opened).to.be.false;
  });

  it('should scroll to a date on open', async () => {
    const overlayContent = getOverlayContent(datepicker);
    // We must scroll to a date on every open because at least IE11 seems to reset
    // scrollTop while the dropdown is closed. This will result in all kind of problems.
    const spy = sinon.spy(overlayContent, 'scrollToDate');

    await open(datepicker);
    expect(spy.called).to.be.true;
    spy.resetHistory();
    await close(datepicker);
    await aTimeout(1);
    await open(datepicker);
    expect(spy.called).to.be.true;
  });

  it('should not change datepicker width', () => {
    datepicker.style.display = 'inline-block';

    datepicker.value = '2000-01-01';
    const width = datepicker.clientWidth;

    datepicker.open();
    expect(datepicker.clientWidth).to.equal(width);
  });

  it('should set has-value attribute when value is set', () => {
    datepicker.value = '2000-02-01';
    expect(datepicker.hasAttribute('has-value')).to.be.true;
  });

  describe('fullscreen', () => {
    beforeEach(() => {
      datepicker._fullscreen = true;
    });

    it('should blur when focused', () => {
      const spy = sinon.spy(input, 'blur');
      input.dispatchEvent(new CustomEvent('focus'));

      expect(spy.called).to.be.true;
    });

    it('should blur the input', () => {
      datepicker.focus();
      expect(isFocused(input)).to.be.false;
    });

    it('should not focus the input on touch tap', () => {
      touchTap(input);
      expect(isFocused(input)).to.be.false;
    });

    it('should set focused attribute when focused', async () => {
      datepicker.focus();
      await open(datepicker);
      await nextRender();
      expect(datepicker.hasAttribute('focused')).to.be.true;
    });

    it('should close the dropdown on Today button Esc', async () => {
      await open(datepicker);
      await nextRender();

      getOverlayContent(datepicker).$.todayButton.focus();
      await sendKeys({ press: 'Escape' });

      expect(datepicker.opened).to.be.false;
    });

    it('should close the dropdown on Cancel button Esc', async () => {
      await open(datepicker);
      await nextRender();

      getOverlayContent(datepicker).$.cancelButton.focus();
      await sendKeys({ press: 'Escape' });

      expect(datepicker.opened).to.be.false;
    });

    it('should remove focused attribute when closed and not focused', async () => {
      await open(datepicker);
      await nextRender();

      getOverlayContent(datepicker).$.todayButton.focus();
      await sendKeys({ press: 'Escape' });

      expect(datepicker.hasAttribute('focused')).to.be.false;
    });

    it('should blur when datepicker is opened', async () => {
      const spy = sinon.spy(input, 'blur');
      await open(datepicker);
      expect(spy.called).to.be.true;
    });
  });

  describe('value property formats', () => {
    it('should accept ISO format', () => {
      const date = new Date(0, 1, 3);

      datepicker.value = '0000-02-03';
      date.setFullYear(0);
      expect(datepicker._selectedDate).to.eql(date);

      datepicker.value = '+010000-02-03';
      date.setFullYear(10000);
      expect(datepicker._selectedDate).to.eql(date);

      datepicker.value = '-010000-02-03';
      date.setFullYear(-10000);
      expect(datepicker._selectedDate).to.eql(date);

      datepicker.value = '0000-02-03T19:27:21.573Z';
      date.setFullYear(0);
      expect(datepicker._selectedDate).to.eql(date);

      datepicker.value = '+010000-02-03T19:27:21.573Z';
      date.setFullYear(10000);
      expect(datepicker._selectedDate).to.eql(date);

      datepicker.value = '-010000-02-03T19:27:21.573Z';
      date.setFullYear(-10000);
      expect(datepicker._selectedDate).to.eql(date);

      datepicker.value = date.toISOString();
      expect(datepicker._selectedDate).to.eql(date);

      datepicker.value = date.toISOString();
      expect(datepicker._selectedDate).to.eql(date);
    });

    it('should not accept non-ISO formats', () => {
      datepicker.value = '03/02/01';
      expect(datepicker.value).to.equal('');
      expect(datepicker._selectedDate).to.equal('');

      datepicker.value = '2010/02/03';
      expect(datepicker.value).to.equal('');
      expect(datepicker._selectedDate).to.equal('');

      datepicker.value = '03/02/2010';
      expect(datepicker.value).to.equal('');
      expect(datepicker._selectedDate).to.equal('');

      datepicker.value = '3 Feb 2010';
      expect(datepicker.value).to.equal('');
      expect(datepicker._selectedDate).to.equal('');

      datepicker.value = 'Feb 3, 2010';
      expect(datepicker.value).to.equal('');
      expect(datepicker._selectedDate).to.equal('');
    });

    it('should output ISO format', () => {
      const date = new Date(0, 1, 3);

      date.setFullYear(0);
      datepicker._selectedDate = date;
      expect(datepicker.value).to.equal('0000-02-03');

      date.setFullYear(10000);
      datepicker._selectedDate = new Date(date.getTime());
      expect(datepicker.value).to.equal('+010000-02-03');

      date.setFullYear(-10000);
      datepicker._selectedDate = new Date(date.getTime());
      expect(datepicker.value).to.equal('-010000-02-03');
    });
  });

  describe('i18n', () => {
    let overlayContent;

    beforeEach(async () => {
      datepicker.set('i18n.weekdays', 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'));
      datepicker.set('i18n.weekdaysShort', 'su_ma_ti_ke_to_pe_la'.split('_'));
      datepicker.set('i18n.firstDayOfWeek', 1);
      datepicker.set('i18n.formatDate', (d) => {
        if (d) {
          return [d.day, d.month + 1, d.year].join('.');
        }
      });
      datepicker.set('i18n.clear', 'Tyhjennä');
      datepicker.set('i18n.today', 'Tänään');
      datepicker.set('i18n.cancel', 'Peruuta');

      overlayContent = getOverlayContent(datepicker);
      overlayContent.$.monthScroller.bufferSize = 1;

      await open(datepicker);
      overlayContent.$.monthScroller._finishInit();
      overlayContent.$.yearScroller._finishInit();
      await aTimeout(1);
    });

    it('should notify i18n mutation to children', () => {
      const monthCalendar = overlayContent.$.monthScroller.querySelector('vaadin-month-calendar');
      const weekdays = monthCalendar.$.monthGrid.querySelectorAll('[part="weekday"]:not(:empty)');
      const weekdayTitles = Array.prototype.map.call(weekdays, (weekday) => weekday.textContent);
      expect(weekdayTitles).to.eql(['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']);
    });

    it('should reflect value in overlay header', () => {
      datepicker.value = '2000-02-01';
      expect(overlayContent.root.querySelector('[part="label"]').textContent.trim()).to.equal('1.2.2000');
    });

    it('should display buttons in correct locale', () => {
      expect(overlayContent.$.todayButton.textContent.trim()).to.equal('Tänään');
      expect(overlayContent.$.cancelButton.textContent.trim()).to.equal('Peruuta');
    });
  });

  describe('Disabled', () => {
    beforeEach(() => {
      datepicker.disabled = true;
    });

    it('should propagate disabled property to the input', () => {
      expect(input.disabled).to.be.true;
    });

    it('should not open overlay when disabled', () => {
      datepicker.open();
      expect(datepicker.$.overlay.hasAttribute('disable-upgrade')).to.be.true;
    });
  });

  describe('Readonly', () => {
    beforeEach(() => {
      datepicker.readonly = true;
    });

    it('should propagate readonly property to the input', () => {
      expect(input.readOnly).to.be.true;
    });

    it('should not open overlay when readonly', () => {
      datepicker.open();
      expect(datepicker.$.overlay.hasAttribute('disable-upgrade')).to.be.true;
    });

    it('should make input focusable', () => {
      expect(input.tabIndex).to.equal(0);
    });
  });

  describe('Date limits', () => {
    beforeEach(() => {
      datepicker.min = '2016-01-01';
      datepicker.max = '2016-12-31';
    });

    it('should be invalid when value is out of limits', () => {
      datepicker.value = '2017-01-01';
      expect(datepicker.invalid).to.be.equal(true);
    });

    it('should be valid when value is inside the limits', () => {
      datepicker.value = '2016-07-14';
      expect(datepicker.invalid).to.be.equal(false);
    });

    it('should be valid when value is the same as min date', () => {
      datepicker.value = '2016-01-01';
      expect(datepicker.invalid).to.be.equal(false);
    });

    it('should be valid when value is the same as max date', () => {
      datepicker.value = '2016-12-31';
      expect(datepicker.invalid).to.be.equal(false);
    });

    it('should reflect correct invalid value on value-changed eventListener', (done) => {
      datepicker.value = '2016-01-01'; // Valid

      datepicker.addEventListener('value-changed', () => {
        expect(datepicker.invalid).to.be.equal(true);
        done();
      });

      datepicker.open();
      getOverlayContent(datepicker)._selectDate(new Date('2017-01-01')); // Invalid
    });

    it('should change invalid state only once', (done) => {
      datepicker.addEventListener('value-changed', () => {
        expect(invalidChangedSpy.calledOnce).to.be.true;
        done();
      });

      const invalidChangedSpy = sinon.spy();
      datepicker.addEventListener('invalid-changed', invalidChangedSpy);
      datepicker.open();
      getOverlayContent(datepicker)._selectDate(new Date('2017-01-01'));
    });

    it('should scroll to min date when today is not allowed', (done) => {
      datepicker.max = null;
      datepicker.min = '2100-01-01';
      const minDate = new Date(2100, 0, 1);

      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);

      const spy = sinon.spy(overlayContent, 'scrollToDate');
      datepicker.$.overlay.addEventListener('vaadin-overlay-open', () => {
        expect(spy.firstCall.args[0]).to.eql(minDate);
        done();
      });
    });

    it('should scroll to max date when today is not allowed', (done) => {
      datepicker.min = null;
      datepicker.max = '2000-01-01';
      const maxDate = new Date(2000, 0, 1);

      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);

      const spy = sinon.spy(overlayContent, 'scrollToDate');
      datepicker.$.overlay.addEventListener('vaadin-overlay-open', () => {
        expect(spy.firstCall.args[0]).to.eql(maxDate);
        done();
      });
      datepicker.open();
    });

    it('should scroll to initial position even when not allowed', (done) => {
      datepicker.initialPosition = '2015-01-01';
      const initialPositionDate = new Date(2015, 0, 1);

      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);

      const spy = sinon.spy(overlayContent, 'scrollToDate');
      datepicker.$.overlay.addEventListener('vaadin-overlay-open', () => {
        expect(spy.firstCall.args[0]).to.eql(initialPositionDate);
        done();
      });
      datepicker.open();
    });
  });

  describe('autoselect', () => {
    it('should set autoselect to false by default', () => {
      expect(datepicker.autoselect).to.be.false;
    });

    it('should not select content on focus when autoselect is false', () => {
      const spy = sinon.spy(input, 'select');
      datepicker.value = '2016-07-14';
      input.focus();
      expect(spy.called).to.be.false;
    });

    it('should select content on focus when autoselect is true', () => {
      const spy = sinon.spy(input, 'select');
      datepicker.value = '2016-07-14';
      datepicker.autoselect = true;
      input.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });
});

describe('inside flexbox', () => {
  it('date-picker should stretch to fit the column flex container', () => {
    const container = fixtureSync(`
    <div style="display: flex; flex-direction: column; width: 500px;">
      <vaadin-date-picker></vaadin-date-picker>
    </div>
    `);
    const flexDatePicker = container.querySelector('vaadin-date-picker');
    expect(window.getComputedStyle(container).width).to.eql('500px');
    expect(window.getComputedStyle(flexDatePicker).width).to.eql('500px');
  });
});

describe('clear button', () => {
  let datepicker, clearButton;

  beforeEach(() => {
    datepicker = fixtureSync('<vaadin-date-picker clear-button-visible></vaadin-date-picker>');
    clearButton = datepicker.shadowRoot.querySelector('[part="clear-button"]');
  });

  it('should have clearButtonVisible property', () => {
    expect(datepicker).to.have.property('clearButtonVisible', true);
  });

  it('should clear the value on click', () => {
    datepicker.value = '2000-02-01';
    click(clearButton);
    expect(datepicker.value).to.equal('');
  });

  it('should clear the value on touch tap', () => {
    datepicker.value = '2000-02-01';
    touchTap(clearButton);
    expect(datepicker.value).to.equal('');
  });

  it('should validate on clear', () => {
    datepicker.required = true;
    datepicker.value = '1991-20-12';
    click(clearButton);
    expect(datepicker.invalid).to.equal(true);
  });

  it('should remove has-value attribute on clear', () => {
    datepicker.value = '2000-02-01';
    click(clearButton);
    expect(datepicker.hasAttribute('has-value')).to.be.false;
  });
});

describe('wrapped', () => {
  let container, datepicker;

  beforeEach(() => {
    container = fixtureSync(`
      <div style="height: 100px; overflow: scroll;">
        <div style="height: 1000px;">
          <vaadin-date-picker></vaadin-date-picker>
        </div>
      </div>
    `);
    datepicker = container.querySelector('vaadin-date-picker');
  });

  it('should match the parent width', () => {
    container.querySelector('div').style.width = '120px';
    datepicker.style.width = '100%';
    expect(datepicker.inputElement.clientWidth).to.equal(120);
  });
});

describe('initial value attribute', () => {
  let datepicker, input;

  beforeEach(() => {
    datepicker = fixtureSync('<vaadin-date-picker value="2000-01-01"></vaadin-date-picker>');
    input = datepicker.inputElement;
  });

  it('should format the input value', () => {
    expect(input.value).to.equal('1/1/2000');
  });
});

describe('auto open disabled', () => {
  let datepicker, input, toggleButton;

  beforeEach(() => {
    datepicker = fixtureSync('<vaadin-date-picker value="2000-01-01"></vaadin-date-picker>');
    input = datepicker.inputElement;
    toggleButton = datepicker.shadowRoot.querySelector('[part="toggle-button"]');
    datepicker.autoOpenDisabled = true;
  });

  it('should focus the input on touch tap', () => {
    touchTap(input);
    expect(isFocused(input)).to.be.true;
  });

  it('should not blur the input on open', async () => {
    touchTap(input);
    await open(datepicker);
    expect(isFocused(input)).to.be.true;
  });

  it('should blur the input on fullscreen open', async () => {
    datepicker._fullscreen = true;
    touchTap(input);
    await open(datepicker);
    expect(isFocused(input)).to.be.false;
  });

  it('should not open on input tap', () => {
    tap(input);
    expect(datepicker.opened).not.to.be.true;
  });

  it('should not open on input tap on fullscreen', () => {
    datepicker._fullscreen = true;
    tap(input);
    expect(datepicker.opened).not.to.be.true;
  });

  it('should open by tapping the calendar icon even if autoOpenDisabled is true', async () => {
    tap(toggleButton);
    await oneEvent(datepicker.$.overlay, 'vaadin-overlay-open');
  });
});

describe('ios', () => {
  let datepicker, input;

  beforeEach(() => {
    datepicker = fixtureSync('<vaadin-date-picker value="2000-01-01"></vaadin-date-picker>');
    input = datepicker.inputElement;
    datepicker._ios = true;
  });

  it('should focus the input when closed', () => {
    datepicker.focus();
    expect(isFocused(input)).to.be.true;
  });

  it('should blur the input when opened', async () => {
    datepicker.focus();
    await open(datepicker);
    expect(isFocused(input)).to.be.false;
  });

  describe('auto open disabled', () => {
    let toggleButton;

    beforeEach(() => {
      datepicker.autoOpenDisabled = true;
      toggleButton = datepicker.shadowRoot.querySelector('[part="toggle-button"]');
    });

    it('should focus the input on touch tap', () => {
      touchTap(input);
      expect(isFocused(input)).to.be.true;
    });

    it('should blur the input on open', async () => {
      touchTap(input);
      await open(datepicker);
      expect(isFocused(input)).to.be.false;
    });

    it('should blur the input on fullscreen open', async () => {
      datepicker._fullscreen = true;
      touchTap(input);
      await open(datepicker);
      expect(isFocused(input)).to.be.false;
    });

    it('should not open on input tap', () => {
      tap(input);
      expect(datepicker.opened).not.to.be.true;
    });

    it('should not open on input tap on fullscreen', () => {
      datepicker._fullscreen = true;
      tap(input);
      expect(datepicker.opened).not.to.be.true;
    });

    it('should open by tapping the calendar icon even if autoOpenDisabled is true', async () => {
      tap(toggleButton);
      await oneEvent(datepicker.$.overlay, 'vaadin-overlay-open');
    });
  });
});
