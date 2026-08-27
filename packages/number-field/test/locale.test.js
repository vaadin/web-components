import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-number-field.js';

describe('locale', () => {
  let numberField, input;

  async function fixture(template) {
    numberField = fixtureSync(template);
    await nextRender();
    input = numberField.inputElement;
  }

  describe('de-DE', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field locale="de-DE"></vaadin-number-field>');
      input.focus();
    });

    it('should parse typed value with comma as decimal separator', async () => {
      await sendKeys({ type: '1234,5' });
      input.blur();
      expect(numberField.value).to.equal('1234.5');
    });

    it('should parse typed value with dot as group separator', async () => {
      await sendKeys({ type: '1.234,5' });
      input.blur();
      expect(numberField.value).to.equal('1234.5');
    });

    it('should reject typed value with group separator after decimal separator', async () => {
      await sendKeys({ type: '1,234.5' });
      input.blur();
      expect(numberField.value).to.equal('');
      expect(numberField.invalid).to.be.true;
      expect(input.value).to.equal('1,234.5');
    });

    it('should format presentation value on commit', async () => {
      await sendKeys({ type: '1234,5' });
      input.blur();
      expect(input.value).to.equal('1.234,5');
    });

    it('should format presentation value on programmatic value set', async () => {
      numberField.value = '1234.5';
      await nextUpdate(numberField);
      expect(input.value).to.equal('1.234,5');
    });

    it('should format initial value set as an attribute', async () => {
      await fixture('<vaadin-number-field locale="de-DE" value="1234.5"></vaadin-number-field>');
      expect(input.value).to.equal('1.234,5');
      expect(numberField.value).to.equal('1234.5');
    });

    it('should warn and clear a localized value set programmatically', async () => {
      numberField.value = '1,5';
      await nextUpdate(numberField);
      expect(numberField.value).to.equal('');
    });

    it('should step by one step on increase button click', async () => {
      numberField.value = '1234.5';
      await nextUpdate(numberField);
      numberField.shadowRoot.querySelector('[part~="increase-button"]').click();
      await nextUpdate(numberField);
      expect(numberField.value).to.equal('1235');
    });
  });

  describe('fr-FR', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field locale="fr-FR"></vaadin-number-field>');
      input.focus();
    });

    it('should format group separator as whitespace', async () => {
      numberField.value = '1234.5';
      await nextUpdate(numberField);
      expect(input.value).to.match(/^1[ \u00A0\u202F]234,5$/u);
    });

    it('should parse typed value grouped with a regular space', async () => {
      await sendKeys({ type: '1 234,5' });
      input.blur();
      expect(numberField.value).to.equal('1234.5');
    });
  });

  describe('ru-RU', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field locale="ru-RU"></vaadin-number-field>');
      input.focus();
    });

    it('should round-trip the formatted presentation value', async () => {
      numberField.value = '1234.5';
      await nextUpdate(numberField);
      const formatted = input.value;
      expect(formatted).to.match(/^1[ \u00A0\u202F]234,5$/u);

      numberField.value = '';
      await nextUpdate(numberField);
      input.focus();
      await sendKeys({ type: formatted });
      input.blur();
      expect(numberField.value).to.equal('1234.5');
    });
  });

  describe('en-IN', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field locale="en-IN"></vaadin-number-field>');
      input.focus();
    });

    it('should format using lakh grouping', async () => {
      numberField.value = '1234567';
      await nextUpdate(numberField);
      expect(input.value).to.equal('12,34,567');
    });

    it('should parse typed lakh-grouped value', async () => {
      await sendKeys({ type: '12,34,567' });
      input.blur();
      expect(numberField.value).to.equal('1234567');
    });
  });

  describe('sv-SE', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field locale="sv-SE"></vaadin-number-field>');
      input.focus();
    });

    it('should format negative value with minus sign U+2212', async () => {
      numberField.value = '-5';
      await nextUpdate(numberField);
      expect(input.value).to.equal('−5');
    });

    it('should parse typed value with minus sign U+2212', async () => {
      await sendKeys({ type: '−5' });
      input.blur();
      expect(numberField.value).to.equal('-5');
    });
  });

  describe('format options', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field locale="en-US"></vaadin-number-field>');
      numberField.formatOptions = { maximumFractionDigits: 2 };
      numberField.value = '1.239';
      await nextUpdate(numberField);
    });

    it('should only affect the presentation when rounding', () => {
      expect(input.value).to.equal('1.24');
      expect(numberField.value).to.equal('1.239');
    });

    it('should keep the value on focus and blur cycle', async () => {
      input.focus();
      input.blur();
      await nextUpdate(numberField);
      expect(numberField.value).to.equal('1.239');
      expect(input.value).to.equal('1.24');
    });

    it('should step from the value, not from the rounded presentation', async () => {
      numberField.step = 0.001;
      await nextUpdate(numberField);
      numberField.shadowRoot.querySelector('[part~="increase-button"]').click();
      await nextUpdate(numberField);
      expect(numberField.value).to.equal('1.24');
    });

    it('should format without group separators when grouping is disabled', async () => {
      numberField.formatOptions = { useGrouping: false };
      numberField.value = '1234.5';
      await nextUpdate(numberField);
      expect(input.value).to.equal('1234.5');
    });
  });

  describe('currency format options', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field locale="de-DE" value="1234.5"></vaadin-number-field>');
      numberField.formatOptions = { style: 'currency', currency: 'EUR' };
      await nextUpdate(numberField);
    });

    it('should format presentation value with the currency affix', () => {
      expect(input.value).to.equal('1.234,50\u00A0€');
    });

    it('should keep the value when the formatted text is edited', async () => {
      input.focus();
      input.setSelectionRange(0, 1);
      await sendKeys({ type: '2' });
      input.blur();
      expect(numberField.value).to.equal('2234.50');
      expect(input.value).to.equal('2.234,50\u00A0€');
    });

    it('should parse typed value without the currency affix', async () => {
      input.focus();
      input.select();
      await sendKeys({ type: '2000' });
      input.blur();
      expect(numberField.value).to.equal('2000');
      expect(input.value).to.equal('2.000,00\u00A0€');
    });

    it('should allow typing the currency affix characters', async () => {
      input.focus();
      input.select();
      await sendKeys({ type: '99 €' });
      input.blur();
      expect(numberField.value).to.equal('99');
    });
  });

  describe('unsupported format options', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field locale="en-US" value="0.5"></vaadin-number-field>');
    });

    it('should ignore the percent style', async () => {
      numberField.formatOptions = { style: 'percent' };
      await nextUpdate(numberField);
      expect(numberField.value).to.equal('0.5');
      expect(input.value).to.equal('0.5');
    });

    it('should ignore the compact notation', async () => {
      numberField.value = '1234567';
      numberField.formatOptions = { notation: 'compact' };
      await nextUpdate(numberField);
      expect(input.value).to.equal('1,234,567');
    });
  });

  describe('locale change', () => {
    beforeEach(async () => {
      await fixture('<vaadin-number-field value="1234.5"></vaadin-number-field>');
    });

    it('should reformat the presentation value on locale change', async () => {
      numberField.locale = 'de-DE';
      await nextUpdate(numberField);
      expect(input.value).to.equal('1.234,5');
    });

    it('should keep the value on locale change', async () => {
      numberField.locale = 'de-DE';
      await nextUpdate(numberField);
      expect(numberField.value).to.equal('1234.5');
    });

    it('should fall back to the default locale for an invalid locale', async () => {
      numberField.locale = 'not!a!locale';
      await nextUpdate(numberField);
      expect(numberField.value).to.equal('1234.5');
      expect(input.value).to.not.equal('');
    });
  });
});
