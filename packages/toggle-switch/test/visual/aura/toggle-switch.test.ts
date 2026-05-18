import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../not-animated-styles.css';
import '../../../src/vaadin-toggle-switch.js';
import type { ToggleSwitch } from '../../../src/vaadin-toggle-switch.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.toggleSwitchComponent = true;

describe('toggle-switch', () => {
  let div: HTMLDivElement;
  let element: ToggleSwitch;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-toggle-switch label="Toggle"></vaadin-toggle-switch>', div);
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('checked', async () => {
      element.checked = true;
      await visualDiff(div, 'checked');
    });

    it('required', async () => {
      element.required = true;
      await visualDiff(div, 'required');
    });

    it('empty', async () => {
      element.label = null;
      await visualDiff(div, 'empty');
    });

    it('invalid', async () => {
      element.required = true;
      element.validate();
      await visualDiff(div, 'invalid');
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
    });

    describe('focus', () => {
      it('keyboard focus', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'focus');
      });

      it('checked focus', async () => {
        element.checked = true;
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'focus-checked');
      });

      it('readonly focus', async () => {
        element.readonly = true;
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'focus-readonly');
      });
    });
  });
});
