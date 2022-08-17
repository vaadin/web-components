import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';

describe('validation', () => {
  let comboBox, validateSpy;

  describe('basic', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
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
      comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
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
