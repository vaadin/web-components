import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-date-time-picker.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

const formatTime = (...args) =>
  customElements
    .get('vaadin-time-picker')
    .properties.i18n.value()
    .formatTime(...args);

const parseTime = (...args) =>
  customElements
    .get('vaadin-time-picker')
    .properties.i18n.value()
    .parseTime(...args);

customElements.define(
  'dtp-i18n-default',
  class extends PolymerElement {
    static get template() {
      return html`<vaadin-date-time-picker id="dateTimePicker" i18n="[[i18n]]"></vaadin-date-time-picker>`;
    }

    static get properties() {
      return {
        i18n: {
          type: Object,
          value: () => {
            return {
              cancel: 'Peruuta', // For date picker

              // formatTime and parseTime are needed so that time picker doesn't throw errors on init
              formatTime,
              parseTime,
            };
          },
        },
      };
    }
  },
);

customElements.define(
  'dtp-i18n-slotted',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-date-time-picker id="dateTimePicker">
          <vaadin-date-picker slot="date-picker" i18n="[[dpI18n]]"></vaadin-date-picker>
          <vaadin-time-picker slot="time-picker" i18n="[[tpI18n]]"></vaadin-time-picker>
        </vaadin-date-time-picker>
      `;
    }

    static get properties() {
      return {
        dpI18n: {
          type: Object,
          value: () => {
            return {
              cancel: 'Peruuta',
            };
          },
        },
        tpI18n: {
          type: Object,
          value: () => {
            return {
              formatTime,
              parseTime,
            };
          },
        },
      };
    }
  },
);

['default', 'slotted'].forEach((set) => {
  describe(`i18n property (${set})`, () => {
    let dateTimePicker;
    let datePicker;

    // No need for "beforeEach" to recreate the fixture before every test since these tests do not
    // modify the state but only check the initial state.
    before(() => {
      const element = fixtureSync(`<dtp-i18n-${set}></dtp-i18n-${set}>`);
      dateTimePicker = element.$.dateTimePicker;
      datePicker = dateTimePicker.querySelector('[slot="date-picker"]');
    });

    it('should have initial value for i18n', () => {
      expect(dateTimePicker.i18n).to.have.property('cancel', 'Peruuta');
      expect(datePicker.i18n).to.have.property('cancel', 'Peruuta');
    });
  });
});
