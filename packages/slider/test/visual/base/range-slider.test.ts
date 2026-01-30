import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-range-slider.js';
import type { RangeSlider } from '../../../src/vaadin-range-slider.js';

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

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('value', async () => {
    element.value = [25, 75];
    await visualDiff(div, 'value');
  });

  it('value same', async () => {
    element.value = [50, 50];
    await visualDiff(div, 'value-same');
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

    it('focus label', async () => {
      element.label = 'Label';
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-label');
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
  });
});
