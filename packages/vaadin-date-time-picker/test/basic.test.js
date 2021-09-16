import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { changeInputValue } from './helpers.js';
import '../vaadin-date-time-picker.js';

const fixtures = {
  'default-inputs': `
    <vaadin-date-time-picker>
      <vaadin-date-picker slot="date-picker"></vaadin-date-picker>
      <vaadin-time-picker slot="time-picker"></vaadin-time-picker>
    </vaadin-date-time-picker>
  `,
  'lazy-inputs': `
    <vaadin-date-time-picker>
      <vaadin-date-picker slot="setAfterReady"></vaadin-date-picker>
      <vaadin-time-picker slot="setAfterReady"></vaadin-time-picker>
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
      <vaadin-date-picker slot="setAfterReady" value="2019-09-16"></vaadin-date-picker>
      <vaadin-time-picker slot="setAfterReady" value="15:00"></vaadin-time-picker>
    </vaadin-date-time-picker>
  `
};

describe('Basic features', () => {
  let dateTimePicker;
  let customField;
  let datePicker;
  let timePicker;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
    customField = dateTimePicker.$.customField;
    datePicker = customField.inputs[0];
    timePicker = customField.inputs[1];
  });

  it('should have default value', () => {
    expect(dateTimePicker.value).to.equal('');
  });

  it('should convert null and undefined values to empty string', () => {
    dateTimePicker.value = '2019-09-19T08:26'; // init with valid value
    dateTimePicker.value = null;
    expect(dateTimePicker.value).to.equal('');

    dateTimePicker.value = '2019-09-19T08:26'; // init with valid value
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

  it('should get value from custom field', () => {
    datePicker.value = '2019-09-19';
    timePicker.value = '15:00';
    dateTimePicker.__triggerCustomFieldValueUpdate();
    expect(dateTimePicker.value).to.equal('2019-09-19T15:00');
  });

  it('should delegate focus() to date picker', () => {
    dateTimePicker.focus();
    expect(datePicker.hasAttribute('focused')).to.be.true;
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
      var date = new Date(0, 1, 3, 8, 30, 0);

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
        '2019-09-19T08.30'
      ];
      for (const invalidValue of invalidValues) {
        dateTimePicker.value = invalidValue;
        expect(dateTimePicker.value).to.equal('');
        expect(dateTimePicker.__selectedDateTime).to.equal('');
      }
    });

    it('should output ISO format', () => {
      var date = new Date(0, 1, 3, 8, 30, 0);

      date.setFullYear(0);
      dateTimePicker.__selectedDateTime = date;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30');

      dateTimePicker.step = 1;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30:00');
      // test that format stays even after setting the value again
      dateTimePicker.value = '';
      dateTimePicker.__selectedDateTime = date;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30:00');

      dateTimePicker.step = 0.001;
      expect(dateTimePicker.value).to.equal('0000-02-03T08:30:00.000');
      // test that format stays even after setting the value again
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
    datePicker = dateTimePicker.$.customField.inputs[0];
    await nextFrame();
  });

  it('should focus date picker when autofocus is set', () => {
    expect(datePicker.hasAttribute('focused')).to.be.true;
  });
});

describe('Initial value', () => {
  let dateTimePicker;
  let customField;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker value="2019-09-16T15:00"></vaadin-date-time-picker>');
    customField = dateTimePicker.$.customField;
  });

  it('should use initial value from attribute without clearing it', () => {
    expect(dateTimePicker.value).to.equal('2019-09-16T15:00');
    expect(customField.value).to.equal('2019-09-16T15:00');
  });
});

describe('helperText', () => {
  let dateTimePicker;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
  });

  it('should display the helper text when provided', () => {
    dateTimePicker.helperText = 'Foo';
    expect(dateTimePicker.$.customField.helperText).to.equal(dateTimePicker.helperText);
  });
});

describe('slotted helper', () => {
  let dateTimePicker;
  let customField;

  beforeEach(() => {
    dateTimePicker = fixtureSync(`
      <vaadin-date-time-picker>
        <div slot="helper">foo</div>
      </vaadin-date-time-picker>
    `);
    customField = dateTimePicker.$.customField;
  });

  it('should display the helper text when slotted helper available', () => {
    expect(customField.querySelector('slot[slot="helper"]').assignedNodes()[0].textContent).to.eql('foo');
  });
});

describe('Theme attribute', () => {
  let dateTimePicker;
  let customField;
  let datePicker;
  let timePicker;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker theme="foo"></vaadin-date-time-picker>');
    customField = dateTimePicker.$.customField;
    datePicker = customField.inputs[0];
    timePicker = customField.inputs[1];
  });

  it('should propagate theme attribute to custom-field', () => {
    expect(customField.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to date-picker', () => {
    expect(datePicker.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to time-picker', () => {
    expect(timePicker.getAttribute('theme')).to.equal('foo');
  });
});

['default', 'lazy'].forEach((set) => {
  describe(`Slotted inputs (${set})`, () => {
    let dateTimePicker;
    let customField;
    let datePicker;
    let timePicker;

    beforeEach(async () => {
      dateTimePicker = fixtureSync(fixtures[`${set}-inputs`]);
      customField = dateTimePicker.$.customField;
      datePicker = dateTimePicker.querySelector('vaadin-date-picker');
      timePicker = dateTimePicker.querySelector('vaadin-time-picker');

      if (set === 'lazy') {
        // Assign the slots lazily simulating the case if Flow adds the slotted elements after date time picker is ready
        datePicker.slot = 'date-picker';
        timePicker.slot = 'time-picker';
        await aTimeout(0);
      }
    });

    it('should have correct inputs set in custom-field', () => {
      expect(customField.inputs[0]).to.equal(datePicker);
      expect(customField.inputs[1]).to.equal(timePicker);
    });

    it('should not have has-value on custom field by default', () => {
      expect(customField.hasAttribute('has-value')).to.be.false;
    });

    it('should not have has-value on custom field if only time is selected', () => {
      timePicker.value = '15:00';
      dateTimePicker.__triggerCustomFieldValueUpdate();
      expect(customField.hasAttribute('has-value')).to.be.false;
    });

    it('should not have has-value on custom field if only date is selected', () => {
      datePicker.value = '2019-09-16';
      dateTimePicker.__triggerCustomFieldValueUpdate();
      expect(customField.hasAttribute('has-value')).to.be.false;
    });

    it('should have has-value on custom field if both date and time are selected', () => {
      timePicker.value = '15:00';
      datePicker.value = '2019-09-16';
      dateTimePicker.__triggerCustomFieldValueUpdate();
      expect(customField.hasAttribute('has-value')).to.be.true;
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
      dateTimePicker.__triggerCustomFieldValueUpdate();
      expect(dateTimePicker.value).to.equal('2019-09-16T15:00');

      datePicker.value = '';
      dateTimePicker.__triggerCustomFieldValueUpdate();
      expect(dateTimePicker.value).to.equal('');
    });

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
    let customField;

    beforeEach(async () => {
      dateTimePicker = fixtureSync(fixtures[`${set}-values`]);
      customField = dateTimePicker.$.customField;

      if (set === 'lazy') {
        // Assign the slots lazily simulating the case if Flow adds the slotted elements after date time picker is ready
        dateTimePicker.querySelector('vaadin-date-picker').slot = 'date-picker';
        dateTimePicker.querySelector('vaadin-time-picker').slot = 'time-picker';
        await aTimeout(0);
      }
    });

    // This test simulates how DatePicker sets the initial value from server side
    it('should get initial value from slotted inputs', () => {
      expect(customField.value).to.equal('2019-09-16T15:00');
      expect(dateTimePicker.value).to.equal('2019-09-16T15:00');
    });
  });
});
