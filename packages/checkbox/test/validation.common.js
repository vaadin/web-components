import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

describe('validation', () => {
  let checkbox, validateSpy;

  describe('initial', () => {
    beforeEach(() => {
      checkbox = document.createElement('vaadin-checkbox');
      validateSpy = sinon.spy(checkbox, 'validate');
    });

    afterEach(() => {
      checkbox.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(checkbox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the checkbox is initially checked', async () => {
      checkbox.checked = true;
      document.body.appendChild(checkbox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field is initially checked and invalid', async () => {
      checkbox.checked = true;
      checkbox.invalid = true;
      document.body.appendChild(checkbox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    beforeEach(async () => {
      checkbox = fixtureSync('<vaadin-checkbox label="Checkbox"></vaadin-checkbox>');
      await nextRender();
      validateSpy = sinon.spy(checkbox, 'validate');
    });

    it('should pass validation by default', () => {
      expect(checkbox.checkValidity()).to.be.true;
    });

    it('should validate when toggling checked property', async () => {
      checkbox.checked = true;
      await nextUpdate(checkbox);
      expect(validateSpy.calledOnce).to.be.true;

      checkbox.checked = false;
      await nextUpdate(checkbox);
      expect(validateSpy.calledTwice).to.be.true;
    });

    it('should validate on focusout', async () => {
      // Focus the checkbox.
      await sendKeys({ press: 'Tab' });
      expect(validateSpy.called).to.be.false;

      // Blur the checkbox.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      checkbox.addEventListener('validated', validatedSpy);
      checkbox.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      checkbox.addEventListener('validated', validatedSpy);
      checkbox.required = true;
      checkbox.validate();

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
        // Focus the checkbox.
        await sendKeys({ press: 'Tab' });

        // Blur the checkbox.
        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ up: 'Shift' });

        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      checkbox = fixtureSync('<vaadin-checkbox label="Checkbox" required></vaadin-checkbox>');
      await nextFrame();
    });

    it('should fail validation with checked set to false', () => {
      expect(checkbox.checkValidity()).to.be.false;
    });

    it('should pass validation with checked set to true', () => {
      checkbox.checked = true;
      expect(checkbox.checkValidity()).to.be.true;
    });

    it('should be valid after toggling a checkbox', () => {
      checkbox.click();
      expect(checkbox.invalid).to.be.false;
    });

    it('should pass validation with required set to false', () => {
      checkbox.required = false;
      expect(checkbox.invalid).to.be.false;
    });
  });
});
