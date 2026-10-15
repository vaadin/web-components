import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, tabKeyDown } from '@vaadin/testing-helpers';
import '../src/vaadin-custom-field.js';

describe('keyboard navigation', () => {
  let customField;

  describe('default', () => {
    beforeEach(async () => {
      customField = fixtureSync(`
        <vaadin-custom-field>
          <input type="text">
          <input type="text">
          <input type="number">
          <input type="number">
        </vaadin-custom-field>
      `);
      await nextRender();
    });

    describe('value change', () => {
      it('should update the value on Tab from the last input', () => {
        customField.inputs[3].value = 1;
        tabKeyDown(customField.inputs[3]);
        expect(customField.value).to.equal('\t\t\t1');
      });

      it('should update the value on Shift Tab from the first input', () => {
        customField.inputs[0].value = 1;
        tabKeyDown(customField.inputs[0], ['shift']);
        expect(customField.value).to.equal('1\t\t\t');
      });
    });
  });
});
