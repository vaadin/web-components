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

        describe('label aside', () => {
          beforeEach(() => {
            element.setAttribute('theme', 'label-aside');
          });

          it('default', async () => {
            await visualDiff(div, `${dir}-label-aside`);
          });

          it('label', async () => {
            element.label = 'Label';
            await visualDiff(div, `${dir}-label-aside-label`);
          });

          it('long label', async () => {
            element.label = 'Label that wraps on multiple lines';
            await visualDiff(div, `${dir}-label-aside-long-label`);
          });

          it('required', async () => {
            element.label = 'Label';
            element.required = true;
            await visualDiff(div, `${dir}-label-aside-required`);
          });

          it('error message', async () => {
            element.label = 'Label';
            element.errorMessage = 'This field is required';
            element.required = true;
            element.validate();
            await visualDiff(div, `${dir}-label-aside-error-message`);
          });

          it('helper text', async () => {
            element.label = 'Label';
            element.helperText = 'Helper text';
            await visualDiff(div, `${dir}-label-aside-helper-text`);
          });

          it('helper above field', async () => {
            element.label = 'Label';
            element.helperText = 'Helper text';
            element.setAttribute('theme', 'label-aside helper-above-field');
            await visualDiff(div, `${dir}-label-aside-helper-above-field`);
          });
        });
      });
    });
  });
});
