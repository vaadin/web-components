import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { formatISOTime, parseISOTime } from '@vaadin/time-picker/src/vaadin-time-picker-helper.js';

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
              formatTime: formatISOTime,
              parseTime: parseISOTime,
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
              formatTime: formatISOTime,
              parseTime: parseISOTime,
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
    before(async () => {
      const element = fixtureSync(`<dtp-i18n-${set}></dtp-i18n-${set}>`);
      await nextRender();
      dateTimePicker = element.$.dateTimePicker;
      datePicker = dateTimePicker.querySelector('[slot="date-picker"]');
    });

    it('should have initial value for i18n', () => {
      expect(dateTimePicker.i18n).to.have.property('cancel', 'Peruuta');
      expect(datePicker.i18n).to.have.property('cancel', 'Peruuta');
    });
  });
});

describe('setting i18n on a slotted picker before connected to the DOM', () => {
  let dateTimePicker, datePicker;

  beforeEach(() => {
    dateTimePicker = document.createElement('vaadin-date-time-picker');
  });

  describe('date-picker', () => {
    beforeEach(() => {
      datePicker = document.createElement('vaadin-date-picker');
      datePicker.slot = 'date-picker';
      datePicker.i18n = { ...datePicker.i18n, cancel: 'Peruuta' };
      dateTimePicker.appendChild(datePicker);
    });

    it('should not have i18n overridden', async () => {
      await aTimeout(0);
      document.body.appendChild(dateTimePicker);
      await nextRender();
      expect(datePicker.i18n.cancel).to.equal('Peruuta');
    });
  });
});

describe('accessibility', () => {
  ['date', 'time'].forEach((part) => {
    let dateTimePicker, pickerFocusElement;

    beforeEach(async () => {
      dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
      await nextRender();
      pickerFocusElement = dateTimePicker.querySelector(`[slot=${part}-picker]`).focusElement;
    });

    it(`should be undefined by default`, () => {
      expect(dateTimePicker.i18n[`${part}Label`]).to.be.undefined;
      expect(pickerFocusElement.getAttribute('aria-label')).to.be.null;
    });

    it(`should update aria-label of ${part}-picker when ${part}Label is changed`, async () => {
      dateTimePicker.i18n = { ...dateTimePicker.i18n, [`${part}Label`]: 'picker-label' };
      await nextFrame();
      expect(pickerFocusElement.getAttribute('aria-label')).to.equal('picker-label');
    });

    it(`should remove aria-label of ${part}-picker when ${part}Label is set to null`, async () => {
      const originalI18n = dateTimePicker.i18n;
      dateTimePicker.i18n = { ...originalI18n, [`${part}Label`]: 'picker-label' };
      await nextFrame();
      dateTimePicker.i18n = originalI18n;
      await nextFrame();
      expect(pickerFocusElement.getAttribute('aria-label')).to.be.null;
    });

    it(`should prepend ${part}Label value with date-time-picker accessible-name value`, async () => {
      dateTimePicker.accessibleName = 'dtp-accessible-name';
      dateTimePicker.i18n = { ...dateTimePicker.i18n, [`${part}Label`]: 'picker-label' };
      await nextFrame();
      expect(pickerFocusElement.getAttribute('aria-label')).to.equal('dtp-accessible-name picker-label');
    });

    it(`should prepend ${part}Label value with date-time-picker label value`, async () => {
      dateTimePicker.label = 'dtp-label';
      dateTimePicker.i18n = { ...dateTimePicker.i18n, [`${part}Label`]: 'picker-label' };
      await nextFrame();
      expect(pickerFocusElement.getAttribute('aria-label')).to.equal('dtp-label picker-label');
    });

    it(`should prepend ${part}label value with date-time-picker accessible-name value when label also set`, async () => {
      dateTimePicker.label = 'dtp-label';
      dateTimePicker.accessibleName = 'dtp-accessible-name';
      dateTimePicker.i18n = { ...dateTimePicker.i18n, [`${part}Label`]: 'picker-label' };
      await nextFrame();
      expect(pickerFocusElement.getAttribute('aria-label')).to.equal('dtp-accessible-name picker-label');
    });

    describe('property set before attach', () => {
      beforeEach(async () => {
        const parent = fixtureSync('<div></div>');
        dateTimePicker = document.createElement('vaadin-date-time-picker');
        dateTimePicker.label = 'dtp-label';
        dateTimePicker.accessibleName = 'dtp-accessible-name';
        dateTimePicker.i18n = { ...dateTimePicker.i18n, [`${part}Label`]: 'picker-label' };

        parent.appendChild(dateTimePicker);
        await nextRender();
        pickerFocusElement = dateTimePicker.querySelector(`[slot=${part}-picker]`).focusElement;
      });

      it(`should have accessible-name + ${part}Label set on the input`, () => {
        expect(pickerFocusElement.getAttribute('aria-label')).to.equal('dtp-accessible-name picker-label');
      });

      it(`should use label + ${part}Label if accessible-name is removed`, async () => {
        dateTimePicker.accessibleName = null;
        await nextFrame();
        expect(pickerFocusElement.getAttribute('aria-label')).to.equal('dtp-label picker-label');
      });

      it(`should use ${part}Label if accessible-name and label are removed`, async () => {
        dateTimePicker.accessibleName = null;
        dateTimePicker.label = null;
        await nextFrame();
        expect(pickerFocusElement.getAttribute('aria-label')).to.equal('picker-label');
      });
    });
  });
});
