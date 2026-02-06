import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, isFirefox, middleOfNode, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-range-slider.js';
import type { SliderBubble } from '../src/vaadin-slider-bubble.js';
import type { RangeSlider } from '../vaadin-range-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

// Pointer tests randomly fail in Firefox
(isFirefox ? describe.skip : describe)('vaadin-range-slider - pointer', () => {
  let slider: RangeSlider;
  let track: HTMLElement;
  let thumbs: Element[];
  let inputs: HTMLInputElement[];

  function middleOfThumb(idx: number) {
    const { x, y } = middleOfNode(thumbs[idx]);
    return {
      x: Math.round(x),
      y: Math.round(y),
    };
  }

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div style="display: flex; flex-direction: column">
        <input id="first-global-focusable" />
        <vaadin-range-slider
          step="10"
          style="width: 200px; --vaadin-slider-thumb-width: 20px"
        ></vaadin-range-slider>
        <input id="last-global-focusable" />
      </div>
    `);
    slider = wrapper.querySelector('vaadin-range-slider')!;
    await nextRender();
    thumbs = [...slider.shadowRoot!.querySelectorAll('[part~="thumb"]')];
    track = slider.shadowRoot!.querySelector('[part="track"]')!;
    inputs = [...slider.querySelectorAll('input')];
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('value', () => {
    describe('default', () => {
      it('should update slider value property on first thumb pointermove', async () => {
        await sendMouseToElement({ type: 'move', element: thumbs[0] });
        await sendMouse({ type: 'down' });
        // Half of the thumb = 10px + 10 * 2px = 20px
        await sendMouse({ type: 'move', position: [30, 10] });

        expect(slider.value).to.deep.equal([10, 100]);
      });

      it('should update slider value property on second thumb pointermove', async () => {
        await sendMouseToElement({ type: 'move', element: thumbs[1] });
        await sendMouse({ type: 'down' });
        // Half of the thumb = 10px + 10 * 2px = 30px
        await sendMouse({ type: 'move', position: [170, 10] });

        expect(slider.value).to.deep.equal([0, 90]);
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

      it('should update slider value property on first thumb pointermove', async () => {
        await sendMouseToElement({ type: 'move', element: thumbs[0] });
        await sendMouse({ type: 'down' });
        // Half of the thumb = 10px + 10 * 2px = 30px
        await sendMouse({ type: 'move', position: [x + 170, 10] });

        expect(slider.value).to.deep.equal([10, 100]);
      });

      it('should update slider value property on second thumb pointermove', async () => {
        await sendMouseToElement({ type: 'move', element: thumbs[1] });
        await sendMouse({ type: 'down' });
        // Half of the thumb = 10px + 10 * 2px = 30px
        await sendMouse({ type: 'move', position: [x + 30, 10] });

        expect(slider.value).to.deep.equal([0, 90]);
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
      const { x, y } = middleOfThumb(0);

      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x + 20, y] });

      expect(spy).to.be.not.called;

      await sendMouse({ type: 'up' });
      expect(spy).to.be.calledOnce;
    });

    it('should fire on pointerup outside of the element', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, 100] });
      await sendMouse({ type: 'up' });

      expect(spy).to.be.calledOnce;
    });

    it('should not fire on pointerup if value remains the same', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, 10] });

      await sendMouse({ type: 'move', position: [0, 10] });
      await sendMouse({ type: 'up' });

      expect(spy).to.be.not.called;
    });

    it('should only fire on track pointerup', async () => {
      slider.value = [20, 80];

      const { x, y } = middleOfThumb(0);

      await sendMouse({ type: 'move', position: [x - 20, y] });
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
      const { x, y } = middleOfThumb(0);

      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x + 20, y] });

      expect(spy).to.be.calledOnce;
    });

    it('should fire on track pointerdown', async () => {
      slider.value = [20, 80];

      const { x, y } = middleOfThumb(0);

      await sendMouse({ type: 'move', position: [x - 20, y] });
      await sendMouse({ type: 'down' });

      expect(spy).to.be.calledOnce;
    });
  });

  describe('track', () => {
    beforeEach(() => {
      slider.value = [20, 80];
    });

    it('should focus first input on track pointerdown before the first thumb', async () => {
      const { x, y } = middleOfThumb(0);
      await sendMouse({ type: 'move', position: [x - 20, y] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([10, 80]);
      expect(document.activeElement).to.equal(inputs[0]);
    });

    it('should focus second input on track pointerdown after the second thumb', async () => {
      const { x, y } = middleOfThumb(1);
      await sendMouse({ type: 'move', position: [x + 20, y] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([20, 90]);
      expect(document.activeElement).to.equal(inputs[1]);
    });

    it('should focus first input on track pointerdown between thumbs closer to the first one', async () => {
      const { x, y } = middleOfThumb(0);
      await sendMouse({ type: 'move', position: [x + 30, y] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([40, 80]);
      expect(document.activeElement).to.equal(inputs[0]);
    });

    it('should focus second input on track pointerdown between thumbs closer to the second one', async () => {
      const { x, y } = middleOfThumb(1);
      await sendMouse({ type: 'move', position: [x - 30, y] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([20, 60]);
      expect(document.activeElement).to.equal(inputs[1]);
    });

    it('should focus an input on pointerdown below the visible track', async () => {
      const { y } = middleOfThumb(0);

      await sendMouse({ type: 'move', position: [50, y + 10] });
      await sendMouse({ type: 'down' });
      expect(document.activeElement).to.equal(inputs[0]);
    });

    it('should focus an input on pointerdown on the label element', async () => {
      slider.label = 'Label';
      await nextRender();
      const label = slider.shadowRoot!.querySelector('[part="label"]')!;
      await sendMouseToElement({ type: 'click', element: label });
      expect(document.activeElement).to.equal(inputs[0]);
    });

    it('should not focus an input on pointerdown on the helper element', async () => {
      slider.helperText = 'Helper';
      await nextRender();
      const helper = slider.shadowRoot!.querySelector('[part="helper-text"]')!;
      await sendMouseToElement({ type: 'click', element: helper });
      inputs.forEach((input) => {
        expect(document.activeElement).to.not.equal(input);
      });
    });
  });

  describe('thumbs limits', () => {
    beforeEach(() => {
      slider.value = [40, 60];
    });

    it('should use the first thumb position as a min limit on second thumb pointermove', async () => {
      const { x, y } = middleOfThumb(1);

      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x + 20, y] });
      await sendMouse({ type: 'up' });

      expect(slider.value).to.deep.equal([60, 60]);
    });

    it('should use the second thumb position as a max limit on first thumb pointermove', async () => {
      const { x, y } = middleOfThumb(0);

      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x - 20, y] });
      await sendMouse({ type: 'up' });

      expect(slider.value).to.deep.equal([40, 40]);
    });

    it('should use the first thumb position as a min limit on when min is a negative value', async () => {
      slider.min = -100;
      slider.max = 100;
      slider.value = [0, 10];

      const { x, y } = middleOfThumb(1);

      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x + -40, y] });
      await sendMouse({ type: 'up' });

      expect(slider.value).to.deep.equal([0, 0]);
    });
  });

  describe('thumbs on top of each other', () => {
    let x: number, y: number;

    beforeEach(() => {
      slider.value = [50, 50];
      ({ x, y } = middleOfThumb(0));
    });

    it('should focus first input and move first thumb on pointerdown closer to the left', async () => {
      await sendMouse({ type: 'move', position: [x - 5, y] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x - 20, y] });

      expect(document.activeElement).to.equal(inputs[0]);
      expect(slider.value).to.deep.equal([40, 50]);
    });

    it('should not move first thumb to the right on pointerdown closer to the left', async () => {
      await sendMouse({ type: 'move', position: [x - 5, y] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x + 20, y] });

      expect(slider.value).to.deep.equal([50, 50]);
    });

    it('should focus second input and move second thumb on pointerdown closer to the right', async () => {
      await sendMouse({ type: 'move', position: [x + 5, y] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x + 20, y] });

      expect(slider.value).to.deep.equal([50, 60]);
      expect(document.activeElement).to.equal(inputs[1]);
    });

    it('should not move second thumb to the left on pointerdown closer to the right', async () => {
      await sendMouse({ type: 'move', position: [x + 5, y] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [x - 20, y] });

      expect(slider.value).to.deep.equal([50, 50]);
    });
  });

  describe('disabled', () => {
    beforeEach(() => {
      slider.disabled = true;
    });

    it('should not update value property on thumb pointermove', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, 10] });

      expect(slider.value).to.deep.equal([0, 100]);
    });

    it('should not update value property on track pointerdown', async () => {
      slider.value = [20, 80];

      await sendMouse({ type: 'move', position: [10, 10] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([20, 80]);
    });
  });

  describe('readonly', () => {
    beforeEach(() => {
      slider.readonly = true;
    });

    it('should not update value property on thumb pointermove', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, 10] });

      expect(slider.value).to.deep.equal([0, 100]);
    });

    it('should not update value property on track pointerdown', async () => {
      slider.value = [20, 80];

      await sendMouse({ type: 'move', position: [10, 10] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([20, 80]);
    });
  });

  describe('start-active', () => {
    it('should set start-active attribute on start thumb pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });

      expect(slider.hasAttribute('start-active')).to.be.true;
      expect(slider.hasAttribute('end-active')).to.be.false;
    });

    it('should remove start-active attribute on pointerup', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'up' });

      expect(slider.hasAttribute('start-active')).to.be.false;
    });

    it('should remove start-active attribute on pointerup outside of the element', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, 100] });
      await sendMouse({ type: 'up' });

      expect(slider.hasAttribute('start-active')).to.be.false;
    });

    it('should not set start-active attribute on label pointerdown', async () => {
      slider.label = 'Label';
      await nextRender();
      const label = slider.querySelector('label')!;
      await sendMouseToElement({ type: 'move', element: label });
      await sendMouse({ type: 'down' });

      expect(slider.hasAttribute('start-active')).to.be.false;
    });

    it('should not set start-active attribute on start thumb pointerdown when readonly', async () => {
      slider.readonly = true;
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });

      expect(slider.hasAttribute('start-active')).to.be.false;
    });
  });

  describe('end-active', () => {
    it('should set end-active attribute on end thumb pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'down' });

      expect(slider.hasAttribute('end-active')).to.be.true;
      expect(slider.hasAttribute('start-active')).to.be.false;
    });

    it('should remove end-active attribute on pointerup', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'up' });

      expect(slider.hasAttribute('end-active')).to.be.false;
    });

    it('should remove end-active attribute on pointerup outside of the element', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, 100] });
      await sendMouse({ type: 'up' });

      expect(slider.hasAttribute('end-active')).to.be.false;
    });

    it('should not set end-active attribute on label pointerdown', async () => {
      slider.label = 'Label';
      await nextRender();
      const label = slider.querySelector('label')!;
      await sendMouseToElement({ type: 'move', element: label });
      await sendMouse({ type: 'down' });

      expect(slider.hasAttribute('end-active')).to.be.false;
    });

    it('should not set end-active attribute on end thumb pointerdown when readonly', async () => {
      slider.readonly = true;
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'down' });

      expect(slider.hasAttribute('end-active')).to.be.false;
    });
  });

  describe('bubble', () => {
    let bubbles: SliderBubble[];
    let focusable: HTMLElement;

    beforeEach(() => {
      bubbles = [...slider.querySelectorAll('vaadin-slider-bubble')];
      focusable = document.getElementById('first-global-focusable')!;
      focusable.focus();
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

    it('should open start bubble on track pointerdown closer to first thumb', async () => {
      const { x, y } = middleOfThumb(0);
      await sendMouse({ type: 'move', position: [x + 40, y] });
      await sendMouse({ type: 'down' });
      expect(bubbles[0].opened).to.be.true;
      expect(bubbles[1].opened).to.be.false;
    });

    it('should open end bubble on track pointerdown closer to second thumb', async () => {
      const { x, y } = middleOfThumb(1);
      await sendMouse({ type: 'move', position: [x - 40, y] });
      await sendMouse({ type: 'down' });
      expect(bubbles[0].opened).to.be.false;
      expect(bubbles[1].opened).to.be.true;
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

    it('should only close start bubble on pointerup outside but not pointerleave', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[0] });
      await sendMouse({ type: 'down' });
      expect(bubbles[0].opened).to.be.true;

      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubbles[0].opened).to.be.true;

      await sendMouse({ type: 'up' });
      expect(bubbles[0].opened).to.be.false;
    });

    it('should close end bubble on pointerup outside but not pointerleave', async () => {
      await sendMouseToElement({ type: 'move', element: thumbs[1] });
      await sendMouse({ type: 'down' });
      expect(bubbles[1].opened).to.be.true;

      await sendMouse({ type: 'move', position: [300, 300] });
      expect(bubbles[1].opened).to.be.true;

      await sendMouse({ type: 'up' });
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
