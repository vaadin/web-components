import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/test/autoload.js';
import '../../../theme/lumo/vaadin-checkbox.js';

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

    it('Bordered dark', async () => {
      document.documentElement.setAttribute('theme', 'dark');
      await visualDiff(div, 'bordered-dark');
    });
  });
});
