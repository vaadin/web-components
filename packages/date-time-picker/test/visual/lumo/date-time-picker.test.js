import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/date-time-picker.css';
import '@vaadin/date-picker/test/not-animated-styles.css';
import '@vaadin/time-picker/test/not-animated-styles.css';
import '../not-animated-styles.css';
import '../../../vaadin-date-time-picker.js';

describe('date-time-picker', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>', div);
  });

  describe('default', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'readonly');
    });

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'label');
    });

    it('placeholder', async () => {
      element.datePlaceholder = 'Date';
      element.timePlaceholder = 'Time';
      await visualDiff(div, 'placeholder');
    });

    it('value', async () => {
      element.value = '2019-09-16T15:00';
      await visualDiff(div, 'value');
    });

    it('required', async () => {
      element.label = 'Label';
      element.required = true;
      await visualDiff(div, 'required');
    });

    it('error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'error-message');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'helper-text');
    });

    it('helper above field', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'helper-above-field');
      await visualDiff(div, 'helper-above-field');
    });

    describe('label aside', () => {
      beforeEach(() => {
        element.setAttribute('theme', 'label-aside');
        element.label = 'Label';
      });

      it('default', async () => {
        await visualDiff(div, 'label-aside');
      });

      it('no label', async () => {
        element.label = '';
        await visualDiff(div, 'label-aside-no-label');
      });

      it('wrapped label', async () => {
        element.label = 'Label that wraps on multiple lines';
        element.style.setProperty('--vaadin-input-field-label-aside-width', '8em');
        await visualDiff(div, 'label-aside-wrapped-label');
      });

      it('required', async () => {
        element.required = true;
        await visualDiff(div, 'label-aside-required');
      });

      it('helper text', async () => {
        element.helperText = 'Helper text';
        await visualDiff(div, 'label-aside-helper-text');
      });

      it('error message', async () => {
        element.errorMessage = 'This field is required';
        element.invalid = true;
        await visualDiff(div, 'label-aside-error-message');
      });

      it('helper above field', async () => {
        element.helperText = 'Helper text';
        element.setAttribute('theme', 'label-aside helper-above-field');
        await visualDiff(div, 'label-aside-helper-above-field');
      });

      it('custom width and gap', async () => {
        element.style.setProperty('--vaadin-input-field-label-aside-width', '6em');
        element.style.setProperty('--vaadin-input-field-label-aside-gap', '2em');
        await visualDiff(div, 'label-aside-custom-width-gap');
      });

      it('RTL', async () => {
        element.setAttribute('dir', 'rtl');
        element.required = true;
        element.helperText = 'Helper text';
        await visualDiff(div, 'label-aside-rtl');
      });

      it('small', async () => {
        element.setAttribute('theme', 'label-aside small');
        await visualDiff(div, 'label-aside-small');
      });
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      element.label = 'Label';
      element.autoOpenDisabled = true;
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('keyboard focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'keyboard-focus-ring');
    });

    it('pointer focus-ring disabled', async () => {
      const picker = element.querySelector('[slot="date-picker"]');
      await sendMouseToElement({ type: 'click', element: picker });
      await visualDiff(div, 'pointer-focus-ring-disabled');
    });

    it('pointer focus-ring enabled', async () => {
      element.style.setProperty('--lumo-input-field-pointer-focus-visible', '1');
      const picker = element.querySelector('[slot="date-picker"]');
      await sendMouseToElement({ type: 'click', element: picker });
      await visualDiff(div, 'pointer-focus-ring-enabled');
    });
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('RTL', async () => {
      await visualDiff(div, 'rtl-basic');
    });

    it('RTL error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'rtl-error-message');
    });
  });
});
