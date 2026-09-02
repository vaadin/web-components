import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../fixtures/mock-group-field.js';

describe('group-field-base', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.width = 'fit-content';
    div.style.padding = '10px';
    element = fixtureSync(
      `Baseline
        <mock-group-field>
          <span>Item A</span>
          <span>Item B</span>
          <span>Item C</span>
        </mock-group-field>`,
      div,
    );
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
          await visualDiff(div, `group-${dir}-default`);
        });

        it('label', async () => {
          element.label = 'Label';
          await visualDiff(div, `group-${dir}-label`);
        });

        it('required', async () => {
          element.label = 'Label';
          element.required = true;
          await visualDiff(div, `group-${dir}-required`);
        });

        it('error message', async () => {
          element.errorMessage = 'This field is required';
          element.invalid = true;
          await visualDiff(div, `group-${dir}-error-message`);
        });

        it('helper text', async () => {
          element.helperText = 'Helper text';
          await visualDiff(div, `group-${dir}-helper-text`);
        });

        it('helper above field', async () => {
          element.helperText = 'Helper text';
          element.setAttribute('theme', 'helper-above-field');
          await visualDiff(div, `group-${dir}-helper-above-field`);
        });

        it('label and helper above field', async () => {
          element.label = 'Label';
          element.helperText = 'Helper text';
          element.setAttribute('theme', 'helper-above-field');
          await visualDiff(div, `group-${dir}-label-helper-above-field`);
        });

        describe('horizontal', () => {
          beforeEach(() => {
            element.setAttribute('theme', 'horizontal');
          });

          it('default', async () => {
            await visualDiff(div, `group-${dir}-horizontal`);
          });

          it('label', async () => {
            element.label = 'Label';
            await visualDiff(div, `group-${dir}-horizontal-label`);
          });

          it('wrapped', async () => {
            element.style.width = '150px';
            await visualDiff(div, `group-${dir}-horizontal-wrapped`);
          });

          it('helper above field', async () => {
            element.helperText = 'Helper text';
            element.setAttribute('theme', 'horizontal helper-above-field');
            await visualDiff(div, `group-${dir}-horizontal-helper-above-field`);
          });

          it('label and helper above field', async () => {
            element.label = 'Label';
            element.helperText = 'Helper text';
            element.setAttribute('theme', 'horizontal helper-above-field');
            await visualDiff(div, `group-${dir}-horizontal-label-helper-above-field`);
          });
        });
      });
    });
  });
});
