import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '@vaadin/icon/src/vaadin-icon.js';
import '@vaadin/icons';
import '../../../src/vaadin-input-container.js';

describe('input-container', () => {
  let div, element, input;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.width = 'fit-content';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-input-container><input></vaadin-input-container>', div);
    input = element.querySelector('input');
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
    });

    it('value', async () => {
      input.value = 'value';
      await visualDiff(div, 'state-value');
    });

    it('placeholder', async () => {
      input.placeholder = 'placeholder';
      await visualDiff(div, 'state-placeholder');
    });

    it('focus', async () => {
      input.focus();
      await visualDiff(div, 'state-focus');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'state-readonly');
    });

    it('readonly focus', async () => {
      element.readonly = true;
      input.focus();
      await visualDiff(div, 'state-readonly-focus');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'state-disabled');
    });

    it('disabled value', async () => {
      input.value = 'value';
      element.disabled = true;
      await visualDiff(div, 'state-disabled-value');
    });
  });

  describe('features', () => {
    ['ltr', 'rtl'].forEach((dir) => {
      describe(dir, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it('prefix icon', async () => {
          const icon = document.createElement('vaadin-icon');
          icon.setAttribute('slot', 'prefix');
          icon.icon = 'vaadin:search';
          element.appendChild(icon);
          await visualDiff(div, `${dir}-prefix-icon`);
        });

        it('suffix icon', async () => {
          const icon = document.createElement('vaadin-icon');
          icon.setAttribute('slot', 'suffix');
          icon.icon = 'vaadin:search';
          element.appendChild(icon);
          await visualDiff(div, `${dir}-suffix-icon`);
        });
      });
    });
  });
});
