import { expect } from '@esm-bundle/chai';
import { fixtureSync, keyboardEventFor, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('form field', () => {
  let comboBox, input;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box allow-custom-value></vaadin-combo-box>');
    input = comboBox.inputElement;
  });

  it('should not be required by default', () => {
    expect(input.required).to.be.false;
  });

  it('should set required property to input', () => {
    comboBox.required = true;
    expect(input.required).to.be.true;
  });

  it('should set disabled property to input', () => {
    comboBox.disabled = true;
    expect(input.hasAttribute('disabled')).to.be.true;
  });

  it('should set readonly property to input', () => {
    comboBox.readonly = true;
    expect(input.readOnly).to.be.true;
  });

  it('should pass the validation when the field is valid', () => {
    expect(comboBox.checkValidity()).to.be.true;
    expect(comboBox.validate()).to.be.true;
    expect(comboBox.invalid).to.be.false;
  });

  it('should not pass the validation when the field is required and has no value', () => {
    comboBox.required = true;
    expect(comboBox.checkValidity()).to.be.false;
    expect(comboBox.validate()).to.be.false;
    expect(comboBox.invalid).to.be.true;
  });

  it('should pass the validation when the field is required and has a value', () => {
    comboBox.required = true;
    comboBox.value = 'foo';
    expect(comboBox.checkValidity()).to.be.true;
    expect(comboBox.validate()).to.be.true;
    expect(comboBox.invalid).to.be.false;
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

  describe('initial validation', () => {
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

  describe('enter key behavior', () => {
    let keydownEvent;

    beforeEach(() => {
      // Fake a keydown event to mimic form submit.
      keydownEvent = keyboardEventFor('keydown', 13, [], 'Enter');
    });

    it('should prevent default on open combobox', () => {
      comboBox.open();
      comboBox.dispatchEvent(keydownEvent);
      expect(keydownEvent.defaultPrevented).to.be.true;
    });

    it('should not prevent default on closed combobox', () => {
      comboBox.dispatchEvent(keydownEvent);
      expect(keydownEvent.defaultPrevented).to.be.false;
    });
  });
});
