import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-range-slider.js';
import type { SliderBubble } from '../src/vaadin-slider-bubble.js';
import type { RangeSlider } from '../vaadin-range-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-range-slider', () => {
  let slider: RangeSlider;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      slider = fixtureSync('<vaadin-range-slider></vaadin-range-slider>');
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
      slider = fixtureSync('<vaadin-range-slider></vaadin-range-slider>');
      slider.value = [1, 3];
      await nextRender();
    });

    it('should not update the value when changing min', () => {
      slider.min = 2;
      expect(slider.value).to.deep.equal([1, 3]);
    });

    it('should not update the value when changing max', () => {
      slider.max = 2;
      expect(slider.value).to.deep.equal([1, 3]);
    });

    it('should not update the value when changing step', () => {
      slider.step = 1.5;
      expect(slider.value).to.deep.equal([1, 3]);
    });
  });

  describe('focus', () => {
    let firstGlobalFocusable: HTMLElement;
    let lastGlobalFocusable: HTMLElement;
    let inputs: HTMLInputElement[];

    function expectInputFocus(idx: number) {
      expect(document.activeElement).to.equal(inputs[idx]);
      expect(slider.hasAttribute(`${idx === 0 ? 'start' : 'end'}-focused`)).to.be.true;
      expect(slider.hasAttribute(`${idx === 0 ? 'end' : 'start'}-focused`)).to.be.false;
    }

    beforeEach(async () => {
      const wrapper = fixtureSync(`
        <div>
          <input id="first-global-focusable" />
          <vaadin-range-slider></vaadin-range-slider>
          <input id="last-global-focusable" />
        </div>
      `);
      [firstGlobalFocusable, slider as any, lastGlobalFocusable] = Array.from(wrapper.children) as HTMLElement[];
      await nextRender();
      inputs = [...slider.querySelectorAll('input')];
    });

    it('should set start-focused attribute on previous focusable Tab', async () => {
      firstGlobalFocusable.focus();
      await sendKeys({ press: 'Tab' });
      expectInputFocus(0);
    });

    it('should focus the second input on first input Tab', async () => {
      firstGlobalFocusable.focus();
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Tab' });
      expectInputFocus(1);
    });

    it('should focus the second input on next focusable Shift + Tab', async () => {
      lastGlobalFocusable.focus();
      await sendKeys({ press: 'Shift+Tab' });
      expectInputFocus(1);
    });

    it('should set start-focused attribute on second input Shift + Tab', async () => {
      lastGlobalFocusable.focus();
      await sendKeys({ press: 'Shift+Tab' });

      await sendKeys({ press: 'Shift+Tab' });
      expectInputFocus(0);
    });

    it('should focus first input and set start-focused attribute on focus()', () => {
      slider.focus();
      expectInputFocus(0);
    });

    it('should remove start-focused attribute when focus leaves slider', async () => {
      slider.focus();
      await sendKeys({ press: 'Shift+Tab' });
      expect(slider.hasAttribute('start-focused')).to.be.false;
    });

    it('should remove start-focused attribute when focus leaves slider', async () => {
      slider.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(slider.hasAttribute('end-focused')).to.be.false;
    });

    it('should not focus any of the inputs on focus() when disabled', () => {
      slider.disabled = true;
      slider.focus();
      expect(document.activeElement).to.not.equal(inputs[0]);
      expect(document.activeElement).to.not.equal(inputs[1]);
    });

    it('should focus the input on required indicator click', () => {
      slider.required = true;
      const indicator = slider.shadowRoot!.querySelector('[part="required-indicator"]') as HTMLElement;
      indicator.click();
      expect(document.activeElement).to.equal(inputs[0]);
    });

    it('should not throw when calling focus() before adding to the DOM', () => {
      expect(() => document.createElement('vaadin-range-slider').focus()).to.not.throw(Error);
    });

    it('should blur the start input on blur()', () => {
      inputs[0].focus();
      slider.blur();
      expect(document.activeElement).to.not.equal(inputs[0]);
    });

    it('should blur the end input on blur()', () => {
      inputs[1].focus();
      slider.blur();
      expect(document.activeElement).to.not.equal(inputs[1]);
    });
  });

  describe('bubble', () => {
    let bubbles: SliderBubble[];
    let focusable: HTMLInputElement;
    let thumbs: Element[];
    let track: Element;

    beforeEach(async () => {
      // Set margin: 10px on the wrapper to prevent mouse cursor
      // from staying on top of the slider at [0, 0] coordinates
      [focusable, slider] = fixtureSync(
        `<div style="margin: 10px">
          <input id="first-global-focusable" />
          <vaadin-range-slider></vaadin-range-slider>
          <input id="last-global-focusable" />
        </div>`,
      ).children as unknown as [HTMLInputElement, RangeSlider];
      await nextRender();
      bubbles = [...slider.querySelectorAll('vaadin-slider-bubble')];
      thumbs = [...slider.shadowRoot!.querySelectorAll('[part~="thumb"]')];
      track = slider.shadowRoot!.querySelector('[part="track"]')!;
      focusable.focus();
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should open start bubble on keyboard focus', async () => {
      await sendKeys({ press: 'Tab' });
      expect(bubbles[0].opened).to.be.true;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should close start bubble on keyboard blur', async () => {
      await sendKeys({ press: 'Tab' });
      expect(bubbles[0].opened).to.be.true;

      await sendKeys({ press: 'Shift+Tab' });
      expect(bubbles[0].opened).to.be.false;
    });

    it('should open end bubble on keyboard focus', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.true;
    });

    it('should close end bubble on keyboard blur', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(bubbles[1].opened).to.be.true;

      await sendKeys({ press: 'Tab' });
      expect(bubbles[1].opened).to.be.false;
    });

    it('should open start bubble on pointer enter over start thumb', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      expect(bubbles[0].opened).to.be.true;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should open end bubble on pointer enter over end thumb', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.true;
    });

    it('should open start bubble on pointer move from track to start thumb', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      expect(bubbles[0].opened).to.be.false;

      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      expect(bubbles[0].opened).to.be.true;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should open end bubble on pointer move from track to end thumb', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      expect(bubbles[1].opened).to.be.false;

      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.true;
    });

    it('should not open bubbles on pointer move outside thumbs', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should close start bubble on pointer leave', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubbles[0].opened).to.be.false;
    });

    it('should close end bubble on pointer leave', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubbles[1].opened).to.be.false;
    });

    it('should close start bubble on pointer leave if focused', async () => {
      await sendMouseToElement({ type: 'click', element: thumbs[0] });
      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should close end bubble on pointer leave if focused', async () => {
      await sendMouseToElement({ type: 'click', element: thumbs[1] });
      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should close start bubble open on hover when focusing the second input', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.true;
    });

    it('should close end bubble open on hover when focusing the first input', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendKeys({ press: 'Tab' });
      expect(bubbles[0].opened).to.be.true;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should close start bubble open on focus when moving pointer over end thumb', async () => {
      await sendKeys({ press: 'Tab' });
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.true;
    });

    it('should close end bubble open on focus on moving pointer over start thumb', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      expect(bubbles[0].opened).to.be.true;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should open start bubble on programmatic focus', () => {
      slider.focus();
      expect(bubbles[0].opened).to.be.true;
    });

    it('should close start bubble on programmatic blur', () => {
      slider.focus();
      expect(bubbles[0].opened).to.be.true;

      slider.blur();
      expect(bubbles[0].opened).to.be.false;
    });

    it('should open both bubbles when valueAlwaysVisible is set to true', async () => {
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.false;

      slider.valueAlwaysVisible = true;
      await nextRender();
      expect(bubbles[0].opened).to.be.true;
      expect(bubbles[1].opened).to.be.true;
    });

    it('should close both bubbles when valueAlwaysVisible is set to false', async () => {
      slider.valueAlwaysVisible = true;
      await nextRender();
      expect(bubbles[0].opened).to.be.true;
      expect(bubbles[1].opened).to.be.true;

      slider.valueAlwaysVisible = false;
      await nextRender();
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.false;
    });
  });
});
