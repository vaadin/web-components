import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';
import { click, close, getOverlayContent, ios, monthsEqual, open, listenForEvent, tap } from './common.js';

describe('basic features', () => {
  let datepicker, toggleButton;

  beforeEach(() => {
    datepicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    toggleButton = datepicker.shadowRoot.querySelector('[part="toggle-button"]');
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

    const spy = sinon.spy(datepicker, 'blur');
    datepicker.dispatchEvent(new CustomEvent('focus'));

    expect(spy.called).to.be.true;
  });

  it('should blur when datepicker is opened on fullscreen', (done) => {
    datepicker._fullscreen = true;

    const spy = sinon.spy(datepicker.focusElement, 'blur');

    open(datepicker, () => {
      expect(spy.called).to.be.true;
      done();
    });
  });

  it('should notify opened changed on open', (done) => {
    open(datepicker, () => {
      expect(datepicker.opened).to.be.true;
      done();
    });
  });

  it('should notify opened changed on close', (done) => {
    open(datepicker, () => {
      listenForEvent(datepicker, 'opened-changed', () => {
        expect(datepicker.opened).to.be.false;
        done();
      });
      datepicker.close();
    });
  });

  it('should close with close call', (done) => {
    open(datepicker, () => {
      close(datepicker, () => {
        setTimeout(() => {
          expect(datepicker.opened).to.be.false;
          done();
        }, 1);
      });
    });
  });

  it('should open on input tap', (done) => {
    tap(datepicker.$.input);
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', done);
  });

  it('should not open on input tap when autoOpenDisabled is true and not on mobile', () => {
    datepicker.autoOpenDisabled = true;
    tap(datepicker.$.input);
    if (!datepicker._noInput) {
      expect(datepicker.opened).not.to.be.true;
    } else {
      expect(datepicker.opened).to.be.true;
    }
  });

  it('should pass the placeholder attribute to the input tag', () => {
    const placeholder = 'Pick a date';
    datepicker.set('placeholder', placeholder);
    expect(datepicker.$.input.placeholder).to.be.equal(placeholder);
  });

  it('should scroll to today by default', (done) => {
    const overlayContent = getOverlayContent(datepicker);
    const spy = sinon.spy(overlayContent, 'scrollToDate');
    open(datepicker, () => {
      expect(monthsEqual(spy.firstCall.args[0], new Date())).to.be.true;
      done();
    });
  });

  it('should scroll to initial position', (done) => {
    datepicker.initialPosition = '2016-01-01';
    const initialPositionDate = new Date(2016, 0, 1);

    const overlayContent = getOverlayContent(datepicker);
    const spy = sinon.spy(overlayContent, 'scrollToDate');

    open(datepicker, () => {
      expect(spy.firstCall.args[0]).to.eql(initialPositionDate);
      done();
    });
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

  it('should scroll to selected value by default', (done) => {
    const overlayContent = getOverlayContent(datepicker);
    const spy = sinon.spy(overlayContent, 'scrollToDate');
    datepicker.value = '2000-02-01';
    open(datepicker, () => {
      expect(monthsEqual(spy.firstCall.args[0], new Date(2000, 1, 1))).to.be.true;
      done();
    });
  });

  it('should close on overlay date tap', (done) => {
    open(datepicker, () => {
      getOverlayContent(datepicker).dispatchEvent(new CustomEvent('date-tap', { bubbles: true, composed: true }));
    });
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', done);
  });

  it('should not have label defined by default', () => {
    expect(datepicker.label).to.be.undefined;
  });

  it('should lead zeros correctly', () => {
    datepicker.value = '+000300-02-01';
    expect(datepicker._inputElement.value).to.equal('2/1/0300');
  });

  it('should format display correctly', () => {
    datepicker.value = '2000-02-01';
    expect(datepicker._inputElement.value).to.equal('2/1/2000');
    datepicker.value = '1999-12-31';
    expect(datepicker._inputElement.value).to.equal('12/31/1999');
  });

  it('should format display correctly with sub 100 years', () => {
    datepicker.value = '+000001-02-01';
    expect(datepicker._inputElement.value).to.equal('2/1/0001');
    datepicker.value = '+000099-02-01';
    expect(datepicker._inputElement.value).to.equal('2/1/0099');
  });

  it('should open by tapping the calendar icon', (done) => {
    tap(toggleButton);
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', done);
  });

  it('should open by tapping the calendar icon even if autoOpenDisabled is true', (done) => {
    window.autoOpenDisabled = true;
    tap(toggleButton);
    listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', done);
  });

  it('should scroll to a date on open', (done) => {
    const overlayContent = getOverlayContent(datepicker);
    // We must scroll to a date on every open because at least IE11 seems to reset
    // scrollTop while the dropdown is closed. This will result in all kind of problems.
    const spy = sinon.spy(overlayContent, 'scrollToDate');

    open(datepicker, () => {
      expect(spy.called).to.be.true;

      spy.resetHistory();
      close(datepicker, () => {
        setTimeout(() => {
          open(datepicker, () => {
            expect(spy.called).to.be.true;
            done();
          });
        }, 1);
      });
      datepicker.close();
    });
  });

  it('should not change datepicker width', () => {
    datepicker.style.display = 'inline-block';

    datepicker.value = '2000-01-01';
    var width = datepicker.clientWidth;

    datepicker.open();
    expect(datepicker.clientWidth).to.equal(width);
  });

  it('should realign on iron-resize', (done) => {
    sinon.stub(datepicker, '_boundUpdateAlignmentAndPosition').callsFake(() => {
      if (!done._called) {
        done._called = true;
        done();
      }
    });
    open(datepicker, () => {
      datepicker.dispatchEvent(new CustomEvent('iron-resize', { bubbles: false }));
    });
  });

  it('should set has-value attribute when value is set', () => {
    datepicker.value = '2000-02-01';
    expect(datepicker.hasAttribute('has-value')).to.be.true;
  });

  describe('window scroll realign', () => {
    beforeEach((done) => {
      open(datepicker, done);
    });

    it('should realign on window scroll', (done) => {
      sinon.stub(datepicker, '_updateAlignmentAndPosition').callsFake(() => {
        if (!done._called) {
          done._called = true;
          done();
        }
      });
      window.dispatchEvent(new CustomEvent('scroll'));
    });

    // https://github.com/vaadin/vaadin-date-picker/issues/330
    (ios ? it.skip : it)('should not realign on year/month scroll', (done) => {
      const spy = sinon.spy(datepicker, '_updateAlignmentAndPosition');
      getOverlayContent(datepicker).$.yearScroller.$.scroller.scrollTop += 100;
      setTimeout(() => {
        expect(spy.called).to.be.false;
        done();
      }, 1);
    });

    it('should not realign once closed', (done) => {
      datepicker.$.overlay.addEventListener('vaadin-overlay-close', () => {
        const spy = sinon.spy(datepicker, '_updateAlignmentAndPosition');
        window.dispatchEvent(new CustomEvent('scroll'));
        setTimeout(() => {
          expect(spy.called).to.be.false;
          done();
        }, 1);
      });
      datepicker.close();
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
    let overlayContent, clearButton;
    beforeEach((done) => {
      clearButton = datepicker._inputElement.shadowRoot.querySelector('[part="clear-button"]');
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

      open(datepicker, () => {
        overlayContent.$.monthScroller._finishInit();
        overlayContent.$.yearScroller._finishInit();
        setTimeout(done, 1);
      });
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
      expect(toggleButton.getAttribute('aria-label').trim()).to.equal('Kalenteri');
      expect(clearButton.getAttribute('aria-label').trim()).to.equal('Tyhjennä');
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

    it('dropdown should not open', () => {
      datepicker.open();
      expect(datepicker.$.overlay.hasAttribute('disable-upgrade')).to.be.true;
    });

    it('calendar icon should not be hidden', () => {
      expect(toggleButton.clientHeight).to.not.equal(0);
    });
  });

  describe('Readonly', () => {
    beforeEach(() => {
      datepicker.readonly = true;
    });

    it('dropdown should not open', () => {
      datepicker.open();
      expect(datepicker.$.overlay.hasAttribute('disable-upgrade')).to.be.true;
    });

    it('calendar icon should not be hidden', () => {
      expect(toggleButton.clientHeight).not.to.equal(0);
    });

    it('should be focusable', () => {
      expect(datepicker.$.input.tabIndex).to.equal(0);
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

  describe('clear button', () => {
    let input;

    beforeEach(() => {
      input = datepicker._inputElement;
    });

    it('should not have clear-button-visible by default', () => {
      expect(datepicker).to.have.property('clearButtonVisible', false);
      expect(input).to.have.property('clearButtonVisible', false);
    });

    it('should bind clear-button-visible to text-field', () => {
      datepicker.clearButtonVisible = true;
      expect(datepicker).to.have.property('clearButtonVisible', true);
      expect(input).to.have.property('clearButtonVisible', true);
    });
  });

  describe('helper text', () => {
    it('should display the helper text when provided', () => {
      datepicker.helperText = 'Foo';
      expect(datepicker._inputElement.helperText).to.equal(datepicker.helperText);
    });
  });
});

describe('slots', () => {
  it('should expose the text-field prefix slot', async () => {
    const datepicker = fixtureSync('<vaadin-date-picker><div slot="prefix">foo</div></vaadin-date-picker>');
    const input = datepicker._inputElement;
    await nextFrame();
    const slot = input.querySelector('slot[name=prefix]');
    expect(slot.assignedNodes()[0].textContent).to.eql('foo');
  });

  it('should display the helper text when slotted helper available', async () => {
    const datepicker = fixtureSync('<vaadin-date-picker><div slot="helper">foo</div></vaadin-date-picker>');
    await nextFrame();
    expect(datepicker._inputElement.querySelector('[slot="helper"]').assignedNodes()[0].textContent).to.eql('foo');
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
    clearButton = datepicker._inputElement.shadowRoot.querySelector('[part="clear-button"]');
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

  it('should realign on container scroll', (done) => {
    open(datepicker, () => {
      sinon.stub(datepicker, '_updateAlignmentAndPosition').callsFake(() => {
        if (!done._called) {
          done._called = true;
          done();
        }
      });
      container.scrollTop += 100;
    });
  });

  it.only('should match the parent width', () => {
    container.querySelector('div').style.width = '120px';
    datepicker.style.width = '100%';
    expect(datepicker.$.input.clientWidth).to.equal(120);
  });
});
