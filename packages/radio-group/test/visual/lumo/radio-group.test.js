import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/radio-group.css';
import '../not-animated-styles.css';
import '../../../vaadin-radio-group.js';

describe('radio-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-radio-group>
          <vaadin-radio-button value="a" label="A"></vaadin-radio-button>
          <vaadin-radio-button value="b" label="B"></vaadin-radio-button>
          <vaadin-radio-button value="c" label="C"></vaadin-radio-button>
        </vaadin-radio-group>
      `,
      div,
    );
  });

  describe('default', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });

    it('vertical', async () => {
      element.setAttribute('theme', 'vertical');
      await visualDiff(div, 'vertical');
    });

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'label');
    });

    it('label focused', async () => {
      element.label = 'Label';
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'label-focused');
    });

    it('label disabled', async () => {
      element.label = 'Label';
      element.disabled = true;
      await visualDiff(div, 'label-disabled');
    });

    it('value', async () => {
      element.value = 'a';
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

    it('wrapped', async () => {
      element.style.width = '150px';
      await visualDiff(div, 'wrapped');
    });

    it('full width', async () => {
      div.style.width = '300px';
      div.style.padding = '0';
      element.style.width = '100%';
      element.querySelectorAll('vaadin-radio-button').forEach((radio) => {
        radio.style.width = '33%';
        // Compensate inline-block whitespace
        radio.style.marginRight = '-3px';
      });
      await visualDiff(div, 'full-width');
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

      it('vertical', async () => {
        element.setAttribute('theme', 'label-aside vertical');
        await visualDiff(div, 'label-aside-vertical');
      });
    });
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('RTL basic', async () => {
      await visualDiff(div, 'rtl-basic');
    });

    it('RTL error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'rtl-error-message');
    });

    it('RTL wrapped', async () => {
      element.style.width = '150px';
      await visualDiff(div, 'rtl-wrapped');
    });
  });
});
