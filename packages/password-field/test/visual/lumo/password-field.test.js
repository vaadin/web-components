import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/text-field/test/visual/not-animated-styles.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/password-field.css';
import '../../../vaadin-password-field.js';

describe('password-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-password-field></vaadin-password-field>', div);
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

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('basic', async () => {
        await visualDiff(div, `${dir}-basic`);
      });

      it('value', async () => {
        element.value = 'value';
        await visualDiff(div, `${dir}-value`);
      });

      it('clear button', async () => {
        element.value = 'value';
        element.clearButtonVisible = true;
        await visualDiff(div, `${dir}-clear-button`);
      });

      it('reveal button hidden', async () => {
        element.value = 'value';
        element.revealButtonHidden = true;
        await visualDiff(div, `${dir}-reveal-button-hidden`);
      });

      it('reveal button focus', async () => {
        element.label = 'Password';
        element.focus();
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, `${dir}-reveal-button-focus`);
      });
    });
  });
});
