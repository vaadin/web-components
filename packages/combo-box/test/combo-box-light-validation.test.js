import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-combo-box-light.js';

describe('vaadin-combo-box-light - validation', () => {
  let comboBox;

  describe('basic', () => {
    let validateSpy;

    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box-light>
          <input class="input" />
        </vaadin-combo-box-light>
      `);
      comboBox.items = ['foo', 'bar', 'baz'];
      await nextRender();
      validateSpy = sinon.spy(comboBox, 'validate');
    });

    it('should pass validation by default', () => {
      expect(comboBox.checkValidity()).to.be.true;
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });

    it('should validate on blur', () => {
      comboBox.inputElement.focus();
      comboBox.inputElement.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box-light>
          <input class="input" />
        </vaadin-combo-box-light>
      `);
      comboBox.items = ['foo', 'bar', 'baz'];
      comboBox.required = true;
      await nextRender();
    });

    it('should fail validation without value', () => {
      expect(comboBox.checkValidity()).to.be.false;
      expect(comboBox.validate()).to.be.false;
      expect(comboBox.invalid).to.be.true;
    });

    it('should pass validation with a value', () => {
      comboBox.value = 'foo';
      expect(comboBox.checkValidity()).to.be.true;
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });
  });
});
