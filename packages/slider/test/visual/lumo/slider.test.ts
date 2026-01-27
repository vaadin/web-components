import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/slider.css';
import '../common.js';
import '../../../vaadin-slider.js';
import type { Slider } from '../../../vaadin-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('slider', () => {
  let div: HTMLDivElement;
  let element: Slider;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-slider></vaadin-slider>', div);
  });

  describe('default', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('value', async () => {
      element.value = 50;
      await visualDiff(div, 'value');
    });

    it('value max', async () => {
      element.value = 100;
      await visualDiff(div, 'value-max');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });

    it('disabled value', async () => {
      element.disabled = true;
      element.value = 50;
      await visualDiff(div, 'disabled-value');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'readonly');
    });

    it('readonly value', async () => {
      element.readonly = true;
      element.value = 50;
      await visualDiff(div, 'readonly-value');
    });

    it('focus', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus');
    });

    it('readonly focus', async () => {
      element.readonly = true;
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-readonly');
    });

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'label');
    });

    it('label focused', async () => {
      element.label = 'Label';
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'label-focused');
    });

    it('label disabled', async () => {
      element.label = 'Label';
      element.disabled = true;
      await visualDiff(div, 'label-disabled');
    });

    it('required', async () => {
      element.label = 'Label';
      element.required = true;
      await visualDiff(div, 'required');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'helper-text');
    });

    it('helper above field', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'helper-above-field');
      await visualDiff(div, 'helper-above-field');
    });
  });
});
