import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('validation', () => {
  let comboBox, input;

  describe('basic', () => {
    let validateSpy;

    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.items = ['foo', 'bar', 'baz'];
      input = comboBox.inputElement;
      validateSpy = sinon.spy(comboBox, 'validate');
    });

    it('should pass validation by default', () => {
      expect(comboBox.checkValidity()).to.be.true;
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });

    it('should validate on blur', () => {
      input.focus();
      input.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      comboBox.addEventListener('validated', validatedSpy);
      comboBox.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      comboBox.addEventListener('validated', validatedSpy);
      comboBox.required = true;
      comboBox.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on blur when document does not have focus', () => {
        input.focus();
        input.blur();
        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('required', () => {
    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.items = ['foo', 'bar', 'baz'];
      comboBox.required = true;
      input = comboBox.inputElement;
    });

    it('should fail validation without value', () => {
      expect(comboBox.checkValidity()).to.be.false;
      expect(comboBox.validate()).to.be.false;
      expect(comboBox.invalid).to.be.true;
    });

    it('should pass validation with a value', () => {
      comboBox.value = 'foo';
      expect(comboBox.checkValidity()).to.be.true;
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });

    it('should be invalid after user input is reverted on blur', async () => {
      input.focus();
      await sendKeys({ type: 'custom' });
      await nextRender();
      input.blur();
      expect(comboBox.invalid).to.be.true;
    });
  });

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      comboBox = document.createElement('vaadin-combo-box');
      comboBox.allowCustomValue = true;
      validateSpy = sinon.spy(comboBox, 'validate');
    });

    afterEach(() => {
      comboBox.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(comboBox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      comboBox.value = 'foo';
      document.body.appendChild(comboBox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      comboBox.value = 'foo';
      comboBox.invalid = true;
      document.body.appendChild(comboBox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });
});
