import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-custom-field.js';
import { dispatchChange } from './helpers.js';

describe('validation', () => {
  let customField;

  describe('basic', () => {
    beforeEach(async () => {
      customField = fixtureSync(`
        <vaadin-custom-field>
          <input type="text" />
          <input type="number" />
        </vaadin-custom-field>
      `);
      await nextRender();
    });

    it('should check validity on validate', () => {
      const spy = sinon.spy(customField, 'checkValidity');
      customField.validate();
      expect(spy.called).to.be.true;
    });

    it('should run validation on input change', () => {
      const spy = sinon.spy(customField, 'checkValidity');
      customField.inputs[0].value = 'foo';
      dispatchChange(customField.inputs[0]);
      expect(spy.called).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      customField.addEventListener('validated', validatedSpy);
      customField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      customField.addEventListener('validated', validatedSpy);
      customField.required = true;
      customField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      customField = fixtureSync(`
        <vaadin-custom-field required>
          <input type="text" />
          <input type="number" />
        </vaadin-custom-field>
      `);
      await nextRender();
    });

    it('should set invalid to false by default', () => {
      expect(customField.invalid).to.be.false;
    });

    it('should become invalid on validate call when empty', () => {
      expect(customField.invalid).to.be.false;
      customField.validate();
      expect(customField.invalid).to.be.true;
    });

    it('should become valid after receiving a non-empty value from "change" event', () => {
      customField.inputs[0].value = 'foo';
      dispatchChange(customField.inputs[0]);
      expect(customField.invalid).to.be.false;
    });

    it('should become invalid after receiving an empty value from "change" event', () => {
      customField.value = 'foo';
      customField.inputs[0].value = '';
      dispatchChange(customField.inputs[0]);
      expect(customField.invalid).to.be.true;
    });
  });
});
