import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
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
  });

  describe('interaction', () => {
    beforeEach(() => {
      div.style.paddingTop = '40px';
    });

    afterEach(async () => {
      await resetMouse();
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

    it('active', async () => {
      const input = element.querySelector('input')!;
      await sendMouseToElement({ type: 'move', element: input });
      await sendMouse({ type: 'down' });
      await visualDiff(div, 'active');
    });
  });
});
