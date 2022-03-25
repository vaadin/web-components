import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon/theme/lumo/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/lumo/vaadin-button.js';

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

    it('active', async () => {
      mousedown(element);
      await visualDiff(div, 'active');
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

    it('secondary', async () => {
      element.setAttribute('theme', 'secondary');
      await visualDiff(div, 'theme-secondary');
    });

    it('secondary disabled', async () => {
      element.setAttribute('theme', 'secondary');
      element.disabled = true;
      await visualDiff(div, 'theme-secondary-disabled');
    });

    it('tertiary', async () => {
      element.setAttribute('theme', 'tertiary');
      await visualDiff(div, 'theme-tertiary');
    });

    it('tertiary disabled', async () => {
      element.setAttribute('theme', 'tertiary');
      element.disabled = true;
      await visualDiff(div, 'theme-tertiary-disabled');
    });

    it('tertiary-inline', async () => {
      element.setAttribute('theme', 'tertiary-inline');
      await visualDiff(div, 'theme-tertiary-inline');
    });

    it('tertiary-inline disabled', async () => {
      element.setAttribute('theme', 'tertiary-inline');
      element.disabled = true;
      await visualDiff(div, 'theme-tertiary-inline-disabled');
    });
  });

  ['contrast', 'success', 'error'].forEach((variant) => {
    describe(variant, () => {
      it('primary', async () => {
        element.setAttribute('theme', `primary ${variant}`);
        await visualDiff(div, `theme-primary-${variant}`);
      });

      it('secondary', async () => {
        element.setAttribute('theme', `${variant}`);
        await visualDiff(div, `theme-secondary-${variant}`);
      });

      it('tertiary', async () => {
        element.setAttribute('theme', `tertiary ${variant}`);
        await visualDiff(div, `theme-tertiary-${variant}`);
      });

      it('primary disabled', async () => {
        element.setAttribute('theme', `primary ${variant}`);
        element.disabled = true;
        await visualDiff(div, `theme-primary-${variant}-disabled`);
      });

      it('secondary disabled', async () => {
        element.setAttribute('theme', `${variant}`);
        element.disabled = true;
        await visualDiff(div, `theme-secondary-${variant}-disabled`);
      });

      it('tertiary disabled', async () => {
        element.setAttribute('theme', `tertiary ${variant}`);
        element.disabled = true;
        await visualDiff(div, `theme-tertiary-${variant}-disabled`);
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
        await visualDiff(div, 'icon-prefix-default');
      });

      it('default', async () => {
        element.setAttribute('theme', 'small');
        await visualDiff(div, 'icon-prefix-small');
      });

      it('default', async () => {
        element.setAttribute('theme', 'large');
        await visualDiff(div, 'icon-prefix-large');
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
        await visualDiff(div, 'icon-suffix-default');
      });

      it('default', async () => {
        element.setAttribute('theme', 'small');
        await visualDiff(div, 'icon-suffix-small');
      });

      it('default', async () => {
        element.setAttribute('theme', 'large');
        await visualDiff(div, 'icon-suffix-large');
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
        await visualDiff(div, 'icon-only-default');
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon small');
        await visualDiff(div, 'icon-only-small');
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon large');
        await visualDiff(div, 'icon-only-large');
      });
    });
  });

  describe('modified line-height', () => {
    it('should keep label center-aligned when increasing line-height on container', async () => {
      div.style['line-height'] = 4;
      await visualDiff(div, 'modified-line-height-label-center-aligned');
    });
  });
});
