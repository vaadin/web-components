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
    await visualDiff(div, 'basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('flex', async () => {
    div.style.display = 'inline-flex';
    div.style.height = '200px';
    await visualDiff(div, 'flex');
  });

  it('invalid', async () => {
    element.invalid = true;
    await visualDiff(div, 'invalid');
  });

  it('focus-ring', async () => {
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'focus-ring');
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
        await visualDiff(div, `${dir}-label`);
      });

      it('placeholder', async () => {
        element.placeholder = 'Number';
        await visualDiff(div, `${dir}-placeholder`);
      });

      it('value', async () => {
        element.value = 10;
        await visualDiff(div, `${dir}-value`);
      });

      it('required', async () => {
        element.label = 'Label';
        element.required = true;
        await visualDiff(div, `${dir}-required`);
      });

      it('error message', async () => {
        element.label = 'Label';
        element.errorMessage = 'This field is required';
        element.required = true;
        element.validate();
        await visualDiff(div, `${dir}-error-message`);
      });

      it('helper text', async () => {
        element.helperText = 'Helper text';
        await visualDiff(div, `${dir}-helper-text`);
      });

      it('prefix slot', async () => {
        const span = document.createElement('span');
        span.setAttribute('slot', 'prefix');
        span.textContent = '$';
        element.appendChild(span);
        await visualDiff(div, `${dir}-prefix`);
      });

      it('suffix slot', async () => {
        const span = document.createElement('span');
        span.setAttribute('slot', 'suffix');
        span.textContent = '$';
        element.appendChild(span);
        await visualDiff(div, `${dir}-suffix`);
      });

      it('controls', async () => {
        element.hasControls = true;
        await visualDiff(div, `${dir}-controls`);
      });

      it('step buttons visible', async () => {
        element.stepButtonsVisible = true;
        await visualDiff(div, `${dir}-step-buttons-visible`);
      });

      it('align-right', async () => {
        element.value = 10;
        element.setAttribute('theme', 'align-right');
        await visualDiff(div, `${dir}-theme-align-right`);
      });
    });
  });
});
