import { expect } from '@vaadin/chai-plugins';
import { nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/checkbox/src/vaadin-checkbox.js';
import '@vaadin/combo-box/src/vaadin-combo-box.js';
import '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';
import '@vaadin/date-picker/src/vaadin-date-picker.js';
import '@vaadin/multi-select-combo-box/src/vaadin-multi-select-combo-box.js';
import '@vaadin/number-field/src/vaadin-number-field.js';
import '@vaadin/radio-group/src/vaadin-radio-group.js';
import '@vaadin/text-area/src/vaadin-text-area.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/time-picker/src/vaadin-time-picker.js';

describe('confirm-dialog with fields', () => {
  let dialog, field;

  [
    'checkbox',
    'combo-box',
    'date-picker',
    'number-field',
    'radio-button',
    'text-area',
    'text-field',
    'time-picker',
  ].forEach((component) => {
    describe(`confirm-dialog with ${component}`, () => {
      beforeEach(async () => {
        dialog = document.createElement('vaadin-confirm-dialog');
        field = document.createElement(`vaadin-${component}`);
        field.label = 'Label';
        if (component === 'date-picker') {
          field.autoOpenDisabled = true;
        }
        dialog.appendChild(field);
        document.body.appendChild(dialog);
        dialog.opened = true;
        await nextRender();
      });

      afterEach(() => {
        dialog.opened = false;
        document.body.removeChild(dialog);
      });

      it(`should not throw error on ${component} label click`, () => {
        expect(() => {
          field.querySelector('label').click();
        }).to.not.throw(Error);
      });
    });
  });
});
