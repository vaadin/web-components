import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-lit-checkbox.js';

describe('checkbox', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-checkbox label="Checkbox"></vaadin-checkbox>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('empty', async () => {
    element.label = null;
    await visualDiff(div, 'empty');
  });

  it('checked', async () => {
    element.checked = true;
    await visualDiff(div, 'checked');
  });

  it('indeterminate', async () => {
    element.indeterminate = true;
    await visualDiff(div, 'indeterminate');
  });

  it('focus-ring', async () => {
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'focus-ring');
  });

  it('checked focus-ring', async () => {
    element.checked = true;
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'checked-focus-ring');
  });

  it('required', async () => {
    element.required = true;
    await visualDiff(div, 'required');
  });

  it('error message', async () => {
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, 'error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'helper-text');
  });

  describe('disabled', () => {
    beforeEach(() => {
      element.disabled = true;
    });

    it('basic', async () => {
      await visualDiff(div, 'disabled');
    });

    it('checked', async () => {
      element.checked = true;
      await visualDiff(div, 'disabled-checked');
    });

    it('indeterminate', async () => {
      element.indeterminate = true;
      await visualDiff(div, 'disabled-indeterminate');
    });

    it('required', async () => {
      element.required = true;
      await visualDiff(div, 'disabled-required');
    });
  });

  describe('readonly', () => {
    beforeEach(() => {
      element.readonly = true;
    });

    it('basic', async () => {
      await visualDiff(div, 'readonly');
    });

    it('checked', async () => {
      element.checked = true;
      await visualDiff(div, 'readonly-checked');
    });

    it('indeterminate', async () => {
      element.indeterminate = true;
      await visualDiff(div, 'readonly-indeterminate');
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'readonly-focus-ring');
    });
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('basic', async () => {
      await visualDiff(div, 'rtl');
    });

    it('empty', async () => {
      element.label = '';
      await visualDiff(div, 'rtl-empty');
    });

    it('required', async () => {
      element.required = true;
      await visualDiff(div, 'rtl-required');
    });
  });
});
