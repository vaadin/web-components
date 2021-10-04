import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { fixtureSync, click } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { CheckedMixin } from '../src/checked-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'checked-mixin-element',
  class extends CheckedMixin(ElementMixin(PolymerElement)) {
    static get template() {
      return html`<div>
        <slot name="label"></slot>
        <slot name="input"></slot>
      </div>`;
    }

    constructor() {
      super();

      this._setType('checkbox');
      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this.stateTarget = input;
        })
      );
    }
  }
);

describe('checked-mixin', () => {
  let element, input, label;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`<checked-mixin-element></checked-mixin-element>`);

      input = element.querySelector('[slot=input]');
      label = element.querySelector('[slot=label]');
    });

    it('should set checked property to false by default', () => {
      expect(element.checked).to.be.false;
    });

    it('should not have checked attribute by default', () => {
      expect(element.hasAttribute('checked')).to.be.false;
    });

    it('should reflect checked property to the attribute', () => {
      element.checked = true;
      expect(element.hasAttribute('checked')).to.be.true;

      element.checked = false;
      expect(element.hasAttribute('checked')).to.be.false;
    });

    it('should toggle checked property on click', () => {
      element.click();
      expect(element.checked).to.be.true;

      element.click();
      expect(element.checked).to.be.false;
    });

    it('should toggle checked property on input click', () => {
      input.click();
      expect(element.checked).to.be.true;

      input.click();
      expect(element.checked).to.be.false;
    });

    it('should toggle checked property on label click', () => {
      label.click();
      expect(element.checked).to.be.true;

      label.click();
      expect(element.checked).to.be.false;
    });

    it('should prevent default behaviour for label click event', () => {
      const event = click(label);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should prevent default behaviour for input click event', () => {
      const event = click(input);
      expect(event.defaultPrevented).to.be.true;
    });

    describe('disabled', () => {
      beforeEach(() => {
        element.disabled = true;
      });

      it('should not toggle checked property on click', () => {
        element.click();
        expect(element.checked).to.be.false;
      });

      it('should not toggle checked property on label click', () => {
        label.click();
        expect(element.checked).to.be.false;
      });

      it('should not toggle checked property on input click', () => {
        input.click();
        expect(element.checked).to.be.false;
      });
    });

    describe('change event', () => {
      let changeSpy;

      beforeEach(() => {
        changeSpy = sinon.spy();
        element.addEventListener('change', changeSpy);
      });

      it('should fire change event on click', () => {
        element.click();
        expect(changeSpy.calledOnce).to.be.true;
      });

      it('should fire change event on label click', () => {
        label.click();
        expect(changeSpy.calledOnce).to.be.true;
      });

      it('should fire change event on input click', () => {
        input.click();
        expect(changeSpy.calledOnce).to.be.true;
      });

      describe('disabled', () => {
        beforeEach(() => {
          element.disabled = true;
        });

        it('should not fire change event on click', () => {
          element.click();
          expect(changeSpy.called).to.be.false;
        });

        it('should not fire change event on label click', () => {
          label.click();
          expect(changeSpy.called).to.be.false;
        });

        it('should not fire change event on input click', () => {
          input.click();
          expect(changeSpy.called).to.be.false;
        });
      });
    });
  });

  describe('delegation', () => {
    describe('checked property', () => {
      beforeEach(() => {
        element = fixtureSync(`<checked-mixin-element checked></checked-mixin-element>`);
        input = element.querySelector('[slot=input]');
      });

      it('should delegate checked property to the input', () => {
        expect(input.checked).to.be.true;

        element.checked = false;
        expect(input.checked).to.be.false;
      });
    });
  });
});
