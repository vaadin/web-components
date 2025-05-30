import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputController } from '../src/input-controller.js';
import { InputFieldMixin } from '../src/input-field-mixin.js';

describe('InputFieldMixin', () => {
  const tag = defineLit(
    'input-field-mixin',
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
      class extends InputFieldMixin(PolylitMixin(Base)) {
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
      },
  );

  let element, input;

  describe('properties', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate autocomplete property to the input', async () => {
      element.autocomplete = 'on';
      await nextUpdate(element);
      expect(input.autocomplete).to.equal('on');
    });

    it('should propagate autocorrect property to the input', async () => {
      element.autocorrect = 'on';
      await nextUpdate(element);
      expect(input.getAttribute('autocorrect')).to.equal('on');
    });

    it('should propagate autocapitalize property to the input', async () => {
      element.autocapitalize = 'none';
      await nextUpdate(element);
      expect(input.getAttribute('autocapitalize')).to.equal('none');
    });
  });

  describe('attributes', () => {
    describe('autocomplete', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} autocomplete="on"></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
      });

      it('should set autocomplete property on the host element', () => {
        expect(element.autocomplete).to.equal('on');
      });

      it('should propagate autocomplete attribute to the input', () => {
        expect(input.autocomplete).to.equal('on');
      });
    });

    describe('autocorrect', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} autocorrect="on"></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
      });

      it('should set autocorrect property on the host element', () => {
        expect(element.autocorrect).to.equal('on');
      });

      it('should propagate autocorrect attribute to the input', () => {
        expect(input.getAttribute('autocorrect')).to.equal('on');
      });
    });

    describe('autocapitalize', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} autocapitalize="characters"></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
      });

      it('should set autocapitalize property on the host element', () => {
        expect(element.autocapitalize).to.equal('characters');
      });

      it('should propagate autocapitalize attribute to the input', () => {
        expect(input.getAttribute('autocapitalize')).to.equal('characters');
      });
    });
  });

  describe('initial validation', () => {
    let validateSpy;

    beforeEach(() => {
      element = document.createElement(tag);
      validateSpy = sinon.spy(element, 'validate');
    });

    afterEach(() => {
      element.remove();
    });

    it('should not validate when the field has an initial value', async () => {
      element.value = 'Initial Value';
      document.body.appendChild(element);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      element.value = 'Initial Value';
      element.invalid = true;
      document.body.appendChild(element);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should validate on input blur', () => {
      const spy = sinon.spy(element, 'validate');
      input.focus();
      input.blur();
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate on programmatic blur', () => {
      const spy = sinon.spy(element, 'validate');
      element.focus();
      element.blur();
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate on input event', async () => {
      element.required = true;
      element.invalid = true;
      await nextUpdate(element);
      const spy = sinon.spy(element, 'validate');
      input.focus();
      await sendKeys({ type: 'f' });
      expect(spy.calledOnce).to.be.true;
      expect(element.invalid).to.be.false;
    });

    it('should validate on value change when field is invalid', async () => {
      const spy = sinon.spy(element, 'validate');
      element.invalid = true;
      element.value = 'foo';
      await nextUpdate(element);
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when required', () => {
      const spy = sinon.spy(input, 'checkValidity');
      element.required = true;
      element.checkValidity();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not call checkValidity on the input when not required', () => {
      const spy = sinon.spy(input, 'checkValidity');
      element.checkValidity();
      expect(spy.calledOnce).to.be.false;
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on blur when document does not have focus', () => {
        const spy = sinon.spy(element, 'validate');
        input.focus();
        input.blur();
        expect(spy.called).to.be.false;
      });
    });
  });

  describe('slotted input value', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
      element = document.createElement(tag);
    });

    afterEach(() => {
      document.body.removeChild(element);
      console.warn.restore();
    });

    it('should warn when value is set on the slotted input', async () => {
      input = document.createElement('input');
      input.setAttribute('slot', 'input');
      input.value = 'foo';
      element.appendChild(input);
      document.body.appendChild(element);
      await nextRender();
      expect(console.warn.called).to.be.true;
    });

    it('should not warn when value is set on the element itself', async () => {
      element.value = 'foo';
      document.body.appendChild(element);
      await nextRender();
      expect(console.warn.called).to.be.false;
    });
  });
});
