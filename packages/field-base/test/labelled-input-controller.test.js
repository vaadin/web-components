import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { InputMixin } from '../src/input-mixin.js';
import { LabelMixin } from '../src/label-mixin.js';
import { LabelledInputController } from '../src/labelled-input-controller.js';

customElements.define(
  'label-for-input-mixin-element',
  class extends LabelMixin(InputMixin(ControllerMixin(PolymerElement))) {
    static get template() {
      return html`<slot name="label"></slot><slot name="input"></slot>`;
    }
  }
);

customElements.define(
  'label-for-textarea-mixin-element',
  class extends LabelMixin(InputMixin(ControllerMixin(PolymerElement))) {
    static get template() {
      return html`<slot name="label"></slot><slot name="textarea"></slot>`;
    }
  }
);

describe('labelled-input-controller', () => {
  let element, target, label;

  ['input', 'textarea'].forEach((el) => {
    describe(el, () => {
      beforeEach(() => {
        element = fixtureSync(`<label-for-${el}-mixin-element label="label"></label-for-${el}-mixin-element>`);
        label = element.querySelector('[slot=label]');
        target = document.createElement(el);
        target.setAttribute('slot', el);
        element.appendChild(target);
        element._setInputElement(target);
        element.addController(new LabelledInputController(target, label));
      });

      it('should set for attribute on the label', () => {
        expect(label.getAttribute('for')).to.equal(target.id);
      });

      it('should only run click handler once on label click', () => {
        const spy = sinon.spy();
        element.addEventListener('click', spy);
        label.click();
        expect(spy.calledOnce).to.be.true;
      });
    });
  });
});
