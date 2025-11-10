import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
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

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
    });

    it('value', async () => {
      element.value = 10;
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
      element.value = 10;
      await visualDiff(div, 'state-disabled-value');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'state-readonly');
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

        it('step buttons', async () => {
          element.value = 10;
          element.stepButtonsVisible = true;
          await visualDiff(div, `${dir}-step-buttons`);
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
