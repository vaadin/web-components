import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import '@vaadin/checkbox/src/vaadin-checkbox.js';
import '@vaadin/checkbox-group/src/vaadin-checkbox-group.js';
import '@vaadin/combo-box/src/vaadin-combo-box.js';
import '@vaadin/custom-field/src/vaadin-custom-field.js';
import '@vaadin/date-picker/src/vaadin-date-picker.js';
import '@vaadin/date-time-picker/src/vaadin-date-time-picker.js';
import '@vaadin/email-field/src/vaadin-email-field.js';
import '@vaadin/form-layout/src/vaadin-form-layout.js';
import '@vaadin/integer-field/src/vaadin-integer-field.js';
import '@vaadin/multi-select-combo-box/src/vaadin-multi-select-combo-box.js';
import '@vaadin/number-field/src/vaadin-number-field.js';
import '@vaadin/password-field/src/vaadin-password-field.js';
import '@vaadin/radio-group/src/vaadin-radio-group.js';
import '@vaadin/select/src/vaadin-select.js';
import '@vaadin/slider/src/vaadin-slider.js';
import '@vaadin/switch/src/vaadin-switch.js';
import '@vaadin/text-area/src/vaadin-text-area.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/time-picker/src/vaadin-time-picker.js';

const FIELDS = [
  'vaadin-checkbox-group',
  'vaadin-combo-box',
  'vaadin-custom-field',
  'vaadin-date-picker',
  'vaadin-date-time-picker',
  'vaadin-email-field',
  'vaadin-integer-field',
  'vaadin-multi-select-combo-box',
  'vaadin-number-field',
  'vaadin-password-field',
  'vaadin-radio-group',
  'vaadin-select',
  'vaadin-slider',
  'vaadin-text-area',
  'vaadin-text-field',
  'vaadin-time-picker',
];

const CHECKABLES = [
  { tag: 'vaadin-checkbox', part: 'checkbox' },
  { tag: 'vaadin-switch', part: 'switch' },
];

describe('fields in form-layout', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-form-layout auto-responsive labels-aside max-columns="1" style="width: 40em">
        ${[...FIELDS, ...CHECKABLES.map(({ tag }) => tag)].map((tag) => `<${tag} label="Label"></${tag}>`).join('')}
      </vaadin-form-layout>
    `);
    await nextResize(layout);
  });

  FIELDS.forEach((tag) => {
    describe(tag, () => {
      let field;

      beforeEach(() => {
        field = layout.querySelector(tag);
      });

      it('should add label-aside theme variant when labels are aside', () => {
        expect(field.getAttribute('theme')).to.equal('label-aside');
      });

      it('should remove label-aside theme variant when labels are above', async () => {
        layout.labelsAside = false;
        await nextFrame();
        expect(field.hasAttribute('theme')).to.be.false;
      });
    });
  });

  CHECKABLES.forEach(({ tag, part }) => {
    describe(tag, () => {
      let checkable;

      beforeEach(() => {
        checkable = layout.querySelector(tag);
      });

      it('should not add label-aside theme variant when labels are aside', () => {
        expect(checkable.hasAttribute('theme')).to.be.false;
      });

      it('should align control with input fields when labels are aside', () => {
        const control = checkable.shadowRoot.querySelector(`[part='${part}']`);
        const inputField = layout.querySelector('vaadin-text-field').shadowRoot.querySelector("[part='input-field']");
        expect(control.getBoundingClientRect().left).to.be.closeTo(inputField.getBoundingClientRect().left, 1);
      });
    });
  });

  describe('theme attribute', () => {
    it('should keep other theme variants', async () => {
      const field = layout.querySelector('vaadin-text-field');
      layout.labelsAside = false;
      await nextFrame();
      field.setAttribute('theme', 'small');
      layout.labelsAside = true;
      await nextFrame();
      expect(field.getAttribute('theme')).to.equal('small label-aside');

      layout.labelsAside = false;
      await nextFrame();
      expect(field.getAttribute('theme')).to.equal('small');
    });

    it('should add label-aside theme variant to a field added later', async () => {
      const field = document.createElement('vaadin-text-field');
      layout.appendChild(field);
      await nextFrame();
      expect(field.getAttribute('theme')).to.equal('label-aside');
    });
  });
});
