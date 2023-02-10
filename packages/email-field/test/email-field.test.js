import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
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
  'email@example',
];

describe('email-field', () => {
  describe('default', () => {
    let emailField;

    beforeEach(async () => {
      emailField = fixtureSync('<vaadin-email-field></vaadin-email-field>');
      await nextRender();
    });

    describe('valid email addresses', () => {
      validAddresses.forEach((address) => {
        it(`should treat ${address} as valid`, async () => {
          emailField.value = address;
          await nextFrame();
          emailField.validate();
          expect(emailField.invalid).to.be.false;
        });
      });
    });

    describe('invalid email addresses', () => {
      invalidAddresses.forEach((address) => {
        it(`should treat ${address} as invalid`, async () => {
          emailField.value = address;
          await nextFrame();
          emailField.validate();
          expect(emailField.invalid).to.be.true;
        });
      });
    });
  });

  describe('custom pattern', () => {
    let emailField;

    beforeEach(async () => {
      emailField = fixtureSync('<vaadin-email-field pattern=".+@example.com"></vaadin-email-field>');
      await nextRender();
    });

    it('should not override custom pattern', () => {
      expect(emailField.pattern).to.equal('.+@example.com');
    });
  });

  describe('initial validation', () => {
    let field, validateSpy;

    beforeEach(() => {
      field = document.createElement('vaadin-email-field');
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
        field.value = 'foo@example.com';
      });

      it('should validate by default', async () => {
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when using a custom pattern', async () => {
        field.pattern = '.+@example.com';
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should not validate when pattern is unset', async () => {
        field.pattern = '';
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate when pattern is unset and the field has invalid', async () => {
        field.pattern = '';
        field.invalid = true;
        document.body.appendChild(field);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('validation', () => {
    let field, validatedSpy;

    beforeEach(async () => {
      field = fixtureSync('<vaadin-email-field></vaadin-email-field>');
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
});
