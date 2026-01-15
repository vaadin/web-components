import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, isFirefox, middleOfNode, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-range-slider.js';
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

    it('should not throw when calling focus() before adding to the DOM', () => {
      expect(() => document.createElement('vaadin-range-slider').focus()).to.not.throw(Error);
    });
  });

  describe('keyboard input', () => {
    let inputs: HTMLInputElement[];

    beforeEach(async () => {
      slider = fixtureSync('<vaadin-range-slider></vaadin-range-slider>');
      await nextRender();
      inputs = [...slider.querySelectorAll('input')];
    });

    describe('start thumb', () => {
      beforeEach(() => {
        inputs[0].focus();
      });

      it('should increase lower value boundary on first input Arrow Right', async () => {
        await sendKeys({ press: 'ArrowRight' });
        expect(slider.value).to.deep.equal([1, 100]);
      });

      it('should increase lower value boundary on first input Arrow Up', async () => {
        await sendKeys({ press: 'ArrowUp' });
        expect(slider.value).to.deep.equal([1, 100]);
      });

      it('should decrease lower value boundary on first input Arrow Left', async () => {
        slider.value = [10, 100];
        await sendKeys({ press: 'ArrowLeft' });
        expect(slider.value).to.deep.equal([9, 100]);
      });

      it('should increase lower value boundary on first input Arrow Down', async () => {
        slider.value = [10, 100];
        await sendKeys({ press: 'ArrowDown' });
        expect(slider.value).to.deep.equal([9, 100]);
      });

      it('should not decrease lower value boundary past min value', async () => {
        await sendKeys({ press: 'ArrowLeft' });
        expect(slider.value).to.deep.equal([0, 100]);
      });

      it('should not increase lower value boundary past upper boundary', async () => {
        slider.value = [10, 10];
        await sendKeys({ press: 'ArrowRight' });
        expect(slider.value).to.deep.equal([10, 10]);
      });

      it('should suppress input when trying to increase value past upper boundary on Arrow Right', async () => {
        const spy = sinon.spy();
        inputs[0].addEventListener('input', spy);

        slider.value = [10, 10];

        await sendKeys({ press: 'ArrowRight' });
        expect(spy).to.be.not.called;
        expect(inputs[0].value).to.equal('10');
      });

      it('should suppress input when trying to increase value past upper boundary on Arrow Up', async () => {
        const spy = sinon.spy();
        inputs[0].addEventListener('input', spy);

        slider.value = [10, 10];

        await sendKeys({ press: 'ArrowUp' });
        expect(spy).to.be.not.called;
        expect(inputs[0].value).to.equal('10');
      });

      it('should fire single change event on first input value change', async () => {
        const spy = sinon.spy();
        slider.addEventListener('change', spy);
        await sendKeys({ press: 'ArrowRight' });
        expect(spy).to.be.calledOnce;
      });
    });

    describe('end thumb', () => {
      beforeEach(() => {
        inputs[1].focus();
      });

      it('should increase upper value boundary on second input Arrow Right', async () => {
        slider.value = [1, 50];
        await sendKeys({ press: 'ArrowRight' });
        expect(slider.value).to.deep.equal([1, 51]);
      });

      it('should increase upper value boundary on second input Arrow Up', async () => {
        slider.value = [1, 50];
        await sendKeys({ press: 'ArrowUp' });
        expect(slider.value).to.deep.equal([1, 51]);
      });

      it('should decrease upper value boundary on second input Arrow Left', async () => {
        await sendKeys({ press: 'ArrowLeft' });
        expect(slider.value).to.deep.equal([0, 99]);
      });

      it('should decrease upper value boundary on second input Arrow Down', async () => {
        await sendKeys({ press: 'ArrowDown' });
        expect(slider.value).to.deep.equal([0, 99]);
      });

      it('should not increase upper value boundary past max value', async () => {
        await sendKeys({ press: 'ArrowRight' });
        expect(slider.value).to.deep.equal([0, 100]);
      });

      it('should not decrease lower value boundary past lower boundary', async () => {
        slider.value = [10, 10];
        await sendKeys({ press: 'ArrowLeft' });
        expect(slider.value).to.deep.equal([10, 10]);
      });

      it('should suppress input when trying to decrease value past lower boundary on Arrow Left', async () => {
        const spy = sinon.spy();
        inputs[1].addEventListener('input', spy);

        slider.value = [10, 10];

        await sendKeys({ press: 'ArrowLeft' });
        expect(spy).to.be.not.called;
        expect(inputs[1].value).to.equal('10');
      });

      it('should suppress input when trying to decrease value past lower boundary on Arrow Down', async () => {
        const spy = sinon.spy();
        inputs[1].addEventListener('input', spy);

        slider.value = [10, 10];

        await sendKeys({ press: 'ArrowDown' });
        expect(spy).to.be.not.called;
        expect(inputs[1].value).to.equal('10');
      });

      it('should fire single change event on second input value change', async () => {
        const spy = sinon.spy();
        slider.addEventListener('change', spy);
        await sendKeys({ press: 'ArrowLeft' });
        expect(spy).to.be.calledOnce;
      });
    });
  });

  // Pointer tests randomly fail in Firefox
  (isFirefox ? describe.skip : describe)('pointer', () => {
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
      slider = fixtureSync('<vaadin-range-slider style="width: 200px"></vaadin-range-slider>');
      await nextRender();
      thumbs = [...slider.shadowRoot!.querySelectorAll('[part~="thumb"]')];
      inputs = [...slider.querySelectorAll('input')];
    });

    afterEach(async () => {
      await resetMouse();
    });

    describe('individual thumbs', () => {
      it('should update slider value property on first thumb pointermove', async () => {
        const { x, y } = middleOfThumb(0);

        await sendMouseToElement({ type: 'move', element: thumbs[0] });
        await sendMouse({ type: 'down' });
        await sendMouse({ type: 'move', position: [x + 20, y] });

        expect(slider.value).to.deep.equal([10, 100]);
      });

      it('should update slider value property on second thumb pointermove', async () => {
        const { x, y } = middleOfThumb(1);

        await sendMouseToElement({ type: 'move', element: thumbs[1] });
        await sendMouse({ type: 'down' });
        await sendMouse({ type: 'move', position: [x - 20, y] });

        expect(slider.value).to.deep.equal([0, 90]);
      });

      it('should not fire change event on thumb pointermove', async () => {
        const { x, y } = middleOfThumb(0);

        const spy = sinon.spy();
        slider.addEventListener('change', spy);

        await sendMouseToElement({ type: 'move', element: thumbs[0] });
        await sendMouse({ type: 'down' });
        await sendMouse({ type: 'move', position: [x + 20, y] });

        expect(spy).to.be.not.called;
      });

      it('should fire change event on thumb pointerup', async () => {
        const { x, y } = middleOfThumb(0);

        const spy = sinon.spy();
        slider.addEventListener('change', spy);

        await sendMouseToElement({ type: 'move', element: thumbs[0] });
        await sendMouse({ type: 'down' });
        await sendMouse({ type: 'move', position: [x + 20, y] });
        await sendMouse({ type: 'up' });

        expect(spy).to.be.calledOnce;
      });

      it('should not fire change event on pointerup if value remains the same', async () => {
        const { x, y } = middleOfThumb(0);

        const spy = sinon.spy();
        slider.addEventListener('change', spy);

        await sendMouseToElement({ type: 'move', element: thumbs[0] });
        await sendMouse({ type: 'down' });
        await sendMouse({ type: 'move', position: [x + 20, y] });

        await sendMouse({ type: 'move', position: [x, y] });
        await sendMouse({ type: 'up' });

        expect(spy).to.be.not.called;
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

        await sendMouse({ type: 'move', position: [x + 40, y] });
        await sendMouse({ type: 'down' });

        expect(slider.value).to.deep.equal([40, 80]);
        expect(document.activeElement).to.equal(inputs[0]);
      });

      it('should focus second input on track pointerdown between thumbs closer to the second one', async () => {
        const { x, y } = middleOfThumb(1);

        await sendMouse({ type: 'move', position: [x - 40, y] });
        await sendMouse({ type: 'down' });

        expect(slider.value).to.deep.equal([20, 60]);
        expect(document.activeElement).to.equal(inputs[1]);
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
  });
});
