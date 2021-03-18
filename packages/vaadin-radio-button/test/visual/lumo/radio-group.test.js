import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
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
          <vaadin-radio-button value="a">A</vaadin-radio-button>
          <vaadin-radio-button value="b">B</vaadin-radio-button>
          <vaadin-radio-button value="c">C</vaadin-radio-button>
        </vaadin-radio-group>
      `,
      div
    );
  });

  describe('default', () => {
    it('basic', async () => {
      await visualDiff(div, 'radio-group:basic');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'radio-group:disabled');
    });

    it('vertical', async () => {
      element.setAttribute('theme', 'vertical');
      await visualDiff(div, 'radio-group:vertical');
    });

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'radio-group:label');
    });

    it('value', async () => {
      element.value = 'a';
      await visualDiff(div, 'radio-group:value');
    });

    it('required', async () => {
      element.label = 'Label';
      element.required = true;
      await visualDiff(div, 'radio-group:required');
    });

    it('error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'radio-group:error-message');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'radio-group:helper-text');
    });

    it('wrapped', async () => {
      element.style.width = '150px';
      await visualDiff(div, 'radio-group:wrapped');
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
      await visualDiff(div, 'radio-group:rtl-basic');
    });

    it('RTL error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'radio-group:rtl-error-message');
    });

    it('RTL wrapped', async () => {
      element.style.width = '150px';
      await visualDiff(div, 'radio-group:rtl-wrapped');
    });
  });
});
