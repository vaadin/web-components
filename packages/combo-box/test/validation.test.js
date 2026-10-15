import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';

describe('validation', () => {
  let comboBox, input;

  describe('basic', () => {
    let validateSpy, changeSpy;

    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.items = ['foo', 'bar', 'baz'];
      await nextRender();
      input = comboBox.inputElement;
      validateSpy = sinon.spy(comboBox, 'validate');
      changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);
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

    it('should validate on outside click', () => {
      input.focus();
      input.click();
      outsideClick();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate before change event on outside click', async () => {
      input.focus();
      input.click();
      await sendKeys({ type: 'foo' });
      outsideClick();
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should validate before change event on blur', async () => {
      input.focus();
      await sendKeys({ type: 'foo' });
      input.blur();
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should validate before change event on Enter', async () => {
      input.focus();
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Enter' });
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should validate before change event on clear button click', () => {
      comboBox.clearButtonVisible = true;
      comboBox.value = 'foo';
      validateSpy.resetHistory();
      comboBox.$.clearButton.click();
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      comboBox.addEventListener('validated', validatedSpy);
      comboBox.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      comboBox.addEventListener('validated', validatedSpy);
      comboBox.required = true;
      await nextUpdate(comboBox);
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
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.items = ['foo', 'bar', 'baz'];
      comboBox.required = true;
      await nextRender();
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
