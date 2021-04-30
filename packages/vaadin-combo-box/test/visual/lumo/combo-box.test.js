import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-combo-box.js';
import '../../not-animated-styles.js';

describe('combo-box', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-combo-box></vaadin-combo-box>', div);
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
    element.placeholder = 'Placeholder';
    await visualDiff(div, `${import.meta.url}_placeholder`);
  });

  it('value', async () => {
    element.allowCustomValue = true;
    element.value = 'value';
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

  it('clear button', async () => {
    element.allowCustomValue = true;
    element.value = 'value';
    element.clearButtonVisible = true;
    await visualDiff(div, `${import.meta.url}_clear-button`);
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, `${import.meta.url}_prefix`);
  });
});
