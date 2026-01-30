import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-slider.js';
import type { Slider } from '../vaadin-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-slider', () => {
  let slider: Slider;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      slider = fixtureSync('<vaadin-slider></vaadin-slider>');
      tagName = slider.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('value property', () => {
    beforeEach(async () => {
      slider = fixtureSync('<vaadin-slider></vaadin-slider>');
      slider.value = 2;
      await nextRender();
    });

    it('should not update the value when changing min', () => {
      slider.min = 3;
      expect(slider.value).to.equal(2);
    });

    it('should not update the value when changing max', () => {
      slider.max = 1;
      expect(slider.value).to.equal(2);
    });

    it('should not update the value when changing step', () => {
      slider.step = 1.5;
      expect(slider.value).to.equal(2);
    });
  });

  describe('focus', () => {
    let firstGlobalFocusable: HTMLElement;
    let lastGlobalFocusable: HTMLElement;
    let input: HTMLInputElement;

    beforeEach(async () => {
      const wrapper = fixtureSync(`
        <div>
          <input id="first-global-focusable" />
          <vaadin-slider></vaadin-slider>
          <input id="last-global-focusable" />
        </div>
      `);
      [firstGlobalFocusable, slider as any, lastGlobalFocusable] = Array.from(wrapper.children) as HTMLElement[];
      await nextRender();
      input = slider.querySelector('input')!;
    });

    it('should focus the input on previous focusable Tab', async () => {
      firstGlobalFocusable.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(input);
    });

    it('should focus the input on next focusable Shift + Tab', async () => {
      lastGlobalFocusable.focus();
      await sendKeys({ press: 'Shift+Tab' });
      expect(document.activeElement).to.equal(input);
    });

    it('should focus the input on focus()', () => {
      slider.focus();
      expect(document.activeElement).to.equal(input);
    });

    it('should not focus the input on focus() when disabled', () => {
      slider.disabled = true;
      slider.focus();
      expect(document.activeElement).to.not.equal(input);
    });

    it('should focus the input on required indicator click', () => {
      slider.required = true;
      const indicator = slider.shadowRoot!.querySelector('[part="required-indicator"]') as HTMLElement;
      indicator.click();
      expect(document.activeElement).to.equal(input);
    });

    it('should not throw when calling focus() before adding to the DOM', () => {
      expect(() => document.createElement('vaadin-slider').focus()).to.not.throw(Error);
    });

    it('should blur the input on blur()', () => {
      slider.focus();
      slider.blur();
      expect(document.activeElement).to.not.equal(input);
    });
  });

  describe('keyboard input', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      slider = fixtureSync('<vaadin-slider></vaadin-slider>');
      await nextRender();
      input = slider.querySelector('input')!;
      input.focus();
    });

    it('should increase value on input Arrow Right', async () => {
      await sendKeys({ press: 'ArrowRight' });
      expect(slider.value).to.equal(1);
    });

    it('should increase value boundary on input Arrow Up', async () => {
      await sendKeys({ press: 'ArrowUp' });
      expect(slider.value).to.equal(1);
    });

    it('should decrease value on input Arrow Left', async () => {
      slider.value = 100;
      await sendKeys({ press: 'ArrowLeft' });
      expect(slider.value).to.equal(99);
    });

    it('should decrease value on input Arrow Down', async () => {
      slider.value = 100;
      await sendKeys({ press: 'ArrowDown' });
      expect(slider.value).to.equal(99);
    });

    it('should not decrease value past min value', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      expect(slider.value).to.equal(0);
    });

    it('should not increase value past max value', async () => {
      slider.value = 100;
      await sendKeys({ press: 'ArrowRight' });
      expect(slider.value).to.equal(100);
    });

    it('should fire single change event on input value change', async () => {
      const spy = sinon.spy();
      slider.addEventListener('change', spy);
      await sendKeys({ press: 'ArrowRight' });
      expect(spy).to.be.calledOnce;
    });

    it('should preserve decimals when changing value using fractional step', async () => {
      slider.value = 3;
      slider.step = 1.5;
      await sendKeys({ press: 'ArrowLeft' });
      expect(slider.value).to.equal(1.5);
    });

    it('should not increase value past max allowed value with fractional step', async () => {
      slider.step = 1.5;
      slider.value = 99;
      await sendKeys({ press: 'ArrowRight' });
      expect(slider.value).to.equal(99);
    });

    it('should not change value on arrow key when readonly', async () => {
      slider.readonly = true;
      await sendKeys({ press: 'ArrowRight' });
      expect(slider.value).to.equal(0);
    });
  });
});
