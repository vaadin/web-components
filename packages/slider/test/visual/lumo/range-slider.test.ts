import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/range-slider.css';
import '../common.js';
import '../../../vaadin-range-slider.js';
import type { RangeSlider } from '../../../vaadin-range-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('range-slider', () => {
  let div: HTMLDivElement;
  let element: RangeSlider;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-range-slider></vaadin-range-slider>', div);
  });

  describe('default', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('value', async () => {
      element.value = [25, 75];
      await visualDiff(div, 'value');
    });

    it('value min', async () => {
      element.value = [0, 50];
      await visualDiff(div, 'value-min');
    });

    it('value max', async () => {
      element.value = [50, 100];
      await visualDiff(div, 'value-max');
    });

    it('value always visible', async () => {
      div.style.padding = '40px 20px 10px';
      element.valueAlwaysVisible = true;
      await visualDiff(div, 'value-always-visible');
    });

    it('min max visible', async () => {
      element.minMaxVisible = true;
      await visualDiff(div, 'min-max-visible');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });

    it('disabled value', async () => {
      element.disabled = true;
      element.value = [25, 75];
      await visualDiff(div, 'disabled-value');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'readonly');
    });

    it('readonly value', async () => {
      element.readonly = true;
      element.value = [25, 75];
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
      div.style.padding = '40px 20px 0';
    });

    it('focus start', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-start');
    });

    it('focus end', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-end');
    });

    it('focus label', async () => {
      element.label = 'Label';
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-label');
    });

    it('focus readonly', async () => {
      element.readonly = true;
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-readonly');
    });
  });

  describe('active', () => {
    let thumbs: Element[];

    beforeEach(() => {
      div.style.paddingTop = '40px';
      element.value = [25, 75];
      thumbs = [...element.shadowRoot!.querySelectorAll('[part~="thumb"]')];
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('active-start', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await visualDiff(div, 'active-start');
    });

    it('active-end', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'down' });
      await visualDiff(div, 'active-end');
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
      element.value = [10, 80];
      await visualDiff(div, 'rtl-basic');
    });

    it('readonly', async () => {
      element.value = [10, 80];
      element.readonly = true;
      await visualDiff(div, 'rtl-readonly');
    });

    it('min max visible', async () => {
      element.minMaxVisible = true;
      await visualDiff(div, 'rtl-min-max-visible');
    });
  });
});
