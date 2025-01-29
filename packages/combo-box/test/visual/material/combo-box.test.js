import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../not-animated-styles.js';
import '../../../theme/material/vaadin-combo-box.js';

describe('combo-box', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-combo-box></vaadin-combo-box>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('opened', async () => {
    div.style.height = '200px';
    div.style.width = '200px';
    element.items = ['Foo', 'Bar', 'Baz'];
    element.click();
    await visualDiff(div, 'opened');
  });

  it('focus-ring', async () => {
    await sendKeys({ press: 'Tab' });

    await visualDiff(div, 'focus-ring');
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
});
