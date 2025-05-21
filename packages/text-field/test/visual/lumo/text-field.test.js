import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/global.css';
import '@vaadin/vaadin-lumo-styles/components/text-field.css';
import '../common.js';
import '../../../src/vaadin-text-field.js';

describe('text-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-text-field></vaadin-text-field>', div);
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
    element.value = 'value';
    await visualDiff(div, 'value');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'required');
  });

  it('invalid', async () => {
    element.invalid = true;
    await visualDiff(div, 'invalid');
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

  it('suffix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'suffix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'suffix');
  });

  describe('alignment', () => {
    let field;

    beforeEach(() => {
      field = document.createElement('vaadin-text-field');
      field.label = 'Label';
      field.style.marginLeft = '10px';
      element.parentNode.appendChild(field);
    });

    afterEach(() => {
      field.remove();
    });

    it('default', async () => {
      await visualDiff(div, 'alignment-default');
    });

    it('small', async () => {
      element.setAttribute('theme', 'small');
      field.setAttribute('theme', 'small');
      await visualDiff(div, 'alignment-small');
    });
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('RTL label', async () => {
      element.label = 'نام کالا';
      await visualDiff(div, 'rtl-label');
    });

    it('RTL prefix', async () => {
      const span = document.createElement('span');
      span.setAttribute('slot', 'prefix');
      span.textContent = 'قیمت';
      element.appendChild(span);
      await visualDiff(div, 'rtl-prefix');
    });

    it('RTL suffix', async () => {
      const span = document.createElement('span');
      span.setAttribute('slot', 'suffix');
      span.textContent = 'تومان';
      element.appendChild(span);
      await visualDiff(div, 'rtl-suffix');
    });

    it('RTL error message', async () => {
      element.label = 'نام کالا';
      element.errorMessage = 'خطا';
      element.required = true;
      element.validate();
      await visualDiff(div, 'rtl-error-message');
    });
  });

  describe('borders enabled', () => {
    before(() => {
      document.documentElement.style.setProperty('--vaadin-input-field-border-width', '1px');
    });
    after(() => {
      document.documentElement.style.removeProperty('--vaadin-input-field-border-width');
    });
    it('Bordered input container, default state', async () => {
      await visualDiff(div, 'bordered-input-container-default');
    });
    it('Bordered input container, disabled state', async () => {
      element.disabled = true;
      await visualDiff(div, 'bordered-input-container-disabled');
    });
    it('Bordered input container, readonly state', async () => {
      element.readonly = true;
      await visualDiff(div, 'bordered-input-container-readonly');
    });
    it('Bordered input container, invalid state', async () => {
      element.invalid = true;
      await visualDiff(div, 'bordered-input-container-invalid');
    });
    it('Bordered input container, dark mode', async () => {
      document.documentElement.setAttribute('theme', 'dark');
      await visualDiff(div, 'bordered-input-container-dark');
      document.documentElement.removeAttribute('theme');
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

    it('keyboard focus-ring, invalid', async () => {
      element.invalid = true;
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'keyboard-focus-ring-invalid');
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

    it('pointer focus-ring enabled, invalid', async () => {
      element.invalid = true;
      element.style.setProperty('--lumo-input-field-pointer-focus-visible', '1');
      await sendMouseToElement({ type: 'click', element });
      await visualDiff(div, 'pointer-focus-ring-enabled-invalid');
    });
  });
});
