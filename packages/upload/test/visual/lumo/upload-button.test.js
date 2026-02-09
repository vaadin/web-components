import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/upload-button.css';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '@vaadin/icon';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.modularUpload = true;

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

  describe('basic', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('active', async () => {
      mousedown(element);
      await visualDiff(div, 'active');
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });
  });

  describe('theme', () => {
    it('primary', async () => {
      element.setAttribute('theme', 'primary');
      await visualDiff(div, 'theme-primary');
    });

    it('primary disabled', async () => {
      element.setAttribute('theme', 'primary');
      element.disabled = true;
      await visualDiff(div, 'theme-primary-disabled');
    });

    it('primary hover', async () => {
      element.setAttribute('theme', 'primary');
      await sendMouseToElement({ type: 'move', element });
      await visualDiff(div, 'theme-primary-hover');
    });

    it('primary active', async () => {
      element.setAttribute('theme', 'primary');
      mousedown(element);
      await visualDiff(div, 'theme-primary-active');
    });

    it('primary focus-ring', async () => {
      element.setAttribute('theme', 'primary');
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'theme-primary-focus-ring');
    });

    it('tertiary', async () => {
      element.setAttribute('theme', 'tertiary');
      await visualDiff(div, 'theme-tertiary');
    });

    it('tertiary hover', async () => {
      element.setAttribute('theme', 'tertiary');
      await sendMouseToElement({ type: 'move', element });
      await visualDiff(div, 'theme-tertiary-hover');
    });

    it('tertiary disabled', async () => {
      element.setAttribute('theme', 'tertiary');
      element.disabled = true;
      await visualDiff(div, 'theme-tertiary-disabled');
    });
  });

  describe('icons', () => {
    describe('prefix and text', () => {
      let icon;

      beforeEach(() => {
        icon = document.createElement('vaadin-icon');
        icon.setAttribute('icon', 'lumo:upload');
        icon.setAttribute('slot', 'prefix');
        element.appendChild(icon);
      });

      it('default', async () => {
        await visualDiff(div, 'icon-prefix-default');
      });

      it('small', async () => {
        element.setAttribute('theme', 'small');
        await visualDiff(div, 'icon-prefix-small');
      });
    });

    describe('icon only', () => {
      let icon;

      beforeEach(() => {
        element.textContent = '';
        icon = document.createElement('vaadin-icon');
        icon.setAttribute('icon', 'lumo:upload');
        icon.setAttribute('slot', 'prefix');
        element.appendChild(icon);
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon');
        await visualDiff(div, 'icon-only-default');
      });

      it('small', async () => {
        element.setAttribute('theme', 'icon small');
        await visualDiff(div, 'icon-only-small');
      });
    });
  });
});
