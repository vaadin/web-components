import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowUp, aTimeout, esc, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-time-picker.js';

describe('keyboard navigation', () => {
  let timePicker, comboBox, inputElement;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    comboBox = timePicker.$.comboBox;
    inputElement = timePicker.inputElement;
  });

  afterEach(async () => {
    if (comboBox.opened) {
      comboBox.opened = false;
      await aTimeout(50);
    }
  });

  describe('with invalid step', () => {
    beforeEach(() => {
      timePicker.step = 899;
    });

    it('should add one minute to input value on arrow up', () => {
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('00:01:00');
    });

    it('should subtract one minute from input value on arrow down', () => {
      arrowDown(inputElement);
      expect(inputElement.value).to.be.equal('23:59:00');
    });
  });

  describe('with step less than 15 mins', () => {
    beforeEach(() => {
      timePicker.step = 720;
    });

    it('should not change the value on arrow up', () => {
      timePicker.value = '00:00';
      arrowUp(inputElement);
      expect(timePicker.value).to.be.equal('00:00');
    });

    it('should not change the value on arrow down', () => {
      timePicker.value = '00:00';
      arrowDown(inputElement);
      expect(timePicker.value).to.be.equal('00:00');
    });

    it('on arrow up should update the input value to 00:12', () => {
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('00:12');
    });

    it('on arrow up should update the input value to 23:48', () => {
      arrowDown(inputElement);
      expect(inputElement.value).to.be.equal('23:48');
    });

    it('on arrow up/down should not change input value if readonly', () => {
      timePicker.readonly = true;
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('');
      arrowDown(inputElement);
      expect(inputElement.value).to.be.equal('');
    });

    it('on arrow up/down should not change input value if disabled', () => {
      timePicker.disabled = true;
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('');
      arrowDown(inputElement);
      expect(inputElement.value).to.be.equal('');
    });

    it('should subtract step value from the current input value on arrow down', () => {
      timePicker.step = 1.5;
      timePicker.value = '23:55:55.500';
      arrowDown(inputElement);
      expect(inputElement.value).to.be.equal('23:55:54.000');
    });

    it('should add step value to the current input value on arrow up', () => {
      timePicker.step = 1.5;
      timePicker.value = '23:55:55.500';
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('23:55:57.000');
    });

    it('should change to the next even value on arrow up', () => {
      timePicker.value = '23:52';
      timePicker.step = 5 * 60;
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('23:55');
    });

    it('should change to the next even value on arrow down', () => {
      timePicker.value = '23:52';
      timePicker.step = 5 * 60;
      arrowDown(inputElement);
      expect(inputElement.value).to.be.equal('23:50');
    });

    it('should call __onArrowPressWithStep on arrow down/up', () => {
      const spy = sinon.spy(timePicker, '__onArrowPressWithStep');
      arrowDown(inputElement);
      arrowUp(inputElement);
      expect(spy.callCount).to.eql(2);
    });

    describe('with custom parser and formatter', () => {
      beforeEach(() => {
        timePicker.i18n.parseTime = (text) => {
          const parts = text.split('.');
          return {
            hours: parts[0],
            minutes: parts[1],
          };
        };
        timePicker.i18n.formatTime = (time) => {
          return `${time.hours}.${time.minutes}`;
        };
      });

      it('should correctly add the step with custom parser and formatter', () => {
        timePicker.value = '12:0';
        timePicker.step = 20;
        for (let inc = 1; inc < 4; inc++) {
          expect(inputElement.value).to.be.equal('12.0');
          arrowUp(inputElement);
        }
        expect(inputElement.value).to.be.equal('12.1');
      });

      it('should correctly subtract the step with custom parser and formatter', () => {
        timePicker.value = '12:0';
        timePicker.step = 20;
        for (let inc = 1; inc < 4; inc++) {
          arrowDown(inputElement);
          expect(inputElement.value).to.be.equal('11.59');
        }
        arrowDown(inputElement);
        expect(inputElement.value).to.be.equal('11.58');
      });
    });
  });

  describe('with dropdown', () => {
    it('should not change the value on arrow up, but should open the overlay', () => {
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('');
      expect(comboBox.opened).to.be.true;
    });
  });

  describe('with step more than 15 mins', () => {
    beforeEach(() => {
      timePicker.step = 1800;
      timePicker.value = '02:00';
      comboBox.opened = true;
    });

    it('should not change the value on arrow up', () => {
      arrowUp(inputElement);
      expect(timePicker.value).to.be.equal('02:00');
    });

    it('should not change the value on arrow down', () => {
      arrowDown(inputElement);
      expect(timePicker.value).to.be.equal('02:00');
    });

    it('should not call __onArrowPressWithStep on arrow down/up', () => {
      const spy = sinon.spy(timePicker, '__onArrowPressWithStep');
      arrowDown(inputElement);
      arrowUp(inputElement);
      expect(spy.callCount).to.eql(0);
    });

    it('should open the overlay on arrow up', () => {
      arrowUp(inputElement);
      expect(document.querySelector('vaadin-time-picker-overlay')).to.be.ok;
    });
  });

  describe('with millisecond step', () => {
    it('should change the value on millisecond resolution', () => {
      timePicker.step = 0.5;
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('00:00:00.500');

      timePicker.step = 0.1;
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('00:00:00.600');
    });

    it('should change by default value increments on microsecond resolution', () => {
      timePicker.step = 0.9999;
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('00:01:00.000');

      timePicker.step = 0.9991;
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('00:02:00.000');
    });

    it('should not open the overlay on arrow up', () => {
      timePicker.step = 0.5;
      arrowUp(inputElement);
      expect(document.querySelector('vaadin-combo-box-overlay')).not.to.be.ok;
    });

    it('should not change value on escape', () => {
      timePicker.step = 0.5;
      arrowUp(inputElement);
      expect(inputElement.value).to.be.equal('00:00:00.500');
      esc(inputElement);
      expect(inputElement.value).to.be.equal('');
    });
  });
});
