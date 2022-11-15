import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ThemePropertyMixin } from '../vaadin-theme-property-mixin.js';

class ThemeHostElement extends ThemePropertyMixin(PolymerElement) {
  static get is() {
    return 'theme-host';
  }

  static get template() {
    return html`<div id="target" theme$="[[_theme]]"></div>`;
  }
}

customElements.define(ThemeHostElement.is, ThemeHostElement);

describe('ThemePropertyMixin', () => {
  let host, target;

  describe('default', () => {
    beforeEach(() => {
      host = fixtureSync('<theme-host></theme-host>');
      target = host.$.target;
    });

    it('should have undefined _theme property on host', () => {
      expect(host._theme).to.be.undefined;
    });

    it('should have null theme attribute on target', () => {
      expect(target.getAttribute('theme')).to.be.null;
    });

    it('should propagate host attribute to target attribute', () => {
      host.setAttribute('theme', 'foo');
      expect(target.getAttribute('theme')).to.equal('foo');
    });

    it('should not propagate host property to target attribute', () => {
      host._theme = 'foo';
      expect(target.getAttribute('theme')).to.be.null;
    });
  });

  describe('with initial value', () => {
    beforeEach(() => {
      host = fixtureSync('<theme-host theme="initial"></theme-host>');
      target = host.$.target;
    });

    it('should have initial _theme property on host', () => {
      expect(host._theme).to.equal('initial');
    });

    it('should have null theme attribute on target', () => {
      expect(target.getAttribute('theme')).to.equal('initial');
    });

    it('should propagate host attribute to target attribute', () => {
      host.setAttribute('theme', 'foo');
      expect(target.getAttribute('theme')).to.equal('foo');
    });

    it('should not propagate host property to target attribute', () => {
      host._theme = 'foo';
      expect(target.getAttribute('theme')).to.equal('initial');
    });

    it('should remove target attribute when removing host attribute', () => {
      host.removeAttribute('theme');
      expect(target.getAttribute('theme')).to.be.null;
    });
  });
});
