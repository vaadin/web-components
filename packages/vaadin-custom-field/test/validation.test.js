import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, html } from '@open-wc/testing-helpers';
import { dispatchChange } from './common.js';
import '../vaadin-custom-field.js';

describe('validation', () => {
  let customField, textInput;

  beforeEach(() => {
    customField = fixtureSync(html`
      <vaadin-custom-field>
        <input type="text" />
        <input type="number" />
      </vaadin-custom-field>
    `);
    textInput = customField.querySelector('input[type="text"]');
  });

  it('should check validity on validate', () => {
    const spy = sinon.spy(customField, 'checkValidity');
    customField.validate();
    expect(spy.called).to.be.true;
  });

  it('should run validation on input change', () => {
    const spy = sinon.spy(customField, 'checkValidity');
    textInput.value = 'foo';
    dispatchChange(textInput);
    expect(spy.called).to.be.true;
  });

  describe('error message', () => {
    let errorMessageElement;

    beforeEach(() => {
      customField.errorMessage = 'Foo';
      customField.invalid = true;
      errorMessageElement = customField.shadowRoot.querySelector('[part=error-message]');
    });

    it('should be displayed when the field is invalid', () => {
      expect(errorMessageElement.textContent.trim()).to.equal('Foo');
    });

    it('should toggle aria-hidden attribute on invalid change', () => {
      expect(errorMessageElement.getAttribute('aria-hidden')).to.equal('false');
      customField.invalid = false;
      expect(errorMessageElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should update aria-describedby attribute on host element when displayed', () => {
      expect(customField.getAttribute('aria-describedby')).to.be.equal(errorMessageElement.id);
    });

    it('should have unique error id', () => {
      expect(errorMessageElement.id.match(/vaadin-custom-field-error-[0-9]*/).length).to.equal(1);
    });
  });

  describe('invalid property', () => {
    beforeEach(() => {
      customField.required = true;
    });

    it('should be false by default', () => {
      expect(customField.invalid).to.be.false;
    });

    it('should become invalid on validate call when empty', () => {
      expect(customField.invalid).to.be.false;
      customField.validate();
      expect(customField.invalid).to.be.true;
    });

    it('should become valid after receiving a non-empty value from "change" event', () => {
      textInput.value = 'foo';
      dispatchChange(textInput);
      expect(customField.invalid).to.be.false;
    });

    it('should become invalid after receiving an empty value from "change" event', () => {
      customField.value = 'foo';
      textInput.value = '';
      dispatchChange(textInput);
      expect(customField.invalid).to.be.true;
    });

    it('should have aria-invalid attribute when invalid', () => {
      expect(customField.hasAttribute('aria-invalid')).to.be.false;
      customField.validate();
      expect(customField.hasAttribute('aria-invalid')).to.be.true;
    });
  });
});
