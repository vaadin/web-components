import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@polymer/iron-icon/iron-icon.js';
import '@vaadin/vaadin-lumo-styles/icons.js';
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
      await visualDiff(div, 'button:basic');
    });

    it('focus-ring', async () => {
      element.setAttribute('focus-ring', '');
      await visualDiff(div, 'button:focus-ring');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'button:disabled');
    });
  });

  ['outlined', 'contained', 'text'].forEach((variant) => {
    describe(variant, () => {
      it(variant, async () => {
        element.setAttribute('theme', `${variant}`);
        await visualDiff(div, `button:theme-${variant}`);
      });

      it(`${variant} disabled`, async () => {
        element.setAttribute('theme', `${variant}`);
        element.disabled = true;
        await visualDiff(div, `button:theme-${variant}-disabled`);
      });
    });
  });

  describe('icon', () => {
    let icon;

    beforeEach(() => {
      icon = document.createElement('iron-icon');
      icon.setAttribute('icon', 'lumo:plus');
    });

    it('prefix', async () => {
      icon.setAttribute('slot', 'prefix');
      element.appendChild(icon);
      await visualDiff(div, 'button:icon-prefix');
    });

    it('suffix', async () => {
      icon.setAttribute('slot', 'suffix');
      element.appendChild(icon);
      await visualDiff(div, 'button:icon-suffix');
    });

    it('icon only', async () => {
      element.textContent = '';
      icon.setAttribute('slot', 'prefix');
      element.appendChild(icon);
      await visualDiff(div, 'button:icon-only');
    });
  });
});
