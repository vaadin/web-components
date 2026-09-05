import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { MaskedField } from '../src/vaadin-masked-field.js';

describe('vaadin-masked-field registration', () => {
  let field;

  beforeEach(() => {
    field = fixtureSync('<vaadin-masked-field></vaadin-masked-field>');
  });

  it('should not register the element while the feature flag is unset', () => {
    expect(customElements.get('vaadin-masked-field')).to.be.undefined;
    expect(field).to.be.instanceOf(HTMLElement);
    expect(field).to.not.be.instanceOf(MaskedField);
    expect('formatMask' in field).to.be.false;
  });

  it('should register the element and upgrade it once the feature flag is set', async () => {
    window.Vaadin.featureFlags.maskedFieldComponent = true;
    await customElements.whenDefined('vaadin-masked-field');
    await nextRender();

    expect(customElements.get('vaadin-masked-field')).to.equal(MaskedField);
    expect(field).to.be.instanceOf(MaskedField);
    expect('formatMask' in field).to.be.true;
  });
});
