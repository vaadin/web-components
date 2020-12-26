import { expect } from '@esm-bundle/chai';
import { fixture, html } from '@open-wc/testing-helpers';
import '../vaadin-time-picker.js';

describe('min and max properties', () => {
  let timePicker;

  beforeEach(async () => {
    timePicker = await fixture(html`<vaadin-time-picker></vaadin-time-picker>`);
  });

  it('min property should be 00:00:00.000 by default', () => {
    expect(timePicker.min).to.be.equal('00:00:00.000');
  });

  it('max property should be 23:59:59.999 by default', () => {
    expect(timePicker.max).to.be.equal('23:59:59.999');
  });

  it('should have dropdown items if min nor max is defined', () => {
    expect(timePicker.__dropdownItems.length).to.be.equal(24);
  });

  it('should allow setting valid min property value', () => {
    timePicker.min = '04:00';
    expect(timePicker.__dropdownItems.length).to.be.equal(20);
  });

  it('should allow setting valid max property value', () => {
    timePicker.max = '19:00';
    expect(timePicker.__dropdownItems.length).to.be.equal(20);
  });

  it('should allow setting valid min and max property value', () => {
    timePicker.min = '04:00';
    timePicker.max = '19:00';
    expect(timePicker.__dropdownItems.length).to.be.equal(16);
  });

  it('should allow setting valid min value via attribute', () => {
    timePicker.setAttribute('min', '04:00');
    expect(timePicker.min).to.be.equal('04:00');
  });

  it('should allow setting valid max value via attribute', () => {
    timePicker.setAttribute('max', '19:00');
    expect(timePicker.max).to.be.equal('19:00');
  });

  it('should allow setting valid min and max values via attributes', () => {
    timePicker.setAttribute('min', '04:00');
    timePicker.setAttribute('max', '19:00');
    expect(timePicker.min).to.be.equal('04:00');
    expect(timePicker.max).to.be.equal('19:00');
  });

  it('should not allow setting a value lower than min property value', () => {
    timePicker.value = '02:00';
    timePicker.min = '10:00';
    expect(timePicker.value).to.be.equal('10:00');
  });

  it('should not allow setting a value higher than max property value', () => {
    timePicker.value = '12:00';
    timePicker.max = '10:00';
    expect(timePicker.value).to.be.equal('10:00');
  });

  it('should not allow setting a value lower than min value via attribute', () => {
    timePicker.setAttribute('value', '02:00');
    timePicker.setAttribute('min', '10:00');
    expect(timePicker.value).to.be.equal('10:00');
  });

  it('should not allow setting a value higher than max value via attribute', () => {
    timePicker.setAttribute('value', '19:00');
    timePicker.setAttribute('max', '16:00');
    expect(timePicker.value).to.be.equal('16:00');
  });

  it('setting min should not change an empty value', () => {
    timePicker.min = '10:00';
    expect(timePicker.value).to.be.equal('');
  });

  it('setting max should not change an empty value', () => {
    timePicker.max = '10:00';
    expect(timePicker.value).to.be.equal('');
  });
});
