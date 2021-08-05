import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { ComboBoxLight } from '@vaadin/combo-box/src/vaadin-combo-box-light.js';
import './vaadin-time-picker.js';

describe('dropdown', () => {
  let timePicker, dropdown;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    dropdown = timePicker.$.dropdown;
  });

  it('should be an instance of vaadin-combo-box-light', () => {
    expect(dropdown).to.be.instanceOf(ComboBoxLight);
  });

  it('should have an hour array as filteredItems by default', () => {
    expect(dropdown.filteredItems.length).to.be.equal(24);
    const pad = (num = 0, fmt = '00') => (fmt + num).substr((fmt + num).length - fmt.length);
    // With default step 1, value should be set to `hh:00`
    for (var i = 0; i < 24; i++) {
      const expected = pad(i) + ':00';
      expect(dropdown.filteredItems[i].label).to.be.equal(expected);
      expect(dropdown.filteredItems[i].value).to.be.equal(expected);
    }
  });

  it('should not have an empty array as filteredItems if step is less than 15 mins', () => {
    timePicker.step = 899;
    expect(dropdown.filteredItems).to.be.empty;
  });

  it('should have an empty array if step is not a divisor of day', () => {
    timePicker.step = 60 * 60 * 16;
    expect(dropdown.filteredItems).to.be.empty;
  });

  it('should divide dropdown on one hour increments if step is undefined', () => {
    timePicker.step = undefined;
    expect(dropdown.filteredItems.length).to.be.equal(24);
    expect(dropdown.filteredItems[0].label).to.be.equal('00:00');
    expect(dropdown.filteredItems[0].value).to.be.equal('00:00');
    expect(dropdown.filteredItems[23].label).to.be.equal('23:00');
    expect(dropdown.filteredItems[23].value).to.be.equal('23:00');
  });

  it('should be possible to divide the day in exact fragments', () => {
    timePicker.step = 60 * 60 * 3;
    expect(dropdown.filteredItems.length).to.be.equal(8);
    expect(dropdown.filteredItems[7].value).to.be.equal('21:00');
  });

  it('should be possible to divide one hour in exact fragments', () => {
    timePicker.step = 60 * 20;
    expect(dropdown.filteredItems.length).to.be.equal(72);
    expect(dropdown.filteredItems[71].value).to.be.equal('23:40');
  });

  it('should be possible to divide one hour in inexact fragments if the day can be divided into those', () => {
    timePicker.step = 60 * 18;
    expect(dropdown.filteredItems.length).to.be.equal(80);
  });

  it('should be possible to divide one day in exact fragments that are greater than 1 hour', () => {
    // 1 hour 36 minutes
    timePicker.step = 3600 + 60 * 36;
    expect(dropdown.filteredItems.length).to.be.equal(15);
  });

  it('should change the resolution on step change, but selectedItem should remain the same', () => {
    timePicker.value = '01:00';
    expect(timePicker.value).to.be.equal('01:00');
    timePicker.step = 0.5;
    expect(timePicker.value).to.be.equal('01:00:00.000');
    timePicker.step = 3600;
    expect(timePicker.value).to.be.equal('01:00');
    expect(dropdown.selectedItem).to.deep.equal(dropdown.filteredItems[1]);
  });

  it('should propagate autoOpenDisabled property to the dropdown', () => {
    expect(dropdown.autoOpenDisabled).to.be.not.ok;
    timePicker.autoOpenDisabled = true;
    expect(dropdown.autoOpenDisabled).to.be.true;
  });
});
