import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-toggle-switch.js';

describe('validation', () => {
  let toggle, validateSpy;

  describe('initial', () => {
    beforeEach(() => {
      toggle = document.createElement('vaadin-toggle-switch');
      validateSpy = sinon.spy(toggle, 'validate');
    });

    afterEach(() => {
      toggle.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(toggle);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the toggle switch is initially checked', async () => {
      toggle.checked = true;
      document.body.appendChild(toggle);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field is initially checked and invalid', async () => {
      toggle.checked = true;
      toggle.invalid = true;
      document.body.appendChild(toggle);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    beforeEach(async () => {
      toggle = fixtureSync(
        `<div>
          <vaadin-toggle-switch label="Toggle"></vaadin-toggle-switch>
          <input id="last-global-focusable" />
        </div>`,
      ).firstElementChild;
      await nextRender();
      validateSpy = sinon.spy(toggle, 'validate');
    });

    it('should pass validation by default', () => {
      expect(toggle.checkValidity()).to.be.true;
    });

    it('should validate when toggling checked property', () => {
      toggle.checked = true;
      expect(validateSpy.calledOnce).to.be.true;

      toggle.checked = false;
      expect(validateSpy.calledTwice).to.be.true;
    });

    it('should validate on focusout', async () => {
      // Focus the toggle switch.
      await sendKeys({ press: 'Tab' });
      expect(validateSpy.called).to.be.false;

      // Blur the toggle switch.
      await sendKeys({ press: 'Tab' });

      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      toggle.addEventListener('validated', validatedSpy);
      toggle.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      toggle.addEventListener('validated', validatedSpy);
      toggle.required = true;
      toggle.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on blur when document does not have focus', async () => {
        // Focus the toggle switch.
        await sendKeys({ press: 'Tab' });

        // Blur the toggle switch.
        await sendKeys({ press: 'Shift+Tab' });

        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      toggle = fixtureSync('<vaadin-toggle-switch label="Toggle" required></vaadin-toggle-switch>');
      await nextFrame();
    });

    it('should fail validation with checked set to false', () => {
      expect(toggle.checkValidity()).to.be.false;
    });

    it('should pass validation with checked set to true', () => {
      toggle.checked = true;
      expect(toggle.checkValidity()).to.be.true;
    });

    it('should be valid after toggling', () => {
      toggle.click();
      expect(toggle.invalid).to.be.false;
    });

    it('should pass validation with required set to false', () => {
      toggle.required = false;
      expect(toggle.invalid).to.be.false;
    });
  });
});
