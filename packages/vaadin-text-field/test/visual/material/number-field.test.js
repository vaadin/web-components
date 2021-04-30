import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-number-field.js';

describe('number-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-number-field></vaadin-number-field>', div);
  });

  it('basic', async () => {
    await visualDiff(div, `${import.meta.url}_basic`);
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, `${import.meta.url}_disabled`);
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, `${import.meta.url}_readonly`);
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, `${import.meta.url}_label`);
  });

  it('placeholder', async () => {
    element.placeholder = 'Number';
    await visualDiff(div, `${import.meta.url}_placeholder`);
  });

  it('value', async () => {
    element.value = 10;
    await visualDiff(div, `${import.meta.url}_value`);
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, `${import.meta.url}_required`);
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, `${import.meta.url}_error-message`);
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, `${import.meta.url}_helper-text`);
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, `${import.meta.url}_prefix`);
  });

  it('suffix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'suffix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, `${import.meta.url}_suffix`);
  });

  it('controls', async () => {
    element.hasControls = true;
    await visualDiff(div, `${import.meta.url}_controls`);
  });
});
