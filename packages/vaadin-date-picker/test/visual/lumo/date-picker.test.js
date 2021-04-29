import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-date-picker.js';
import '../../not-animated-styles.js';

describe('date-picker', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-date-picker></vaadin-date-picker>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'date-picker:basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'date-picker:disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'date-picker:readonly');
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'date-picker:label');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'date-picker:placeholder');
  });

  it('value', async () => {
    element.value = '1991-12-20';
    await visualDiff(div, 'date-picker:value');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'date-picker:required');
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, 'date-picker:error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'date-picker:helper-text');
  });

  it('clear button', async () => {
    element.value = '1991-12-20';
    element.clearButtonVisible = true;
    await visualDiff(div, 'date-picker:clear-button');
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'date-picker:prefix');
  });
});
