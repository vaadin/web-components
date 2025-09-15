import { expect } from '@vaadin/chai-plugins';
import { arrowDown, arrowUp, fixtureSync, keyDownOn, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-integer-field.js';

describe('integer-field', () => {
  let integerField, input;

  beforeEach(async () => {
    integerField = fixtureSync('<vaadin-integer-field></vaadin-integer-field>');
    await nextRender();
    input = integerField.inputElement;
  });

  describe('basic', () => {
    it('should fire input event on input element when pressing ArrowUp', async () => {
      integerField.step = 3;
      await nextUpdate(integerField);
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      arrowUp(input);
      expect(spy).to.be.calledOnce;
    });

    it('should fire input event on input element when pressing ArrowDown', async () => {
      integerField.step = 3;
      await nextUpdate(integerField);
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      arrowDown(input);
      expect(spy).to.be.calledOnce;
    });

    it('should fire input event on input element when clicking decrease button', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      integerField.shadowRoot.querySelector('[part~="decrease-button"]').click();
      expect(spy).to.be.calledOnce;
    });

    it('should fire input event on input element when clicking increase button', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      integerField.shadowRoot.querySelector('[part~="increase-button"]').click();
      expect(spy).to.be.calledOnce;
    });

    it('should not prevent default for input wheel events when not focused', () => {
      const event = new CustomEvent('wheel', { cancelable: true });
      input.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.false;
    });

    it('should prevent default for input wheel events when focused', () => {
      const event = new CustomEvent('wheel', { cancelable: true });
      input.focus();
      input.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should not prevent default for host wheel events when focused', () => {
      const event = new CustomEvent('wheel', { cancelable: true });
      input.focus();
      integerField.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.false;
    });
  });

  describe('keyboard input', () => {
    let keydownSpy;

    beforeEach(() => {
      keydownSpy = sinon.spy();
      input.addEventListener('keydown', keydownSpy);
    });

    [
      [188, [], ','],
      [190, [], '.'],
      [69, [], 'e'],
      [69, ['shift'], 'E'],
      [106, [], '*'],
      [32, [], ' '],
      [187, [], '?'],
    ].forEach(([keyCode, modifiers, key]) => {
      const keyCombo = modifiers.concat(key).join('+');

      it(`should prevent "${keyCombo}"`, () => {
        keyDownOn(input, keyCode, modifiers, key);
        const event = keydownSpy.lastCall.args[0];
        expect(event.defaultPrevented).to.be.true;
      });
    });

    [
      [49, [], '1'],
      [187, [], '+'],
      [189, [], '-'],
      [49, ['ctrl'], '1'],
      [49, ['meta'], '1'],
      [65, ['ctrl'], 'e'],
      [65, ['meta'], 'e'],
      [65, ['ctrl', 'shift'], 'E'],
      [112, [], 'F1'],
      [8, [], 'Backspace'],
      [37, [], 'ArrowLeft'],
      [37, ['ctrl'], 'ArrowLeft'],
    ].forEach(([keyCode, modifiers, key]) => {
      const keyCombo = modifiers.concat(key).join('+');

      it(`should not prevent "${keyCombo}"`, () => {
        keyDownOn(input, keyCode, modifiers, key);
        const event = keydownSpy.lastCall.args[0];
        expect(event.defaultPrevented).to.be.false;
      });
    });
  });

  const fireDropEvent = (draggedText) => {
    const event = new Event('drop', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    event.dataTransfer = {
      getData: () => draggedText,
    };
    input.dispatchEvent(event);
    return event;
  };

  const firePasteEvent = (pastedText) => {
    const event = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    event.clipboardData = {
      getData: () => pastedText,
    };
    input.dispatchEvent(event);
    return event;
  };

  const fireBeforeInputEvent = (textToInput) => {
    const event = new Event('beforeinput', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    event.data = textToInput;
    input.dispatchEvent(event);
    return event;
  };

  const testEvent = (eventName, fireEvent) => {
    describe(`${eventName} event`, () => {
      it(`should prevent ${eventName} with text`, () => {
        const event = fireEvent('foo');
        expect(event.defaultPrevented).to.be.true;
      });

      it(`should prevent ${eventName} with decimals`, () => {
        const event = fireEvent('1.2');
        expect(event.defaultPrevented).to.be.true;
      });

      it(`should not prevent ${eventName} with integer`, () => {
        const event = fireEvent('123');
        expect(event.defaultPrevented).to.be.false;
      });

      it(`should not prevent ${eventName} with negative integer`, () => {
        const event = fireEvent('-123');
        expect(event.defaultPrevented).to.be.false;
      });

      it(`should not prevent ${eventName} with minus and plus signs`, () => {
        // Because the same can be done by typing
        const event = fireEvent('1-2+3');
        expect(event.defaultPrevented).to.be.false;
      });
    });
  };

  testEvent('drop', fireDropEvent);
  testEvent('paste', firePasteEvent);
  testEvent('beforeinput', fireBeforeInputEvent);

  describe('value property', () => {
    const initialValue = '1';

    beforeEach(() => {
      integerField.value = initialValue;
    });

    it('should accept integer value as string', () => {
      expect(integerField.value).to.eql(initialValue);
    });

    it('should accept integer value as number and convert to string', async () => {
      integerField.value = 2;
      await nextUpdate(integerField);
      expect(integerField.value).to.eql('2');
    });

    it('should accept negative integer value as string', async () => {
      integerField.value = '-2';
      await nextUpdate(integerField);
      expect(integerField.value).to.eql('-2');
    });

    it('should accept negative integer value as number and convert to string', async () => {
      integerField.value = -2;
      await nextUpdate(integerField);
      expect(integerField.value).to.eql('-2');
    });

    it('should accept empty string', async () => {
      integerField.value = '';
      await nextUpdate(integerField);
      expect(integerField.value).to.eql('');
    });

    describe('invalid value', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      ['foo', '1.2', 1.2, '+2', '2-', '2-2', '-', '+', '1e1', undefined, null, {}].forEach((invalidValue) => {
        it(`should clear the value when setting ${typeof invalidValue} value: ${invalidValue}`, async () => {
          integerField.value = invalidValue;
          await nextUpdate(integerField);
          expect(integerField.value).to.eql('');
          expect(console.warn.called).to.be.true;
        });
      });
    });
  });

  describe('step property', () => {
    const initialStep = 3;

    beforeEach(() => {
      integerField.step = initialStep;
    });

    it('should allow setting positive integer', () => {
      expect(integerField.step).to.eql(initialStep);
    });

    describe('invalid step', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      ['foo', '-1', -1, '1.2', 1.2, '+1', '1e1', {}, ''].forEach((invalidStep) => {
        it(`should reset default step when setting ${typeof invalidStep} value: "${invalidStep}"`, async () => {
          integerField.step = invalidStep;
          await nextUpdate(integerField);
          expect(integerField.step).to.be.null;
          expect(console.warn.called).to.be.true;
        });
      });

      it('should not show the warning when setting step to undefined', async () => {
        integerField.step = undefined;
        await nextUpdate(integerField);
        expect(integerField.step).to.be.undefined;
        expect(console.warn.called).to.be.false;
      });

      it('should not show the warning when setting step to null', async () => {
        integerField.step = null;
        await nextUpdate(integerField);
        expect(integerField.step).to.be.null;
        expect(console.warn.called).to.be.false;
      });
    });
  });
});
