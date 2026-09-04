import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FormatMixin } from '../src/format-mixin.js';
import { InputControlMixin } from '../src/input-control-mixin.js';
import { InputController } from '../src/input-controller.js';

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
    `
      <div part="label">
        <slot name="label"></slot>
      </div>
      <slot name="input"></slot>
      <button id="clearButton">Clear</button>
      <div part="error-message">
        <slot name="error-message"></slot>
      </div>
      <slot name="helper"></slot>
    `,
    (Base) =>
      class extends FormatMixin(InputControlMixin(PolylitMixin(Base))) {
        // Backs `_hasFormat` with a field so that a test can turn the format
        // off, the way a component with an unset `format` property behaves.
        formatEnabled = true;

        get clearElement() {
          return this.$.clearButton;
        }

        get _hasFormat() {
          return this.formatEnabled;
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

    it('should not define a format property', () => {
      expect('format' in element).to.be.false;
      expect(element.format).to.be.undefined;
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
});
