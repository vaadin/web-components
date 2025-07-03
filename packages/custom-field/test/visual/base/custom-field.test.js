import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-custom-field.js';

describe('custom-field', () => {
  describe('basic', () => {
    let div, element;

    beforeEach(() => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';

      element = fixtureSync(
        `
        <vaadin-custom-field>
          <input type="text" />
          <input type="number" />
        </vaadin-custom-field>
      `,
        div,
      );
    });

    it('basic', async () => {
      await visualDiff(div, 'default');
    });

    it('label', async () => {
      element.label = 'Home address';
      await visualDiff(div, 'label');
    });

    it('value', async () => {
      element.value = 'Foo street\t42';
      await visualDiff(div, 'value');
    });

    it('required', async () => {
      element.label = 'Home address';
      element.required = true;
      await visualDiff(div, 'required');
    });

    it('error message', async () => {
      element.label = 'Home address';
      element.required = true;
      element.errorMessage = 'This field is required';
      element.validate();
      await visualDiff(div, 'error-message');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'helper-text');
    });

    it('helper above field', async () => {
      element.label = 'Home address';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'helper-above-field');
      await visualDiff(div, 'helper-above-field');
    });
  });
});
