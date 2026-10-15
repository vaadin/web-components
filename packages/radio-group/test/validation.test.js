import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-radio-group.js';

describe('validation', () => {
  let group, validateSpy;

  describe('initial', () => {
    beforeEach(() => {
      group = document.createElement('vaadin-radio-group');

      const radio = document.createElement('vaadin-radio-button');
      radio.value = '1';
      group.appendChild(radio);

      validateSpy = sinon.spy(group, 'validate');
    });

    afterEach(() => {
      group.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(group);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      group.value = '1';
      document.body.appendChild(group);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      group.value = '1';
      group.invalid = true;
      document.body.appendChild(group);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    let firstGlobalFocusable;

    beforeEach(async () => {
      [firstGlobalFocusable, group] = fixtureSync(
        `<div>
          <input id="first-global-focusable" />
          <vaadin-radio-group>
            <vaadin-radio-button label="Button 1" value="1"></vaadin-radio-button>
            <vaadin-radio-button label="Button 2" value="2"></vaadin-radio-button>
          </vaadin-radio-group>
        </div>`,
      ).children;
      firstGlobalFocusable.focus();
      await nextFrame();
      validateSpy = sinon.spy(group, 'validate');
    });

    it('should pass validation by default', () => {
      expect(group.checkValidity()).to.be.true;
    });

    it('should validate on radio button click', async () => {
      group.querySelector('vaadin-radio-button').click();
      await nextUpdate(group);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on value change', async () => {
      group.value = '1';
      await nextUpdate(group);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on focusout', async () => {
      // Focus on the first radio button.
      await sendKeys({ press: 'Tab' });
      expect(validateSpy.called).to.be.false;

      // Move focus out of the group.
      await sendKeys({ press: 'Shift+Tab' });
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      group.addEventListener('validated', validatedSpy);
      group.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      group.addEventListener('validated', validatedSpy);
      group.required = true;
      group.validate();

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
        // Focus on the first checkbox.
        await sendKeys({ press: 'Tab' });

        // Move focus out of the checkbox group.
        await sendKeys({ press: 'Shift+Tab' });

        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group required>
          <vaadin-radio-button label="Button 1" value="1"></vaadin-radio-button>
          <vaadin-radio-button label="Button 2" value="2"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextFrame();
    });

    it('should be valid by default', () => {
      expect(group.invalid).to.be.false;
    });

    it('should fail validation without value', () => {
      expect(group.checkValidity()).to.be.false;
    });

    it('should pass validation with value', () => {
      group.value = '1';
      expect(group.checkValidity()).to.be.true;
    });

    it('should be valid after selecting a radio button', () => {
      group.querySelector('vaadin-radio-button').click();
      expect(group.invalid).to.be.false;
    });
  });
});
