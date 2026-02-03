import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '@vaadin/icon/vaadin-icon.js';
import '@vaadin/icons/vaadin-iconset.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.aiComponents = true;

import '../../../vaadin-upload-button.js';

describe('upload-button', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-upload-button>Upload</vaadin-upload-button>', div);
  });

  afterEach(async () => {
    await resetMouse();
  });

  ['basic', 'primary', 'tertiary'].forEach((variant) => {
    describe(variant, () => {
      beforeEach(() => {
        if (variant !== 'basic') {
          element.setAttribute('theme', variant);
        }
      });

      it('default', async () => {
        await visualDiff(div, `${variant}-default`);
      });

      it('active', async () => {
        mousedown(element);
        await visualDiff(div, `${variant}-active`);
      });

      it('focus-ring', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, `${variant}-focus-ring`);
      });

      it('hover', async () => {
        await sendMouseToElement({ type: 'move', element });
        await visualDiff(div, `${variant}-hover`);
      });

      it('disabled', async () => {
        element.disabled = true;
        await visualDiff(div, `${variant}-disabled`);
      });
    });
  });

  describe('icon', () => {
    const getIcon = (slot) => `
      <vaadin-icon
        icon="vaadin:upload"
         ${slot ? `slot="${slot}"` : ''}
      ></vaadin-icon>
    `;

    it('before text', async () => {
      element.insertAdjacentHTML('afterbegin', getIcon('prefix'));
      await visualDiff(div, 'icon-before-text');
    });

    it('after text', async () => {
      element.insertAdjacentHTML('beforeend', getIcon('suffix'));
      await visualDiff(div, 'icon-after-text');
    });

    it('without text', async () => {
      element.innerHTML = getIcon('');
      await visualDiff(div, 'icon-without-text');
    });
  });

  describe('accent', () => {
    ['neutral', 'green', 'yellow', 'purple', 'orange', 'blue', 'red'].forEach((color) => {
      it(color, async () => {
        element.classList.add(`aura-accent-${color}`);
        await visualDiff(div, `accent-${color}`);
      });
    });
  });
});
