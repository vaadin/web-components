import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-number-field.js';

describe('value control buttons', () => {
  let numberField, input, decreaseButton, increaseButton;

  beforeEach(async () => {
    numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
    await nextRender();
    input = numberField.inputElement;
    decreaseButton = numberField.shadowRoot.querySelector('[part~="decrease-button"]');
    increaseButton = numberField.shadowRoot.querySelector('[part~="increase-button"]');
  });

  describe('basic', () => {
    it('should fire input event on input element when clicking minus button', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      decreaseButton.click();
      expect(spy).to.be.calledOnce;
    });

    it('should fire input event on input element when clicking plus button', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      increaseButton.click();
      expect(spy).to.be.calledOnce;
    });

    it('should increase value by 1 on plus button click', async () => {
      numberField.value = 0;
      await nextUpdate(numberField);

      increaseButton.click();

      expect(numberField.value).to.equal('1');
    });

    it('should not focus input when a button is clicked', () => {
      const spy = sinon.spy(input, 'focus');
      increaseButton.click();
      expect(spy.called).to.be.false;
    });

    it('should increment value to next multiple of step offset by the min', async () => {
      numberField.step = 3;
      numberField.min = 4;
      numberField.value = 4;
      await nextUpdate(numberField);

      increaseButton.click();

      expect(numberField.value).equal('7');
    });

    it('should increase value by 0.2 when step is 0.2 on plus button click', async () => {
      numberField.step = 0.2;
      numberField.value = 0.6;
      await nextUpdate(numberField);

      increaseButton.click();

      expect(numberField.value).to.equal('0.8');
    });

    it('should adjust value to exact step on plus button click', async () => {
      numberField.step = 0.2;
      numberField.value = 0.5;
      await nextUpdate(numberField);

      increaseButton.click();

      expect(numberField.value).to.equal('0.6');
    });

    it('should decrease value by 1 on minus button click', async () => {
      numberField.value = 0;
      await nextUpdate(numberField);

      decreaseButton.click();

      expect(numberField.value).to.equal('-1');
    });

    it('should decrease value by 0.2 on minus button click', async () => {
      numberField.value = 0;
      numberField.step = 0.2;
      await nextUpdate(numberField);

      decreaseButton.click();

      expect(numberField.value).to.equal('-0.2');
    });

    it('should adjust value to exact step on minus button click', async () => {
      numberField.value = 7;
      numberField.step = 2;
      await nextUpdate(numberField);

      decreaseButton.click();

      expect(numberField.value).to.equal('6');
    });

    it('should adjust decimals based on the step value when control button is pressed', async () => {
      numberField.value = 1;
      numberField.step = 0.001;
      await nextUpdate(numberField);

      increaseButton.click();
      expect(numberField.value).to.equal('1.001');
    });

    it('should adjust decimals based on the min value when control button is pressed', async () => {
      numberField.value = 1;
      numberField.step = 0.001;
      numberField.min = 0.0001;
      await nextUpdate(numberField);

      increaseButton.click();
      expect(numberField.value).to.equal('1.0001');
    });

    it('should not increase value on plus button click when max value is reached', async () => {
      numberField.value = 0;
      numberField.max = 0;
      await nextUpdate(numberField);

      increaseButton.click();

      expect(numberField.value).to.equal('0');
    });

    it('should not decrease value on minus button click when min value is reached', async () => {
      numberField.value = 0;
      numberField.min = 0;
      await nextUpdate(numberField);

      decreaseButton.click();

      expect(numberField.value).to.equal('0');
    });

    it('should not disable buttons if there are no limits set', () => {
      expect(decreaseButton.hasAttribute('disabled')).to.be.false;
      expect(increaseButton.hasAttribute('disabled')).to.be.false;
    });

    it('should disable minus button if min limit is reached', async () => {
      numberField.value = 0;
      numberField.min = 0;
      await nextUpdate(numberField);
      expect(decreaseButton.hasAttribute('disabled')).to.be.true;
      expect(increaseButton.hasAttribute('disabled')).to.be.false;
    });

    it('should disable plus button if max limit is reached', async () => {
      numberField.value = 1;
      numberField.max = 1;
      await nextUpdate(numberField);
      expect(decreaseButton.hasAttribute('disabled')).to.be.false;
      expect(increaseButton.hasAttribute('disabled')).to.be.true;
    });

    it('should not change value when the field is disabled and controls are clicked', async () => {
      numberField.disabled = true;
      numberField.value = 0;
      await nextUpdate(numberField);

      increaseButton.click();
      expect(numberField.value).to.equal('0');

      decreaseButton.click();
      expect(numberField.value).to.equal('0');
    });

    it('should not change value on minus button click when min limit is reached', async () => {
      numberField.min = -1;
      numberField.value = 0;
      await nextUpdate(numberField);

      decreaseButton.click();
      expect(numberField.value).to.equal('-1');

      decreaseButton.click();
      expect(numberField.value).to.equal('-1');
    });

    it('should not change value on plus button click when max limit is reached', async () => {
      numberField.max = 1;
      numberField.value = 0;
      await nextUpdate(numberField);

      increaseButton.click();
      expect(numberField.value).to.equal('1');

      increaseButton.click();
      expect(numberField.value).to.equal('1');
    });

    it('should not change value on plus button click when max limit will be reached with the next step', async () => {
      numberField.min = -10;
      numberField.max = 10;
      numberField.step = 6;
      numberField.value = 2;
      await nextUpdate(numberField);

      increaseButton.click();
      expect(numberField.value).to.equal('8');

      increaseButton.click();
      expect(numberField.value).to.equal('8');
    });

    it('should prevent touchend event on value control buttons', async () => {
      numberField.value = 0;
      await nextUpdate(numberField);

      let e = new CustomEvent('touchend', { cancelable: true });
      increaseButton.dispatchEvent(e);
      expect(e.defaultPrevented).to.be.true;
      expect(numberField.value).to.equal('1');

      e = new CustomEvent('touchend', { cancelable: true });
      decreaseButton.dispatchEvent(e);
      expect(e.defaultPrevented).to.be.true;
      expect(numberField.value).to.equal('0');
    });

    it('should not change value on value control buttons touchend event if not cancelable', async () => {
      numberField.value = 0;
      await nextUpdate(numberField);

      let e = new CustomEvent('touchend', { cancelable: false });
      increaseButton.dispatchEvent(e);
      expect(e.defaultPrevented).to.be.false;
      expect(numberField.value).to.equal('0');

      e = new CustomEvent('touchend', { cancelable: false });
      decreaseButton.dispatchEvent(e);
      expect(e.defaultPrevented).to.be.false;
      expect(numberField.value).to.equal('0');
    });

    it('should decrease value to max value on minus button click when value is over max', async () => {
      numberField.value = 50;
      numberField.max = 10;
      await nextUpdate(numberField);

      decreaseButton.click();

      expect(numberField.value).to.equal(String(numberField.max));
    });

    it('should decrease value to the closest step value on minus button click', async () => {
      numberField.min = -17;
      numberField.value = -8;
      numberField.step = 4;
      await nextUpdate(numberField);

      decreaseButton.click();

      expect(numberField.value).to.equal('-9');
    });

    it('should correctly decrease value on minus button click', async () => {
      numberField.min = -20;
      numberField.value = -1;
      numberField.step = 4;
      await nextUpdate(numberField);

      [-4, -8, -12, -16, -20].forEach((step) => {
        decreaseButton.click();
        expect(numberField.value).to.equal(String(step));
      });
    });

    it('should increase value to min value on plus button click when value is under min', async () => {
      numberField.value = -40;
      numberField.min = -10;
      await nextUpdate(numberField);

      increaseButton.click();

      expect(numberField.value).to.equal(String(numberField.min));
    });

    it('should increase value to the closest step value on plus button click', async () => {
      numberField.min = -17;
      numberField.value = -8;
      numberField.step = 4;
      await nextUpdate(numberField);

      increaseButton.click();

      expect(numberField.value).to.equal('-5');
    });

    it('should correctly increase value on plus button click', async () => {
      numberField.min = -3;
      numberField.max = 18;
      numberField.value = -1;
      numberField.step = 4;
      await nextUpdate(numberField);

      [1, 5, 9, 13, 17].forEach((step) => {
        increaseButton.click();
        expect(numberField.value).to.equal(String(step));
      });
    });

    it('should correctly increase value on plus button click when step is a decimal number', async () => {
      numberField.min = -0.02;
      numberField.max = 0.02;
      numberField.value = -0.03;
      numberField.step = 0.01;
      await nextUpdate(numberField);

      [-0.02, -0.01, 0, 0.01, 0.02].forEach((step) => {
        increaseButton.click();
        expect(numberField.value).to.equal(String(step));
      });
    });

    it('should correctly calculate the precision with decimal value', async () => {
      numberField.value = 5.1;
      numberField.step = 0.01;
      await nextUpdate(numberField);

      increaseButton.click();
      expect(numberField.value).to.equal('5.11');
    });

    describe('problematic values', () => {
      it('should correctly increase value', () => {
        const configs = [
          { props: { step: 0.001, value: 1.001 }, expectedValue: '1.002' },
          { props: { step: 0.001, value: 1.003 }, expectedValue: '1.004' },
          { props: { step: 0.001, value: 1.005 }, expectedValue: '1.006' },
          { props: { step: 0.001, value: 2.002 }, expectedValue: '2.003' },
          { props: { step: 0.001, value: 4.004 }, expectedValue: '4.005' },
          { props: { step: 0.001, value: 8.008 }, expectedValue: '8.009' },
          { props: { step: 0.01, value: 16.08 }, expectedValue: '16.09' },
          { props: { step: 0.01, value: 73.1 }, expectedValue: '73.11' },
          { props: { step: 0.001, value: 1.0131, min: 0.0001 }, expectedValue: '1.0141' },
        ];
        const reset = { step: 1, min: undefined, max: undefined, value: '' };

        configs.forEach(({ props, expectedValue }) => {
          Object.assign(numberField, reset, props);
          increaseButton.click();
          expect(numberField.value).to.equal(expectedValue);
        });
      });

      it('should correctly decrease value', () => {
        const configs = [
          { props: { step: 0.01, value: 72.9 }, expectedValue: '72.89' },
          { props: { step: 0.001, min: 0.0001, value: 1.0031 }, expectedValue: '1.0021' },
          { props: { step: 0.001, min: 0.0001, value: 1.0051 }, expectedValue: '1.0041' },
          { props: { step: 0.001, min: 0.0001, value: 1.0071 }, expectedValue: '1.0061' },
          { props: { step: 0.001, min: 0.0001, value: 1.0091 }, expectedValue: '1.0081' },
        ];
        const reset = { step: 1, min: undefined, max: undefined, value: '' };

        configs.forEach(({ props, expectedValue }) => {
          Object.assign(numberField, reset, props);
          decreaseButton.click();
          expect(numberField.value).to.equal(expectedValue);
        });
      });
    });
  });

  describe('no initial value', () => {
    describe('min is defined and max is undefined', () => {
      describe('min is below zero', () => {
        it('should set value to the first positive step value when min < 0 on plus button click', async () => {
          numberField.min = -19;
          numberField.step = 6;
          await nextUpdate(numberField);

          increaseButton.click();

          expect(numberField.value).to.equal('5');
        });

        it('should set value to the first negative step value when min < 0 zero on plus button click', async () => {
          numberField.min = -19;
          numberField.step = 6;
          await nextUpdate(numberField);

          decreaseButton.click();

          expect(numberField.value).to.equal('-1');
        });
      });

      describe('min is above zero', () => {
        it('should set value to min when min > 0 on pus button click', async () => {
          numberField.min = 19;
          numberField.step = 6;
          await nextUpdate(numberField);

          increaseButton.click();

          expect(numberField.value).to.equal('19');
        });

        it('should set value to min when min > 0 on minus button click', async () => {
          numberField.min = 19;
          numberField.step = 6;
          await nextUpdate(numberField);

          decreaseButton.click();

          expect(numberField.value).to.equal('19');
        });
      });

      describe('min equals zero', () => {
        it('should set value to the first positive step value when min = 0 on plus button click', async () => {
          numberField.min = 0;
          numberField.step = 6;
          await nextUpdate(numberField);

          increaseButton.click();

          expect(numberField.value).to.equal('6');
        });

        it('should set value to 0 when min = 0 on minus button click', async () => {
          numberField.min = 0;
          numberField.step = 6;
          await nextUpdate(numberField);

          decreaseButton.click();

          expect(numberField.value).to.equal('0');
        });
      });
    });

    describe('max is defined and min is undefined', () => {
      describe('max is below zero', () => {
        it('should set value to the closest to the max value when max < 0 on plus button click', async () => {
          // -19 cannot be equally divided by 6
          // The closest is -24, cause with the next stepUp it will become -18
          numberField.max = -19;
          numberField.step = 6;
          await nextUpdate(numberField);

          increaseButton.click();

          expect(numberField.value).to.equal('-24');

          // Check with max that can be equally divided
          numberField.value = '';
          numberField.max = -18;
          numberField.step = 6;
          await nextUpdate(numberField);

          increaseButton.click();

          expect(numberField.value).to.equal('-18');
        });

        it('should set value to max when max < 0 on minus button click', async () => {
          numberField.max = -19;
          numberField.step = 6;
          await nextUpdate(numberField);

          decreaseButton.click();

          expect(numberField.value).to.equal('-19');
        });
      });

      describe('max is above zero', () => {
        it('should set value to the first positive step value when max > 0 on minus button click', async () => {
          numberField.max = 19;
          numberField.step = 6;
          await nextUpdate(numberField);

          increaseButton.click();

          expect(numberField.value).to.equal('6');
        });

        it('should set value to the first step negative step value when max > 0 on minus button click', async () => {
          numberField.max = 19;
          numberField.step = 6;
          await nextUpdate(numberField);

          decreaseButton.click();

          expect(numberField.value).to.equal('-6');
        });
      });

      describe('max equals zero', () => {
        it('should set value to 0 when max = 0 on plus button click', async () => {
          numberField.max = 0;
          numberField.step = 6;
          await nextUpdate(numberField);

          increaseButton.click();

          expect(numberField.value).to.equal('0');
        });

        it('should set value to the first negative step value when max = 0 on minus button click', async () => {
          numberField.max = 0;
          numberField.step = 6;
          await nextUpdate(numberField);

          decreaseButton.click();

          expect(numberField.value).to.equal('-6');
        });
      });
    });

    describe('min and max values are defined', () => {
      it('should set value to the closest to the max when min < 0 and max < 0 on plus button click', async () => {
        numberField.min = -20;
        numberField.max = -3;
        numberField.step = 6;
        await nextUpdate(numberField);

        increaseButton.click();

        expect(numberField.value).to.equal('-8');

        // Check with max that can be equally divided
        numberField.value = '';
        numberField.min = -24;
        numberField.step = 6;
        await nextUpdate(numberField);

        increaseButton.click();

        expect(numberField.value).to.equal('-6');
      });

      it('should set value to 0 when max = 0 and min = 0 on minus button or plus button click', async () => {
        numberField.min = 0;
        numberField.max = 0;
        numberField.step = 6;
        await nextUpdate(numberField);

        decreaseButton.click();
        expect(numberField.value).to.equal('0');

        increaseButton.click();
        expect(numberField.value).to.equal('0');
      });

      it('should set value to min when min > 0 and max > 0 on plus button click', async () => {
        numberField.min = 3;
        numberField.max = 19;
        numberField.step = 6;
        await nextUpdate(numberField);

        increaseButton.click();

        expect(numberField.value).to.equal('3');
      });

      it('should set value to min when min > 0 and max < 0 on plus button click', async () => {
        numberField.min = 19;
        numberField.max = -3;
        numberField.step = 6;
        await nextUpdate(numberField);

        increaseButton.click();

        expect(numberField.value).to.equal('19');
      });

      it('should set value to the first positive step value when min < 0 and max is > 0 on plus button click', async () => {
        numberField.min = -19;
        numberField.max = 19;
        numberField.step = 6;
        await nextUpdate(numberField);

        increaseButton.click();

        expect(numberField.value).to.equal('5');
      });

      it('should set value to max when min < 0 and max < 0 on minus button click', async () => {
        numberField.min = -19;
        numberField.max = -3;
        numberField.step = 6;
        await nextUpdate(numberField);

        decreaseButton.click();

        expect(numberField.value).to.equal('-3');
      });

      it('should set value to min when min > 0 and max > 0 on minus button click', async () => {
        numberField.min = 3;
        numberField.max = 19;
        numberField.step = 6;
        await nextUpdate(numberField);

        decreaseButton.click();

        expect(numberField.value).to.equal('3');
      });

      it('should set value to max when min > 0 and max < 0 on minus button click', async () => {
        numberField.min = 19;
        numberField.max = -3;
        numberField.step = 6;
        await nextUpdate(numberField);

        decreaseButton.click();

        expect(numberField.value).to.equal('-3');
      });

      it('should set value to the first negative step value when min < 0 and max > 0 on minus button click', async () => {
        numberField.min = -19;
        numberField.max = 19;
        numberField.step = 6;
        await nextUpdate(numberField);

        decreaseButton.click();

        expect(numberField.value).to.equal('-1');
      });
    });

    describe('min and max values are undefined', () => {
      it('should set value to the first positive step value on minus button click', async () => {
        numberField.step = 6;
        await nextUpdate(numberField);

        increaseButton.click();

        expect(numberField.value).to.equal('6');
      });

      it('should set value to the first negative step value on minus button click', async () => {
        numberField.step = 6;
        await nextUpdate(numberField);

        decreaseButton.click();

        expect(numberField.value).to.equal('-6');
      });
    });
  });
});

describe('multiple fields', () => {
  let container, fields;

  beforeEach(async () => {
    container = fixtureSync(`
      <div>
        <vaadin-number-field step-buttons-visible></vaadin-number-field>
        <vaadin-number-field step-buttons-visible></vaadin-number-field>
      </div>
    `);
    await nextRender();
    fields = [...container.children];
  });

  ['increase', 'decrease'].forEach((type) => {
    describe(`${type} button`, () => {
      let button;

      beforeEach(() => {
        button = fields[1].shadowRoot.querySelector(`[part~="${type}-button"]`);
      });

      it(`should blur the other field on ${type} button touchend`, () => {
        const input = fields[0].inputElement;
        input.focus();

        const spy = sinon.spy(input, 'blur');
        const e = new CustomEvent('touchend', { cancelable: true });
        button.dispatchEvent(e);

        expect(spy).to.be.calledOnce;
      });

      it(`should not blur the other field on ${type} button touchend if not cancelable`, () => {
        const input = fields[0].inputElement;
        input.focus();

        const spy = sinon.spy(input, 'blur');
        const e = new CustomEvent('touchend', { cancelable: false });
        button.dispatchEvent(e);

        expect(spy).to.be.not.called;
      });

      it(`should not blur the field on its own ${type} button touchend`, () => {
        const input = fields[1].inputElement;
        input.focus();

        const spy = sinon.spy(input, 'blur');
        const e = new CustomEvent('touchend', { cancelable: true });
        button.dispatchEvent(e);

        expect(spy).to.be.not.called;
      });

      it(`should not blur the field on its own ${type} button touchend when in shadow root`, () => {
        // Move the field into shadow root to verify the deep active element logic
        const inner = document.createElement('div');
        inner.attachShadow({ mode: 'open' });
        container.appendChild(inner);
        inner.shadowRoot.appendChild(fields[1]);

        const input = fields[1].inputElement;
        input.focus();

        const e = new CustomEvent('touchend', { cancelable: true });
        button.dispatchEvent(e);

        expect(inner.shadowRoot.activeElement).to.be.equal(input);
      });
    });
  });
});
