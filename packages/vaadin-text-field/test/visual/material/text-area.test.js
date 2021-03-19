import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
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
    await visualDiff(div, 'text-area:basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'text-area:disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'text-area:readonly');
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'text-area:label');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'text-area:placeholder');
  });

  it('value', async () => {
    element.value = 'value';
    await visualDiff(div, 'text-area:value');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'text-area:required');
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, 'text-area:error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'text-area:helper-text');
  });

  it('clear button', async () => {
    element.value = 'value';
    element.clearButtonVisible = true;
    await visualDiff(div, 'text-area:clear-button');
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'text-area:prefix');
  });

  it('suffix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'suffix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'text-area:suffix');
  });
});
