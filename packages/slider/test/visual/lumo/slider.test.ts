import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
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

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'label');
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
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'helper-above-field');
      await visualDiff(div, 'helper-above-field');
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      div.style.paddingTop = '40px';
    });

    it('focus', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus');
    });

    it('focus readonly', async () => {
      element.readonly = true;
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-readonly');
    });

    it('focus label', async () => {
      element.label = 'Label';
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-label');
    });
  });

  describe('theme', () => {
    it('contrast', async () => {
      element.value = 50;
      element.setAttribute('theme', 'contrast');
      await visualDiff(div, 'theme-contrast');
    });

    it('success', async () => {
      element.value = 50;
      element.setAttribute('theme', 'success');
      await visualDiff(div, 'theme-success');
    });

    it('error', async () => {
      element.value = 50;
      element.setAttribute('theme', 'error');
      await visualDiff(div, 'theme-error');
    });
  });

  describe('active', () => {
    let input: HTMLElement;

    beforeEach(() => {
      div.style.paddingTop = '40px';
      element.value = 50;
      input = element.querySelector('input')!;
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('active', async () => {
      await sendMouseToElement({ type: 'move', element: input });
      await sendMouse({ type: 'down' });
      await visualDiff(div, 'active');
    });

    it('contrast active', async () => {
      element.setAttribute('theme', 'contrast');
      await sendMouseToElement({ type: 'move', element: input });
      await sendMouse({ type: 'down' });
      await visualDiff(div, 'theme-contrast-active');
    });

    it('success active', async () => {
      element.setAttribute('theme', 'success');
      await sendMouseToElement({ type: 'move', element: input });
      await sendMouse({ type: 'down' });
      await visualDiff(div, 'theme-success-active');
    });

    it('error active', async () => {
      element.setAttribute('theme', 'error');
      await sendMouseToElement({ type: 'move', element: input });
      await sendMouse({ type: 'down' });
      await visualDiff(div, 'theme-error-active');
    });
  });

  describe('RTL', () => {
    beforeEach(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    afterEach(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('basic', async () => {
      element.value = 50;
      await visualDiff(div, 'rtl-basic');
    });

    it('readonly', async () => {
      element.value = 50;
      element.readonly = true;
      await visualDiff(div, 'rtl-readonly');
    });
  });
});
