import { expect } from '@esm-bundle/chai';
import { nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/checkbox';
import '@vaadin/combo-box';
import '@vaadin/confirm-dialog';
import '@vaadin/date-picker';
import '@vaadin/multi-select-combo-box';
import '@vaadin/number-field';
import '@vaadin/radio-group';
import '@vaadin/text-area';
import '@vaadin/text-field';
import '@vaadin/time-picker';

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
