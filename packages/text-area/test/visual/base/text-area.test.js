import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-text-area.js';

describe('text-area', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    // maxRows calculation fails with the default value 'normal', as browsers return the string 'normal' for the computed style.
    div.style.lineHeight = '1.2';
    element = fixtureSync('<vaadin-text-area></vaadin-text-area>', div);
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
    });

    it('value', async () => {
      element.value = 'value';
      await visualDiff(div, 'state-value');
    });

    it('placeholder', async () => {
      element.placeholder = 'Placeholder';
      await visualDiff(div, 'state-placeholder');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'state-disabled');
    });

    it('disabled value', async () => {
      element.disabled = true;
      element.value = 'value';
      await visualDiff(div, 'state-disabled-value');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'state-readonly');
    });

    it('required', async () => {
      element.label = 'Label';
      element.required = true;
      await visualDiff(div, 'state-required');
    });

    it('flex', async () => {
      div.style.display = 'inline-flex';
      div.style.height = '200px';
      await visualDiff(div, 'state-flex');
    });

    describe('focus', () => {
      afterEach(async () => {
        await resetMouse();
        // After tests which use sendKeys() the focus-utils.js -> isKeyboardActive is set to true.
        // Click once here on body to reset it so other tests are not affected by it.
        // An unwanted focus-ring would be shown in other tests otherwise.
        mousedown(document.body);
      });

      it('keyboard focus', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus-keyboard');
      });

      it('pointer focus', async () => {
        await sendMouseToElement({ type: 'click', element });
        await visualDiff(div, 'state-focus-pointer');
      });
    });

    describe('scroll', () => {
      it('scrolled', async () => {
        element.style.height = '70px';
        element.value = 'a\nb\nc\nd\ne';
        element.focus();
        await visualDiff(div, 'state-scrolled');
      });

      it('scrolled with prefix, suffix, clear button', async () => {
        const prefix = document.createElement('span');
        prefix.setAttribute('slot', 'prefix');
        prefix.textContent = '$';
        element.appendChild(prefix);

        const suffix = document.createElement('span');
        suffix.setAttribute('slot', 'suffix');
        suffix.textContent = '$';
        element.appendChild(suffix);

        element.clearButtonVisible = true;
        element.style.height = '70px';
        element.value = 'a\nb\nc\nd\ne';
        element.focus();
        await visualDiff(div, 'state-scrolled-with-slots');
      });
    });

    describe('rows', () => {
      it('min-rows', async () => {
        element.value = 'value';
        element.minRows = 4;
        await visualDiff(div, 'state-min-rows');
      });

      it('max-rows', async () => {
        element.value = Array(10).join('value\n');
        element.maxRows = 4;
        await visualDiff(div, 'state-max-rows');
      });

      it('single-row', async () => {
        element.minRows = 1;
        element.value = 'value';
        element.clearButtonVisible = true;

        await visualDiff(div, 'state-single-row');
      });
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

        it('clear button', async () => {
          element.value = 'value';
          element.clearButtonVisible = true;
          await visualDiff(div, `${dir}-clear-button`);
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

        it('helper above field', async () => {
          element.label = 'Label';
          element.helperText = 'Helper text';
          element.setAttribute('theme', 'helper-above-field');
          await visualDiff(div, `${dir}-helper-above-field`);
        });

        it('prefix', async () => {
          const span = document.createElement('span');
          span.setAttribute('slot', 'prefix');
          span.textContent = '$';
          element.appendChild(span);
          await visualDiff(div, `${dir}-prefix`);
        });

        it('suffix', async () => {
          const span = document.createElement('span');
          span.setAttribute('slot', 'suffix');
          span.textContent = '$';
          element.appendChild(span);
          await visualDiff(div, `${dir}-suffix`);
        });
      });
    });
  });
});
