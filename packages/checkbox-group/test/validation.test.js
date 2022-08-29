import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-checkbox-group.js';

describe('validation', () => {
  let group, validateSpy;

  describe('initial', () => {
    beforeEach(() => {
      group = document.createElement('vaadin-checkbox-group');
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
      group.value = ['en'];
      document.body.appendChild(group);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      group.value = ['en'];
      group.invalid = true;
      document.body.appendChild(group);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox name="language" value="en" label="English">/vaadin-checkbox>
          <vaadin-checkbox name="language" value="fr" label="Français"></vaadin-checkbox>
          <vaadin-checkbox name="language" value="de" label="Deutsch">/vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      validateSpy = sinon.spy(group, 'validate');
    });

    it('should pass validation by default', () => {
      expect(group.checkValidity()).to.be.true;
    });

    it('should validate when adding a value', () => {
      group.value = ['en', 'fr'];
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate when removing a value', () => {
      group.value = ['en', 'fr'];
      validateSpy.resetHistory();
      group.value = ['en'];
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on focusout', async () => {
      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });
      expect(validateSpy.called).to.be.false;

      // Move focus out of the checkbox group.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should not validate while user is tabbing between checkboxes inside of the group', async () => {
      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });
      // Focus on the second checkbox.
      await sendKeys({ press: 'Tab' });
      expect(validateSpy.called).to.be.false;
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
  });

  describe('required', () => {
    let checkboxes;

    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group required>
          <vaadin-checkbox name="language" value="en" label="English">/vaadin-checkbox>
          <vaadin-checkbox name="language" value="fr" label="Français"></vaadin-checkbox>
          <vaadin-checkbox name="language" value="de" label="Deutsch">/vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
      validateSpy = sinon.spy(group, 'validate');
    });

    it('should fail validation without value', () => {
      expect(group.checkValidity()).to.be.false;
    });

    it('should pass validation with value', () => {
      group.value = ['en'];
      expect(group.checkValidity()).to.be.true;
    });

    it('should be valid after selecting a checkbox', () => {
      checkboxes[0].click();
      expect(group.invalid).to.be.false;
    });

    it('should be invalid after deselecting all checkboxes', () => {
      checkboxes[0].click();
      checkboxes[0].click();
      expect(group.invalid).to.be.true;
    });
  });
});
