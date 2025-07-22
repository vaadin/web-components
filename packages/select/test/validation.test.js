import { expect } from '@vaadin/chai-plugins';
import { sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-select.js';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';

describe('validation', () => {
  let select, validateSpy, valueChangedSpy, changeSpy;

  describe('basic', () => {
    beforeEach(async () => {
      select = fixtureSync(
        `<div>
          <vaadin-select></vaadin-select>
          <input id="last-global-focusable" />
        </div>`,
      ).firstElementChild;
      select.items = [
        { label: 'Option 1', value: 'option-1' },
        { label: 'Option 2', value: 'option-2' },
      ];
      await nextRender();
      validateSpy = sinon.spy(select, 'validate');
      changeSpy = sinon.spy();
      select.addEventListener('change', changeSpy);
      valueChangedSpy = sinon.spy();
      select.addEventListener('value-changed', valueChangedSpy);
    });

    it('should pass validation by default', () => {
      expect(select.checkValidity()).to.be.true;
      expect(select.validate()).to.be.true;
      expect(select.invalid).to.be.false;
    });

    it('should validate on blur', () => {
      select.focus();
      select.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on outside click', async () => {
      select.focus();
      select.click();
      await nextRender();

      await sendMouseToElement({ element: document.body, type: 'click' });
      await nextUpdate(select);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should not validate on close with Escape', async () => {
      select.focus();
      select.click();
      await nextRender();

      await sendKeys({ press: 'Escape' });
      await nextUpdate(select);
      expect(validateSpy.called).to.be.false;
    });

    it('should validate once on close with Tab', async () => {
      select.focus();
      select.click();
      await nextRender();

      await sendKeys({ press: 'Tab' });
      await nextUpdate(select);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate between value-changed and change events on Enter', async () => {
      select.focus();
      select.click();
      await nextRender();

      await sendKeys({ press: 'Enter' });
      await nextUpdate(select);
      expect(valueChangedSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledAfter(valueChangedSpy)).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should validate on value change', async () => {
      select.value = 'option-2';
      await nextUpdate(select);
      expect(validateSpy.callCount).to.be.equal(1);

      select.value = '';
      await nextUpdate(select);
      expect(validateSpy.callCount).to.be.equal(2);
    });

    it('should validate when removing required property', async () => {
      select.required = true;
      await nextUpdate(select);
      expect(validateSpy.called).to.be.false;

      select.required = false;
      await nextUpdate(select);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      select.addEventListener('validated', validatedSpy);
      select.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      select.addEventListener('validated', validatedSpy);
      select.required = true;
      await nextUpdate(select);
      select.validate();

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

      it('should not validate on blur when document does not have focus', () => {
        select.blur();
        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      select = fixtureSync('<vaadin-select required></vaadin-select>');
      select.items = [
        { label: '', value: '' },
        { label: 'Option 1', value: 'option-1' },
      ];
      await nextRender();
    });

    it('should fail validation without value', () => {
      expect(select.checkValidity()).to.be.false;
    });

    it('should pass validation without value when readonly', async () => {
      select.readonly = true;
      await nextUpdate(select);
      expect(select.checkValidity()).to.be.true;
    });

    it('should pass validation with a value', async () => {
      select.value = 'option-2';
      await nextUpdate(select);
      expect(select.checkValidity()).to.be.true;
    });

    it('should be valid when committing a non-empty value', async () => {
      select.focus();
      select.click();
      await nextRender();
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      await nextUpdate(select);
      expect(select.invalid).to.be.false;
    });

    it('should be invalid when committing an empty value', async () => {
      select.value = 'option-1';
      await nextUpdate(select);
      select.focus();
      select.click();
      await nextRender();
      await sendKeys({ press: 'ArrowUp' });
      await sendKeys({ press: 'Enter' });
      await nextUpdate(select);
      expect(select.invalid).to.be.true;
    });
  });

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      select = document.createElement('vaadin-select');
      validateSpy = sinon.spy(select, 'validate');
    });

    afterEach(() => {
      select.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(select);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      select.value = 'value';
      document.body.appendChild(select);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      select.value = 'value';
      select.invalid = true;
      document.body.appendChild(select);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });
});
