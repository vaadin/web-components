import { expect } from '@vaadin/chai-plugins';
import { defineCustomElement } from '../src/define.js';

describe('define', () => {
  describe('default', () => {
    before(() => {
      defineCustomElement(
        class XElement extends HTMLElement {
          static get is() {
            return 'x-element';
          }
        },
      );
    });

    it('should define a custom element', () => {
      expect(customElements.get('x-element')).to.be.ok;
    });

    it('should have a valid version number', () => {
      expect(customElements.get('x-element').version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta|rc)\d+)?$/u);
    });
  });

  describe('experimental', () => {
    before(() => {
      defineCustomElement(
        class XFoo extends HTMLElement {
          static get is() {
            return 'x-foo';
          }

          static get experimental() {
            return true;
          }
        },
      );
    });

    it('should not define an experimental custom element by default', () => {
      expect(customElements.get('x-foo')).to.be.not.ok;
    });

    it('should define an experimental custom element when flag is set after define', () => {
      window.Vaadin.featureFlags.fooComponent = true;
      expect(customElements.get('x-foo')).to.be.ok;
    });

    it('should define an experimental custom element when flag is set before define', () => {
      window.Vaadin.featureFlags.fooBarComponent = true;
      defineCustomElement(
        class XFooBar extends HTMLElement {
          static get is() {
            return 'x-foo-bar';
          }

          static get experimental() {
            return true;
          }
        },
      );
      expect(customElements.get('x-foo-bar')).to.be.ok;
    });

    it('should support defining feature flag name using experimental getter', () => {
      defineCustomElement(
        class XBaz extends HTMLElement {
          static get is() {
            return 'x-baz-item';
          }

          static get experimental() {
            return 'bazComponent';
          }
        },
      );
      window.Vaadin.featureFlags.bazComponent = true;
      expect(customElements.get('x-baz-item')).to.be.ok;
    });
  });
});
