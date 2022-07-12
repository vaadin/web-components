import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-date-time-picker.js';

class DateTimePicker2020Element extends customElements.get('vaadin-date-time-picker') {
  checkValidity() {
    return this.value === '2020-02-02T20:20';
  }
}

customElements.define('vaadin-date-time-picker-2020', DateTimePicker2020Element);

const fixtures = {
  default: '<vaadin-date-time-picker></vaadin-date-time-picker>',
  slotted: `
    <vaadin-date-time-picker>
      <vaadin-date-picker slot="date-picker"></vaadin-date-picker>
      <vaadin-time-picker slot="time-picker"></vaadin-time-picker>
    </vaadin-date-time-picker>
  `,
};

['default', 'slotted'].forEach((set) => {
  describe(`Validation (${set})`, () => {
    let dateTimePicker;

    beforeEach(() => {
      dateTimePicker = fixtureSync(fixtures[set]);
    });

    it('should not be required', () => {
      expect(dateTimePicker.required).not.to.be.ok;
    });

    it('should call checkValidity when validate is called', () => {
      const validitySpy = sinon.spy(dateTimePicker, 'checkValidity');
      dateTimePicker.validate();
      expect(validitySpy.called).to.be.true;
      expect(dateTimePicker.invalid).to.be.false;
    });

    it('should validate correctly with required flag', () => {
      dateTimePicker.name = 'foo';
      dateTimePicker.required = true;

      expect(dateTimePicker.validate()).to.equal(false);
      expect(dateTimePicker.invalid).to.equal(true);

      dateTimePicker.value = '2020-02-02T02:02:00';
      expect(dateTimePicker.validate()).to.equal(true);
      expect(dateTimePicker.invalid).to.equal(false);
    });

    it('should validate min/max times', () => {
      dateTimePicker.min = '2020-02-02T02:00';
      dateTimePicker.max = '2020-02-02T04:00';

      // Set invalid value.
      dateTimePicker.value = '2020-02-02T01:00';
      expect(dateTimePicker.validate()).to.equal(false);
      expect(dateTimePicker.invalid).to.equal(true);

      dateTimePicker.value = '2020-02-02T03:00';
      expect(dateTimePicker.validate()).to.equal(true);
      expect(dateTimePicker.invalid).to.equal(false);
    });

    it('should validate min/max dates', () => {
      dateTimePicker.min = '2020-02-01T02:00';
      dateTimePicker.max = '2020-02-03T04:00';

      // Set invalid value.
      dateTimePicker.value = '2020-02-04T03:00';
      expect(dateTimePicker.validate()).to.equal(false);
      expect(dateTimePicker.invalid).to.equal(true);

      dateTimePicker.value = '2020-02-02T03:00';
      expect(dateTimePicker.validate()).to.equal(true);
      expect(dateTimePicker.invalid).to.equal(false);
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      dateTimePicker.addEventListener('validated', validatedSpy);
      dateTimePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      dateTimePicker.addEventListener('validated', validatedSpy);
      dateTimePicker.required = true;
      dateTimePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });

    describe('required', () => {
      beforeEach(() => {
        dateTimePicker.required = true;
      });

      it('should not be invalid without user interactions', () => {
        expect(dateTimePicker.invalid).to.be.false;
      });

      it('should be invalid after validate() if value is not set', () => {
        dateTimePicker.validate();
        expect(dateTimePicker.invalid).to.be.true;
      });
    });
  });
});

describe('initial validation', () => {
  let validateSpy, dateTimePicker;

  beforeEach(() => {
    dateTimePicker = document.createElement('vaadin-date-time-picker');
    validateSpy = sinon.spy(dateTimePicker, 'validate');
  });

  afterEach(() => {
    dateTimePicker.remove();
  });

  it('should not validate by default', async () => {
    document.body.appendChild(dateTimePicker);
    await nextRender();
    expect(validateSpy.called).to.be.false;
  });

  it('should not validate when the field has an initial value', async () => {
    dateTimePicker.value = '2020-02-01T02:00';
    document.body.appendChild(dateTimePicker);
    await nextRender();
    expect(validateSpy.called).to.be.false;
  });

  it('should not validate when the field has an initial value and invalid', async () => {
    dateTimePicker.value = '2020-02-01T02:00';
    dateTimePicker.invalid = true;
    document.body.appendChild(dateTimePicker);
    await nextRender();
    expect(validateSpy.called).to.be.false;
  });
});

describe('custom validator', () => {
  let dateTimePicker;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker-2020></vaadin-date-time-picker-2020>');
  });

  it('should validate correctly with custom validator', () => {
    // Try invalid value.
    dateTimePicker.value = '2030-03-03T20:30';
    expect(dateTimePicker.validate()).to.equal(false);
    expect(dateTimePicker.invalid).to.equal(true);

    // Try valid value.
    dateTimePicker.value = '2020-02-02T20:20';
    expect(dateTimePicker.validate()).to.equal(true);
    expect(dateTimePicker.invalid).to.equal(false);
  });
});
