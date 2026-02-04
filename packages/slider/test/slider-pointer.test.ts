import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, isFirefox, middleOfNode, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-slider.js';
import type { SliderBubble } from '../src/vaadin-slider-bubble.js';
import type { Slider } from '../vaadin-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-slider - pointer', () => {
  let slider: Slider;
  let thumb: Element;
  let track: Element;
  let y: number;

  beforeEach(async () => {
    slider = fixtureSync(`
      <vaadin-slider
        step="10"
        style="width: 200px; --vaadin-slider-thumb-width: 20px"
      ></vaadin-slider>
    `);
    await nextRender();
    thumb = slider.shadowRoot!.querySelector('[part="thumb"]')!;
    track = slider.shadowRoot!.querySelector('[part="track"]')!;
    y = Math.round(middleOfNode(thumb).y);
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('value', () => {
    describe('default', () => {
      it('should update on thumb pointermove', async () => {
        await sendMouseToElement({ type: 'move', element: thumb });
        await sendMouse({ type: 'down' });
        // Half of the thumb = 10px + 10 * 2px = 30px
        await sendMouse({ type: 'move', position: [30, y] });

        expect(slider.value).to.equal(10);
      });

      it('should update on track pointerdown', async () => {
        await sendMouse({ type: 'move', position: [40, y] });
        await sendMouse({ type: 'down' });

        expect(slider.value).to.equal(20);
      });
    });

    describe('RTL', () => {
      let x: number;

      beforeEach(async () => {
        document.documentElement.setAttribute('dir', 'rtl');
        await nextUpdate(slider);
        x = slider.offsetLeft;
      });

      afterEach(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('should update on thumb pointermove', async () => {
        await sendMouseToElement({ type: 'move', element: thumb });
        await sendMouse({ type: 'down' });
        await sendMouse({ type: 'move', position: [x + 30, y] });

        expect(slider.value).to.equal(90);
      });

      it('should update on track pointerdown', async () => {
        await sendMouse({ type: 'move', position: [x + 40, y] });
        await sendMouse({ type: 'down' });

        expect(slider.value).to.equal(80);
      });
    });
  });

  describe('change event', () => {
    let spy: sinon.SinonSpy;

    beforeEach(() => {
      spy = sinon.spy();
      slider.addEventListener('change', spy);
    });

    it('should only fire on thumb pointerup but not pointermove', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      expect(spy).to.be.not.called;

      await sendMouse({ type: 'up' });
      expect(spy).to.be.calledOnce;
    });

    // FIXME: fails in Firefox due to sendMouse instability
    (isFirefox ? it.skip : it)('should fire on pointerup outside of the element', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y + 100] });
      await sendMouse({ type: 'up' });

      expect(spy).to.be.calledOnce;
    });

    it('should not fire on pointerup if value remains the same', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      await sendMouse({ type: 'move', position: [0, y] });
      await sendMouse({ type: 'up' });

      expect(spy).to.be.not.called;
    });

    it('should only fire on track pointerup', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      await sendMouse({ type: 'down' });
      expect(spy).to.be.not.called;

      await sendMouse({ type: 'up' });
      expect(spy).to.be.calledOnce;
    });
  });

  describe('input event', () => {
    let spy: sinon.SinonSpy;

    beforeEach(() => {
      spy = sinon.spy();
      slider.addEventListener('input', spy);
    });

    it('should fire on thumb pointermove', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      expect(spy).to.be.calledOnce;
    });

    it('should fire on track pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      await sendMouse({ type: 'down' });

      expect(spy).to.be.calledOnce;
    });
  });

  describe('focus', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = slider.querySelector('input')!;
    });

    it('should focus slotted range input on thumb pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      expect(document.activeElement).to.equal(input);
    });

    it('should focus slotted range input on track pointerdown', async () => {
      await sendMouse({ type: 'move', position: [50, y] });
      await sendMouse({ type: 'down' });
      expect(document.activeElement).to.equal(input);
    });

    it('should focus slotted range input on pointerdown below the visible track', async () => {
      await sendMouse({ type: 'move', position: [50, y + 5] });
      await sendMouse({ type: 'down' });
      expect(document.activeElement).to.equal(input);
    });

    it('should focus an input on pointerdown on the label element', async () => {
      slider.label = 'Label';
      await nextRender();
      const label = slider.querySelector('[slot="label"]')!;
      await sendMouseToElement({ type: 'click', element: label });
      expect(document.activeElement).to.equal(input);
    });

    it('should not focus an input on pointerdown on the helper element', async () => {
      slider.helperText = 'Helper';
      await nextRender();
      const helper = slider.shadowRoot!.querySelector('[part="helper-text"]')!;
      await sendMouseToElement({ type: 'click', element: helper });
      expect(document.activeElement).to.not.equal(input);
    });
  });

  describe('disabled', () => {
    beforeEach(() => {
      slider.disabled = true;
    });

    it('should not update slider value property on thumb pointermove', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      expect(slider.value).to.equal(0);
    });

    it('should not update slider value property on track pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.equal(0);
    });
  });

  describe('readonly', () => {
    beforeEach(() => {
      slider.readonly = true;
    });

    it('should not update slider value property on thumb pointermove', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      expect(slider.value).to.equal(0);
    });

    it('should not update slider value property on track pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.equal(0);
    });
  });

  describe('active', () => {
    it('should set active attribute on thumb pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });

      expect(slider.hasAttribute('active')).to.be.true;
    });

    it('should remove active attribute on pointerup', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'up' });

      expect(slider.hasAttribute('active')).to.be.false;
    });

    it('should remove active attribute on pointerup outside of the element', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y + 100] });
      await sendMouse({ type: 'up' });

      expect(slider.hasAttribute('active')).to.be.false;
    });

    it('should not set active attribute on label pointerdown', async () => {
      slider.label = 'Label';
      await nextRender();
      const label = slider.querySelector('label')!;
      await sendMouseToElement({ type: 'move', element: label });
      await sendMouse({ type: 'down' });

      expect(slider.hasAttribute('active')).to.be.false;
    });
  });

  describe('bubble', () => {
    let bubble: SliderBubble;
    let focusable: HTMLInputElement;
    let thumb: Element;
    let track: Element;

    beforeEach(async () => {
      // Set margin: 10px on the wrapper to prevent mouse cursor
      // from staying on top of the slider at [0, 0] coordinates
      [focusable, slider] = fixtureSync(
        `<div style="margin: 10px">
          <input id="first-global-focusable" />
          <vaadin-slider></vaadin-slider>
          <input id="last-global-focusable" />
        </div>`,
      ).children as unknown as [HTMLInputElement, Slider];
      await nextRender();
      bubble = slider.querySelector('vaadin-slider-bubble')!;
      thumb = slider.shadowRoot!.querySelector('[part="thumb"]')!;
      track = slider.shadowRoot!.querySelector('[part="track"]')!;
      focusable.focus();
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
      await nextRender();
      expect(bubble.opened).to.be.false;
    });

    it('should close on pointer leave', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubble.opened).to.be.false;
    });

    it('should close on pointer leave if focused', async () => {
      await sendMouseToElement({ type: 'click', element: thumb });
      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubble.opened).to.be.false;
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
