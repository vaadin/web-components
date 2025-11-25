import { expect } from '@vaadin/chai-plugins';
import { defineLit, fixtureSync } from '@vaadin/testing-helpers';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TabindexMixin } from '../src/tabindex-mixin.js';

describe('TabindexMixin', () => {
  const tag = defineLit(
    'tabindex-mixin',
    '<slot></slot>',
    (Base) => class extends TabindexMixin(PolylitMixin(Base)) {},
  );

  let element;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    it('should not have tabindex attribute by default', () => {
      expect(element.hasAttribute('tabindex')).to.be.false;
    });

    it('should reflect native tabIndex property to the attribute', () => {
      element.tabIndex = 1;
      expect(element.getAttribute('tabindex')).to.be.equal('1');
    });

    it('should reflect tabindex attribute to the property', () => {
      element.setAttribute('tabindex', '1');
      expect(element.tabIndex).to.be.equal(1);
    });

    it('should set tabindex attribute to -1 when disabled', () => {
      element.tabIndex = 1;
      element.disabled = true;
      expect(element.getAttribute('tabindex')).to.be.equal('-1');
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
      expect(element.getAttribute('tabindex')).to.be.equal('1');
    });

    it('should restore tabindex attribute with the last known value when enabled', () => {
      element.tabIndex = 1;
      element.disabled = true;
      element.tabIndex = 2;
      expect(element.getAttribute('tabindex')).to.be.equal('-1');

      element.disabled = false;
      expect(element.getAttribute('tabindex')).to.be.equal('2');
    });

    it('should allow programmatic focus when enabled', () => {
      element.tabIndex = 0;
      element.focus();
      expect(document.activeElement).to.equal(element);
    });

    it('should not allow programmatic focus when disabled', () => {
      element.tabIndex = 0;
      element.disabled = true;
      element.focus();
      expect(document.activeElement).to.equal(document.body);
    });
  });

  describe('custom', () => {
    beforeEach(() => {
      element = fixtureSync(`<${tag} tabindex="1"></${tag}>`);
    });

    it('should set tabindex property to the custom value', () => {
      expect(element.tabIndex).to.equal(1);
    });
  });
});
