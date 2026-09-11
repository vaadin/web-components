import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/combo-box.css';
import '../../not-animated-styles.css';
import '../../../vaadin-combo-box.js';

describe('combo-box', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-combo-box></vaadin-combo-box>', div);
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

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'label');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'placeholder');
  });

  it('value', async () => {
    element.allowCustomValue = true;
    element.value = 'value';
    await visualDiff(div, 'value');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'required');
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, 'error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'helper-text');
  });

  it('clear button', async () => {
    element.allowCustomValue = true;
    element.value = 'value';
    element.clearButtonVisible = true;
    await visualDiff(div, 'clear-button');
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'prefix');
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      beforeEach(() => {
        div.style.height = '200px';
        div.style.width = '200px';
        element.items = ['Foo', 'Bar', 'Baz'];
        element.open();
      });

      it(`${dir} opened`, async () => {
        await visualDiff(div, `${dir}-opened`);
      });

      it(`${dir} loading`, async () => {
        element.loading = true;
        await nextFrame();
        await visualDiff(div, `${dir}-loading`);
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

  describe('label aside', () => {
    beforeEach(() => {
      element.setAttribute('theme', 'label-aside');
      element.label = 'Label';
    });

    it('default', async () => {
      await visualDiff(div, 'label-aside');
    });

    it('no label', async () => {
      element.label = '';
      await visualDiff(div, 'label-aside-no-label');
    });

    it('wrapped label', async () => {
      element.label = 'Label that wraps on multiple lines';
      element.style.setProperty('--vaadin-input-field-label-aside-width', '8em');
      await visualDiff(div, 'label-aside-wrapped-label');
    });

    it('required', async () => {
      element.required = true;
      await visualDiff(div, 'label-aside-required');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'label-aside-helper-text');
    });

    it('error message', async () => {
      element.errorMessage = 'This field is required';
      element.invalid = true;
      await visualDiff(div, 'label-aside-error-message');
    });

    it('helper above field', async () => {
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'label-aside helper-above-field');
      await visualDiff(div, 'label-aside-helper-above-field');
    });

    it('custom width and gap', async () => {
      element.style.setProperty('--vaadin-input-field-label-aside-width', '6em');
      element.style.setProperty('--vaadin-input-field-label-aside-gap', '2em');
      await visualDiff(div, 'label-aside-custom-width-gap');
    });

    it('RTL', async () => {
      element.setAttribute('dir', 'rtl');
      element.required = true;
      element.helperText = 'Helper text';
      await visualDiff(div, 'label-aside-rtl');
    });

    it('small', async () => {
      element.setAttribute('theme', 'label-aside small');
      await visualDiff(div, 'label-aside-small');
    });
  });
});
