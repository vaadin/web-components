import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/vaadin-icon/theme/lumo/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/lumo/vaadin-button.js';
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

  describe('theme', () => {
    it('primary', async () => {
      element.setAttribute('theme', 'primary');
      await visualDiff(div, `${import.meta.url}_theme-primary`);
    });

    it('primary disabled', async () => {
      element.setAttribute('theme', 'primary');
      element.disabled = true;
      await visualDiff(div, `${import.meta.url}_theme-primary-disabled`);
    });

    it('secondary', async () => {
      element.setAttribute('theme', 'secondary');
      await visualDiff(div, `${import.meta.url}_theme-secondary`);
    });

    it('secondary disabled', async () => {
      element.setAttribute('theme', 'secondary');
      element.disabled = true;
      await visualDiff(div, `${import.meta.url}_theme-secondary-disabled`);
    });

    it('tertiary', async () => {
      element.setAttribute('theme', 'tertiary');
      await visualDiff(div, `${import.meta.url}_theme-tertiary`);
    });

    it('tertiary disabled', async () => {
      element.setAttribute('theme', 'tertiary');
      element.disabled = true;
      await visualDiff(div, `${import.meta.url}_theme-tertiary-disabled`);
    });

    it('tertiary-inline', async () => {
      element.setAttribute('theme', 'tertiary-inline');
      await visualDiff(div, `${import.meta.url}_theme-tertiary-inline`);
    });

    it('tertiary-inline disabled', async () => {
      element.setAttribute('theme', 'tertiary-inline');
      element.disabled = true;
      await visualDiff(div, `${import.meta.url}_theme-tertiary-inline-disabled`);
    });
  });

  ['contrast', 'success', 'error'].forEach((variant) => {
    describe(variant, () => {
      it('primary', async () => {
        element.setAttribute('theme', `primary ${variant}`);
        await visualDiff(div, `${import.meta.url}_theme-primary-${variant}`);
      });

      it('secondary', async () => {
        element.setAttribute('theme', `${variant}`);
        await visualDiff(div, `${import.meta.url}_theme-secondary-${variant}`);
      });

      it('tertiary', async () => {
        element.setAttribute('theme', `tertiary ${variant}`);
        await visualDiff(div, `${import.meta.url}_theme-tertiary-${variant}`);
      });

      it('primary disabled', async () => {
        element.setAttribute('theme', `primary ${variant}`);
        element.disabled = true;
        await visualDiff(div, `${import.meta.url}_theme-primary-${variant}-disabled`);
      });

      it('secondary disabled', async () => {
        element.setAttribute('theme', `${variant}`);
        element.disabled = true;
        await visualDiff(div, `${import.meta.url}_theme-secondary-${variant}-disabled`);
      });

      it('tertiary disabled', async () => {
        element.setAttribute('theme', `tertiary ${variant}`);
        element.disabled = true;
        await visualDiff(div, `${import.meta.url}_theme-tertiary-${variant}-disabled`);
      });
    });
  });

  describe('icons', () => {
    describe('prefix and text', () => {
      let icon;

      beforeEach(() => {
        icon = document.createElement('vaadin-icon');
        icon.setAttribute('icon', 'lumo:edit');
        icon.setAttribute('slot', 'prefix');
        element.appendChild(icon);
      });

      it('default', async () => {
        await visualDiff(div, `${import.meta.url}_icon-prefix-default`);
      });

      it('default', async () => {
        element.setAttribute('theme', 'small');
        await visualDiff(div, `${import.meta.url}_icon-prefix-small`);
      });

      it('default', async () => {
        element.setAttribute('theme', 'large');
        await visualDiff(div, `${import.meta.url}_icon-prefix-large`);
      });
    });

    describe('suffix and text', () => {
      let icon;

      beforeEach(() => {
        icon = document.createElement('vaadin-icon');
        icon.setAttribute('icon', 'lumo:arrow-right');
        icon.setAttribute('slot', 'suffix');
        element.appendChild(icon);
      });

      it('default', async () => {
        await visualDiff(div, `${import.meta.url}_icon-suffix-default`);
      });

      it('default', async () => {
        element.setAttribute('theme', 'small');
        await visualDiff(div, `${import.meta.url}_icon-suffix-small`);
      });

      it('default', async () => {
        element.setAttribute('theme', 'large');
        await visualDiff(div, `${import.meta.url}_icon-suffix-large`);
      });
    });

    describe('icon only', () => {
      let icon;

      beforeEach(() => {
        element.textContent = '';
        icon = document.createElement('vaadin-icon');
        icon.setAttribute('icon', 'lumo:plus');
        icon.setAttribute('slot', 'prefix');
        element.appendChild(icon);
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon');
        await visualDiff(div, `${import.meta.url}_icon-only-default`);
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon small');
        await visualDiff(div, `${import.meta.url}_icon-only-small`);
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon large');
        await visualDiff(div, `${import.meta.url}_icon-only-large`);
      });
    });
  });
});
