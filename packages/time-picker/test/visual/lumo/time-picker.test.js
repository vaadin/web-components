import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../theme/lumo/vaadin-time-picker.js';

describe('time-picker', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-time-picker></vaadin-time-picker>', div);
    element.style.setProperty('--vaadin-time-picker-overlay-max-height', '300px');
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
        element.placeholder = 'Placeholder';
        await visualDiff(div, `${dir}-placeholder`);
      });

      it('value', async () => {
        element.value = '12:12:12.122';
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
        element.value = '12:12:12.122';
        element.clearButtonVisible = true;
        await visualDiff(div, `${dir}-clear-button`);
      });

      it('opened', async () => {
        div.style.height = '350px';
        div.style.width = '200px';
        element.click();
        await visualDiff(div, `${dir}-opened`);
      });
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      element.autoOpenDisabled = true;
    });

    it('keyboard focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'keyboard-focus-ring');
    });

    it('pointer focus-ring disabled', async () => {
      const bounds = element.getBoundingClientRect();
      await sendMouse({ type: 'click', position: [bounds.left + 5, bounds.top + 5] });
      await visualDiff(div, 'pointer-focus-ring-disabled');
    });

    it('pointer focus-ring enabled', async () => {
      element.style.setProperty('--lumo-input-field-pointer-focus-visible', '1');
      const bounds = element.getBoundingClientRect();
      await sendMouse({ type: 'click', position: [bounds.left + 5, bounds.top + 5] });
      await visualDiff(div, 'pointer-focus-ring-enabled');
    });
  });
});
