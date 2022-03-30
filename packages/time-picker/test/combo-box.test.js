import { expect } from '@esm-bundle/chai';
import { enter, fire, fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-time-picker.js';

describe('combo-box', () => {
  let timePicker, comboBox;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    comboBox = timePicker.$.comboBox;
  });

  it('should store a reference to a combo-box instance', () => {
    expect(comboBox.localName).to.equal('vaadin-time-picker-combo-box');
  });

  it('should define a toggle element on the combo-box', () => {
    expect(comboBox._toggleElement).to.not.be.null;
  });

  it('should set allowCustomValue on the combo-box', () => {
    expect(comboBox.allowCustomValue).to.be.true;
  });

  it('should set an hour array to combo-box filteredItems by default', () => {
    expect(comboBox.filteredItems.length).to.be.equal(24);
    const pad = (num = 0, fmt = '00') => (fmt + num).substr((fmt + num).length - fmt.length);
    // With default step 1, value should be set to `hh:00`
    for (var i = 0; i < 24; i++) {
      const expected = pad(i) + ':00';
      expect(comboBox.filteredItems[i].label).to.be.equal(expected);
      expect(comboBox.filteredItems[i].value).to.be.equal(expected);
    }
  });

  it('should not set an empty array to combo-box if step is less than 15 mins', () => {
    timePicker.step = 899;
    expect(comboBox.filteredItems).to.be.empty;
  });

  it('should set an empty array to combo-box if step is not a divisor of day', () => {
    timePicker.step = 60 * 60 * 16;
    expect(comboBox.filteredItems).to.be.empty;
  });

  it('should divide dropdown on one hour increments if step is undefined', () => {
    timePicker.step = undefined;
    expect(comboBox.filteredItems.length).to.be.equal(24);
    expect(comboBox.filteredItems[0].label).to.be.equal('00:00');
    expect(comboBox.filteredItems[0].value).to.be.equal('00:00');
    expect(comboBox.filteredItems[23].label).to.be.equal('23:00');
    expect(comboBox.filteredItems[23].value).to.be.equal('23:00');
  });

  it('should be possible to divide the day in exact fragments', () => {
    timePicker.step = 60 * 60 * 3;
    expect(comboBox.filteredItems.length).to.be.equal(8);
    expect(comboBox.filteredItems[7].value).to.be.equal('21:00');
  });

  it('should be possible to divide one hour in exact fragments', () => {
    timePicker.step = 60 * 20;
    expect(comboBox.filteredItems.length).to.be.equal(72);
    expect(comboBox.filteredItems[71].value).to.be.equal('23:40');
  });

  it('should be possible to divide one hour in inexact fragments if the day can be divided into those', () => {
    timePicker.step = 60 * 18;
    expect(comboBox.filteredItems.length).to.be.equal(80);
  });

  it('should be possible to divide one day in exact fragments that are greater than 1 hour', () => {
    // 1 hour 36 minutes
    timePicker.step = 3600 + 60 * 36;
    expect(comboBox.filteredItems.length).to.be.equal(15);
  });

  it('should change the resolution on step change, but selectedItem should remain the same', () => {
    timePicker.value = '01:00';
    expect(timePicker.value).to.be.equal('01:00');
    timePicker.step = 0.5;
    expect(timePicker.value).to.be.equal('01:00:00.000');
    timePicker.step = 3600;
    expect(timePicker.value).to.be.equal('01:00');
    expect(comboBox.selectedItem).to.deep.equal(comboBox.filteredItems[1]);
  });

  it('should propagate autoOpenDisabled property to combo-box', () => {
    expect(comboBox.autoOpenDisabled).to.be.not.ok;
    timePicker.autoOpenDisabled = true;
    expect(comboBox.autoOpenDisabled).to.be.true;
  });
});

describe('autoOpenDisabled', () => {
  let timePicker, comboBox, inputElement;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker auto-open-disabled value="05:00"></vaadin-time-picker>`);
    comboBox = timePicker.$.comboBox;
    inputElement = timePicker.inputElement;
  });

  it('should focus the correct item when opened', () => {
    comboBox.open();

    const items = document.querySelectorAll('vaadin-time-picker-item');
    expect(items[5].hasAttribute('focused')).to.be.true;
  });

  it('should commit a custom value after setting a predefined value', async () => {
    inputElement.value = '05:10';
    fire(inputElement, 'input');
    enter(inputElement);
    expect(timePicker.value).to.equal('05:10');
  });

  it('should commit an empty value after setting a predefined value', async () => {
    inputElement.value = '';
    fire(inputElement, 'input');
    enter(inputElement);
    expect(timePicker.value).to.equal('');
  });
});
