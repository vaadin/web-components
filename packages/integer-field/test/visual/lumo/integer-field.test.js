import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/text-field/test/visual/not-animated-styles.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/integer-field.css';
import '../../../vaadin-integer-field.js';

describe('integer-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-integer-field></vaadin-integer-field>', div);
  });

  describe('label aside', () => {
    beforeEach(() => {
      element.setAttribute('theme', 'label-aside');
      element.label = 'Label';
    });

    it('default', async () => {
      await visualDiff(div, 'label-aside');
    });

    it('no label', async () => {
      element.label = '';
      await visualDiff(div, 'label-aside-no-label');
    });

    it('wrapped label', async () => {
      element.label = 'Label that wraps on multiple lines';
      element.style.setProperty('--vaadin-input-field-label-aside-width', '8em');
      await visualDiff(div, 'label-aside-wrapped-label');
    });

    it('required', async () => {
      element.required = true;
      await visualDiff(div, 'label-aside-required');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'label-aside-helper-text');
    });

    it('error message', async () => {
      element.errorMessage = 'This field is required';
      element.invalid = true;
      await visualDiff(div, 'label-aside-error-message');
    });

    it('helper above field', async () => {
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'label-aside helper-above-field');
      await visualDiff(div, 'label-aside-helper-above-field');
    });

    it('custom width and gap', async () => {
      element.style.setProperty('--vaadin-input-field-label-aside-width', '6em');
      element.style.setProperty('--vaadin-input-field-label-aside-gap', '2em');
      await visualDiff(div, 'label-aside-custom-width-gap');
    });

    it('RTL', async () => {
      element.setAttribute('dir', 'rtl');
      element.required = true;
      element.helperText = 'Helper text';
      await visualDiff(div, 'label-aside-rtl');
    });

    it('small', async () => {
      element.setAttribute('theme', 'label-aside small');
      await visualDiff(div, 'label-aside-small');
    });
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('value', async () => {
    element.value = 10;
    await visualDiff(div, 'value');
  });

  it('clear button', async () => {
    element.value = 10;
    element.clearButtonVisible = true;
    await visualDiff(div, 'clear-button');
  });

  it('step buttons visible', async () => {
    element.stepButtonsVisible = true;
    element.value = 5;
    await visualDiff(div, 'step-buttons-visible');
  });
});
