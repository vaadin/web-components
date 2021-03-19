import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-text-field.js';

describe('text-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-text-field></vaadin-text-field>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'text-field:basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'text-field:disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'text-field:readonly');
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'text-field:label');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'text-field:placeholder');
  });

  it('value', async () => {
    element.value = 'value';
    await visualDiff(div, 'text-field:value');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'text-field:required');
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, 'text-field:error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'text-field:helper-text');
  });

  it('clear button', async () => {
    element.value = 'value';
    element.clearButtonVisible = true;
    await visualDiff(div, 'text-field:clear-button');
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'text-field:prefix');
  });

  it('suffix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'suffix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'text-field:suffix');
  });
});
