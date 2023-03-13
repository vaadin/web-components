import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';

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

    it('should not validate without value', async () => {
      document.body.appendChild(textArea);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    describe('with value', () => {
      beforeEach(() => {
        textArea.value = 'Value';
      });

      it('should not validate by default', async () => {
        document.body.appendChild(textArea);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate when the field has invalid', async () => {
        textArea.invalid = true;
        document.body.appendChild(textArea);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should validate when the field has minlength', async () => {
        textArea.minlength = 2;
        document.body.appendChild(textArea);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when the field has maxlength', async () => {
        textArea.maxlength = 2;
        document.body.appendChild(textArea);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('basic', () => {
    let validatedSpy;

    beforeEach(async () => {
      textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
      await nextRender();
      validatedSpy = sinon.spy();
      textArea.addEventListener('validated', validatedSpy);
    });

    it('should fire a validated event on validation success', () => {
      textArea.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      textArea.required = true;
      await nextFrame();
      textArea.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('minlength', () => {
    beforeEach(async () => {
      textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
      await nextRender();
    });

    it('should not validate the field when minlength is set', async () => {
      textArea.minlength = 2;
      await nextFrame();
      expect(textArea.invalid).to.be.false;
    });

    it('should validate the field when invalid after minlength is changed', async () => {
      textArea.invalid = true;
      await nextFrame();
      const spy = sinon.spy(textArea, 'validate');
      textArea.minlength = 2;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('maxlength', () => {
    beforeEach(async () => {
      textArea = fixtureSync('<vaadin-text-area></vaadin-text-area>');
      await nextRender();
    });

    it('should not validate the field when maxlength is set', async () => {
      textArea.maxlength = 6;
      await nextFrame();
      expect(textArea.invalid).to.be.false;
    });

    it('should validate the field when invalid after maxlength is changed', async () => {
      textArea.invalid = true;
      await nextFrame();
      const spy = sinon.spy(textArea, 'validate');
      textArea.maxlength = 6;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });
  });
});
