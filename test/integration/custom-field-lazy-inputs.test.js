import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/custom-field/src/vaadin-custom-field.js';

describe('custom-field inputs', () => {
  let customField;

  beforeEach(async () => {
    customField = fixtureSync(`
      <vaadin-custom-field value="01\t25">
        <vaadin-integer-field></vaadin-integer-field>
        <vaadin-integer-field></vaadin-integer-field>
      </vaadin-custom-field>
    `);

    // Ensure lazy custom element upgrade for slotted inputs.
    await import('@vaadin/integer-field/src/vaadin-integer-field.js');
  });

  it('should apply value set using attribute to inputs', () => {
    expect(customField.inputs[0].value).to.equal('01');
    expect(customField.inputs[1].value).to.equal('25');
  });
});
