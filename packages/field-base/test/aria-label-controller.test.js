import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { AriaLabelController } from '../src/aria-label-controller.js';
import { InputMixin } from '../src/input-mixin.js';
import { LabelMixin } from '../src/label-mixin.js';

customElements.define(
  'aria-label-input-mixin-element',
  class extends LabelMixin(InputMixin(ElementMixin(PolymerElement))) {
    static get template() {
      return html`<slot name="label"></slot><slot name="input"></slot>`;
    }
  }
);

customElements.define(
  'aria-label-textarea-mixin-element',
  class extends LabelMixin(InputMixin(ElementMixin(PolymerElement))) {
    static get template() {
      return html`<slot name="label"></slot><slot name="textarea"></slot>`;
    }
  }
);

describe('aria-label-mixin', () => {
  let element, target, label;

  ['input', 'textarea'].forEach((el) => {
    describe(el, () => {
      beforeEach(() => {
        element = fixtureSync(`<aria-label-${el}-mixin-element label="label"></aria-label-${el}-mixin-element>`);
        label = element.querySelector('[slot=label]');
        target = document.createElement(el);
        target.setAttribute('slot', el);
        element.appendChild(target);
        element._setInputElement(target);
        element.addController(new AriaLabelController(element, target, label));
      });

      it('should set for attribute on the label', () => {
        expect(label.getAttribute('for')).to.equal(target.id);
      });

      it('should set aria-labelledby attribute on the ' + el, () => {
        expect(target.getAttribute('aria-labelledby')).to.equal(label.id);
      });

      it('should remove aria-labelledby attribute from the ' + el, () => {
        element.label = '';
        expect(target.hasAttribute('aria-labelledby')).to.be.false;
      });

      it('should restore aria-labelledby attribute on the ' + el, () => {
        element.label = '';
        element.label = 'label';
        expect(target.getAttribute('aria-labelledby')).to.equal(label.id);
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
