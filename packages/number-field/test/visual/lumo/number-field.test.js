import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/components/number-field.css';
import '../common.js';
import '../../../src/vaadin-number-field.js';

describe('number-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-number-field></vaadin-number-field>', div);
  });

  afterEach(() => {
    // After tests which use sendKeys() the focus-utils.js -> isKeyboardActive is set to true.
    // Click once here on body to reset it so other tests are not affected by it.
    // An unwanted focus-ring would be shown in other tests otherwise.
    mousedown(document.body);
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

      it('clear button', async () => {
        element.value = 10;
        element.clearButtonVisible = true;
        await visualDiff(div, `${dir}-clear-button`);
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

      it('step buttons visible', async () => {
        element.stepButtonsVisible = true;
        element.value = 5;
        await visualDiff(div, `${dir}-step-buttons-visible`);
      });

      it('step buttons visible disabled', async () => {
        element.stepButtonsVisible = true;
        element.disabled = true;
        await visualDiff(div, `${dir}-step-buttons-visible-disabled`);
      });

      it('step buttons visible disabled value', async () => {
        element.stepButtonsVisible = true;
        element.value = 1;
        element.disabled = true;
        await visualDiff(div, `${dir}-step-buttons-visible-disabled-value`);
      });

      it('align-right', async () => {
        element.value = 10;
        element.setAttribute('theme', 'align-right');
        await visualDiff(div, `${dir}-theme-align-right`);
      });
    });
  });

  describe('focus', () => {
    afterEach(async () => {
      await resetMouse();
    });

    it('keyboard focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'keyboard-focus-ring');
    });

    it('pointer focus-ring disabled', async () => {
      await sendMouseToElement({ type: 'click', element });
      await visualDiff(div, 'pointer-focus-ring-disabled');
    });

    it('pointer focus-ring enabled', async () => {
      element.style.setProperty('--lumo-input-field-pointer-focus-visible', '1');
      await sendMouseToElement({ type: 'click', element });
      await visualDiff(div, 'pointer-focus-ring-enabled');
    });
  });
});
