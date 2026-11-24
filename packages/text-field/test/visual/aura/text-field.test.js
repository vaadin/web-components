import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../not-animated-styles.css';
import '../../../vaadin-text-field.js';

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

  it('value', async () => {
    element.value = 'value';
    await visualDiff(div, 'value');
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

  it('invalid', async () => {
    element.invalid = true;
    await visualDiff(div, 'invalid');
  });

  // The default invalid background is too subtle for the screenshot diff to detect,
  // so use an opaque color to verify that disabled and readonly take precedence.
  describe('invalid background', () => {
    beforeEach(() => {
      element.style.setProperty('--vaadin-input-field-invalid-background', 'red');
      element.invalid = true;
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled-invalid');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'readonly-invalid');
    });
  });

  it('label aside', async () => {
    element.setAttribute('theme', 'label-aside');
    element.label = 'Label';
    await visualDiff(div, 'label-aside');
  });
});
