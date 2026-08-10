import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-time-picker.js';

describe('dropdown items', () => {
  let timePicker;

  beforeEach(async () => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    await nextRender();
  });

  it('should set an hour array to dropdown items by default', () => {
    expect(timePicker._dropdownItems.length).to.be.equal(24);
    const pad = (num = 0, fmt = '00') => (fmt + num).substr((fmt + num).length - fmt.length);
    // With default step 1, value should be set to `hh:00`
    for (let i = 0; i < 24; i++) {
      const expected = `${pad(i)}:00`;
      expect(timePicker._dropdownItems[i].label).to.be.equal(expected);
      expect(timePicker._dropdownItems[i].value).to.be.equal(expected);
    }
  });

  it('should not set an empty array to dropdown items if step is less than 15 mins', () => {
    timePicker.step = 899;
    expect(timePicker._dropdownItems).to.be.empty;
  });

  it('should set an empty array to to dropdown items if step is not a divisor of day', () => {
    timePicker.step = 60 * 60 * 16;
    expect(timePicker._dropdownItems).to.be.empty;
  });

  it('should divide dropdown on one hour increments if step is undefined', () => {
    timePicker.step = undefined;
    expect(timePicker._dropdownItems.length).to.be.equal(24);
    expect(timePicker._dropdownItems[0].label).to.be.equal('00:00');
    expect(timePicker._dropdownItems[0].value).to.be.equal('00:00');
    expect(timePicker._dropdownItems[23].label).to.be.equal('23:00');
    expect(timePicker._dropdownItems[23].value).to.be.equal('23:00');
  });

  it('should be possible to divide the day in exact fragments', () => {
    timePicker.step = 60 * 60 * 3;
    expect(timePicker._dropdownItems.length).to.be.equal(8);
    expect(timePicker._dropdownItems[7].value).to.be.equal('21:00');
  });

  it('should be possible to divide one hour in exact fragments', () => {
    timePicker.step = 60 * 20;
    expect(timePicker._dropdownItems.length).to.be.equal(72);
    expect(timePicker._dropdownItems[71].value).to.be.equal('23:40');
  });

  it('should be possible to divide one hour in inexact fragments if the day can be divided into those', () => {
    timePicker.step = 60 * 18;
    expect(timePicker._dropdownItems.length).to.be.equal(80);
  });

  it('should be possible to divide one day in exact fragments that are greater than 1 hour', () => {
    // 1 hour 36 minutes
    timePicker.step = 3600 + 60 * 36;
    expect(timePicker._dropdownItems.length).to.be.equal(15);
  });

  it('should change the resolution on step change, but selected item should remain the same', () => {
    timePicker.value = '01:00';
    expect(timePicker.value).to.be.equal('01:00');
    timePicker.step = 0.5;
    expect(timePicker.value).to.be.equal('01:00:00.000');
    timePicker.step = 3600;
    expect(timePicker.value).to.be.equal('01:00');
    expect(timePicker._scroller.selectedItem).to.equal(timePicker._dropdownItems[1]);
  });

  ['min', 'max'].forEach((constraint) => {
    it(`should keep the matching item selected after regenerating items on ${constraint} change`, () => {
      timePicker.value = '10:00';
      timePicker[constraint] = constraint === 'min' ? '01:00' : '23:00';
      expect(timePicker._dropdownItems).to.include(timePicker._scroller.selectedItem);
    });
  });
});

describe('value set before attach', () => {
  let picker;

  beforeEach(() => {
    picker = document.createElement('vaadin-time-picker');
  });

  afterEach(() => {
    picker.remove();
  });

  it('should set value to the input when added to the DOM', async () => {
    picker.value = '10:00';
    document.body.appendChild(picker);
    await nextRender();
    expect(picker._scroller.selectedItem).to.equal(picker._dropdownItems[10]);
  });
});
