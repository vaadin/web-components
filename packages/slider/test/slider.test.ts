import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, middleOfNode, nextRender } from '@vaadin/testing-helpers';
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

    it('should not throw when calling focus() before adding to the DOM', () => {
      expect(() => document.createElement('vaadin-slider').focus()).to.not.throw(Error);
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
  });

  describe('pointer', () => {
    let thumb: Element;
    let y: number;

    beforeEach(async () => {
      slider = fixtureSync('<vaadin-slider style="width: 200px"></vaadin-slider>');
      await nextRender();
      thumb = slider.shadowRoot!.querySelector('[part="thumb"]')!;
      y = Math.round(middleOfNode(thumb).y);
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should update slider value property on thumb pointermove', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      expect(slider.value).to.equal(10);
    });

    it('should only fire change event on thumb pointerup but not pointermove', async () => {
      const spy = sinon.spy();
      slider.addEventListener('change', spy);

      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      expect(spy).to.be.not.called;

      await sendMouse({ type: 'up' });
      expect(spy).to.be.calledOnce;
    });

    it('should fire change event on pointerup outside of the element', async () => {
      const spy = sinon.spy();
      slider.addEventListener('change', spy);

      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y + 100] });
      await sendMouse({ type: 'up' });

      expect(spy).to.be.calledOnce;
    });

    it('should not fire change event on pointerup if value remains the same', async () => {
      const spy = sinon.spy();
      slider.addEventListener('change', spy);

      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      await sendMouse({ type: 'move', position: [0, y] });
      await sendMouse({ type: 'up' });

      expect(spy).to.be.not.called;
    });

    it('should update slider value property on track pointerdown', async () => {
      const track = slider.shadowRoot!.querySelector('[part="track"]')!;

      await sendMouseToElement({ type: 'move', element: track });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.equal(50);
    });

    it('should only fire change event on track pointerup', async () => {
      const track = slider.shadowRoot!.querySelector('[part="track"]')!;

      const spy = sinon.spy();
      slider.addEventListener('change', spy);

      await sendMouseToElement({ type: 'move', element: track });
      await sendMouse({ type: 'down' });
      expect(spy).to.be.not.called;

      await sendMouse({ type: 'up' });
      expect(spy).to.be.calledOnce;
    });

    it('should focus slotted range input on thumb pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      expect(document.activeElement).to.equal(slider.querySelector('input'));
    });

    it('should focus slotted range input on track pointerdown', async () => {
      await sendMouse({ type: 'move', position: [50, y] });
      await sendMouse({ type: 'down' });
      expect(document.activeElement).to.equal(slider.querySelector('input'));
    });

    it('should focus slotted range input on pointerdown below the track', async () => {
      await sendMouse({ type: 'move', position: [50, y + 5] });
      await sendMouse({ type: 'down' });
      expect(document.activeElement).to.not.equal(slider.querySelector('input'));
    });
  });
});
