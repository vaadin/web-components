import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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
  });
});
