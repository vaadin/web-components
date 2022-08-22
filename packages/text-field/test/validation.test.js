import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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

    it('should not validate by default', async () => {
      document.body.appendChild(field);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      field.value = 'Initial Value';
      document.body.appendChild(field);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      field.value = 'Initial Value';
      field.invalid = true;
      document.body.appendChild(field);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    beforeEach(() => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      field.addEventListener('validated', validatedSpy);
      field.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      field.addEventListener('validated', validatedSpy);
      field.required = true;
      field.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(() => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    });

    it('should update "invalid" state when "required" is removed', () => {
      field.required = true;
      field.validate();
      expect(field.invalid).to.be.true;

      field.required = false;
      expect(field.invalid).to.be.false;
    });
  });

  describe('minlength', () => {
    beforeEach(() => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    });

    it('should not validate the field when minlength is set', () => {
      field.minlength = 2;
      expect(field.invalid).to.be.false;
    });

    it('should validate the field when invalid after minlength is changed', () => {
      field.invalid = true;
      const spy = sinon.spy(field, 'validate');
      field.minlength = 2;
      expect(spy.calledOnce).to.be.true;
    });

    it.skip('should update "invalid" state when "minlength" is removed', () => {
      field.minlength = 5;
      field.value = 'foo';

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
      expect(field.invalid).to.be.false;
    });
  });

  describe('maxlength', () => {
    beforeEach(() => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    });

    it('should not validate the field when maxlength is set', () => {
      field.maxlength = 6;
      expect(field.invalid).to.be.false;
    });

    it.skip('should update "invalid" state when "maxlength" is removed', () => {
      field.maxlength = 3;
      field.value = 'foobar';

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
      expect(field.invalid).to.be.false;
    });
  });

  describe('pattern', () => {
    beforeEach(() => {
      field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    });

    it('should update "invalid" state when "pattern" is removed', () => {
      field.value = '123foo';
      field.pattern = '\\d+';
      field.validate();
      expect(field.invalid).to.be.true;

      field.pattern = '';
      expect(field.invalid).to.be.false;
    });
  });
});
