import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-email-field.js';

const validAddresses = [
  'email@example.com',
  'firstname.lastname@example.com',
  'email@subdomain.example.com',
  'firstname+lastname@example.com',
  'email@123.123.123.123',
  '1234567890@example.com',
  'email@example-one.com',
  '_______@example.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com',
];

const invalidAddresses = [
  'plainaddress',
  '#@%^%#$@#$@#.com',
  '@example.com',
  'Joe Smith <email@example.com>',
  'email.example.com',
  'email@example@example.com',
  'あいうえお@example.com',
  'email@example.com (Joe Smith)',
  'email@example..com',
  'email.@example.com',
  '.email@example.com',
  'email@example',
];

describe('validation', () => {
  let emailField;

  describe('basic', () => {
    beforeEach(async () => {
      emailField = fixtureSync('<vaadin-email-field></vaadin-email-field>');
      await nextRender();
    });

    describe('valid email addresses', () => {
      validAddresses.forEach((address) => {
        it(`should treat ${address} as valid`, async () => {
          emailField.value = address;
          await nextUpdate(emailField);
          emailField.validate();
          expect(emailField.invalid).to.be.false;
        });
      });
    });

    describe('invalid email addresses', () => {
      invalidAddresses.forEach((address) => {
        it(`should treat ${address} as invalid`, async () => {
          emailField.value = address;
          await nextUpdate(emailField);
          emailField.validate();
          expect(emailField.invalid).to.be.true;
        });
      });
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      emailField.addEventListener('validated', validatedSpy);
      emailField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      emailField.addEventListener('validated', validatedSpy);
      emailField.required = true;
      await nextUpdate(emailField);
      emailField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('custom pattern', () => {
    beforeEach(async () => {
      emailField = fixtureSync('<vaadin-email-field pattern=".+@example.com"></vaadin-email-field>');
      await nextRender();
    });

    it('should not override custom pattern', () => {
      expect(emailField.pattern).to.equal('.+@example.com');
    });
  });

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      emailField = document.createElement('vaadin-email-field');
      validateSpy = sinon.spy(emailField, 'validate');
    });

    afterEach(() => {
      emailField.remove();
    });

    it('should not validate without value', async () => {
      document.body.appendChild(emailField);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    describe('with value', () => {
      beforeEach(() => {
        emailField.value = 'foo@example.com';
      });

      it('should validate by default', async () => {
        document.body.appendChild(emailField);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when using a custom pattern', async () => {
        emailField.pattern = '.+@example.com';
        document.body.appendChild(emailField);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should not validate when pattern is unset', async () => {
        emailField.pattern = '';
        document.body.appendChild(emailField);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate when pattern is unset and the field has invalid', async () => {
        emailField.pattern = '';
        emailField.invalid = true;
        document.body.appendChild(emailField);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });
    });
  });
});
