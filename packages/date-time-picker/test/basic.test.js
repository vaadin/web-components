import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, focusin, focusout, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-date-time-picker.js';
import { changeInputValue } from './helpers.js';

const fixtures = {
  'default-inputs': `
    <vaadin-date-time-picker>
      <vaadin-date-picker slot="date-picker"></vaadin-date-picker>
      <vaadin-time-picker slot="time-picker"></vaadin-time-picker>
    </vaadin-date-time-picker>
  `,
  'lazy-inputs': `
    <vaadin-date-time-picker>
    </vaadin-date-time-picker>
  `,
  'default-values': `
    <vaadin-date-time-picker>
      <vaadin-date-picker slot="date-picker" value="2019-09-16"></vaadin-date-picker>
      <vaadin-time-picker slot="time-picker" value="15:00"></vaadin-time-picker>
    </vaadin-date-time-picker>
  `,
  'lazy-values': `
    <vaadin-date-time-picker>
    </vaadin-date-time-picker>
  `,
};

function getDatePicker(dateTimePicker) {
  return dateTimePicker.querySelector('[slot="date-picker"]');
}

function getTimePicker(dateTimePicker) {
  return dateTimePicker.querySelector('[slot="time-picker"]');
}

describe('Basic features', () => {
  let dateTimePicker;
  let datePicker;
  let timePicker;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
    datePicker = getDatePicker(dateTimePicker);
    timePicker = getTimePicker(dateTimePicker);
  });

  it('should have default value', () => {
    expect(dateTimePicker.value).to.equal('');
  });

  it('should convert null and undefined values to empty string', () => {
    dateTimePicker.value = '2019-09-19T08:26'; // Init with valid value
    dateTimePicker.value = null;
    expect(dateTimePicker.value).to.equal('');

    dateTimePicker.value = '2019-09-19T08:26'; // Init with valid value
    dateTimePicker.value = undefined;
    expect(dateTimePicker.value).to.equal('');
  });

  it('should notify value change', () => {
    const spy = sinon.spy();
    dateTimePicker.addEventListener('value-changed', spy);
    dateTimePicker.value = '2019-09-19T08:26';
    expect(spy.calledOnce).to.be.true;

    spy.resetHistory();
    dateTimePicker.value = '';
    expect(spy.calledOnce).to.be.true;
  });

  it('should not clear time-picker when date-picker is cleared', () => {
    dateTimePicker.value = '2019-09-19T08:26';
    datePicker.value = '';
    expect(timePicker.value).to.equal('08:26');
  });

  it('should not clear date-picker when time-picker is cleared', () => {
    dateTimePicker.value = '2019-09-19T08:26';
    timePicker.value = '';
    expect(datePicker.value).to.equal('2019-09-19');
  });

  it('should get value from custom field', () => {
    datePicker.value = '2019-09-19';
    timePicker.value = '15:00';
    expect(dateTimePicker.value).to.equal('2019-09-19T15:00');
  });

  it('should delegate focus() to date picker', () => {
    dateTimePicker.focus();
    expect(datePicker.hasAttribute('focused')).to.be.true;
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

    it('should not remove focused attribute when moving focus to overlay', () => {
      focusin(datePicker);
      datePicker.open();
      focusout(datePicker, datePicker._overlayContent);
      expect(dateTimePicker.hasAttribute('focused')).to.be.true;
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      dateTimePicker.addEventListener('change', spy);
    });

    it('should fire change on date picker change event', () => {
      changeInputValue(timePicker, '16:00');
      expect(spy.called).to.be.false;
      changeInputValue(datePicker, '2020-01-17');
      expect(spy.calledOnce).to.be.true;
      changeInputValue(datePicker, '');
      expect(spy.calledTwice).to.be.true;
    });

    it('should fire change on time picker change event', () => {
      changeInputValue(datePicker, '2020-01-17');
      expect(spy.called).to.be.false;
      changeInputValue(timePicker, '16:00');
      expect(spy.calledOnce).to.be.true;
      changeInputValue(timePicker, '');
      expect(spy.calledTwice).to.be.true;
    });

    it('should not fire change on programmatic value change', () => {
      dateTimePicker.value = '2020-01-17T16:00';
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change after manual one', () => {
      dateTimePicker.value = '2020-01-17T16:00'; // Init with valid value
      changeInputValue(datePicker, '2020-01-20');
      spy.resetHistory();
      dateTimePicker.value = '2020-01-10T12:00';
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change after partial manual one', () => {
      changeInputValue(datePicker, '2020-01-17');
      // Time picker has no value so date time picker value is still empty
      dateTimePicker.value = '2020-01-17T16:00';
      expect(spy.called).to.be.false;
    });
  });

  describe('value property formats', () => {
    it('should accept ISO format', () => {
      const date = new Date(0, 1, 3, 8, 30, 0);

      date.setFullYear(0);
      dateTimePicker.value = '0000-02-03T08:30:00';
      expect(dateTimePicker.__selectedDateTime).to.eql(date);

      date.setFullYear(10000);
      dateTimePicker.value = '+010000-02-03T08:30:00';
      expect(dateTimePicker.__selectedDateTime).to.eql(date);

      date.setFullYear(-10000);
      dateTimePicker.value = '-010000-02-03T08:30:00';
      expect(dateTimePicker.__selectedDateTime).to.eql(date);
    });

    it('should not accept non-ISO formats', () => {
      const invalidValues = [
        '03/02/01T08:30',
        '2010/02/03T08:30',
        '03/02/2010T08:30',
        '3 Feb 2010T08:30',
        'Feb 3, 2010T08:30',
        '2019-09-19T08.30',
      ];
      for (const invalidValue of invalidValues) {
        dateTimePicker.value = invalidValue;
        expect(dateTimePicker.value).to.equal('');
        expect(dateTimePicker.__selectedDateTime).to.equal('');
      }
    });

    it('should output ISO format', () => {
      const date = new Date(0, 1, 3, 8, 30, 0);

      date.setFullYear(0);
      dateTimePicker.__selectedDateTime = date;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30');

      dateTimePicker.step = 1;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30:00');
      // Test that format stays even after setting the value again
      dateTimePicker.value = '';
      dateTimePicker.__selectedDateTime = date;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30:00');

      dateTimePicker.step = 0.001;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30:00.000');
      // Test that format stays even after setting the value again
      dateTimePicker.value = '';
      dateTimePicker.__selectedDateTime = date;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30:00.000');

      date.setFullYear(10000);
      dateTimePicker.step = undefined;
      dateTimePicker.__selectedDateTime = new Date(date.getTime());
      expect(dateTimePicker.value).to.equal('+010000-02-03T08:30');
      dateTimePicker.step = 1;
      expect(dateTimePicker.value).to.equal('+010000-02-03T08:30:00');
      dateTimePicker.step = 0.001;
      expect(dateTimePicker.value).to.equal('+010000-02-03T08:30:00.000');

      date.setFullYear(-10000);
      dateTimePicker.step = undefined;
      dateTimePicker.__selectedDateTime = new Date(date.getTime());
      expect(dateTimePicker.value).to.equal('-010000-02-03T08:30');
      dateTimePicker.step = 1;
      expect(dateTimePicker.value).to.equal('-010000-02-03T08:30:00');
      dateTimePicker.step = 0.001;
      expect(dateTimePicker.value).to.equal('-010000-02-03T08:30:00.000');
    });

    it('should allow millisecond precision values', () => {
      dateTimePicker.step = 0.5;
      const testValue = '2020-01-09T12:34:56.789';
      dateTimePicker.value = testValue;
      expect(dateTimePicker.value).to.equal(testValue);
    });
  });
});

describe('autofocus', () => {
  let dateTimePicker;
  let datePicker;

  beforeEach(async () => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker autofocus></vaadin-date-time-picker>');
    datePicker = getDatePicker(dateTimePicker);
    await nextFrame();
  });

  it('should focus date picker when autofocus is set', () => {
    expect(datePicker.hasAttribute('focused')).to.be.true;
  });
});

describe('Initial value', () => {
  let dateTimePicker;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker value="2019-09-16T15:00"></vaadin-date-time-picker>');
  });

  it('should use initial value from attribute without clearing it', () => {
    expect(dateTimePicker.value).to.equal('2019-09-16T15:00');
  });
});

describe('helperText', () => {
  let dateTimePicker;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
  });

  it('should display the helper text when provided', () => {
    dateTimePicker.helperText = 'Foo';
    expect(dateTimePicker.querySelector('[slot="helper"]').textContent).to.equal('Foo');
  });
});

describe('Theme attribute', () => {
  let dateTimePicker;
  let datePicker;
  let timePicker;

  describe('default', () => {
    beforeEach(() => {
      dateTimePicker = fixtureSync('<vaadin-date-time-picker theme="foo"></vaadin-date-time-picker>');
      datePicker = getDatePicker(dateTimePicker);
      timePicker = getTimePicker(dateTimePicker);
    });

    it('should propagate theme attribute to date-picker', () => {
      expect(datePicker.getAttribute('theme')).to.equal('foo');
    });

    it('should propagate theme attribute to time-picker', () => {
      expect(timePicker.getAttribute('theme')).to.equal('foo');
    });
  });

  describe('slotted', () => {
    beforeEach(() => {
      dateTimePicker = document.createElement('vaadin-date-time-picker');

      datePicker = document.createElement('vaadin-date-time-picker-date-picker');
      datePicker.setAttribute('slot', 'date-picker');
      dateTimePicker.appendChild(datePicker);

      timePicker = document.createElement('vaadin-date-time-picker-time-picker');
      timePicker.setAttribute('slot', 'time-picker');
      dateTimePicker.appendChild(timePicker);
    });

    afterEach(() => {
      dateTimePicker.remove();
    });

    it('should propagate theme attribute to date-picker when set before adding to DOM', () => {
      dateTimePicker.setAttribute('theme', 'foo');
      document.body.appendChild(dateTimePicker);
      expect(datePicker.getAttribute('theme')).to.equal('foo');
    });

    it('should propagate theme attribute to time-picker when set before adding to DOM', () => {
      dateTimePicker.setAttribute('theme', 'foo');
      document.body.appendChild(dateTimePicker);
      expect(timePicker.getAttribute('theme')).to.equal('foo');
    });
  });
});

['default', 'lazy'].forEach((set) => {
  describe(`Slotted inputs (${set})`, () => {
    let dateTimePicker;
    let datePicker;
    let timePicker;
    let originalDatePicker;
    let originalTimePicker;

    beforeEach(async () => {
      dateTimePicker = fixtureSync(fixtures[`${set}-inputs`]);
      originalDatePicker = getDatePicker(dateTimePicker);
      originalTimePicker = getTimePicker(dateTimePicker);
      datePicker = dateTimePicker.querySelector('vaadin-date-picker');
      timePicker = dateTimePicker.querySelector('vaadin-time-picker');

      if (set === 'lazy') {
        // Add slotted children lazily simulating the case where Flow adds the slotted elements after date time picker is ready
        datePicker = document.createElement('vaadin-date-picker');
        datePicker.slot = 'date-picker';
        timePicker = document.createElement('vaadin-time-picker');
        timePicker.slot = 'time-picker';
        dateTimePicker.appendChild(datePicker);
        dateTimePicker.appendChild(timePicker);
        // Wait for FlattenedNodeObserver to trigger
        await aTimeout(0);
      }
    });

    it('should not have has-value by default', () => {
      expect(dateTimePicker.hasAttribute('has-value')).to.be.false;
    });

    it('should not have has-value if only time is selected', () => {
      timePicker.value = '15:00';
      expect(dateTimePicker.hasAttribute('has-value')).to.be.false;
    });

    it('should not have has-value if only date is selected', () => {
      datePicker.value = '2019-09-16';
      expect(dateTimePicker.hasAttribute('has-value')).to.be.false;
    });

    it('should have has-value if both date and time are selected', () => {
      timePicker.value = '15:00';
      datePicker.value = '2019-09-16';
      expect(dateTimePicker.hasAttribute('has-value')).to.be.true;
    });

    it('should propagate value to slotted inputs', () => {
      dateTimePicker.value = '2019-09-16T15:00';
      expect(datePicker.value).to.equal('2019-09-16');
      expect(timePicker.value).to.equal('15:00');

      dateTimePicker.value = '';
      expect(datePicker.value).to.equal('');
      expect(timePicker.value).to.equal('');
    });

    it('should get value from slotted inputs', () => {
      datePicker.value = '2019-09-16';
      timePicker.value = '15:00';
      expect(dateTimePicker.value).to.equal('2019-09-16T15:00');

      datePicker.value = '';
      expect(dateTimePicker.value).to.equal('');
    });

    it('should contain only one date-picker', () => {
      expect(dateTimePicker.querySelectorAll('[slot="date-picker"]')).to.have.lengthOf(1);
    });

    it('should contain only one time-picker', () => {
      expect(dateTimePicker.querySelectorAll('[slot="time-picker"]')).to.have.lengthOf(1);
    });

    if (set === 'lazy') {
      it('should not contain original date picker', () => {
        expect(originalDatePicker).not.to.be.undefined;
        expect(dateTimePicker.contains(originalDatePicker)).to.be.false;
      });

      it('should not contain original time picker', () => {
        expect(originalTimePicker).not.to.be.undefined;
        expect(dateTimePicker.contains(originalTimePicker)).to.be.false;
      });

      it('should not react to changes on discarded pickers', () => {
        sinon.spy(dateTimePicker, '__valueChangedEventHandler');
        sinon.spy(dateTimePicker, '__changeEventHandler');
        originalDatePicker.value = '2000-01-01';
        originalDatePicker.dispatchEvent(new CustomEvent('change'));
        originalTimePicker.value = '00:00';
        originalTimePicker.dispatchEvent(new CustomEvent('change'));

        expect(dateTimePicker.__valueChangedEventHandler.called).to.be.false;
        expect(dateTimePicker.__changeEventHandler.called).to.be.false;
      });
    }

    describe('Removing change listeners', () => {
      it('should remove change listener from removed date picker', async () => {
        dateTimePicker.removeChild(datePicker); // Remove slotted date picker
        await aTimeout(0);
        changeInputValue(datePicker, '2019-09-16');
        expect(dateTimePicker.__doDispatchChange).to.be.not.true;
      });

      it('should remove change listener from removed time picker', async () => {
        dateTimePicker.removeChild(timePicker); // Remove slotted time picker
        await aTimeout(0);
        changeInputValue(timePicker, '15:00');
        expect(dateTimePicker.__doDispatchChange).to.be.not.true;
      });
    });
  });

  describe(`Initial value from slotted inputs (${set})`, () => {
    let dateTimePicker;

    beforeEach(async () => {
      dateTimePicker = fixtureSync(fixtures[`${set}-values`]);

      if (set === 'lazy') {
        // Add slotted children lazily simulating the case where Flow adds the slotted elements after date time picker is ready
        const datePicker = document.createElement('vaadin-date-picker');
        datePicker.value = '2019-09-16';
        datePicker.slot = 'date-picker';
        const timePicker = document.createElement('vaadin-time-picker');
        timePicker.value = '15:00';
        timePicker.slot = 'time-picker';
        dateTimePicker.appendChild(datePicker);
        dateTimePicker.appendChild(timePicker);
        // Wait for FlattenedNodeObserver to trigger
        await aTimeout(0);
      }
    });

    // This test simulates how DatePicker sets the initial value from server side
    it('should get initial value from slotted inputs', () => {
      expect(dateTimePicker.value).to.equal('2019-09-16T15:00');
    });
  });
});
