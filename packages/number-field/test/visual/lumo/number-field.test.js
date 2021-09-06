import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../theme/lumo/vaadin-number-field.js';

describe('number-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-number-field></vaadin-number-field>', div);
  });

  it('basic', async () => {
    await visualDiff(div, `${import.meta.url}_basic`);
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, `${import.meta.url}_disabled`);
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, `${import.meta.url}_readonly`);
  });

  it('focus-ring', async () => {
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, `${import.meta.url}_focus-ring`);
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('label', async () => {
        element.label = 'Label';
        await visualDiff(div, `${import.meta.url}_${dir}-label`);
      });

      it('placeholder', async () => {
        element.placeholder = 'Number';
        await visualDiff(div, `${import.meta.url}_${dir}-placeholder`);
      });

      it('value', async () => {
        element.value = 10;
        await visualDiff(div, `${import.meta.url}_${dir}-value`);
      });

      it('required', async () => {
        element.label = 'Label';
        element.required = true;
        await visualDiff(div, `${import.meta.url}_${dir}-required`);
      });

      it('error message', async () => {
        element.label = 'Label';
        element.errorMessage = 'This field is required';
        element.required = true;
        element.validate();
        await visualDiff(div, `${import.meta.url}_${dir}-error-message`);
      });

      it('helper text', async () => {
        element.helperText = 'Helper text';
        await visualDiff(div, `${import.meta.url}_${dir}-helper-text`);
      });

      it('prefix slot', async () => {
        const span = document.createElement('span');
        span.setAttribute('slot', 'prefix');
        span.textContent = '$';
        element.appendChild(span);
        await visualDiff(div, `${import.meta.url}_${dir}-prefix`);
      });

      it('suffix slot', async () => {
        const span = document.createElement('span');
        span.setAttribute('slot', 'suffix');
        span.textContent = '$';
        element.appendChild(span);
        await visualDiff(div, `${import.meta.url}_${dir}-suffix`);
      });

      it('controls', async () => {
        element.hasControls = true;
        await visualDiff(div, `${import.meta.url}_${dir}-controls`);
      });

      it('align-right', async () => {
        element.value = 10;
        element.setAttribute('theme', 'align-right');
        await visualDiff(div, `${import.meta.url}_${dir}-theme-align-right`);
      });
    });
  });
});
