import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FormatMixin } from '../src/format-mixin.js';

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

    it('should restore the caret to the given index', () => {
      element._presentValue('foobar', 2);
      expect(input.selectionStart).to.equal(2);
      expect(input.selectionEnd).to.equal(2);
    });

    it('should leave the caret at the end when no index is given', () => {
      input.setSelectionRange(1, 1);
      element._presentValue('foobar');
      expect(input.selectionStart).to.equal(6);
    });
  });
});
