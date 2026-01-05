import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/text-field/test/visual/common.js';
import '@vaadin/aura/aura.css';
import '../../../vaadin-password-field.js';

describe('password-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-password-field></vaadin-password-field>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('value', async () => {
    element.value = 'value';
    await visualDiff(div, 'value');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'placeholder');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('disabled value', async () => {
    element.disabled = true;
    element.value = 'value';
    await visualDiff(div, 'disabled-value');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('reveal button hidden', async () => {
    element.value = 'value';
    element.revealButtonHidden = true;
    await visualDiff(div, 'reveal-button-hidden');
  });

  it('reveal button focus', async () => {
    element.focus();
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'reveal-button-focus');
  });
});
