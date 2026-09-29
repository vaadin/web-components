import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './fixtures/mock-field.js';

describe('field base styles', () => {
  describe('baseline alignment', () => {
    let row, reference, fields;

    const center = (rect) => rect.top + rect.height / 2;

    // Vertical offset of the field's input text from the reference text, in a baseline-aligned row.
    // The native input stretches to the input-field part and centers its single line of text.
    const offset = (field) =>
      center(field.inputElement.getBoundingClientRect()) - center(reference.getBoundingClientRect());

    beforeEach(async () => {
      row = fixtureSync(`
        <div style="display: flex; align-items: baseline; gap: 8px">
          <span>Reference</span>
          <mock-field></mock-field>
          <mock-field label="Label"></mock-field>
          <mock-field helper-text="Helper" theme="helper-above-field"></mock-field>
        </div>
      `);
      reference = row.querySelector('span');
      fields = [...row.querySelectorAll('mock-field')];
      await nextRender();
    });

    it('should align the input text with the reference text', () => {
      fields.forEach((field) => expect(offset(field)).to.be.closeTo(0, 1));
    });

    it('should keep the input text aligned when the input field height property is set', async () => {
      row.style.setProperty('--vaadin-input-field-height', '56px');
      await nextRender();
      fields.forEach((field) => expect(offset(field)).to.be.closeTo(0, 1));
    });

    it('should keep the input text aligned when the input field height property is below content height', async () => {
      row.style.setProperty('--vaadin-input-field-height', '1px');
      await nextRender();
      fields.forEach((field) => expect(offset(field)).to.be.closeTo(0, 1));
    });

    it('should use the baseline input height property over the input field height property', async () => {
      const contentHeight = fields[0].shadowRoot.querySelector('[part="input-field"]').getBoundingClientRect().height;
      row.style.setProperty('--vaadin-input-field-height', '56px');
      row.style.setProperty('--vaadin-field-baseline-input-height', `${contentHeight}px`);
      await nextRender();
      // The guide keeps the content height while the text is centered in a taller field
      fields.forEach((field) => expect(offset(field)).to.be.closeTo((56 - contentHeight) / 2, 1));
    });
  });
});
