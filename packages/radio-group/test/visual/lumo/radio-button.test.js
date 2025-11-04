import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/global/index.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/radio-button.css';
import '../../../vaadin-radio-button.js';

describe('radio-button', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-radio-button label="Radio button"></vaadin-radio-button>', div);
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

    describe('styled', () => {
      before(() => {
        document.documentElement.style.setProperty('--vaadin-radio-button-disabled-background', 'black');
        document.documentElement.style.setProperty('--vaadin-radio-button-disabled-dot-color', 'white');
      });

      after(() => {
        document.documentElement.style.removeProperty('--vaadin-radio-button-disabled-background');
        document.documentElement.style.removeProperty('--vaadin-radio-button-disabled-dot-color');
      });

      it('disabled', async () => {
        await visualDiff(div, 'styled-disabled');
      });

      it('disabled checked', async () => {
        element.checked = true;
        await visualDiff(div, 'styled-disabled-checked');
      });
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
    it('Bordered dark', async () => {
      document.documentElement.setAttribute('theme', 'dark');
      await visualDiff(div, 'bordered-dark');
    });
  });
});
