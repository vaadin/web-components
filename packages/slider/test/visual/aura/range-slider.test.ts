import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
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
});
