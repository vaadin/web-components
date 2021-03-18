import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@polymer/iron-icon/iron-icon.js';
import '@vaadin/vaadin-lumo-styles/icons.js';
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

  describe('theme', () => {
    it('primary', async () => {
      element.setAttribute('theme', 'primary');
      await visualDiff(div, 'button:theme-primary');
    });

    it('primary disabled', async () => {
      element.setAttribute('theme', 'primary');
      element.disabled = true;
      await visualDiff(div, 'button:theme-primary-disabled');
    });

    it('secondary', async () => {
      element.setAttribute('theme', 'secondary');
      await visualDiff(div, 'button:theme-secondary');
    });

    it('secondary disabled', async () => {
      element.setAttribute('theme', 'secondary');
      element.disabled = true;
      await visualDiff(div, 'button:theme-secondary-disabled');
    });

    it('tertiary', async () => {
      element.setAttribute('theme', 'tertiary');
      await visualDiff(div, 'button:theme-tertiary');
    });

    it('tertiary disabled', async () => {
      element.setAttribute('theme', 'tertiary');
      element.disabled = true;
      await visualDiff(div, 'button:theme-tertiary-disabled');
    });

    it('tertiary-inline', async () => {
      element.setAttribute('theme', 'tertiary-inline');
      await visualDiff(div, 'button:theme-tertiary-inline');
    });

    it('tertiary-inline disabled', async () => {
      element.setAttribute('theme', 'tertiary-inline');
      element.disabled = true;
      await visualDiff(div, 'button:theme-tertiary-inline-disabled');
    });
  });

  ['contrast', 'success', 'error'].forEach((variant) => {
    describe(variant, () => {
      it('primary', async () => {
        element.setAttribute('theme', `primary ${variant}`);
        await visualDiff(div, `button:theme-primary-${variant}`);
      });

      it('secondary', async () => {
        element.setAttribute('theme', `${variant}`);
        await visualDiff(div, `button:theme-secondary-${variant}`);
      });

      it('tertiary', async () => {
        element.setAttribute('theme', `tertiary ${variant}`);
        await visualDiff(div, `button:theme-tertiary-${variant}`);
      });

      it('primary disabled', async () => {
        element.setAttribute('theme', `primary ${variant}`);
        element.disabled = true;
        await visualDiff(div, `button:theme-primary-${variant}-disabled`);
      });

      it('secondary disabled', async () => {
        element.setAttribute('theme', `${variant}`);
        element.disabled = true;
        await visualDiff(div, `button:theme-secondary-${variant}-disabled`);
      });

      it('tertiary disabled', async () => {
        element.setAttribute('theme', `tertiary ${variant}`);
        element.disabled = true;
        await visualDiff(div, `button:theme-tertiary-${variant}-disabled`);
      });
    });
  });

  describe('icons', () => {
    describe('prefix and text', () => {
      let icon;

      beforeEach(() => {
        icon = document.createElement('iron-icon');
        icon.setAttribute('icon', 'lumo:edit');
        icon.setAttribute('slot', 'prefix');
        element.appendChild(icon);
      });

      it('default', async () => {
        await visualDiff(div, 'button:icon-prefix-default');
      });

      it('default', async () => {
        element.setAttribute('theme', 'small');
        await visualDiff(div, 'button:icon-prefix-small');
      });

      it('default', async () => {
        element.setAttribute('theme', 'large');
        await visualDiff(div, 'button:icon-prefix-large');
      });
    });

    describe('suffix and text', () => {
      let icon;

      beforeEach(() => {
        icon = document.createElement('iron-icon');
        icon.setAttribute('icon', 'lumo:arrow-right');
        icon.setAttribute('slot', 'suffix');
        element.appendChild(icon);
      });

      it('default', async () => {
        await visualDiff(div, 'button:icon-suffix-default');
      });

      it('default', async () => {
        element.setAttribute('theme', 'small');
        await visualDiff(div, 'button:icon-suffix-small');
      });

      it('default', async () => {
        element.setAttribute('theme', 'large');
        await visualDiff(div, 'button:icon-suffix-large');
      });
    });

    describe('icon only', () => {
      let icon;

      beforeEach(() => {
        element.textContent = '';
        icon = document.createElement('iron-icon');
        icon.setAttribute('icon', 'lumo:plus');
        icon.setAttribute('slot', 'prefix');
        element.appendChild(icon);
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon');
        await visualDiff(div, 'button:icon-only-default');
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon small');
        await visualDiff(div, 'button:icon-only-small');
      });

      it('default', async () => {
        element.setAttribute('theme', 'icon large');
        await visualDiff(div, 'button:icon-only-large');
      });
    });
  });
});
