import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-area.js';

describe('validation', () => {
  let textArea, validateSpy;

  describe('initial', () => {
    beforeEach(() => {
      textArea = document.createElement('vaadin-text-area');
      validateSpy = sinon.spy(textArea, 'validate');
    });

    afterEach(() => {
      textArea.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(textArea);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      textArea.value = 'Initial Value';
      document.body.appendChild(textArea);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      textArea.value = 'Initial Value';
      textArea.invalid = true;
      document.body.appendChild(textArea);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    beforeEach(() => {
      textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      textArea.addEventListener('validated', validatedSpy);
      textArea.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      textArea.addEventListener('validated', validatedSpy);
      textArea.required = true;
      textArea.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('minlength', () => {
    beforeEach(() => {
      textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
    });

    it('should not validate the field when minlength is set', () => {
      textArea.minlength = 2;
      expect(textArea.invalid).to.be.false;
    });

    it('should validate the field when invalid after minlength is changed', () => {
      textArea.invalid = true;
      const spy = sinon.spy(textArea, 'validate');
      textArea.minlength = 2;
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('maxlength', () => {
    beforeEach(() => {
      textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
    });

    it('should not validate the field when maxlength is set', () => {
      textArea.maxlength = 6;
      expect(textArea.invalid).to.be.false;
    });

    it('should validate the field when invalid after maxlength is changed', () => {
      textArea.invalid = true;
      const spy = sinon.spy(textArea, 'validate');
      textArea.maxlength = 6;
      expect(spy.calledOnce).to.be.true;
    });
  });
});
