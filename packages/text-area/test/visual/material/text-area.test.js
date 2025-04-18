import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../theme/material/vaadin-text-area.js';

describe('text-area', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-text-area></vaadin-text-area>', div);
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

  it('scrolled', async () => {
    element.style.height = '70px';
    element.value = 'a\nb\nc\nd\ne';
    element.focus();
    await visualDiff(div, 'scrolled');
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
    await visualDiff(div, 'scrolled-with-prefix-suffix-clear-button');
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
    element.value = 'value';
    await visualDiff(div, 'prefix');
  });

  it('suffix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'suffix');
    span.textContent = '$';
    element.appendChild(span);
    element.value = 'value';
    await visualDiff(div, 'suffix');
  });

  it('min-rows', async () => {
    element.value = 'value';
    element.minRows = 4;
    await visualDiff(div, 'min-rows');
  });

  it('max-rows', async () => {
    element.value = Array(10).join('value\n');
    element.maxRows = 4;
    await visualDiff(div, 'max-rows');
  });

  it('single-row', async () => {
    element.minRows = 1;
    element.value = 'value';
    element.clearButtonVisible = true;

    await visualDiff(div, 'single-row');
  });
});
