import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ChunkFormatMixin } from '../src/chunk-format-mixin.js';
import { FormatMixin } from '../src/format-mixin.js';
import { InputControlMixin } from '../src/input-control-mixin.js';
import { InputController } from '../src/input-controller.js';

const INPUT_CONTROL_TEMPLATE = `
  <div part="label">
    <slot name="label"></slot>
  </div>
  <slot name="input"></slot>
  <button id="clearButton">Clear</button>
  <div part="error-message">
    <slot name="error-message"></slot>
  </div>
  <slot name="helper"></slot>
`;

// Wires up the clear button and the input element that `InputControlMixin` expects.
const InputControlHostMixin = (superclass) =>
  class extends superclass {
    get clearElement() {
      return this.$.clearButton;
    }

    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        }),
      );
    }
  };

describe('FormatMixin', () => {
  const tag = defineLit(
    'format-mixin',
    '<slot name="input"></slot>',
    (Base) => class extends FormatMixin(PolylitMixin(Base)) {},
  );

  let element, input;

  beforeEach(async () => {
    element = fixtureSync(`<${tag}></${tag}>`);
    await nextRender();
    input = document.createElement('input');
    input.setAttribute('slot', 'input');
    element.appendChild(input);
    element._setInputElement(input);
    await nextRender();
  });

  describe('core inert by default', () => {
    it('should not have a format by default', () => {
      expect(element._hasFormat).to.be.false;
    });

    it('should set formattedValue to empty string by default', () => {
      expect(element.formattedValue).to.equal('');
    });

    it('should not update formattedValue when typing', async () => {
      input.focus();
      await sendKeys({ type: 'foo' });
      expect(element.formattedValue).to.equal('');
    });

    it('should not update formattedValue when value is set programmatically', async () => {
      element.value = 'foo';
      await nextUpdate(element);
      expect(element.formattedValue).to.equal('');
    });

    it('should not update formattedValue when set by the application', async () => {
      element.formattedValue = 'x';
      await nextUpdate(element);
      expect(element.formattedValue).to.equal('');
    });

    it('should update value when typing', async () => {
      input.focus();
      await sendKeys({ type: 'foo' });
      expect(element.value).to.equal('foo');
    });

    it('should write value to the input element when set programmatically', async () => {
      element.value = 'foo';
      await nextUpdate(element);
      expect(input.value).to.equal('foo');
    });

    it('should not format on input', () => {
      expect(element._shouldFormatOnInput(new Event('input'))).to.be.false;
    });

    it('should not format on delete', () => {
      expect(element._shouldFormatOnDelete(new Event('input'))).to.be.false;
    });

    it('should present no text on input', () => {
      expect(element._formatOnInput(new Event('input'))).to.be.undefined;
    });

    it('should map no caret to the presented value', () => {
      expect(element._mapCaretToPresentedValue(input, 'foo')).to.be.undefined;
    });
  });

  describe('_presentValue', () => {
    beforeEach(async () => {
      element.value = 'foo';
      await nextUpdate(element);
      input.focus();
    });

    it('should write the given text to the input element', () => {
      element._presentValue('foobar');
      expect(input.value).to.equal('foobar');
    });

    it('should not update value when presenting text', () => {
      element._presentValue('foobar');
      expect(element.value).to.equal('foo');
    });

    it('should not restore the caret to the given index without a format', () => {
      input.setSelectionRange(1, 1);
      element._presentValue('foobar', 2);
      expect(input.selectionStart).to.equal(6);
    });

    it('should leave the caret at the end when no index is given', () => {
      input.setSelectionRange(1, 1);
      element._presentValue('foobar');
      expect(input.selectionStart).to.equal(6);
    });
  });
});

describe('FormatMixin with a trivial formatter', () => {
  const tag = defineLit(
    'format-mixin-uppercase',
    INPUT_CONTROL_TEMPLATE,
    (Base) =>
      class extends InputControlHostMixin(FormatMixin(InputControlMixin(PolylitMixin(Base)))) {
        // Backs `_hasFormat` with a field so that a test can turn the format
        // off, the way a component with an unset `format` property behaves.
        formatEnabled = true;

        get _hasFormat() {
          return this.formatEnabled;
        }

        _formatOnInput(_event) {
          const input = this.inputElement;
          this._presentValue(input.value.toUpperCase(), input.selectionStart);
        }

        _modelValueFromInput(viewValue) {
          return viewValue.toUpperCase();
        }

        _inputValueFromModel(value) {
          return value.toUpperCase();
        }
      },
  );

  let element, input;

  beforeEach(async () => {
    element = fixtureSync(`<${tag}></${tag}>`);
    await nextRender();
    input = element.querySelector('[slot=input]');
  });

  describe('core without chunking', () => {
    it('should present the value in its formatted form', async () => {
      element.value = 'abc';
      await nextUpdate(element);
      expect(input.value).to.equal('ABC');
    });

    it('should update formattedValue when value is set programmatically', async () => {
      element.value = 'abc';
      await nextUpdate(element);
      expect(element.formattedValue).to.equal('ABC');
    });

    it('should write the presented text through _presentValue', () => {
      element._presentValue('ABC');
      expect(input.value).to.equal('ABC');
      expect(element.formattedValue).to.equal('ABC');
    });

    it('should not define the format properties', () => {
      expect('formatBlocks' in element).to.be.false;
      expect('formatDelimiter' in element).to.be.false;
      expect('formatTextCase' in element).to.be.false;
    });

    it('should not call _forwardInputValue when typing', async () => {
      const spy = sinon.spy(element, '_forwardInputValue');
      input.focus();
      await sendKeys({ type: 'abc' });
      expect(spy).to.be.not.called;
    });

    it('should fire one value-changed event per keystroke', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      input.focus();
      await sendKeys({ type: 'a' });
      expect(spy).to.be.calledOnce;
    });
  });

  describe('formattedValue timing', () => {
    it('should have formattedValue up to date when value-changed fires', async () => {
      let formattedValue;
      element.addEventListener('value-changed', () => {
        formattedValue = element.formattedValue;
      });
      element.value = 'abc';
      await nextUpdate(element);
      expect(formattedValue).to.equal('ABC');
    });

    it('should have formattedValue up to date after _presentValue', () => {
      element._presentValue('ABC');
      expect(element.formattedValue).to.equal('ABC');
    });
  });

  describe('caret', () => {
    beforeEach(async () => {
      element.value = 'abcdef';
      await nextUpdate(element);
      input.focus();
    });

    it('should restore the caret to the index given to _presentValue', () => {
      element._presentValue('ABCXDEF', 3);
      expect(input.selectionStart).to.equal(3);
      expect(input.selectionEnd).to.equal(3);
    });

    it('should leave the caret where the write puts it when no index is given', () => {
      input.setSelectionRange(2, 2);
      element._presentValue('ABCXDEF');
      expect(input.selectionStart).to.equal(7);

      // Control: the same is what assigning the value of a plain input does.
      const control = fixtureSync('<input value="ABCDEF">');
      control.focus();
      control.setSelectionRange(2, 2);
      control.value = 'ABCXDEF';
      expect(control.selectionStart).to.equal(7);
    });

    it('should not move the caret on a synthetic input event', async () => {
      input.setSelectionRange(3, 3);
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await nextUpdate(element);
      expect(input.selectionStart).to.equal(3);
      expect(input.selectionEnd).to.equal(3);
    });

    it('should not apply a caret index left over from a write without a format', async () => {
      element.formatEnabled = false;
      element._presentValue('x', 3);
      expect(input.selectionStart).to.equal(1);

      element.formatEnabled = true;
      element.value = 'ghijkl';
      await nextUpdate(element);
      expect(input.value).to.equal('GHIJKL');
      expect(input.selectionStart).to.equal(6);
    });
  });

  describe('_prevState', () => {
    beforeEach(() => {
      input.focus();
    });

    it('should record the presented text and the caret it was written with', () => {
      element._presentValue('FI21 5', 3);
      expect(element._prevState).to.eql({ value: 'FI21 5', selection: [3, 3] });
    });

    it('should record the state of the input element before an edit', async () => {
      await sendKeys({ type: 'abc' });
      input.setSelectionRange(1, 2);
      input.dispatchEvent(
        new InputEvent('beforeinput', {
          bubbles: true,
          composed: true,
          cancelable: true,
          inputType: 'insertText',
          data: 'x',
        }),
      );
      expect(element._prevState).to.eql({ value: 'ABC', selection: [1, 2] });
    });

    it('should not let a caller change the recorded state', () => {
      element._presentValue('FI21 5', 3);
      element._prevState.selection[0] = 0;
      expect(element._prevState).to.eql({ value: 'FI21 5', selection: [3, 3] });
    });
  });

  describe('caret intent before the input element exists', () => {
    let detached, detachedInput;

    beforeEach(async () => {
      detached = document.createElement(tag);
      detached._presentValue('x', 3);
      document.body.appendChild(detached);
      await nextRender();
      detachedInput = detached.querySelector('[slot=input]');
      detachedInput.focus();
    });

    afterEach(() => {
      detached.remove();
    });

    it('should not apply a caret index left over from a write before attach', async () => {
      detached.value = 'abcdef';
      await nextUpdate(detached);
      expect(detachedInput.value).to.equal('ABCDEF');
      expect(detachedInput.selectionStart).to.equal(6);
    });
  });

  describe('clear', () => {
    beforeEach(async () => {
      element.value = 'abc';
      await nextUpdate(element);
    });

    it('should reset value, formattedValue and the input element on clear', async () => {
      element.clear();
      await nextUpdate(element);
      expect(element.value).to.equal('');
      expect(element.formattedValue).to.equal('');
      expect(input.value).to.equal('');
    });

    it('should remove has-value attribute on clear', async () => {
      element.clear();
      await nextUpdate(element);
      expect(element.hasAttribute('has-value')).to.be.false;
    });
  });

  describe('no format configured', () => {
    beforeEach(async () => {
      element.formatEnabled = false;
      element.value = 'abcdef';
      await nextUpdate(element);
      input.focus();
    });

    it('should move the caret to the end on a programmatic value set', async () => {
      input.setSelectionRange(1, 1);
      element.value = 'longer value';
      await nextUpdate(element);
      expect(input.selectionStart).to.equal(input.value.length);
    });

    it('should collapse the selection when writing the same string', () => {
      input.setSelectionRange(2, 4);
      element._inputElementValue = input.value;
      const selection = [input.selectionStart, input.selectionEnd];

      // Control: the same is what assigning the value of a plain input does.
      const control = fixtureSync('<input value="ABCDEF">');
      control.focus();
      control.setSelectionRange(2, 4);
      const same = control.value;
      control.value = same;
      expect(selection).to.eql([control.selectionStart, control.selectionEnd]);
    });

    it('should keep formattedValue empty', async () => {
      element.value = 'longer value';
      await nextUpdate(element);
      expect(element.formattedValue).to.equal('');
    });
  });

  describe('formatting while typing', () => {
    beforeEach(() => {
      input.focus();
    });

    it('should present the typed text in its formatted form', async () => {
      await sendKeys({ type: 'abc' });
      expect(input.value).to.equal('ABC');
    });

    it('should update value and formattedValue while typing', async () => {
      await sendKeys({ type: 'abc' });
      expect(element.value).to.equal('ABC');
      expect(element.formattedValue).to.equal('ABC');
    });

    it('should keep the caret after the typed character', async () => {
      await sendKeys({ type: 'abc' });
      expect(input.selectionStart).to.equal(3);
      expect(input.selectionEnd).to.equal(3);
    });

    it('should fire one value-changed event per typed character', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      await sendKeys({ type: 'abc' });
      expect(spy).to.be.calledThrice;
    });

    it('should have value formatted when the input event reaches the host', async () => {
      const seen = [];
      element.addEventListener('input', () => seen.push([element.value, input.value]));
      await sendKeys({ type: 'abc' });
      expect(seen).to.eql([
        ['A', 'A'],
        ['AB', 'AB'],
        ['ABC', 'ABC'],
      ]);
    });
  });

  describe('delete intents', () => {
    let spy;

    beforeEach(async () => {
      input.focus();
      await sendKeys({ type: 'abc' });
      spy = sinon.spy(element, '_formatOnInput');
    });

    it('should not format the view when a character is deleted', async () => {
      await sendKeys({ press: 'Backspace' });
      expect(spy).to.be.not.called;
      expect(element.value).to.equal('AB');
    });

    it('should not format the view when a synthetic input event shrinks it', async () => {
      input.value = 'AB';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await nextUpdate(element);
      expect(spy).to.be.not.called;
      expect(element.value).to.equal('AB');
    });

    it('should format the view when a synthetic input event grows it', async () => {
      input.value = 'ABCd';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await nextUpdate(element);
      expect(spy).to.be.calledOnce;
      expect(input.value).to.equal('ABCD');
    });

    it('should format the view on a deletion when the layer asks for it', async () => {
      sinon.stub(element, '_shouldFormatOnDelete').returns(true);
      await sendKeys({ press: 'Backspace' });
      expect(spy).to.be.calledOnce;
      expect(element.value).to.equal('AB');
    });

    it('should not apply a delete intent that a layer above prevented', async () => {
      // Registered after the mixin's own listener, so that it prevents the edit
      // once the intent for it has been recorded, the way a layer above does.
      input.addEventListener('beforeinput', (event) => event.preventDefault());
      input.dispatchEvent(
        new InputEvent('beforeinput', {
          bubbles: true,
          composed: true,
          cancelable: true,
          inputType: 'deleteContentBackward',
        }),
      );

      input.value = 'ABCd';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await nextUpdate(element);
      expect(spy).to.be.calledOnce;
      expect(input.value).to.equal('ABCD');
    });

    it('should not apply a recorded delete intent to a later event', async () => {
      input.dispatchEvent(
        new InputEvent('beforeinput', {
          bubbles: true,
          composed: true,
          cancelable: true,
          inputType: 'deleteContentBackward',
        }),
      );
      input.value = 'AB';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await nextUpdate(element);
      expect(spy).to.be.not.called;

      input.value = 'ABc';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await nextUpdate(element);
      expect(spy).to.be.calledOnce;
      expect(input.value).to.equal('ABC');
    });
  });

  describe('prevented edit', () => {
    let spy;

    beforeEach(async () => {
      element.allowedCharPattern = '[a-z]';
      element.value = 'abc';
      await nextUpdate(element);
      spy = sinon.spy(element, '_formatOnInput');
    });

    it('should not record an intent for an edit that a lower layer prevents', async () => {
      const event = new InputEvent('beforeinput', {
        bubbles: true,
        composed: true,
        cancelable: true,
        inputType: 'insertText',
        data: '1',
      });
      input.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;

      // With no intent recorded, the shrinking event below reads as a deletion.
      // Had the prevented `insertText` been recorded, it would reformat instead.
      input.value = 'AB';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await nextUpdate(element);
      expect(spy).to.be.not.called;
      expect(element.value).to.equal('AB');
    });
  });

  describe('composition', () => {
    let spy;

    beforeEach(() => {
      input.focus();
      spy = sinon.spy(element, '_formatOnInput');
    });

    async function compose(text) {
      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, composed: true }));
      await sendKeys({ type: text });
    }

    it('should not format the view while composing', async () => {
      await compose('abc');
      expect(spy).to.be.not.called;
      expect(input.value).to.equal('abc');
    });

    it('should update value while composing', async () => {
      await compose('abc');
      expect(element.value).to.equal('ABC');
    });

    it('should format the view once when the composition ends', async () => {
      await compose('abc');
      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true }));
      await nextUpdate(element);
      expect(spy).to.be.calledOnce;
      expect(input.value).to.equal('ABC');
      expect(element.formattedValue).to.equal('ABC');
    });
  });

  describe('formatting on commit', () => {
    let spy;

    beforeEach(() => {
      sinon.stub(element, '_shouldFormatOnInput').returns(false);
      spy = sinon.spy(element, '_formatOnInput');
      input.focus();
    });

    it('should update value on every typed character', async () => {
      const valueChangedSpy = sinon.spy();
      element.addEventListener('value-changed', valueChangedSpy);
      await sendKeys({ type: 'abc' });
      expect(element.value).to.equal('ABC');
      expect(valueChangedSpy).to.be.calledThrice;
    });

    it('should leave the view exactly as typed', async () => {
      await sendKeys({ type: 'abc' });
      expect(spy).to.be.not.called;
      expect(input.value).to.equal('abc');
    });

    it('should format the view when _presentValue is called from a commit path', async () => {
      await sendKeys({ type: 'abc' });
      element._presentValue(input.value.toUpperCase());
      expect(input.value).to.equal('ABC');
      expect(element.formattedValue).to.equal('ABC');
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      element.addEventListener('change', spy);
      input.focus();
    });

    it('should not fire change on blur after a programmatic value set with a format', async () => {
      element.value = 'FI21';
      await nextUpdate(element);

      input.blur();

      expect(input.value).to.equal('FI21');
      expect(spy).to.be.not.called;
    });

    it('should fire change once on blur after typing without a format', async () => {
      element.formatEnabled = false;
      await sendKeys({ type: 'abc' });
      await nextUpdate(element);

      input.blur();

      expect(input.value).to.equal('abc');
      expect(spy).to.be.calledOnce;
    });
  });
});

describe('FormatMixin with a format from a layer above chunking', () => {
  // A layer that presents a format of its own on top of the chunking layer, the
  // way a second format mixin in the chain does. It reports a format without
  // configuring the chunking below it, so nothing but that layer's own guards
  // keeps the field working.
  const FormatLayerMixin = (superclass) =>
    class extends FormatMixin(superclass) {
      get _hasFormat() {
        return true;
      }
    };

  const tag = defineLit(
    'format-mixin-layered',
    INPUT_CONTROL_TEMPLATE,
    (Base) =>
      class extends InputControlHostMixin(FormatLayerMixin(ChunkFormatMixin(InputControlMixin(PolylitMixin(Base))))) {},
  );

  let element, input;

  beforeEach(async () => {
    element = fixtureSync(`<${tag}></${tag}>`);
    await nextRender();
    input = element.querySelector('[slot=input]');
    input.focus();
  });

  it('should report a format with none configured for the layer below', () => {
    expect(element._hasFormat).to.be.true;
    expect(element.formatBlocks).to.be.undefined;
  });

  it('should present the typed text as a field without a format does', async () => {
    await sendKeys({ type: 'abcd' });
    expect(input.value).to.equal('abcd');
    expect(element.value).to.equal('abcd');
  });

  it('should delete the character before the caret as a field without a format does', async () => {
    await sendKeys({ type: 'abcd' });
    input.setSelectionRange(2, 2);
    await sendKeys({ press: 'Backspace' });
    expect(input.value).to.equal('acd');
    expect(element.value).to.equal('acd');
  });

  it('should accept a pasted string as a field without a format does', () => {
    const event = new Event('paste', { bubbles: true, cancelable: true, composed: true });
    event.clipboardData = { getData: () => 'FI21 1234' };
    input.dispatchEvent(event);
    expect(event.defaultPrevented).to.be.false;
    expect(element.hasAttribute('input-prevented')).to.be.false;
  });

  it('should map no caret to the presented value', () => {
    expect(element._mapCaretToPresentedValue(input, 'abc')).to.be.undefined;
  });
});
