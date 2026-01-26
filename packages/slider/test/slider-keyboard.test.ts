import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-slider.js';
import type { Slider } from '../vaadin-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-slider - keyboard input', () => {
  let slider: Slider;
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

  it('should fire single input event on input value change', async () => {
    const spy = sinon.spy();
    slider.addEventListener('input', spy);
    await sendKeys({ press: 'ArrowRight' });
    expect(spy).to.be.calledOnce;
  });

  it('should preserve decimals when changing value using fractional step', async () => {
    slider.value = 3;
    slider.step = 1.5;
    await sendKeys({ press: 'ArrowLeft' });
    expect(slider.value).to.equal(1.5);
  });

  it('should not increase value past max allowed value with fractional step', async () => {
    slider.step = 1.5;
    slider.value = 99;
    await sendKeys({ press: 'ArrowRight' });
    expect(slider.value).to.equal(99);
  });

  it('should not change value on arrow key when readonly', async () => {
    slider.readonly = true;
    await sendKeys({ press: 'ArrowRight' });
    expect(slider.value).to.equal(0);
  });
});
