import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { AriaLabelMixin } from '../src/aria-label-mixin.js';

customElements.define(
  'aria-label-mixin-element',
  class extends AriaLabelMixin(PolymerElement) {
    static get template() {
      return html`<slot name="label"></slot><slot name="input"></slot>`;
    }
  }
);

describe('aria-label-mixin', () => {
  let element, input, label;

  beforeEach(() => {
    element = fixtureSync('<aria-label-mixin-element></aria-label-mixin-element>');
    input = element.querySelector('[slot=input]');
    label = element.querySelector('[slot=label]');
  });

  it('should set for attribute on the label', () => {
    expect(label.getAttribute('for')).to.equal(input.id);
  });

  it('should set aria-labelledby attribute on the input', () => {
    expect(input.getAttribute('aria-labelledby')).to.equal(label.id);
  });

  it('should only run click handler once on label click', () => {
    const spy = sinon.spy();
    element.addEventListener('click', spy);
    label.click();
    expect(spy.calledOnce).to.be.true;
  });
});
