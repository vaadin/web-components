import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-checkbox-group.js';

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
    let firstGlobalFocusable;

    beforeEach(async () => {
      [firstGlobalFocusable, group] = fixtureSync(
        `<div>
          <input id="first-global-focusable" />
          <vaadin-checkbox-group>
            <vaadin-checkbox name="language" value="en" label="English"></vaadin-checkbox>
            <vaadin-checkbox name="language" value="fr" label="Français"></vaadin-checkbox>
            <vaadin-checkbox name="language" value="de" label="Deutsch"></vaadin-checkbox>
          </vaadin-checkbox-group>
        </div>`,
      ).children;
      firstGlobalFocusable.focus();
      await nextRender();
      validateSpy = sinon.spy(group, 'validate');
    });

    it('should pass validation by default', () => {
      expect(group.checkValidity()).to.be.true;
    });

    it('should validate when adding a value', async () => {
      group.value = ['en', 'fr'];
      await nextUpdate(group);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate when removing a value', async () => {
      group.value = ['en', 'fr'];
      await nextUpdate(group);
      validateSpy.resetHistory();
      group.value = ['en'];
      await nextUpdate(group);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on focusout', async () => {
      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });
      expect(validateSpy.called).to.be.false;

      // Move focus out of the checkbox group.
      await sendKeys({ press: 'Shift+Tab' });
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

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      group.addEventListener('validated', validatedSpy);
      group.required = true;
      await nextUpdate(group);
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
    let checkboxes;

    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group required>
          <vaadin-checkbox name="language" value="en" label="English"></vaadin-checkbox>
          <vaadin-checkbox name="language" value="fr" label="Français"></vaadin-checkbox>
          <vaadin-checkbox name="language" value="de" label="Deutsch"></vaadin-checkbox>
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

    it('should fail validation when value set to null', () => {
      group.value = null;
      expect(group.checkValidity()).to.be.false;
    });

    it('should be valid after selecting a checkbox', async () => {
      checkboxes[0].click();
      await nextUpdate(group);
      expect(group.invalid).to.be.false;
    });

    it('should be invalid after deselecting all checkboxes', async () => {
      checkboxes[0].click();
      await nextUpdate(group);
      checkboxes[0].click();
      await nextUpdate(group);
      expect(group.invalid).to.be.true;
    });
  });
});
