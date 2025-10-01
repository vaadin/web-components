import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/global/index.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/checkbox.css';
import '../common.js';
import '../../../vaadin-checkbox.js';

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
    element.label = '';
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

  it('required empty', async () => {
    element.required = true;
    element.label = '';
    await visualDiff(div, 'required-empty');
  });

  it('invalid focus-ring', async () => {
    element.required = true;
    element.invalid = true;
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'invalid-focus-ring');
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

    it('readonly checked', async () => {
      element.readonly = true;
      element.checked = true;
      await visualDiff(div, 'disabled-readonly-checked');
    });

    it('readonly indeterminate', async () => {
      element.readonly = true;
      element.indeterminate = true;
      await visualDiff(div, 'disabled-readonly-indeterminate');
    });

    describe('styled', () => {
      before(() => {
        document.documentElement.style.setProperty('--vaadin-checkbox-disabled-checkmark-color', 'white');
        document.documentElement.style.setProperty('--vaadin-checkbox-disabled-background', 'black');
      });

      after(() => {
        document.documentElement.style.removeProperty('--vaadin-checkbox-disabled-checkmark-color');
        document.documentElement.style.removeProperty('--vaadin-checkbox-disabled-background');
      });

      it('checked', async () => {
        element.checked = true;
        await visualDiff(div, 'styled-disabled-checked');
      });

      it('indeterminate', async () => {
        element.indeterminate = true;
        await visualDiff(div, 'styled-disabled-indeterminate');
      });

      it('unchecked', async () => {
        await visualDiff(div, 'styled-disabled');
      });
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

  describe('borders enabled', () => {
    before(() => {
      document.documentElement.style.setProperty('--vaadin-input-field-border-width', '1px');
    });

    after(() => {
      document.documentElement.style.removeProperty('--vaadin-input-field-border-width');
    });

    it('bordered default', async () => {
      await visualDiff(div, 'bordered-default');
    });

    it('bordered focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'bordered-focus-ring');
    });

    it('bordered checked', async () => {
      element.checked = true;
      await visualDiff(div, 'bordered-checked');
    });

    it('bordered-disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'bordered-disabled');
    });

    it('bordered readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'bordered-readonly');
    });

    it('bordered invalid', async () => {
      element.invalid = true;
      await visualDiff(div, 'bordered-invalid');
    });

    it('Bordered dark', async () => {
      document.documentElement.setAttribute('theme', 'dark');
      await visualDiff(div, 'bordered-dark');
    });
  });
});
