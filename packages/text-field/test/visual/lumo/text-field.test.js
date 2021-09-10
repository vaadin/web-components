import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
// TODO: remove in https://github.com/vaadin/web-components/issues/2220
import './vaadin-text-field.js';
import { TextField } from '../../../src/vaadin-text-field.js';

customElements.define('vaadin-text-field', TextField);

describe('text-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-text-field></vaadin-text-field>', div);
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
});
