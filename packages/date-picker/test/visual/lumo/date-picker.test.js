import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/components/date-picker.css';
import '../../not-animated-styles.js';
import '../common.js';
import '../../../src/vaadin-date-picker.js';
import { untilOverlayRendered } from '../../helpers.js';

describe('date-picker', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-date-picker></vaadin-date-picker>', div);
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
        element.value = '1991-12-20';
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
        element.value = '1991-12-20';
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

      describe('dropdown', () => {
        async function openOverlay() {
          element.opened = true;
          div.style.height = `${element.offsetHeight + element.$.overlay.$.overlay.offsetHeight}px`;
          div.style.width = `${element.$.overlay.$.overlay.offsetWidth}px`;
          await untilOverlayRendered(element);
        }

        it('default', async () => {
          element.value = '2000-01-01';
          await openOverlay();
          await visualDiff(div, `${dir}-dropdown`);
        });

        it('week numbers', async () => {
          element.value = '2000-01-01';
          element.showWeekNumbers = true;
          element.i18n = { firstDayOfWeek: 1 };
          await openOverlay();
          await visualDiff(div, `${dir}-week-numbers`);
        });
      });
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      element.autoOpenDisabled = true;
    });

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
