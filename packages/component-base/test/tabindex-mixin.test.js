import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { TabindexMixin } from '../src/tabindex-mixin.js';

customElements.define(
  'tabindex-mixin-element',
  class extends TabindexMixin(PolymerElement) {
    static get template() {
      return html`<div></div>`;
    }
  }
);

describe('tabindex-mixin', () => {
  let element;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`<tabindex-mixin-element></tabindex-mixin-element>`);
    });

    it('should not have tabindex attribute by default', () => {
      expect(element.hasAttribute('tabindex')).to.be.false;
    });

    it('should reflect tabindex property to the attribute', () => {
      element.tabindex = 1;
      expect(element.getAttribute('tabindex')).to.equal('1');
    });

    it('should reflect native tabIndex property to the attribute', () => {
      element.tabIndex = 1;
      expect(element.getAttribute('tabindex')).to.equal('1');
    });

    it('should reflect tabindex attribute to the property', () => {
      element.setAttribute('tabindex', '1');
      expect(element.tabindex).to.equal(1);
    });

    it('should set tabindex attribute to -1 when disabled', () => {
      element.tabIndex = 1;
      element.disabled = true;
      expect(element.getAttribute('tabindex')).to.equal('-1');
    });

    it('should remove tabindex attribute when enabled if no tabindex was before', () => {
      element.disabled = true;
      element.disabled = false;
      expect(element.hasAttribute('tabindex')).to.be.false;
    });

    it('should restore tabindex attribute when enabled', () => {
      element.tabIndex = 1;
      element.disabled = true;
      element.disabled = false;
      expect(element.getAttribute('tabindex')).to.equal('1');
    });

    it('should restore positive tabindex attribute that is set while disabled', () => {
      element.tabIndex = 1;
      element.disabled = true;
      element.tabIndex = 2;
      expect(element.getAttribute('tabindex')).to.equal('-1');

      element.disabled = false;
      expect(element.getAttribute('tabindex')).to.equal('2');
    });
  });

  describe('custom', () => {
    beforeEach(() => {
      element = fixtureSync(`<tabindex-mixin-element tabindex="1"></tabindex-mixin-element>`);
    });

    it('should set tabindex property to the custom value', () => {
      expect(element.tabindex).to.equal(1);
    });
  });
});
