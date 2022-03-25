import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon/theme/material/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/material/vaadin-button.js';

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
      await visualDiff(div, 'basic');
    });

    it('focus-ring', async () => {
      // Focus on the button
      await sendKeys({ press: 'Tab' });

      await visualDiff(div, 'focus-ring');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });
  });

  ['outlined', 'contained', 'text'].forEach((variant) => {
    describe(variant, () => {
      it(variant, async () => {
        element.setAttribute('theme', `${variant}`);
        await visualDiff(div, `theme-${variant}`);
      });

      it(`${variant} disabled`, async () => {
        element.setAttribute('theme', `${variant}`);
        element.disabled = true;
        await visualDiff(div, `theme-${variant}-disabled`);
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
      await visualDiff(div, 'icon-prefix');
    });

    it('suffix', async () => {
      icon.setAttribute('slot', 'suffix');
      element.appendChild(icon);
      await visualDiff(div, 'icon-suffix');
    });

    it('icon only', async () => {
      element.textContent = '';
      icon.setAttribute('slot', 'prefix');
      element.appendChild(icon);
      await visualDiff(div, 'icon-only');
    });
  });

  describe('modified line-height', () => {
    it('should keep label center-aligned when increasing line-height on container', async () => {
      element.setAttribute('theme', 'outlined');
      div.style['line-height'] = 4;
      await visualDiff(div, 'modified-line-height-label-center-aligned');
    });
  });
});
