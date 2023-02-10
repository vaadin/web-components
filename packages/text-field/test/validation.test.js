import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-field.js';

describe('validation', () => {
  let field, validateSpy;

  describe('initial', () => {
    beforeEach(() => {
      field = document.createElement('vaadin-text-field');
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
        field.value = 'Value';
      });

      it('should not validate by default', async () => {
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate when the field has invalid', async () => {
        field.invalid = true;
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should validate when the field has minlength', async () => {
        field.minlength = 2;
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when the field has maxlength', async () => {
        field.maxlength = 2;
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('basic', () => {
    let validatedSpy;

    beforeEach(async () => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
      await nextRender();
      validatedSpy = sinon.spy();
      field.addEventListener('validated', validatedSpy);
    });

    it('should fire a validated event on validation success', () => {
      field.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      field.required = true;
      await nextFrame();

      field.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
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
  });

  describe('minlength', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
      await nextRender();
    });

    it('should not validate the field when minlength is set', async () => {
      field.minlength = 2;
      await nextFrame();
      expect(field.invalid).to.be.false;
    });

    it('should validate the field when invalid after minlength is changed', async () => {
      field.invalid = true;
      await nextFrame();

      const spy = sinon.spy(field, 'validate');
      field.minlength = 2;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it.skip('should update "invalid" state when "minlength" is removed', async () => {
      field.minlength = 5;
      field.value = 'foo';
      await nextFrame();

      // There seems to be no way to make minlength/maxlength trigger invalid
      // state in a native input programmatically. It can only become invalid
      // if the user really types into the input. Using MockInteractions,
      // triggering `input` and/or `change` events didn't seem to help.
      // Since vaadin-text-field currently relies on inputElement.checkValidity()
      // for setting the `invalid` property (thus simulating native behaviour)
      // there is currently no way to test this.

      // Let's enable this test if we find a way to make this invalid first

      field.validate();
      expect(field.invalid).to.be.true; // Fails here

      field.minlength = undefined;
      await nextFrame();
      expect(field.invalid).to.be.false;
    });
  });

  describe('maxlength', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
      await nextRender();
    });

    it('should not validate the field when maxlength is set', async () => {
      field.maxlength = 6;
      await nextFrame();
      expect(field.invalid).to.be.false;
    });

    it('should validate the field when invalid after maxlength is changed', async () => {
      field.invalid = true;
      await nextFrame();
      const spy = sinon.spy(field, 'validate');
      field.maxlength = 2;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it.skip('should update "invalid" state when "maxlength" is removed', async () => {
      field.maxlength = 3;
      field.value = 'foobar';
      await nextFrame();

      // There seems to be no way to make minlength/maxlength trigger invalid
      // state in a native input programmatically. It can only become invalid
      // if the user really types into the input. Using MockInteractions,
      // triggering `input` and/or `change` events didn't seem to help.
      // Since vaadin-text-field currently relies on inputElement.checkValidity()
      // for setting the `invalid` property (thus simulating native behaviour)
      // there is currently no way to test this.

      // Let's enable this test if we find a way to make this invalid first

      field.validate();
      expect(field.invalid).to.be.true; // Fails here

      field.maxlength = undefined;
      await nextFrame();
      expect(field.invalid).to.be.false;
    });
  });

  describe('pattern', () => {
    beforeEach(async () => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
      await nextRender();
    });

    it('should update "invalid" state when "pattern" is removed', async () => {
      field.value = '123foo';
      field.pattern = '\\d+';
      await nextFrame();

      field.validate();
      expect(field.invalid).to.be.true;

      field.pattern = '';
      await nextFrame();
      expect(field.invalid).to.be.false;
    });
  });
});
