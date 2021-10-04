import { expect } from '@esm-bundle/chai';
import { fixtureSync, arrowDownKeyDown, escKeyDown } from '@vaadin/testing-helpers';
import '../src/vaadin-time-picker.js';

describe('ARIA', () => {
  let timePicker, comboBox, input, label, helper, error;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker helper-text="Time slot"></vaadin-time-picker>`);
    comboBox = timePicker.$.comboBox;
    input = timePicker.inputElement;
    label = timePicker.querySelector('[slot=label]');
    error = timePicker.querySelector('[slot=error-message]');
    helper = timePicker.querySelector('[slot=helper]');
  });

  afterEach(() => {
    comboBox.opened = false;
  });

  describe('default', () => {
    it('should set role attribute on the native input', () => {
      expect(input.getAttribute('role')).to.equal('combobox');
    });

    it('should set aria-autocomplete attribute on the native input', () => {
      expect(input.getAttribute('aria-autocomplete')).to.equal('list');
    });

    it('should set aria-labelledby attribute on the native input', () => {
      expect(input.getAttribute('aria-labelledby')).to.equal(label.id);
    });

    it('should set aria-describedby with helper text ID when valid', () => {
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.not.include(error.id);
    });

    it('should add error message ID to aria-describedby when invalid', () => {
      timePicker.invalid = true;
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.include(error.id);
    });
  });

  describe('opened', () => {
    beforeEach(() => {
      arrowDownKeyDown(input);
    });

    it('should set role listbox on the scroller', () => {
      const scroller = comboBox.$.dropdown._scroller;
      expect(scroller.getAttribute('role')).to.equal('listbox');
    });

    it('should set aria-expanded attribute when opened', () => {
      expect(input.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should unset aria-expanded attribute when closed', () => {
      escKeyDown(input);

      expect(input.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should set selection aria attributes when focusing an item', () => {
      timePicker.value = '00:00';
      arrowDownKeyDown(input); // 'focus moves to 2nd item'

      const items = comboBox.$.dropdown._scroller.querySelectorAll('vaadin-time-picker-item');
      expect(items[0].getAttribute('role')).to.equal('option');
      expect(items[0].getAttribute('aria-selected')).to.equal('false');
      expect(items[1].getAttribute('aria-selected')).to.equal('true');
    });
  });
});
