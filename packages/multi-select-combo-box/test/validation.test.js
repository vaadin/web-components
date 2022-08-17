import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';

describe('validation', () => {
  let comboBox, validateSpy;

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
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.items = ['apple', 'banana'];
      validateSpy = sinon.spy(comboBox, 'validate');
    });

    it('should not validate on required change when no items are selected', () => {
      comboBox.required = true;
      expect(validateSpy.called).to.be.false;
      comboBox.required = false;
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box required></vaadin-multi-select-combo-box>`);
      comboBox.items = ['apple', 'banana'];
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
  });
});
