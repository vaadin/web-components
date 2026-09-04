import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-number-field.js';

describe('properties', () => {
  let numberField;

  describe('defaults', () => {
    beforeEach(async () => {
      numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
    });

    it('should have min set to undefined by default', () => {
      expect(numberField.min).to.be.undefined;
    });

    it('should have max set to undefined by default', () => {
      expect(numberField.max).to.be.undefined;
    });

    it('should have step set to undefined by default', () => {
      expect(numberField.step).to.be.undefined;
    });

    it('should have stepButtonsVisible set to false by default', () => {
      expect(numberField.stepButtonsVisible).to.be.false;
    });

    it('should have value set to empty string by default', () => {
      expect(numberField.value).to.equal('');
    });

    it('should not have step-buttons-visible attribute by default', () => {
      expect(numberField.hasAttribute('step-buttons-visible')).to.be.false;
    });
  });

  describe('attributes', () => {
    beforeEach(async () => {
      numberField = fixtureSync(`
        <vaadin-number-field
          min="-10"
          max="10"
          step="0.5"
          step-buttons-visible
          value="5"
        ></vaadin-number-field>
      `);
      await nextRender();
    });

    it('should set min property from attribute', () => {
      expect(numberField.min).to.equal(-10);
    });

    it('should set max property from attribute', () => {
      expect(numberField.max).to.equal(10);
    });

    it('should set step property from attribute', () => {
      expect(numberField.step).to.equal(0.5);
    });

    it('should set stepButtonsVisible property from attribute', () => {
      expect(numberField.stepButtonsVisible).to.be.true;
    });

    it('should set value property from attribute', () => {
      expect(numberField.value).to.equal('5');
      expect(numberField.inputElement.value).to.equal('5');
    });

    it('should keep value attribute text form as is', async () => {
      numberField = fixtureSync('<vaadin-number-field value="1.50"></vaadin-number-field>');
      await nextRender();
      expect(numberField.value).to.equal('1.50');
      expect(numberField.inputElement.value).to.equal('1.50');
    });

    it('should keep value attribute in exponent notation as is', async () => {
      numberField = fixtureSync('<vaadin-number-field value="1e3"></vaadin-number-field>');
      await nextRender();
      expect(numberField.value).to.equal('1e3');
      expect(numberField.inputElement.value).to.equal('1e3');
    });

    it('should clear non-numeric value set from attribute', async () => {
      numberField = fixtureSync('<vaadin-number-field value="foo"></vaadin-number-field>');
      await nextRender();
      expect(numberField.value).to.equal('');
      expect(numberField.inputElement.value).to.equal('');
    });
  });

  describe('reflection', () => {
    beforeEach(async () => {
      numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
    });

    it('should toggle step-buttons-visible attribute on stepButtonsVisible property change', async () => {
      numberField.stepButtonsVisible = true;
      await nextUpdate(numberField);
      expect(numberField.hasAttribute('step-buttons-visible')).to.be.true;

      numberField.stepButtonsVisible = false;
      await nextUpdate(numberField);
      expect(numberField.hasAttribute('step-buttons-visible')).to.be.false;
    });
  });
});
