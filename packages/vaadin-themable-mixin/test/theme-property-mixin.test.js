import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemePropertyMixin } from '../vaadin-theme-property-mixin.js';

class ThemeHostElement extends ThemePropertyMixin(PolymerElement) {
  static get is() {
    return 'theme-host';
  }

  static get template() {
    return html`<div id="target" theme$="[[theme]]"></div>`;
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

    it('should have undefined theme property on host', () => {
      expect(host.theme).to.be.undefined;
    });

    it('should have null theme attribute on target', () => {
      expect(target.getAttribute('theme')).to.be.null;
    });

    it('should propagate host attribute to target attribute', () => {
      host.setAttribute('theme', 'foo');
      expect(target.getAttribute('theme')).to.equal('foo');
    });

    it('should not propagate host property to target attribute', () => {
      host.theme = 'foo';
      expect(target.getAttribute('theme')).to.be.null;
    });
  });

  describe('with initial value', () => {
    beforeEach(() => {
      host = fixtureSync('<theme-host theme="initial"></theme-host>');
      target = host.$.target;
    });

    it('should have initial theme property on host', () => {
      expect(host.theme).to.equal('initial');
    });

    it('should have null theme attribute on target', () => {
      expect(target.getAttribute('theme')).to.equal('initial');
    });

    it('should propagate host attribute to target attribute', () => {
      host.setAttribute('theme', 'foo');
      expect(target.getAttribute('theme')).to.equal('foo');
    });

    it('should not propagate host property to target attribute', () => {
      host.theme = 'foo';
      expect(target.getAttribute('theme')).to.equal('initial');
    });

    it('should remove target attribute when removing host attribute', () => {
      host.removeAttribute('theme');
      expect(target.getAttribute('theme')).to.be.null;
    });
  });
});
