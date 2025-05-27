import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-checkbox.js';

describe('checkbox', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-checkbox label="Checkbox"></vaadin-checkbox>', div);
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
    });

    it('checked', async () => {
      element.checked = true;
      await visualDiff(div, 'state-checked');
    });

    it('indeterminate', async () => {
      element.indeterminate = true;
      await visualDiff(div, 'state-indeterminate');
    });

    it('required', async () => {
      element.required = true;
      await visualDiff(div, 'state-required');
    });

    it('empty', async () => {
      element.label = null;
      await visualDiff(div, 'state-empty');
    });

    describe('disabled', () => {
      beforeEach(() => {
        element.disabled = true;
      });

      it('basic', async () => {
        await visualDiff(div, 'state-disabled');
      });

      it('checked', async () => {
        element.checked = true;
        await visualDiff(div, 'state-disabled-checked');
      });

      it('indeterminate', async () => {
        element.indeterminate = true;
        await visualDiff(div, 'state-disabled-indeterminate');
      });

      it('required', async () => {
        element.required = true;
        await visualDiff(div, 'state-disabled-required');
      });
    });

    describe('readonly', () => {
      beforeEach(() => {
        element.readonly = true;
      });

      it('basic', async () => {
        await visualDiff(div, 'state-readonly');
      });

      it('checked', async () => {
        element.checked = true;
        await visualDiff(div, 'state-readonly-checked');
      });

      it('indeterminate', async () => {
        element.indeterminate = true;
        await visualDiff(div, 'state-readonly-indeterminate');
      });
    });

    describe('focus', () => {
      it('keyboard focus', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus');
      });

      it('checked focus', async () => {
        element.checked = true;
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus-checked');
      });

      it('indeterminate focus', async () => {
        element.indeterminate = true;
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus-indeterminate');
      });

      it('readonly focus', async () => {
        element.readonly = true;
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus-readonly');
      });
    });
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
      });
    });
  });
});
