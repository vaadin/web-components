import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { makeFixture } from './helpers.js';
import '../vaadin-text-area.js';
import '../vaadin-text-field.js';

['default', 'slotted'].forEach((condition) => {
  describe(`keyboard ${condition}`, () => {
    let textField, escKeyDownEvent;

    beforeEach(() => {
      textField = fixtureSync(makeFixture('<vaadin-text-field></vaadin-text-field>', condition));

      escKeyDownEvent = new CustomEvent('keydown', {
        bubbles: true,
        cancelable: true
      });
      escKeyDownEvent.keyCode = 27;
      escKeyDownEvent.code = 27;
    });

    it('should clear the value on ESC if clear button is visible', () => {
      textField.value = 'Foo';
      textField.clearButtonVisible = true;
      textField.dispatchEvent(escKeyDownEvent);
      expect(textField.value).not.to.be.ok;
    });

    it('should dispatch `change` event on ESC after value is cleared', () => {
      textField.value = 'Foo';
      textField.clearButtonVisible = true;

      const changeSpy = sinon.spy();
      textField.addEventListener('change', changeSpy);

      textField.dispatchEvent(escKeyDownEvent);
      // Check when value was already cleared
      textField.dispatchEvent(escKeyDownEvent);

      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should clear the value of native input on ESC if clear button is visible', () => {
      textField.value = 'Foo';
      textField.clearButtonVisible = true;
      textField.dispatchEvent(escKeyDownEvent);
      expect(textField.inputElement.value).to.equal('');
    });

    it('should not clear the value on ESC if clear button is not visible', () => {
      textField.value = 'Foo';
      textField.dispatchEvent(escKeyDownEvent);
      expect(textField.value).to.equal('Foo');
    });

    it('should not clear the value of native input on ESC if clear button is not visible', () => {
      textField.value = 'Foo';
      textField.dispatchEvent(escKeyDownEvent);
      expect(textField.inputElement.value).to.equal('Foo');
    });
  });
});

['vaadin-text-field', 'vaadin-text-area'].forEach((el) => {
  ['default', 'slotted'].forEach((condition) => {
    describe(`${el}: accessibility ${condition}`, () => {
      describe(`default ${condition}`, () => {
        let tf, label, inputField, input;

        beforeEach(() => {
          tf = fixtureSync(makeFixture(`<${el}></${el}>`, condition));
          inputField = tf.shadowRoot.querySelector('[part="input-field"]');
          input = tf.inputElement;
          label = tf.shadowRoot.querySelector('[part=label]');
        });

        it('should have input-field in accessible label', () => {
          expect(input.getAttribute('aria-labelledby')).to.equal(`${inputField.id}`);
        });

        it('should have input-field with label in accessible label', () => {
          tf.label = 'foo';
          expect(input.getAttribute('aria-labelledby')).to.equal(`${label.id} ${inputField.id}`);
        });

        it('should not be marked required', () => {
          expect(input.hasAttribute('required')).to.be.false;
        });

        it('should be marked required', () => {
          tf.required = true;
          expect(input.getAttribute('required')).to.equal('');
        });

        it('should not be marked readonly', () => {
          expect(input.hasAttribute('readonly')).to.be.false;
        });

        it('should be marked readonly', () => {
          tf.readonly = true;
          expect(input.getAttribute('readonly')).to.equal('');
        });

        it('should not be marked disabled', () => {
          expect(input.hasAttribute('disabled')).to.be.false;
        });

        it('should be marked disabled', () => {
          tf.disabled = true;
          expect(input.getAttribute('disabled')).to.equal('');
        });

        describe('clear icon button', () => {
          it('should have default accessible label', () => {
            expect(tf.$.clearButton.getAttribute('aria-label')).to.equal('Clear');
          });

          it('should translate accessible label with new i18n object', () => {
            tf.i18n = { clear: 'tyhjennä' };
            expect(tf.$.clearButton.getAttribute('aria-label')).to.equal('tyhjennä');
          });

          it('should translate accessible label with set API', () => {
            tf.set('i18n.clear', 'tyhjennä');
            expect(tf.$.clearButton.getAttribute('aria-label')).to.equal('tyhjennä');
          });
        });
      });

      describe(`error ${condition}`, () => {
        let tf, err, input, helperText;

        beforeEach(() => {
          tf = fixtureSync(makeFixture(`<${el} required error-message="ERR"></${el}>`, condition));
          input = tf.inputElement;
          err = tf.shadowRoot.querySelector('[part=error-message]');
          helperText = tf.shadowRoot.querySelector('[part=helper-text]');
        });

        it('should have an error element', () => {
          expect(err).to.be.ok;
        });

        it('should not announce the error message initially', () => {
          expect(err.getAttribute('aria-hidden')).to.equal('true');
        });

        it('should announce the error message after validation is run', () => {
          tf.validate();
          expect(window.getComputedStyle(err).display).not.to.equal('none');
          expect(err.getAttribute('aria-hidden')).to.equal('false');
        });

        it('should not announce the error message if error-message is empty', () => {
          tf.errorMessage = '';
          tf.validate();
          expect(err.getAttribute('aria-hidden')).to.equal('true');
        });

        it('should not have aria-describedby attribute if valid and no helper text', () => {
          expect(input.hasAttribute('aria-describedby')).to.be.false;
        });

        it('should have aria-describedby attribute with error message when invalid', () => {
          tf.validate();
          expect(input.getAttribute('aria-describedby')).to.equal(err.id);
        });

        it('should have aria-describedby attribute with helper text when helper property is set', () => {
          tf.helperText = 'foo';
          expect(input.getAttribute('aria-describedby')).to.equal(helperText.id);
        });

        it('should have aria-describedby with helper text and error message when helper property is set and input invalid', () => {
          tf.helperText = 'foo';
          tf.validate();
          expect(input.getAttribute('aria-describedby')).to.equal(`${helperText.id} ${err.id}`);
        });

        it('should have appropriate aria-live attribute', () => {
          expect(err.getAttribute('aria-live')).to.equal('assertive');
        });
      });

      describe(`invalid ${condition}`, () => {
        let tf, err, input;

        beforeEach(() => {
          tf = fixtureSync(makeFixture(`<${el} invalid error-message="ERR"></${el}>`, condition));
          err = tf.shadowRoot.querySelector('[part=error-message]');
          input = tf.inputElement;
        });

        it('should show the error if initially invalid', () => {
          expect(window.getComputedStyle(err).display).not.to.equal('none');
        });

        it('should be marked invalid', () => {
          expect(input.getAttribute('aria-invalid')).to.equal('true');
        });

        it('should not be marked invalid', () => {
          tf.invalid = false;
          expect(input.hasAttribute('aria-invalid')).to.be.false;
        });
      });

      describe(`multiple fields ${condition}`, () => {
        let wrapper, fields;

        beforeEach(() => {
          wrapper = fixtureSync(makeFixture(`<div><${el}></${el}><${el}></${el}></div>`, condition));
          fields = wrapper.children;
        });

        it('should have unique error identifiers', () => {
          const err0 = fields[0].shadowRoot.querySelector('[part=error-message]');
          const err1 = fields[1].shadowRoot.querySelector('[part=error-message]');
          expect(err0.id).not.to.equal(err1.id);
        });

        it('should have unique label identifiers', () => {
          const label0 = fields[0].shadowRoot.querySelector('[part=label]');
          const label1 = fields[1].shadowRoot.querySelector('[part=label]');
          expect(label0.id).not.to.equal(label1.id);
        });
      });
    });
  });

  describe('helper', () => {
    let tf, input;

    beforeEach(() => {
      tf = fixtureSync(makeFixture(`<${el} required error-message="ERR"><div slot="helper">foo</div></${el}>`));
      input = tf.inputElement;
    });

    it('should have aria-describedby with helper text and error message if slotted helper is set', () => {
      const err = tf.shadowRoot.querySelector('[part=error-message]');
      const helperText = tf.shadowRoot.querySelector('[part=helper-text]');
      tf.validate();
      expect(input.getAttribute('aria-describedby')).to.equal(`${helperText.id} ${err.id}`);
    });
  });
});
