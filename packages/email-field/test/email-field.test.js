import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
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

    beforeEach(() => {
      emailField = fixtureSync('<vaadin-email-field></vaadin-email-field>');
    });

    describe('valid email addresses', () => {
      validAddresses.forEach((address) => {
        it(`should treat ${address} as valid`, () => {
          emailField.value = address;
          emailField.validate();
          expect(emailField.invalid).to.be.false;
        });
      });
    });

    describe('invalid email addresses', () => {
      invalidAddresses.forEach((address) => {
        it(`should treat ${address} as invalid`, () => {
          emailField.value = address;
          emailField.validate();
          expect(emailField.invalid).to.be.true;
        });
      });
    });
  });

  describe('custom pattern', () => {
    let emailField;

    beforeEach(() => {
      emailField = fixtureSync('<vaadin-email-field pattern=".+@example.com"></vaadin-email-field>');
    });

    it('should not override custom pattern', () => {
      expect(emailField.pattern).to.equal('.+@example.com');
    });
  });

  describe('invalid', () => {
    let field;

    beforeEach(() => {
      field = fixtureSync('<vaadin-email-field invalid></vaadin-email-field>');
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });

  describe('invalid with value', () => {
    let field;

    beforeEach(() => {
      field = fixtureSync('<vaadin-email-field invalid value="foo@example.com"></vaadin-email-field>');
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });
});
