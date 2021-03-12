import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, html } from '@open-wc/testing-helpers';
import { dispatchChange } from './common.js';
import '../vaadin-custom-field.js';

describe('custom parser and formatter', () => {
  let customField;

  beforeEach(() => {
    customField = fixtureSync(html`
      <vaadin-custom-field>
        <input type="text" />
        <input type="number" />
      </vaadin-custom-field>
    `);
  });

  it('should use custom parser if that exists', () => {
    customField.set(
      'i18n.parseValue',
      sinon.stub().callsFake((value) => {
        return value.split(' ').map((value) => parseInt(value) + 1);
      })
    );

    customField.value = '1 1';

    customField.inputs.forEach((el) => {
      expect(el.value).to.equal('2');
    });
  });

  it('should use custom formatter if that exists', () => {
    customField.set(
      'i18n.formatValue',
      sinon.stub().callsFake((inputValues) => {
        return inputValues.map((value) => parseInt(value) + 1 || '').join(' ');
      })
    );

    customField.inputs.forEach((el) => {
      el.value = '1';
      dispatchChange(el);
    });

    expect(customField.value).to.be.equal('2 2');
  });

  it('should warn if custom parser has not returned array of values', () => {
    customField.set('i18n.parseValue', () => {
      return;
    });
    sinon.stub(console, 'warn');
    customField.value = 'foo';
    expect(console.warn.callCount).to.equal(1);
  });
});
