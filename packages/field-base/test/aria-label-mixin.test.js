import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { AriaLabelMixin } from '../src/aria-label-mixin.js';
import { InputSlotMixin } from '../src/input-slot-mixin.js';
import { TextAreaSlotMixin } from '../src/text-area-slot-mixin.js';

customElements.define(
  'aria-label-input-mixin-element',
  class extends AriaLabelMixin(InputSlotMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="label"></slot><slot name="input"></slot>`;
    }
  }
);

customElements.define(
  'aria-label-textarea-mixin-element',
  class extends AriaLabelMixin(TextAreaSlotMixin(PolymerElement)) {
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
        element = fixtureSync(`<aria-label-${el}-mixin-element></aria-label-${el}-mixin-element>`);
        target = element.querySelector(`[slot=${el}]`);
        label = element.querySelector('[slot=label]');
      });

      it('should set for attribute on the label', () => {
        expect(label.getAttribute('for')).to.equal(target.id);
      });

      it('should set aria-labelledby attribute on the ' + el, () => {
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
