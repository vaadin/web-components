import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowUp, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-number-field.js';

describe('number-field', () => {
  let numberField, input, decreaseButton, increaseButton;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      tagName = numberField.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('basic', () => {
    beforeEach(async () => {
      numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
      input = numberField.inputElement;
      decreaseButton = numberField.shadowRoot.querySelector('[part=decrease-button]');
      increaseButton = numberField.shadowRoot.querySelector('[part=increase-button]');
    });

    describe('native', () => {
      it('should set value with correct decimal places regardless of step', async () => {
        numberField.step = 2;
        numberField.value = 9.99;
        await nextFrame();

        expect(numberField.value).equal('9.99');
      });

      it('should increment value to next multiple of step offset by the min', async () => {
        numberField.step = 3;
        numberField.min = 4;
        numberField.value = 4;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).equal('7');
      });

      it('should increment value on arrow up', async () => {
        numberField.step = 3;
        await nextFrame();
        arrowUp(input);
        expect(numberField.value).equal('3');
      });

      it('should decrement value on arrow down', async () => {
        numberField.step = 3;
        await nextFrame();
        arrowDown(input);
        expect(numberField.value).equal('-3');
      });

      it('should not change value on arrow keys when readonly', async () => {
        numberField.readonly = true;
        numberField.value = 0;
        await nextFrame();

        arrowUp(input);
        expect(numberField.value).to.be.equal('0');

        arrowDown(input);
        expect(numberField.value).to.be.equal('0');
      });
    });

    describe('value control buttons', () => {
      it('should increase value by 1 on plus button click', async () => {
        numberField.value = 0;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('1');
      });

      it('should dispatch change event on minus button click', async () => {
        const changeSpy = sinon.spy();
        numberField.addEventListener('change', changeSpy);

        decreaseButton.click();
        await nextFrame();

        expect(changeSpy.callCount).to.equal(1);
      });

      it('should dispatch change event on plus button click', async () => {
        const changeSpy = sinon.spy();
        numberField.addEventListener('change', changeSpy);

        increaseButton.click();
        await nextFrame();

        expect(changeSpy.callCount).to.equal(1);
      });

      it('should dispatch single value-changed event on minus button click', async () => {
        const spy = sinon.spy();
        numberField.addEventListener('value-changed', spy);

        decreaseButton.click();
        await nextFrame();

        expect(spy.callCount).to.equal(1);
      });

      it('should dispatch single value-changed event on plus button click', async () => {
        const spy = sinon.spy();
        numberField.addEventListener('value-changed', spy);

        increaseButton.click();
        await nextFrame();

        expect(spy.callCount).to.equal(1);
      });

      it('should not focus input when a button is clicked', () => {
        const spy = sinon.spy(input, 'focus');
        increaseButton.click();
        expect(spy.called).to.be.false;
      });

      it('should increase value by 0.2 when step is 0.2 on plus button click', async () => {
        numberField.step = 0.2;
        numberField.value = 0.6;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('0.8');
      });

      it('should adjust value to exact step on plus button click', async () => {
        numberField.step = 0.2;
        numberField.value = 0.5;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('0.6');
      });

      it('should decrease value by 1 on minus button click', async () => {
        numberField.value = 0;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-1');
      });

      it('should decrease value by 0.2 on minus button click', async () => {
        numberField.value = 0;
        numberField.step = 0.2;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-0.2');
      });

      it('should adjust value to exact step on minus button click', async () => {
        numberField.value = 7;
        numberField.step = 2;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('6');
      });

      it('should adjust decimals based on the step value when control button is pressed', async () => {
        numberField.value = 1;
        numberField.step = 0.001;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('1.001');
      });

      it('should adjust decimals based on the min value when control button is pressed', async () => {
        numberField.value = 1;
        numberField.step = 0.001;
        numberField.min = 0.0001;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('1.0001');
      });

      it('should not increase value on plus button click when max value is reached', async () => {
        numberField.value = 0;
        numberField.max = 0;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('0');
      });

      it('should not decrease value on minus button click when min value is reached', async () => {
        numberField.value = 0;
        numberField.min = 0;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('0');
      });

      it('should not disable buttons if there are no limits set', () => {
        expect(decreaseButton.hasAttribute('disabled')).to.be.false;
        expect(increaseButton.hasAttribute('disabled')).to.be.false;
      });

      it('should disable minus button if min limit is reached', async () => {
        numberField.value = 0;
        numberField.min = 0;
        await nextFrame();
        expect(decreaseButton.hasAttribute('disabled')).to.be.true;
        expect(increaseButton.hasAttribute('disabled')).to.be.false;
      });

      it('should disable plus button if max limit is reached', async () => {
        numberField.value = 1;
        numberField.max = 1;
        await nextFrame();
        expect(decreaseButton.hasAttribute('disabled')).to.be.false;
        expect(increaseButton.hasAttribute('disabled')).to.be.true;
      });

      it('should not change value when the field is disabled and controls are clicked', async () => {
        numberField.disabled = true;
        numberField.value = 0;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('0');

        decreaseButton.click();
        expect(numberField.value).to.be.equal('0');
      });

      it('should not change value on minus button click when min limit is reached', async () => {
        numberField.min = -1;
        numberField.value = 0;
        await nextFrame();

        decreaseButton.click();
        expect(numberField.value).to.be.equal('-1');

        decreaseButton.click();
        expect(numberField.value).to.be.equal('-1');
      });

      it('should not change value on plus button click when max limit is reached', async () => {
        numberField.max = 1;
        numberField.value = 0;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('1');

        increaseButton.click();
        expect(numberField.value).to.be.equal('1');
      });

      it('should not change value on plus button click when max limit will be reached with the next step', async () => {
        numberField.min = -10;
        numberField.max = 10;
        numberField.step = 6;
        numberField.value = 2;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('8');

        increaseButton.click();
        expect(numberField.value).to.be.equal('8');
      });

      it('should prevent touchend event on value control buttons', async () => {
        numberField.value = 0;
        await nextFrame();

        let e = new CustomEvent('touchend', { cancelable: true });
        increaseButton.dispatchEvent(e);
        expect(e.defaultPrevented).to.be.true;
        expect(numberField.value).to.equal('1');

        e = new CustomEvent('touchend', { cancelable: true });
        decreaseButton.dispatchEvent(e);
        expect(e.defaultPrevented).to.be.true;
        expect(numberField.value).to.equal('0');
      });

      it('should decrease value to max value on minus button click when value is over max', async () => {
        numberField.value = 50;
        numberField.max = 10;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal(String(numberField.max));
      });

      it('should decrease value to the closest step value on minus button click', async () => {
        numberField.min = -17;
        numberField.value = -8;
        numberField.step = 4;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-9');
      });

      it('should correctly decrease value on minus button click', async () => {
        numberField.min = -20;
        numberField.value = -1;
        numberField.step = 4;
        await nextFrame();

        [-4, -8, -12, -16, -20].forEach((step) => {
          decreaseButton.click();
          expect(numberField.value).to.be.equal(String(step));
        });
      });

      it('should increase value to min value on plus button click when value is under min', async () => {
        numberField.value = -40;
        numberField.min = -10;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal(String(numberField.min));
      });

      it('should increase value to the closest step value on plus button click', async () => {
        numberField.min = -17;
        numberField.value = -8;
        numberField.step = 4;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('-5');
      });

      it('should correctly increase value on plus button click', async () => {
        numberField.min = -3;
        numberField.max = 18;
        numberField.value = -1;
        numberField.step = 4;
        await nextFrame();

        [1, 5, 9, 13, 17].forEach((step) => {
          increaseButton.click();
          expect(numberField.value).to.be.equal(String(step));
        });
      });

      it('should correctly increase value on plus button click when step is a decimal number', async () => {
        numberField.min = -0.02;
        numberField.max = 0.02;
        numberField.value = -0.03;
        numberField.step = 0.01;
        await nextFrame();

        [-0.02, -0.01, 0, 0.01, 0.02].forEach((step) => {
          increaseButton.click();
          expect(numberField.value).to.be.equal(String(step));
        });
      });

      it('should correctly calculate the precision with decimal value', async () => {
        numberField.value = 5.1;
        numberField.step = 0.01;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('5.11');
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
            expect(numberField.value).to.be.equal(expectedValue);
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
            expect(numberField.value).to.be.equal(expectedValue);
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
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('5');
          });

          it('should set value to the first negative step value when min < 0 zero on plus button click', async () => {
            numberField.min = -19;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('-1');
          });
        });

        describe('min is above zero', () => {
          it('should set value to min when min > 0 on pus button click', async () => {
            numberField.min = 19;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('19');
          });

          it('should set value to min when min > 0 on minus button click', async () => {
            numberField.min = 19;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('19');
          });
        });

        describe('min equals zero', () => {
          it('should set value to the first positive step value when min = 0 on plus button click', async () => {
            numberField.min = 0;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('6');
          });

          it('should set value to 0 when min = 0 on minus button click', async () => {
            numberField.min = 0;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('0');
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
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('-24');

            // Check with max that can be equally divided
            numberField.value = '';
            numberField.max = -18;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('-18');
          });

          it('should set value to max when max < 0 on minus button click', async () => {
            numberField.max = -19;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('-19');
          });
        });

        describe('max is above zero', () => {
          it('should set value to the first positive step value when max > 0 on minus button click', async () => {
            numberField.max = 19;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('6');
          });

          it('should set value to the first step negative step value when max > 0 on minus button click', async () => {
            numberField.max = 19;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('-6');
          });
        });

        describe('max equals zero', () => {
          it('should set value to 0 when max = 0 on plus button click', async () => {
            numberField.max = 0;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('0');
          });

          it('should set value to the first negative step value when max = 0 on minus button click', async () => {
            numberField.max = 0;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('-6');
          });
        });
      });

      describe('min and max values are defined', () => {
        it('should set value to the closest to the max when min < 0 and max < 0 on plus button click', async () => {
          numberField.min = -20;
          numberField.max = -3;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('-8');

          // Check with max that can be equally divided
          numberField.value = '';
          numberField.min = -24;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('-6');
        });

        it('should set value to 0 when max = 0 and min = 0 on minus button or plus button click', async () => {
          numberField.min = 0;
          numberField.max = 0;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();
          expect(numberField.value).to.be.equal('0');

          increaseButton.click();
          expect(numberField.value).to.be.equal('0');
        });

        it('should set value to min when min > 0 and max > 0 on plus button click', async () => {
          numberField.min = 3;
          numberField.max = 19;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('3');
        });

        it('should set value to min when min > 0 and max < 0 on plus button click', async () => {
          numberField.min = 19;
          numberField.max = -3;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('19');
        });

        it('should set value to the first positive step value when min < 0 and max is > 0 on plus button click', async () => {
          numberField.min = -19;
          numberField.max = 19;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('5');
        });

        it('should set value to max when min < 0 and max < 0 on minus button click', async () => {
          numberField.min = -19;
          numberField.max = -3;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('-3');
        });

        it('should set value to min when min > 0 and max > 0 on minus button click', async () => {
          numberField.min = 3;
          numberField.max = 19;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('3');
        });

        it('should set value to max when min > 0 and max < 0 on minus button click', async () => {
          numberField.min = 19;
          numberField.max = -3;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('-3');
        });

        it('should set value to the first negative step value when min < 0 and max > 0 on minus button click', async () => {
          numberField.min = -19;
          numberField.max = 19;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('-1');
        });
      });

      describe('min and max values are undefined', () => {
        it('should set value to the first positive step value on minus button click', async () => {
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('6');
        });

        it('should set value to the first negative step value on minus button click', async () => {
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('-6');
        });
      });
    });

    describe('has-input-value-changed event', () => {
      let hasInputValueChangedSpy;

      beforeEach(() => {
        hasInputValueChangedSpy = sinon.spy();
        numberField.addEventListener('has-input-value-changed', hasInputValueChangedSpy);
        input.focus();
      });

      it('should fire the event when entering and removing a valid number', async () => {
        await sendKeys({ type: '555' });
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;

        hasInputValueChangedSpy.resetHistory();
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
      });

      it('should fire the event when entering and removing an invalid number', async () => {
        await sendKeys({ type: '--5' });
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;

        hasInputValueChangedSpy.resetHistory();
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('required', () => {
    let numberField;

    beforeEach(async () => {
      numberField = fixtureSync('<vaadin-number-field required></vaadin-number-field>');
      await nextRender();
    });

    it('should focus on required indicator click', () => {
      numberField.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(numberField.hasAttribute('focused')).to.be.true;
    });
  });
});
