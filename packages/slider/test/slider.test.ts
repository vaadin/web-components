import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-slider.js';
import type { SliderBubble } from '../src/vaadin-slider-bubble.js';
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

  describe('bubble', () => {
    let bubble: SliderBubble;
    let thumb: Element;
    let track: Element;

    beforeEach(async () => {
      // Set margin: 10px on the wrapper to prevent mouse cursor
      // from staying on top of the slider at [0, 0] coordinates
      [slider] = fixtureSync(
        `<div style="margin: 10px">
          <vaadin-slider></vaadin-slider>
          <input id="last-global-focusable" />
        </div>`,
      ).children as unknown as [Slider];
      await nextRender();
      bubble = slider.querySelector('vaadin-slider-bubble')!;
      thumb = slider.shadowRoot!.querySelector('[part="thumb"]')!;
      track = slider.shadowRoot!.querySelector('[part="track"]')!;
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should open on keyboard focus', async () => {
      await sendKeys({ press: 'Tab' });
      expect(bubble.opened).to.be.true;
    });

    it('should close on keyboard blur', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(bubble.opened).to.be.false;
    });

    it('should open on pointer enter over thumb', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      expect(bubble.opened).to.be.true;
    });

    it('should open on pointer move from track to thumb', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      expect(bubble.opened).to.be.false;

      await sendMouseToElement({ type: 'move', element: thumb });
      expect(bubble.opened).to.be.true;
    });

    it('should not open on pointer move outside thumb', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      expect(bubble.opened).to.be.false;
    });

    it('should close on pointer leave', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubble.opened).to.be.false;
    });

    it('should not close on pointer leave if focused', async () => {
      await sendMouseToElement({ type: 'click', element: thumb });
      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubble.opened).to.be.true;
    });

    it('should open on programmatic focus', () => {
      slider.focus();
      expect(bubble.opened).to.be.true;
    });

    it('should close on programmatic blur', () => {
      slider.focus();
      expect(bubble.opened).to.be.true;

      slider.blur();
      expect(bubble.opened).to.be.false;
    });

    it('should open when valueAlwaysVisible is set to true', async () => {
      slider.valueAlwaysVisible = true;
      await nextRender();
      expect(bubble.opened).to.be.true;
    });

    it('should close when valueAlwaysVisible is set to false', async () => {
      slider.valueAlwaysVisible = true;
      await nextRender();
      expect(bubble.opened).to.be.true;

      slider.valueAlwaysVisible = false;
      await nextRender();
      expect(bubble.opened).to.be.false;
    });
  });
});
