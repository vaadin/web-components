import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-range-slider.js';
import type { RangeSlider } from '../vaadin-range-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-range-slider - keyboard input', () => {
  let slider: RangeSlider;
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

    it('should fire single input event on first input value change', async () => {
      const spy = sinon.spy();
      slider.addEventListener('input', spy);
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

    it('should fire single input event on second input value change', async () => {
      const spy = sinon.spy();
      slider.addEventListener('input', spy);
      await sendKeys({ press: 'ArrowLeft' });
      expect(spy).to.be.calledOnce;
    });

    it('should preserve decimals when changing value using fractional step', async () => {
      slider.value = [0, 3];
      slider.step = 1.5;
      await sendKeys({ press: 'ArrowLeft' });
      expect(slider.value).to.deep.equal([0, 1.5]);
    });

    it('should not increase value past max allowed value with fractional step', async () => {
      slider.value = [0, 99];
      slider.step = 1.5;
      await sendKeys({ press: 'ArrowRight' });
      expect(slider.value).to.deep.equal([0, 99]);
    });

    it('should not change value on arrow key when readonly', async () => {
      slider.readonly = true;
      await sendKeys({ press: 'ArrowRight' });
      expect(slider.value).to.deep.equal([0, 100]);
    });
  });
});
