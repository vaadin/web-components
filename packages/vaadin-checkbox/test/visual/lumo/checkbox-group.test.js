import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-checkbox-group.js';

describe('checkbox-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-checkbox-group>
          <vaadin-checkbox value="a">A</vaadin-checkbox>
          <vaadin-checkbox value="b">B</vaadin-checkbox>
          <vaadin-checkbox value="c">C</vaadin-checkbox>
        </vaadin-checkbox-group>
      `,
      div
    );
  });

  describe('default', () => {
    it('basic', async () => {
      await visualDiff(div, 'checkbox-group:basic');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'checkbox-group:disabled');
    });

    it('vertical', async () => {
      element.setAttribute('theme', 'vertical');
      await visualDiff(div, 'checkbox-group:vertical');
    });

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'checkbox-group:label');
    });

    it('value', async () => {
      element.value = ['a', 'c'];
      await visualDiff(div, 'checkbox-group:value');
    });

    it('required', async () => {
      element.label = 'Label';
      element.required = true;
      await visualDiff(div, 'checkbox-group:required');
    });

    it('error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'checkbox-group:error-message');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'checkbox-group:helper-text');
    });

    it('wrapped', async () => {
      element.style.width = '150px';
      await visualDiff(div, 'checkbox-group:wrapped');
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
      await visualDiff(div, 'checkbox-group:rtl-basic');
    });

    it('RTL error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'checkbox-group:rtl-error-message');
    });

    it('RTL wrapped', async () => {
      element.style.width = '150px';
      await visualDiff(div, 'checkbox-group:rtl-wrapped');
    });
  });
});
