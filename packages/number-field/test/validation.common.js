import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

describe('validation', () => {
  let field, input;

  describe('basic', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
      input = field.inputElement;
    });

    it('should pass validation by default', () => {
      expect(field.checkValidity()).to.be.true;
      expect(field.validate()).to.be.true;
      expect(field.invalid).to.be.false;
    });

    it('should not pass validation when the field is required and has no value', async () => {
      field.required = true;
      await nextFrame();
      expect(field.checkValidity()).to.be.false;
      expect(field.validate()).to.be.false;
      expect(field.invalid).to.be.true;
    });

    it('should pass validation when the field is required and has a valid value', async () => {
      field.required = true;
      field.value = '1';
      await nextFrame();
      expect(field.checkValidity()).to.be.true;
      expect(field.validate()).to.be.true;
      expect(field.invalid).to.be.false;
    });

    it('should be valid with numeric values', async () => {
      field.value = '1';
      await nextFrame();
      expect(input.value).to.be.equal('1');
      expect(field.validate()).to.be.true;
    });

    it('should prevent setting non-numeric values', async () => {
      field.value = 'foo';
      await nextFrame();
      expect(field.value).to.be.empty;
      expect(field.validate()).to.be.true;
    });

    it('should align checkValidity with the native input element', async () => {
      field.value = -1;
      field.min = 0;
      await nextFrame();

      expect(field.checkValidity()).to.equal(input.checkValidity());
    });

    it('should allow setting decimals', async () => {
      field.value = 7.6;
      await nextFrame();
      expect(field.value).to.be.equal('7.6');
    });

    it('should not prevent invalid values applied programmatically (step)', async () => {
      field.step = 0.1;
      field.value = 7.686;
      await nextFrame();
      expect(field.value).to.be.equal('7.686');
    });

    it('should not prevent invalid values applied programmatically (min)', async () => {
      field.min = 2;
      field.value = 1;
      await nextFrame();
      expect(field.value).to.be.equal('1');
    });

    it('should not prevent invalid values applied programmatically (max)', async () => {
      field.max = 2;
      field.value = 3;
      await nextFrame();
      expect(field.value).to.be.equal('3');
    });

    it('should validate when setting limits', async () => {
      field.min = 2;
      field.max = 4;
      await nextFrame();

      field.value = '';
      await nextFrame();
      expect(field.validate(), 'empty value is allowed because not required').to.be.true;

      field.value = '3';
      await nextFrame();
      expect(field.validate(), 'valid value should be in the range').to.be.true;

      field.value = '1';
      await nextFrame();
      expect(field.validate(), 'value should not be below min').to.be.false;

      field.value = '3';
      await nextFrame();
      expect(field.validate(), 'invalid status should be reset when setting valid value').to.be.true;

      field.value = '5';
      await nextFrame();
      expect(field.validate(), 'value should not be greater than max').to.be.false;
    });

    it('should dispatch change event after validation', async () => {
      const validateSpy = sinon.spy(field, 'validate');
      const changeSpy = sinon.spy();
      field.required = true;
      field.addEventListener('change', changeSpy);
      input.value = '123';
      input.dispatchEvent(new CustomEvent('change'));
      await nextFrame();
      expect(validateSpy.calledOnce).to.be.true;
      expect(changeSpy.calledAfter(validateSpy)).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      field.addEventListener('validated', validatedSpy);
      field.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      field.addEventListener('validated', validatedSpy);

      field.required = true;
      await nextFrame();

      field.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('bad input', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
      input = field.inputElement;
      input.focus();
    });

    it('should be valid when committing a valid number', async () => {
      await sendKeys({ type: '1' });
      input.blur();
      expect(field.invalid).to.be.false;
    });

    it('should be invalid when trying to commit an invalid number', async () => {
      await sendKeys({ type: '1--' });
      input.blur();
      expect(field.invalid).to.be.true;
    });

    it('should set an empty value when trying to commit an invalid number', async () => {
      field.value = '1';
      await nextFrame();
      await sendKeys({ type: '1--' });
      await sendKeys({ type: 'Enter' });
      expect(field.value).to.equal('');
    });

    it('should be valid after removing an invalid number', async () => {
      await sendKeys({ type: '1--' });
      input.blur();
      input.focus();
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      input.blur();
      expect(field.invalid).to.be.false;
    });
  });

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      field = document.createElement('vaadin-number-field');
      validateSpy = sinon.spy(field, 'validate');
    });

    afterEach(() => {
      field.remove();
    });

    it('should not validate without value', async () => {
      document.body.appendChild(field);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    describe('with value', () => {
      beforeEach(() => {
        field.value = '2';
      });

      it('should not validate without constraints', async () => {
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate without constraints when the field has invalid', async () => {
        field.invalid = true;
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should validate when the field has min', async () => {
        field.min = 2;
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when the field has max', async () => {
        field.max = 2;
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when the field has step', async () => {
        field.step = 2;
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('step', () => {
    describe('default', () => {
      beforeEach(async () => {
        field = fixtureSync('<vaadin-number-field></vaadin-number-field>');
        await nextRender();
      });

      it('should not validate by step when only min and max are set', async () => {
        field.min = 1;
        field.max = 5;
        field.value = 1.5; // Would be invalid by default step=1
        await nextFrame();
        expect(field.validate()).to.be.true;
      });
    });

    describe('values', () => {
      beforeEach(async () => {
        field = fixtureSync('<vaadin-number-field></vaadin-number-field>');
        field.step = 1.5;
        await nextRender();
      });

      [-6, -1.5, 0, 1.5, 4.5].forEach((validValue) => {
        it(`should validate valid value "${validValue}" by step when defined by user`, async () => {
          field.value = validValue;
          await nextFrame();
          expect(field.validate()).to.be.true;
        });
      });

      [-3.5, -1, 2, 2.5].forEach((invalidValue) => {
        it(`should validate invalid value "${invalidValue}" by step when defined by user`, async () => {
          field.value = invalidValue;
          await nextFrame();
          expect(field.validate()).to.be.false;
        });
      });
    });

    describe('basis', () => {
      beforeEach(async () => {
        field = fixtureSync('<vaadin-number-field></vaadin-number-field>');
        field.min = 1;
        field.step = 1.5;
        await nextRender();
      });

      [1, 2.5, 4, 5.5].forEach((validValue) => {
        it(`should validate valid value "${validValue}" using min as basis`, async () => {
          field.value = validValue;
          await nextFrame();
          expect(field.validate()).to.be.true;
        });
      });

      [1.5, 3, 5].forEach((invalidValue) => {
        it(`should validate invalid value "${invalidValue}" using min as basis`, async () => {
          field.value = invalidValue;
          await nextFrame();
          expect(field.validate()).to.be.false;
        });
      });
    });

    describe('the default step is set initially', () => {
      beforeEach(async () => {
        field = fixtureSync('<vaadin-number-field step="1"></vaadin-number-field>');
        await nextRender();
      });

      it('should validate by step when default value defined as attribute', async () => {
        field.value = 1.5;
        await nextFrame();
        expect(field.validate()).to.be.false;

        field.value = 1;
        await nextFrame();
        expect(field.validate()).to.be.true;
      });
    });

    describe('a custom step is set initially', () => {
      beforeEach(async () => {
        field = fixtureSync('<vaadin-number-field step="1.5"></vaadin-number-field>');
        await nextRender();
      });

      it('should validate by step when defined as attribute', async () => {
        field.value = 1;
        await nextFrame();
        expect(field.validate()).to.be.false;

        field.value = 1.5;
        await nextFrame();
        expect(field.validate()).to.be.true;
      });
    });
  });

  describe('removing constraints', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
    });

    it('should update "invalid" state when "required" is removed', async () => {
      field.required = true;
      await nextFrame();

      field.validate();
      expect(field.invalid).to.be.true;

      field.required = false;
      await nextFrame();

      expect(field.invalid).to.be.false;
    });

    it('should update "invalid" state when "min" is removed', async () => {
      field.value = '42';
      field.min = 50;
      await nextFrame();

      field.validate();
      expect(field.invalid).to.be.true;

      field.min = '';
      await nextFrame();

      expect(field.invalid).to.be.false;
    });

    it('should update "invalid" state when "max" is removed', async () => {
      field.value = '42';
      field.max = 20;
      await nextFrame();

      field.validate();
      expect(field.invalid).to.be.true;

      field.max = '';
      await nextFrame();

      expect(field.invalid).to.be.false;
    });

    it('should update "invalid" state when "step" is removed', async () => {
      field.value = '3';
      field.min = 0;
      field.step = 2;
      await nextFrame();

      field.validate();
      expect(field.invalid).to.be.true;

      field.step = null;
      await nextFrame();

      expect(field.invalid).to.be.false;
    });

    it('should not update "invalid" when "step" is removed but the field is still required', async () => {
      field.required = true;
      field.step = 2;
      await nextFrame();

      field.validate();
      expect(field.invalid).to.be.true;

      field.step = null;
      await nextFrame();

      expect(field.invalid).to.be.true;
    });

    it('should not set "invalid" to false when "min" is set to 0', async () => {
      field.value = '-5';
      field.min = -1;
      await nextFrame();

      field.validate();
      expect(field.invalid).to.be.true;

      field.min = 0;
      await nextFrame();

      expect(field.invalid).to.be.true;
    });

    it('should not set "invalid" to false when "max" is set to 0', async () => {
      field.value = '5';
      field.max = 1;
      await nextFrame();

      field.validate();
      expect(field.invalid).to.be.true;

      field.max = 0;
      await nextFrame();

      expect(field.invalid).to.be.true;
    });
  });

  describe('invalid is set initially', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-number-field invalid></vaadin-number-field>');
      await nextRender();
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });

  describe('invalid and value are set initially', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-number-field invalid value="123456"></vaadin-number-field>');
      await nextRender();
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });

  describe('checkValidity', () => {
    it('should return true when called before connected to the DOM', () => {
      const field = document.createElement('vaadin-number-field');
      expect(field.checkValidity()).to.be.true;
    });

    it('should return false when called before connected to the DOM and invalid', () => {
      const field = document.createElement('vaadin-number-field');
      field.invalid = true;
      expect(field.checkValidity()).to.be.false;
    });
  });
});
