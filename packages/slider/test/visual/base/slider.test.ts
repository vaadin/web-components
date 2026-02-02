import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-slider.js';
import type { Slider } from '../../../src/vaadin-slider.js';

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

  it('keyboard focus', async () => {
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'focus');
  });

  it('readonly focus', async () => {
    element.readonly = true;
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'focus-readonly');
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
