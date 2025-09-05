import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-date-time-picker.js';

describe('i18n property', () => {
  let dateTimePicker, datePicker, timePicker;

  beforeEach(async () => {
    dateTimePicker = fixtureSync(`<vaadin-date-time-picker></vaadin-date-time-picker>`);
    await nextRender();
    datePicker = dateTimePicker.querySelector('[slot="date-picker"]');
    timePicker = dateTimePicker.querySelector('[slot="time-picker"]');
  });

  it('should have default i18n properties coming from date and time pickers', () => {
    // From date picker
    expect(dateTimePicker.i18n).to.have.property('formatDate').that.is.a('function');
    expect(dateTimePicker.i18n).to.have.property('parseDate').that.is.a('function');
    expect(dateTimePicker.i18n).to.have.property('cancel').that.is.a('string');
    // From time picker
    expect(dateTimePicker.i18n).to.have.property('formatTime').that.is.a('function');
    expect(dateTimePicker.i18n).to.have.property('parseTime').that.is.a('function');
  });

  it('should propagate relevant properties to sub-components', () => {
    dateTimePicker.i18n = { cancel: 'Peruuta' };

    expect(datePicker.i18n).to.have.property('cancel', 'Peruuta');
    expect(timePicker.i18n).to.not.have.property('cancel');

    const parseTime = () => {};
    dateTimePicker.i18n = { parseTime };

    expect(timePicker.i18n).to.have.property('parseTime', parseTime);
    expect(datePicker.i18n).to.not.have.property('parseTime');
  });

  it('should fall back to default values', () => {
    dateTimePicker.i18n = {};

    expect(datePicker.i18n.cancel).to.equal('Cancel');
    expect(timePicker.i18n).to.have.property('formatTime').that.is.a('function');
  });

  it('should initialize property from JSON string', () => {
    const i18nJson = JSON.stringify({ cancel: 'Peruuta' });
    dateTimePicker = fixtureSync(`<vaadin-date-time-picker i18n='${i18nJson}'></vaadin-date-time-picker>`);
    datePicker = dateTimePicker.querySelector('[slot="date-picker"]');

    expect(dateTimePicker.i18n).to.have.property('cancel', 'Peruuta');
    expect(datePicker.i18n).to.have.property('cancel', 'Peruuta');
  });

  describe('slotted date and time pickers', () => {
    beforeEach(() => {
      dateTimePicker = fixtureSync(`
        <vaadin-date-time-picker>
          <vaadin-date-picker slot="date-picker"></vaadin-date-picker>
          <vaadin-time-picker slot="time-picker"></vaadin-time-picker>
        </vaadin-date-time-picker>
      `);
      datePicker = dateTimePicker.querySelector('[slot="date-picker"]');
      timePicker = dateTimePicker.querySelector('[slot="time-picker"]');
    });

    it('should not override i18n of slotted date and time pickers', () => {
      const i18n = { cancel: 'Peruuta', formatDate: () => 'formatted-date' };
      dateTimePicker.i18n = i18n;

      expect(datePicker.i18n.cancel).to.not.equal(i18n.cancel);
      expect(datePicker.i18n.formatDate).to.not.equal(i18n.formatDate);
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
