import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, click, fixtureSync, isIOS, oneEvent, tap } from '@vaadin/testing-helpers';
import { close, getOverlayContent, monthsEqual, open } from './common.js';
import '../src/vaadin-date-picker.js';

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

  it('should blur when focused on fullscreen', () => {
    datepicker._fullscreen = true;

    const spy = sinon.spy(input, 'blur');
    input.dispatchEvent(new CustomEvent('focus'));

    expect(spy.called).to.be.true;
  });

  it('should blur when datepicker is opened on fullscreen', async () => {
    datepicker._fullscreen = true;
    const spy = sinon.spy(input, 'blur');
    await open(datepicker);
    expect(spy.called).to.be.true;
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

  it('should not open on input tap when autoOpenDisabled is true and not on mobile', () => {
    datepicker.autoOpenDisabled = true;
    tap(input);
    if (!datepicker._noInput) {
      expect(datepicker.opened).not.to.be.true;
    } else {
      expect(datepicker.opened).to.be.true;
    }
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
    getOverlayContent(datepicker).dispatchEvent(new CustomEvent('date-tap', { bubbles: true, composed: true }));
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

  it('should open by tapping the calendar icon even if autoOpenDisabled is true', async () => {
    window.autoOpenDisabled = true;
    tap(toggleButton);
    await oneEvent(datepicker.$.overlay, 'vaadin-overlay-open');
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
    var width = datepicker.clientWidth;

    datepicker.open();
    expect(datepicker.clientWidth).to.equal(width);
  });

  it('should set has-value attribute when value is set', () => {
    datepicker.value = '2000-02-01';
    expect(datepicker.hasAttribute('has-value')).to.be.true;
  });

  describe('realign', () => {
    beforeEach(async () => {
      await open(datepicker);
    });

    it('should realign on iron-resize', async () => {
      const spy = sinon.spy(datepicker._overlayContent, '_repositionYearScroller');
      datepicker.dispatchEvent(new CustomEvent('iron-resize', { bubbles: false }));
      expect(spy.called).to.be.true;
    });

    it('should realign on window scroll', () => {
      const spy = sinon.spy(datepicker, '_updateAlignmentAndPosition');
      window.dispatchEvent(new CustomEvent('scroll'));
      expect(spy.called).to.be.true;
    });

    // https://github.com/vaadin/vaadin-date-picker/issues/330
    (isIOS ? it.skip : it)('should not realign on year/month scroll', async () => {
      const spy = sinon.spy(datepicker, '_updateAlignmentAndPosition');
      getOverlayContent(datepicker).$.yearScroller.$.scroller.scrollTop += 100;
      await aTimeout(1);
      expect(spy.called).to.be.false;
    });

    it('should not realign once closed', async () => {
      const spy = sinon.spy(datepicker, '_updateAlignmentAndPosition');
      await close(datepicker);
      window.dispatchEvent(new CustomEvent('scroll'));
      expect(spy.called).to.be.false;
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
      datepicker.set('i18n.calendar', 'Kalenteri');
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
      const weekdayLabels = Array.prototype.map.call(weekdays, (weekday) => weekday.getAttribute('aria-label'));
      const weekdayTitles = Array.prototype.map.call(weekdays, (weekday) => weekday.textContent);
      expect(weekdayLabels).to.eql([
        'maanantai',
        'tiistai',
        'keskiviikko',
        'torstai',
        'perjantai',
        'lauantai',
        'sunnuntai'
      ]);
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

    it('should translate the overlay title', () => {
      expect(overlayContent.$.announcer.textContent.trim()).to.equal('Kalenteri');
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
      datepicker.value = '2016-01-01'; // valid

      datepicker.addEventListener('value-changed', () => {
        expect(datepicker.invalid).to.be.equal(true);
        done();
      });

      datepicker.open();
      getOverlayContent(datepicker).selectedDate = new Date('2017-01-01'); // invalid
    });

    it('should change invalid state only once', (done) => {
      datepicker.addEventListener('value-changed', () => {
        expect(invalidChangedSpy.calledOnce).to.be.true;
        done();
      });

      const invalidChangedSpy = sinon.spy();
      datepicker.addEventListener('invalid-changed', invalidChangedSpy);
      datepicker.open();
      getOverlayContent(datepicker).selectedDate = new Date('2017-01-01');
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

describe('clear-button-visible', () => {
  let datepicker, clearButton;

  beforeEach(() => {
    datepicker = fixtureSync('<vaadin-date-picker clear-button-visible></vaadin-date-picker>');
    clearButton = datepicker.shadowRoot.querySelector('[part="clear-button"]');
  });

  it('should have clearButtonVisible property', () => {
    expect(datepicker).to.have.property('clearButtonVisible', true);
  });

  it('should clear the value', () => {
    datepicker.value = '2000-02-01';
    click(clearButton);
    expect(datepicker.value).to.equal('');
  });

  it('should not prevent touchend event on clear button', () => {
    datepicker.value = '2000-02-01';
    const e = new CustomEvent('touchend', { cancelable: true });
    clearButton.dispatchEvent(e);
    expect(e.defaultPrevented).to.be.false;
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

  it('should realign on container scroll', async () => {
    const spy = sinon.spy(datepicker, '_updateAlignmentAndPosition');
    await open(datepicker);
    container.scrollTop += 100;
    expect(spy.called).to.be.true;
  });

  it('should match the parent width', () => {
    container.querySelector('div').style.width = '120px';
    datepicker.style.width = '100%';
    expect(datepicker.inputElement.clientWidth).to.equal(120);
  });
});

describe('Initial value', () => {
  let datepicker, input;

  beforeEach(() => {
    datepicker = fixtureSync('<vaadin-date-picker value="2000-01-01"></vaadin-date-picker>');
    input = datepicker.inputElement;
  });

  it('should format the input value', () => {
    expect(input.value).to.equal('1/1/2000');
  });
});
