import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../fixtures/mock-field.js';

describe('field-base', () => {
  let div, element;

  beforeEach(() => {
    div = fixtureSync(`
      <div style="width: fit-content; padding: 10px">
        Baseline
        <mock-field></mock-field>
      </div>
    `);
    element = div.querySelector('mock-field');
  });

  describe('features', () => {
    ['ltr', 'rtl'].forEach((dir) => {
      describe(dir, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it('default', async () => {
          await visualDiff(div, `${dir}-default`);
        });

        it('label', async () => {
          element.label = 'Label';
          await visualDiff(div, `${dir}-label`);
        });

        it('required', async () => {
          element.label = 'Label';
          element.required = true;
          await visualDiff(div, `${dir}-required`);
        });

        it('clear button', async () => {
          element.value = 'Value';
          element.clearButtonVisible = true;
          await visualDiff(div, `${dir}-clear-button`);
        });

        it('error message', async () => {
          element.errorMessage = 'This field is required';
          element.required = true;
          element.validate();
          await visualDiff(div, `${dir}-error-message`);
        });

        it('helper text', async () => {
          element.helperText = 'Helper text';
          await visualDiff(div, `${dir}-helper-text`);
        });

        it('helper above field', async () => {
          element.helperText = 'Helper text';
          element.setAttribute('theme', 'helper-above-field');
          await visualDiff(div, `${dir}-helper-above-field`);
        });

        it('label and helper above field', async () => {
          element.label = 'Label';
          element.helperText = 'Helper text';
          element.setAttribute('theme', 'helper-above-field');
          await visualDiff(div, `${dir}-label-helper-above-field`);
        });
      });
    });
  });

  describe('label aside', () => {
    ['ltr', 'rtl'].forEach((dir) => {
      describe(dir, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        beforeEach(() => {
          element.label = 'Label';
          element.setAttribute('theme', 'label-aside');
        });

        it('default', async () => {
          await visualDiff(div, `${dir}-label-aside`);
        });

        it('no label', async () => {
          element.label = null;
          await visualDiff(div, `${dir}-label-aside-no-label`);
        });

        it('short label', async () => {
          element.label = 'ID';
          await visualDiff(div, `${dir}-label-aside-short-label`);
        });

        it('wrapped label', async () => {
          element.label = 'Label that wraps on multiple lines';
          element.style.setProperty('--vaadin-input-field-label-aside-width', '8em');
          await visualDiff(div, `${dir}-label-aside-wrapped-label`);
        });

        it('required', async () => {
          element.required = true;
          await visualDiff(div, `${dir}-label-aside-required`);
        });

        it('error message', async () => {
          element.errorMessage = 'This field is required';
          element.invalid = true;
          await visualDiff(div, `${dir}-label-aside-error-message`);
        });

        it('helper text', async () => {
          element.helperText = 'Helper text';
          await visualDiff(div, `${dir}-label-aside-helper-text`);
        });

        it('helper above field', async () => {
          element.helperText = 'Helper text';
          element.setAttribute('theme', 'label-aside helper-above-field');
          await visualDiff(div, `${dir}-label-aside-helper-above-field`);
        });

        it('custom label width and gap', async () => {
          element.style.setProperty('--vaadin-input-field-label-aside-width', '6em');
          element.style.setProperty('--vaadin-input-field-label-aside-gap', '2em');
          await visualDiff(div, `${dir}-label-aside-custom-width-gap`);
        });

        it('custom label text align', async () => {
          element.label = 'Label that wraps on multiple lines';
          element.required = true;
          element.style.setProperty('--vaadin-input-field-label-aside-width', '12em');
          element.style.setProperty('--vaadin-input-field-label-text-align', 'end');
          await visualDiff(div, `${dir}-label-aside-custom-text-align`);
        });
      });
    });
  });
});
