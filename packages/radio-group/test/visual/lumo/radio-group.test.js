import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-radio-group.js';

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
        // compensate inline-block whitespace
        radio.style.marginRight = '-3px';
      });
      await visualDiff(div, 'full-width');
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
