import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-password-field.js';
import { PasswordField } from '../../../src/vaadin-password-field.js';

customElements.define('vaadin-password-field', PasswordField);

describe('password-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-password-field></vaadin-password-field>', div);
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('basic', async () => {
        await visualDiff(div, `${import.meta.url}_${dir}-basic`);
      });

      it('value', async () => {
        element.value = 'value';
        await visualDiff(div, `${import.meta.url}_${dir}-value`);
      });

      it('clear button', async () => {
        element.value = 'value';
        element.clearButtonVisible = true;
        await visualDiff(div, `${import.meta.url}_${dir}-clear-button`);
      });

      it('reveal button hidden', async () => {
        element.value = 'value';
        element.revealButtonHidden = true;
        await visualDiff(div, `${import.meta.url}_${dir}-reveal-button-hidden`);
      });
    });
  });
});
