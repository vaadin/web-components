import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/vaadin-icon/theme/material/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/material/vaadin-button.js';
import '../../../src/vaadin-button.js';

describe('button', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-button>Button</vaadin-button>', div);
  });

  describe('basic', () => {
    it('basic', async () => {
      await visualDiff(div, `${import.meta.url}_basic`);
    });

    it('focus-ring', async () => {
      // Focus on the button
      await sendKeys({ press: 'Tab' });

      await visualDiff(div, `${import.meta.url}_focus-ring`);
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, `${import.meta.url}_disabled`);
    });
  });

  ['outlined', 'contained', 'text'].forEach((variant) => {
    describe(variant, () => {
      it(variant, async () => {
        element.setAttribute('theme', `${variant}`);
        await visualDiff(div, `${import.meta.url}_theme-${variant}`);
      });

      it(`${variant} disabled`, async () => {
        element.setAttribute('theme', `${variant}`);
        element.disabled = true;
        await visualDiff(div, `${import.meta.url}_theme-${variant}-disabled`);
      });
    });
  });

  describe('icon', () => {
    let icon;

    beforeEach(() => {
      icon = document.createElement('vaadin-icon');
      icon.setAttribute('icon', 'lumo:plus');
    });

    it('prefix', async () => {
      icon.setAttribute('slot', 'prefix');
      element.appendChild(icon);
      await visualDiff(div, `${import.meta.url}_icon-prefix`);
    });

    it('suffix', async () => {
      icon.setAttribute('slot', 'suffix');
      element.appendChild(icon);
      await visualDiff(div, `${import.meta.url}_icon-suffix`);
    });

    it('icon only', async () => {
      element.textContent = '';
      icon.setAttribute('slot', 'prefix');
      element.appendChild(icon);
      await visualDiff(div, `${import.meta.url}_icon-only`);
    });
  });
});
