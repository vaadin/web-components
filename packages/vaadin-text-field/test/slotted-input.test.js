import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import { listenOnce } from './helpers.js';
import '../vaadin-text-field.js';

describe('slotted input', () => {
  let textField, input;

  beforeEach(() => {
    textField = fixtureSync(`
      <vaadin-text-field>
        <input slot="input">
      </vaadin-text-field>
    `);
    input = textField.firstElementChild;
  });

  describe('basic features', () => {
    it('should set inputElement to the slotted input', () => {
      expect(textField.inputElement).to.equal(input);
    });

    it('should update value when slotted input value changes', () => {
      input.value = 'foo';
      input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
      expect(textField.value).to.be.equal('foo');
    });

    it('should dispatch change event on slotted input change', (done) => {
      const changeEvent = new Event('change');
      listenOnce(textField, 'change', (e) => {
        expect(e.detail.sourceEvent).to.equal(changeEvent);
        done();
      });
      input.dispatchEvent(changeEvent);
    });
  });

  describe('attributes', () => {
    ['readonly', 'disabled', 'required', 'invalid'].forEach((attr) => {
      it(`should propagate ${attr} attribute to the input if it was defined on host`, () => {
        textField.setAttribute(attr, '');
        expect(input.hasAttribute(attr)).to.be.true;
      });
    });
  });

  describe('removing slotted input', () => {
    let defaultInput;

    beforeEach(() => {
      defaultInput = textField.shadowRoot.querySelector('[part~="value"]');
    });

    it('should set inputElement to the default input', async () => {
      textField.removeChild(input);
      await nextFrame();
      expect(textField.inputElement).to.equal(defaultInput);
    });

    it('should set value to the default input', async () => {
      textField.value = 'foo';
      textField.removeChild(input);
      await nextFrame();
      expect(defaultInput.value).to.equal('foo');
    });

    describe('attributes', () => {
      ['readonly', 'disabled', 'required', 'invalid'].forEach((attr) => {
        it(`should propagate ${attr} to the default input if it was defined on host`, async () => {
          textField.setAttribute(attr, '');
          expect(input.hasAttribute(attr)).to.be.true;
          textField.removeChild(input);
          await nextFrame();
          expect(defaultInput.hasAttribute(attr)).to.be.true;
        });
      });
    });
  });
});

describe('lazily attached slotted input', () => {
  let textField, input;

  beforeEach(() => {
    textField = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    input = document.createElement('input');
    input.setAttribute('slot', 'input');
  });

  it('should set inputElement to the slotted input', async () => {
    textField.appendChild(input);
    await nextFrame();
    expect(textField.inputElement).to.equal(input);
  });

  it('should set value to the slotted input', async () => {
    textField.value = 'foo';
    textField.appendChild(input);
    await nextFrame();
    expect(input.value).to.equal('foo');
  });

  describe('warnings', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn if value was defined on the slotted input', async () => {
      input.value = 'foo';
      textField.appendChild(input);
      await nextFrame();
      expect(console.warn.called).to.be.true;
    });

    it('should clear the value when initially defined on the slotted input', async () => {
      input.value = 'foo';
      textField.appendChild(input);
      await nextFrame();
      expect(input.value).to.equal('');
    });
  });

  describe('attributes', () => {
    ['readonly', 'disabled', 'required', 'invalid'].forEach((attr) => {
      it(`should propagate ${attr} to the slotted input if it was defined on host`, async () => {
        textField.setAttribute(attr, '');
        textField.appendChild(input);
        await nextFrame();
        expect(input.hasAttribute(attr)).to.be.true;
      });
    });
  });
});
