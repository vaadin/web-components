import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
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

  afterEach(async () => {
    await resetMouse();
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

    it('flex-shrink', async () => {
      const wrapper = fixtureSync(`
        <div style="display: flex; align-items: baseline; gap: 20px; width: 400px">
          <vaadin-button>This is a button</vaadin-button>

          <span style="flex-basis: 100%; background-color: #eee;">Sibling</span>
        </div>
      `);
      await visualDiff(wrapper, 'flex-shrink');
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

      it(`${variant} hover`, async () => {
        element.setAttribute('theme', `${variant}`);
        await new Promise((resolve) => {
          element.addEventListener('transitionend', resolve, { once: true });
          sendMouseToElement({ type: 'move', element });
        });
        await visualDiff(div, `theme-${variant}-hover`);
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
