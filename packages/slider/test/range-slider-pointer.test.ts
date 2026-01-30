import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, isFirefox, middleOfNode, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-range-slider.js';
import type { RangeSlider } from '../vaadin-range-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

// Pointer tests randomly fail in Firefox
(isFirefox ? describe.skip : describe)('vaadin-range-slider - pointer', () => {
  let slider: RangeSlider;
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
    slider = fixtureSync(`
      <vaadin-range-slider
        step="10"
        style="width: 200px; --vaadin-slider-thumb-width: 20px"
      ></vaadin-range-slider>
    `);
    await nextRender();
    thumbs = [...slider.shadowRoot!.querySelectorAll('[part~="thumb"]')];
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

  describe('track', () => {
    beforeEach(() => {
      slider.value = [20, 80];
    });

    it('should focus first input on track pointerdown before the first thumb', async () => {
      await sendMouse({ type: 'move', position: [30, 10] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([10, 80]);
      expect(document.activeElement).to.equal(inputs[0]);
    });

    it('should focus second input on track pointerdown after the second thumb', async () => {
      await sendMouse({ type: 'move', position: [170, 10] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([20, 90]);
      expect(document.activeElement).to.equal(inputs[1]);
    });

    it('should focus first input on track pointerdown between thumbs closer to the first one', async () => {
      await sendMouse({ type: 'move', position: [80, 10] });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.deep.equal([40, 80]);
      expect(document.activeElement).to.equal(inputs[0]);
    });

    it('should focus second input on track pointerdown between thumbs closer to the second one', async () => {
      await sendMouse({ type: 'move', position: [120, 10] });
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
});
