import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, middleOfNode, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-slider.js';
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
    slider = fixtureSync('<vaadin-slider style="width: 200px"></vaadin-slider>');
    await nextRender();
    thumb = slider.shadowRoot!.querySelector('[part="thumb"]')!;
    track = slider.shadowRoot!.querySelector('[part="track"]')!;
    y = Math.round(middleOfNode(thumb).y);
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('value', () => {
    it('should update on thumb pointermove', async () => {
      await sendMouseToElement({ type: 'move', element: thumb });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [20, y] });

      expect(slider.value).to.equal(10);
    });

    it('should update on track pointerdown', async () => {
      await sendMouseToElement({ type: 'move', element: track });
      await sendMouse({ type: 'down' });

      expect(slider.value).to.equal(50);
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

    it('should fire on pointerup outside of the element', async () => {
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
});
