import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { makeFixture } from './helpers.js';
import '../vaadin-email-field.js';
import '../vaadin-number-field.js';
import '../vaadin-password-field.js';
import '../vaadin-text-area.js';
import '../vaadin-text-field.js';

['default', 'slotted'].forEach((condition) => {
  ['vaadin-text-field', 'vaadin-text-area'].forEach((el) => {
    const isTextField = el === 'vaadin-text-field';

    describe(`${el}: validate ${condition}`, () => {
      let tf, input;

      beforeEach(() => {
        tf = fixtureSync(makeFixture(`<${el} name="foo"></$${el}>`, condition));
        input = tf.inputElement;
      });

      it('should have the invalid attribute', () => {
        tf.required = true;
        tf.validate();
        expect(tf.getAttribute('invalid')).to.be.equal('');
      });

      it('should not have the invalid attribute', () => {
        tf.required = true;
        tf.validate();
        tf.required = false;
        tf.validate();
        expect(tf.getAttribute('invalid')).not.to.be.ok;
      });

      it('validate() should return correct boolean value', () => {
        tf.required = true;
        tf.minlength = 2;
        expect(tf.validate()).to.be.false;
        tf.value = 'hi';
        expect(tf.validate()).to.be.true;
      });

      it('should check validity on validate', () => {
        const spy = sinon.spy(tf, 'checkValidity');
        tf.validate();
        expect(spy.called).to.be.true;
      });

      it('should not change invalid property if no constraints are set', () => {
        tf.validate();
        expect(tf.invalid).to.be.false;
        tf.invalid = true;
        tf.validate();
        expect(tf.invalid).to.be.true;
      });

      it('should force check and change invalid property if `__forceCheckValidity` is set', () => {
        tf.validate();
        expect(tf.invalid).to.be.false;
        tf.invalid = true;
        tf.__forceCheckValidity = true;
        tf.validate();
        expect(tf.invalid).to.be.false;
      });

      it('should override explicitly set invalid if constraints are set', () => {
        tf.invalid = true;
        tf.value = 'foo';
        tf.required = true;
        expect(tf.invalid).to.be.false;
      });

      describe(`prevent invalid input ${condition}`, () => {
        beforeEach(() => {
          tf.preventInvalidInput = true;
          tf.value = '1';
        });

        describe(`user action ${condition}`, () => {
          function userSetValue(value) {
            input.value = value;
            input.dispatchEvent(new CustomEvent('input'));
          }

          if (isTextField) {
            it('should prevent invalid pattern', () => {
              tf.pattern = '[0-9]*';
              userSetValue('f');
              expect(tf.value).to.equal('1');
            });

            it('should temporarily set input-prevented attribute on invalid input', () => {
              tf.pattern = '[0-9]*';
              userSetValue('f');
              expect(tf.hasAttribute('input-prevented')).to.be.true;
            });

            it('should not set input-prevented attribute on valid input', () => {
              tf.pattern = '[0-9]*';
              userSetValue('1');
              expect(tf.hasAttribute('input-prevented')).to.be.false;
            });

            it('should have empty value', () => {
              tf.value = undefined;
              tf.pattern = '[0-9]*';
              userSetValue('f');
              expect(tf.value).to.equal('');
            });

            it('should not fire value change', () => {
              const spy = sinon.spy();
              tf.addEventListener('value-changed', spy);
              tf.pattern = '[0-9]*';
              userSetValue('f');
              expect(spy.called).to.be.false;
            });
          }

          it('should not prevent valid pattern', () => {
            tf.pattern = '[0-9]*';
            userSetValue('2');
            expect(tf.value).to.equal('2');
          });

          it('should not prevent too short value', () => {
            tf.minlength = 1;
            userSetValue('');
            expect(tf.value).to.equal('');
          });

          it('should not prevent empty value for required field', () => {
            tf.required = true;
            userSetValue('');
            expect(tf.value).to.equal('');
          });
        });

        describe(`programmatic ${condition}`, () => {
          it('should not prevent invalid pattern', () => {
            tf.pattern = '[0-9]*';
            tf.value = 'foo';
            expect(tf.value).to.equal('foo');
          });

          it('should not prevent too short value', () => {
            tf.minlength = 1;
            tf.value = '';
            expect(tf.value).to.equal('');
          });

          it('should not prevent empty value for required field', () => {
            tf.required = true;
            tf.value = '';
            expect(tf.value).to.equal('');
          });

          it('should not prevent null value for required field', () => {
            tf.required = true;
            tf.value = null;
            expect(tf.value).to.equal(null);
          });
        });
      });
    });
  });
});

const fixtures = [
  { name: 'email field', tpl: '<vaadin-email-field invalid></vaadin-email-field>' },
  { name: 'email field with value', tpl: '<vaadin-email-field invalid value="foo@example.com"></vaadin-email-field>' },
  { name: 'number field', tpl: '<vaadin-number-field invalid></vaadin-number-field>' },
  { name: 'number field with value', tpl: '<vaadin-number-field invalid value="42"></vaadin-number-field>' },
  { name: 'password field', tpl: '<vaadin-password-field invalid></vaadin-password-field>' },
  { name: 'password field with value', tpl: '<vaadin-password-field invalid value="foo"></vaadin-password-field>' },
  { name: 'text field', tpl: '<vaadin-text-field invalid></vaadin-text-field>' },
  { name: 'text field with value', tpl: '<vaadin-text-field invalid value="foo"></vaadin-text-field>' }
];

fixtures.forEach(({ name, tpl }) => {
  describe(name, () => {
    let field;

    beforeEach(() => {
      field = fixtureSync(tpl);
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });
});
