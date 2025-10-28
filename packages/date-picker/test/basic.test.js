import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { click, fixtureSync, keyboardEventFor, nextRender, oneEvent, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { parseDate } from '../src/vaadin-date-picker-helper.js';
import { open, touchTap, untilOverlayRendered } from './helpers.js';

describe('basic features', () => {
  let datePicker, input, overlay;

  beforeEach(async () => {
    datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    await nextRender();
    input = datePicker.inputElement;
    overlay = datePicker.$.overlay;
  });

  it('should parse date components with varying number of digits', () => {
    const composeDate = (year, month, day) => {
      const date = new Date(0, 0);
      date.setFullYear(parseInt(year));
      date.setMonth(parseInt(month));
      date.setDate(parseInt(day));
      return date;
    };

    expect(parseDate('2017-11-11')).to.eql(composeDate('2017', '10', '11'));
    expect(parseDate('2016-1-1')).to.eql(composeDate('2016', '0', '1'));
    expect(parseDate('04-11-2')).to.eql(composeDate('04', '10', '2'));
  });

  it('should have default value', () => {
    expect(datePicker.value).to.equal('');
  });

  it('should notify value change', () => {
    const spy = sinon.spy();
    datePicker.addEventListener('value-changed', spy);
    datePicker.value = '2000-02-01';
    expect(spy.calledOnce).to.be.true;
  });

  it('should keep focused attribute when focus moves to overlay', async () => {
    datePicker.focus();
    await sendKeys({ press: 'ArrowDown' });
    await untilOverlayRendered(datePicker);
    expect(datePicker.hasAttribute('focused')).to.be.true;
  });

  it('should have focused attribute when closed and focused', async () => {
    datePicker.focus();
    await sendKeys({ press: 'ArrowDown' });
    await untilOverlayRendered(datePicker);
    await sendKeys({ press: 'Escape' });
    expect(datePicker.hasAttribute('focused')).to.be.true;
  });

  it('should notify opened changed on open and close', async () => {
    const spy = sinon.spy();
    datePicker.addEventListener('opened-changed', spy);
    await open(datePicker);
    expect(spy.calledOnce).to.be.true;
    datePicker.close();
    expect(spy.calledTwice).to.be.true;
  });

  it('should set opened to false with close call', async () => {
    await open(datePicker);
    datePicker.close();
    expect(datePicker.opened).to.be.false;
  });

  it('should open on input tap', async () => {
    tap(input);
    await oneEvent(overlay, 'vaadin-overlay-open');
  });

  it('should focus the input on touch tap', async () => {
    touchTap(input);
    await oneEvent(overlay, 'vaadin-overlay-open');
    expect(document.activeElement).to.equal(input);
  });

  it('should not change datePicker width', async () => {
    datePicker.style.display = 'inline-block';

    datePicker.value = '2000-01-01';
    const width = datePicker.clientWidth;

    await open(datePicker);
    expect(datePicker.clientWidth).to.equal(width);
  });

  describe('input field', () => {
    let inputField;

    beforeEach(() => {
      inputField = datePicker.shadowRoot.querySelector('[part="input-field"]');
    });

    it('should open overlay on input field element click', async () => {
      click(inputField);
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(datePicker.opened).to.be.true;
    });

    it('should prevent default for the handled click event', async () => {
      const event = click(inputField);
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(event.defaultPrevented).to.be.true;
    });

    it('should not prevent default for click when autoOpenDisabled', () => {
      datePicker.autoOpenDisabled = true;
      const event = click(inputField);
      expect(event.defaultPrevented).to.be.false;
    });
  });

  describe('input value format', () => {
    it('should lead zeros correctly', () => {
      datePicker.value = '+000300-02-01';
      expect(input.value).to.equal('2/1/0300');
    });

    it('should format display correctly', () => {
      datePicker.value = '2000-02-01';
      expect(input.value).to.equal('2/1/2000');
      datePicker.value = '1999-12-31';
      expect(input.value).to.equal('12/31/1999');
    });

    it('should format display correctly with sub 100 years', () => {
      datePicker.value = '+000001-02-01';
      expect(input.value).to.equal('2/1/0001');
      datePicker.value = '+000099-02-01';
      expect(input.value).to.equal('2/1/0099');
    });
  });

  describe('value property formats', () => {
    it('should accept ISO format', () => {
      const date = new Date(0, 1, 3);

      datePicker.value = '0000-02-03';
      date.setFullYear(0);
      expect(datePicker._selectedDate).to.eql(date);

      datePicker.value = '+010000-02-03';
      date.setFullYear(10000);
      expect(datePicker._selectedDate).to.eql(date);

      datePicker.value = '-010000-02-03';
      date.setFullYear(-10000);
      expect(datePicker._selectedDate).to.eql(date);
    });

    it('should not accept non-ISO formats', () => {
      datePicker.value = '03/02/01';
      expect(datePicker.value).to.equal('');
      expect(datePicker._selectedDate).to.be.null;

      datePicker.value = '2010/02/03';
      expect(datePicker.value).to.equal('');
      expect(datePicker._selectedDate).to.be.null;

      datePicker.value = '03/02/2010';
      expect(datePicker.value).to.equal('');
      expect(datePicker._selectedDate).to.be.null;

      datePicker.value = '3 Feb 2010';
      expect(datePicker.value).to.equal('');
      expect(datePicker._selectedDate).to.be.null;

      datePicker.value = 'Feb 3, 2010';
      expect(datePicker.value).to.equal('');
      expect(datePicker._selectedDate).to.be.null;
    });

    it('should output ISO format', () => {
      const date = new Date(0, 1, 3);

      date.setFullYear(0);
      datePicker._selectedDate = date;
      expect(datePicker.value).to.equal('0000-02-03');

      date.setFullYear(10000);
      datePicker._selectedDate = new Date(date.getTime());
      expect(datePicker.value).to.equal('+010000-02-03');

      date.setFullYear(-10000);
      datePicker._selectedDate = new Date(date.getTime());
      expect(datePicker.value).to.equal('-010000-02-03');
    });
  });

  describe('i18n', () => {
    let overlayContent;

    beforeEach(async () => {
      datePicker.i18n = {
        weekdays: ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
        weekdaysShort: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],
        firstDayOfWeek: 1,
        today: 'Tänään',
        cancel: 'Peruuta',
        formatDate: (d) => {
          if (d) {
            return [d.day, d.month + 1, d.year].join('.');
          }
        },
      };

      await open(datePicker);
      overlayContent = datePicker._overlayContent;
    });

    it('should notify i18n mutation to children', () => {
      const monthCalendar = overlayContent.querySelector('vaadin-month-calendar');
      const weekdays = monthCalendar.$.monthGrid.querySelectorAll('[part="weekday"]:not(:empty)');
      const weekdayTitles = Array.prototype.map.call(weekdays, (weekday) => weekday.textContent.trim());
      expect(weekdayTitles).to.eql(['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']);
    });

    it('should reflect value in overlay header', () => {
      datePicker.value = '2000-02-01';
      expect(overlayContent.shadowRoot.querySelector('[part="label"]').textContent.trim()).to.equal('1.2.2000');
    });

    it('should display buttons in correct locale', () => {
      expect(overlayContent._todayButton.textContent.trim()).to.equal('Tänään');
      expect(overlayContent._cancelButton.textContent.trim()).to.equal('Peruuta');
    });
  });

  describe('autoselect', () => {
    it('should set autoselect to false by default', () => {
      expect(datePicker.autoselect).to.be.false;
    });

    it('should not select content on focus when autoselect is false', () => {
      const spy = sinon.spy(input, 'select');
      datePicker.value = '2016-07-14';
      input.focus();
      expect(spy.called).to.be.false;
    });

    it('should select content on focus when autoselect is true', () => {
      const spy = sinon.spy(input, 'select');
      datePicker.value = '2016-07-14';
      datePicker.autoselect = true;
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
  let datePicker, clearButton;

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker clear-button-visible></vaadin-date-picker>');
    await nextRender();
    clearButton = datePicker.shadowRoot.querySelector('[part="clear-button"]');
  });

  it('should have clearButtonVisible property', () => {
    expect(datePicker).to.have.property('clearButtonVisible', true);
  });

  it('should clear the value on click', () => {
    datePicker.value = '2000-02-01';
    click(clearButton);
    expect(datePicker.value).to.equal('');
    expect(datePicker.inputElement.value).to.equal('');
  });

  it('should clear the value on touch tap', () => {
    datePicker.value = '2000-02-01';
    touchTap(clearButton);
    expect(datePicker.value).to.equal('');
    expect(datePicker.inputElement.value).to.equal('');
  });

  it('should remove has-value attribute on clear', () => {
    datePicker.value = '2000-02-01';
    click(clearButton);
    expect(datePicker.hasAttribute('has-value')).to.be.false;
  });

  it('should prevent default on clear button click event', () => {
    datePicker.value = '2000-02-01';
    const event = click(clearButton);
    expect(event.defaultPrevented).to.be.true;
  });

  it('should prevent default on Esc when clearing value', () => {
    datePicker.value = '2000-02-01';
    const event = keyboardEventFor('keydown', 27, [], 'Escape');
    datePicker.inputElement.dispatchEvent(event);
    expect(event.defaultPrevented).to.be.true;
  });

  it('should stop propagation on Esc when clearing value', () => {
    datePicker.value = '2000-02-01';
    const event = keyboardEventFor('keydown', 27, [], 'Escape');
    const spy = sinon.spy(event, 'stopPropagation');
    datePicker.inputElement.dispatchEvent(event);
    expect(spy.calledOnce).to.be.true;
  });

  it('should not stop propagation on Esc when no value is set', () => {
    const event = keyboardEventFor('keydown', 27, [], 'Escape');
    const spy = sinon.spy(event, 'stopPropagation');
    datePicker.inputElement.dispatchEvent(event);
    expect(spy.called).to.be.false;
  });

  it('should not stop propagation on Esc when clearButtonVisible is false', () => {
    datePicker.clearButtonVisible = false;
    const event = keyboardEventFor('keydown', 27, [], 'Escape');
    const spy = sinon.spy(event, 'stopPropagation');
    datePicker.inputElement.dispatchEvent(event);
    expect(spy.called).to.be.false;
  });

  it('should not clear value on Esc when readonly is true', () => {
    datePicker.value = '2000-02-01';
    datePicker.readonly = true;
    const event = keyboardEventFor('keydown', 27, [], 'Escape');
    const spy = sinon.spy(event, 'stopPropagation');
    datePicker.inputElement.dispatchEvent(event);
    expect(spy.called).to.be.false;
  });

  it('should not stop propagation on Esc when readonly is true', () => {
    datePicker.value = '2000-02-01';
    datePicker.readonly = true;
    const event = keyboardEventFor('keydown', 27, [], 'Escape');
    datePicker.inputElement.dispatchEvent(event);
    expect(datePicker.value).to.equal('2000-02-01');
  });

  it('should not close on clear button click when opened', async () => {
    await open(datePicker);
    datePicker.value = '2001-01-01';
    click(clearButton);
    expect(datePicker.opened).to.be.true;
  });

  it('should not open on clear button click when not opened', () => {
    datePicker.value = '2001-01-01';
    click(clearButton);
    expect(datePicker.opened).to.be.not.ok;
  });

  it('should not prevent default on clear button mousedown if input is not focused', () => {
    datePicker.value = '2001-01-01';
    const event = new CustomEvent('mousedown', { cancelable: true });
    clearButton.dispatchEvent(event);
    expect(event.defaultPrevented).to.be.false;
  });

  it('should prevent default on clear button mousedown if input is focused', () => {
    datePicker.value = '2001-01-01';
    datePicker.inputElement.focus();
    const event = new CustomEvent('mousedown', { cancelable: true });
    clearButton.dispatchEvent(event);
    expect(event.defaultPrevented).to.be.true;
  });

  it('should prevent default on clear button mousedown when opened', async () => {
    datePicker.value = '2001-01-01';
    await open(datePicker);
    datePicker.inputElement.blur();
    const event = new CustomEvent('mousedown', { cancelable: true });
    clearButton.dispatchEvent(event);
    expect(event.defaultPrevented).to.be.true;
  });
});

describe('initial value attribute', () => {
  let datePicker, input;

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker value="2000-01-01"></vaadin-date-picker>');
    await nextRender();
    input = datePicker.inputElement;
  });

  it('should format the input value', () => {
    expect(input.value).to.equal('1/1/2000');
  });
});

describe('auto open disabled', () => {
  let datePicker, input, toggleButton;

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker value="2000-01-01"></vaadin-date-picker>');
    await nextRender();
    input = datePicker.inputElement;
    toggleButton = datePicker.shadowRoot.querySelector('[part="toggle-button"]');
    datePicker.autoOpenDisabled = true;
  });

  it('should focus the input on touch tap', () => {
    touchTap(input);
    expect(document.activeElement).to.equal(input);
  });

  it('should not blur the input on open', async () => {
    touchTap(input);
    await open(datePicker);
    expect(document.activeElement).to.equal(input);
  });

  it('should not open on input tap', () => {
    tap(input);
    expect(datePicker.opened).not.to.be.true;
  });

  it('should open on calendar icon tap', async () => {
    tap(toggleButton);
    await oneEvent(datePicker.$.overlay, 'vaadin-overlay-open');
  });
});

describe('ios', () => {
  let datePicker, input;

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker value="2000-01-01"></vaadin-date-picker>');
    await nextRender();
    input = datePicker.inputElement;
    datePicker._ios = true;
  });

  it('should focus the input when closed', () => {
    datePicker.focus();
    expect(document.activeElement).to.equal(input);
  });

  it('should blur the input when opened', async () => {
    datePicker.focus();
    await open(datePicker);
    expect(document.activeElement).to.not.equal(input);
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      datePicker.autoOpenDisabled = true;
    });

    it('should focus the input on touch tap', () => {
      touchTap(input);
      expect(document.activeElement).to.equal(input);
    });

    it('should blur the input on open', async () => {
      touchTap(input);
      await open(datePicker);
      expect(document.activeElement).to.not.equal(input);
    });

    it('should not open on input tap', () => {
      tap(input);
      expect(datePicker.opened).not.to.be.true;
    });
  });
});

describe('required', () => {
  let datePicker;

  beforeEach(async () => {
    datePicker = fixtureSync(`<vaadin-date-picker required></vaadin-date-picker>`);
    await nextRender();
  });

  it('should focus on required indicator click', async () => {
    datePicker.shadowRoot.querySelector('[part="required-indicator"]').click();
    await untilOverlayRendered(datePicker);
    expect(datePicker.hasAttribute('focused')).to.be.true;
  });
});
