import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ValueMixin } from '../src/value-mixin.js';

customElements.define('value-mixin-element', class extends ValueMixin(PolymerElement) {});

describe('value-mixin', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<value-mixin-element></value-mixin-element>');
  });

  it('should set property to empty string by default', () => {
    expect(element.value).to.be.equal('');
  });

  it('should not set has-value attribute by default', () => {
    expect(element.hasAttribute('has-value')).to.be.false;
  });

  it('should set has-value attribute when value attribute is set', () => {
    element.setAttribute('value', 'test');
    expect(element.hasAttribute('has-value')).to.be.true;
  });

  it('should set has-value attribute when value property is set', () => {
    element.value = 'test';
    expect(element.hasAttribute('has-value')).to.be.true;
  });
});
