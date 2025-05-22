import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';

describe('validation', () => {
  let comboBox, validateSpy, changeSpy, input;

  describe('initial', () => {
    beforeEach(() => {
      comboBox = document.createElement('vaadin-multi-select-combo-box');
      comboBox.items = ['apple', 'banana'];
      validateSpy = sinon.spy(comboBox, 'validate');
    });

    afterEach(() => {
      comboBox.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(comboBox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      comboBox.selectedItems = ['apple'];
      document.body.appendChild(comboBox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      comboBox.selectedItems = ['apple'];
      comboBox.invalid = true;
      document.body.appendChild(comboBox);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.items = ['apple', 'banana'];
      await nextRender();
      input = comboBox.inputElement;
      validateSpy = sinon.spy(comboBox, 'validate');
      changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);
    });

    it('should validate on blur', () => {
      input.focus();
      input.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on outside click', () => {
      input.focus();
      input.click();
      outsideClick();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate before change event on Enter', async () => {
      input.focus();
      await sendKeys({ type: 'apple' });
      await sendKeys({ press: 'Enter' });
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should validate before change event on clear button click', () => {
      comboBox.clearButtonVisible = true;
      comboBox.value = 'apple';
      validateSpy.resetHistory();
      comboBox.$.clearButton.click();
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should not validate on required change when no items are selected', () => {
      comboBox.required = true;
      expect(validateSpy.called).to.be.false;
      comboBox.required = false;
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box required></vaadin-multi-select-combo-box>`);
      comboBox.items = ['apple', 'banana'];
      await nextRender();
    });

    it('should fail validation when selectedItems is empty', () => {
      expect(comboBox.checkValidity()).to.be.false;
    });

    it('should pass validation when selectedItems is empty and readonly', () => {
      comboBox.readonly = true;
      expect(comboBox.checkValidity()).to.be.true;
    });

    it('should pass validation when selectedItems is not empty', () => {
      comboBox.selectedItems = ['apple'];
      expect(comboBox.checkValidity()).to.be.true;
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on blur when document does not have focus', () => {
        const spy = sinon.spy(comboBox, 'validate');
        comboBox.inputElement.focus();
        comboBox.inputElement.blur();
        expect(spy.called).to.be.false;
      });
    });
  });
});
