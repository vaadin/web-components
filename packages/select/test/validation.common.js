import { expect } from '@esm-bundle/chai';
import {
  enterKeyDown,
  escKeyDown,
  fixtureSync,
  nextRender,
  nextUpdate,
  oneEvent,
  outsideClick,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';

describe('validation', () => {
  let select, valueButton, validateSpy, changeSpy;

  describe('basic', () => {
    beforeEach(async () => {
      select = fixtureSync('<vaadin-select></vaadin-select>');
      select.items = [
        { label: 'Option 1', value: '' },
        { label: 'Option 2', value: 'option-2' },
        { label: 'Option 3', value: 'option-3' },
      ];
      await nextRender();
      valueButton = select.querySelector('vaadin-select-value-button');
      validateSpy = sinon.spy(select, 'validate');
      changeSpy = sinon.spy();
      select.addEventListener('change', changeSpy);
    });

    it('should pass the validation when the field is valid', () => {
      select.validate();
      expect(select.checkValidity()).to.be.true;
      expect(select.invalid).to.be.false;
    });

    it('should not pass the validation when the field is required and has no value', async () => {
      select.required = true;
      await nextUpdate(select);

      enterKeyDown(valueButton);
      await oneEvent(select._overlayElement, 'vaadin-overlay-open');

      escKeyDown(select._items[2]);
      await nextUpdate(select);

      expect(select.checkValidity()).to.be.false;
      expect(select.invalid).to.be.true;
    });

    it('should pass the validation when the field is required and readonly', async () => {
      select.required = true;
      select.readonly = true;
      await nextUpdate(select);

      select.validate();

      expect(select.checkValidity()).to.be.true;
    });

    it('should validate when required property is removed', async () => {
      select.required = true;
      await nextUpdate(select);

      select.required = false;
      await nextUpdate(select);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should update invalid state when required property is removed', async () => {
      select.required = true;
      await nextUpdate(select);

      select.validate();
      expect(select.invalid).to.be.true;

      select.required = false;
      await nextUpdate(select);
      expect(select.invalid).to.be.false;
    });

    it('should validate on blur', () => {
      select.focus();
      select.blur();
      expect(validateSpy.called).to.be.true;
    });

    it('should validate on programmatic blur', () => {
      select.blur();
      expect(validateSpy.called).to.be.true;
    });

    it('should validate on outside click', async () => {
      select.focus();
      valueButton.click();
      await nextRender();

      outsideClick();
      await nextUpdate(select);
      expect(validateSpy.called).to.be.true;
    });

    it('should validate before change event on Enter', async () => {
      select.focus();
      valueButton.click();
      await nextRender();

      await sendKeys({ press: 'Enter' });
      await nextUpdate(select);
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.called).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should validate when setting value property', async () => {
      select.value = 'option-2';
      await nextUpdate(select);
      expect(validateSpy.callCount).to.be.equal(1);

      select.value = '';
      await nextUpdate(select);
      expect(validateSpy.callCount).to.be.equal(2);
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
