import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-time-picker.js';

describe('custom functions', () => {
  let timePicker, comboBox, input;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    comboBox = timePicker.$.comboBox;
    input = timePicker.inputElement;
  });

  it('should use custom parser if that exists', function () {
    timePicker.set('i18n.parseTime', sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }));
    timePicker.value = '12';
    expect(timePicker.i18n.parseTime.args[0][0]).to.be.equal('12:00');
    expect(timePicker.value).to.be.equal('12:00');
  });

  it('should align values of dropdown and input when i18n was reassigned', function () {
    timePicker.value = '12';
    timePicker.set('i18n', {
      formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
      parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 })
    });
    expect(comboBox.selectedItem).to.be.deep.equal({ label: '12:00 AM', value: '12:00 AM' });
    expect(comboBox.value).to.be.equal('12:00 AM');
    expect(input.value).to.be.equal('12:00 AM');
    expect(timePicker.value).to.be.equal('12:00');
  });

  it('should use custom formatter if that exists', function () {
    timePicker.set('i18n', {
      formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
      parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 })
    });
    timePicker.value = '12';
    expect(timePicker.value).to.be.equal('12:00');
    expect(comboBox.value).to.be.equal('12:00 AM');
  });

  it('should accept custom time formatter', function () {
    timePicker.set('i18n.formatTime', sinon.stub().returns('1200'));
    const parseTime = sinon.stub();
    parseTime.withArgs('1200').returns({ hours: 12, minutes: 0 });
    timePicker.set('i18n.parseTime', parseTime);
    timePicker.value = '12:00';
    expect(input.value).to.equal('1200');
    expect(timePicker.value).to.equal('12:00');
  });
});
