import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { ElementMixin } from '../vaadin-element-mixin.js';

describe('ElementMixin', () => {
  describe('globals', () => {
    it('should define window.Vaadin', () => {
      expect(window.Vaadin).to.exist;
    });

    it('should check for development mode', () => {
      expect(window.Vaadin.developmentMode).to.exist;
    });

    it('should collect usage statistics', () => {
      expect(window.Vaadin.developmentModeCallback).to.be.instanceOf(Object);
      expect(window.Vaadin.developmentModeCallback['vaadin-usage-statistics']).to.be.instanceOf(Function);
    });
  });

  describe('registrations', () => {
    it('should store the class entry in registrations once instance created', () => {
      class ElementFoo extends ElementMixin(PolymerElement) {
        static get is() {
          return 'element-foo';
        }
      }
      customElements.define(ElementFoo.is, ElementFoo);
      document.createElement('element-foo');
      flush();
      expect(window.Vaadin.registrations).to.be.instanceOf(Array);
      expect(window.Vaadin.registrations[0].is).to.equal('element-foo');
    });

    it('should be possible to exclude development mode detector', () => {
      const origCallback = window.Vaadin.developmentModeCallback;
      window.Vaadin.developmentModeCallback = undefined;
      class ElementBar extends ElementMixin(PolymerElement) {
        static get is() {
          return 'element-bar';
        }
      }
      // Everything is ok as long as defining the TestBar class does not fail
      expect(ElementBar.is).to.equal('element-bar');

      window.Vaadin.developmentModeCallback = origCallback;
    });

    it('should collect usage statistics once per class', () => {
      const spy = sinon.spy(window.Vaadin.usageStatsChecker, 'maybeGatherAndSend');

      class ElementBaz extends ElementMixin(PolymerElement) {
        static get is() {
          return 'element-baz';
        }
      }
      customElements.define(ElementBaz.is, ElementBaz);

      const elem1 = document.createElement('element-baz');
      document.body.appendChild(elem1);
      flush();
      expect(spy.calledOnce).to.be.true;

      const elem2 = document.createElement('element-baz');
      document.body.appendChild(elem2);
      flush();
      expect(spy.calledOnce).to.be.true;

      class ElementBaz2 extends ElementMixin(PolymerElement) {
        static get is() {
          return 'element-baz2';
        }
      }
      customElements.define(ElementBaz2.is, ElementBaz2);

      const elem3 = document.createElement('element-baz2');
      document.body.appendChild(elem3);
      flush();
      expect(spy.calledTwice).to.be.true;
    });
  });

  describe('doctype', () => {
    before(() => {
      sinon.stub(document, 'doctype').get(() => null);
      sinon.stub(console, 'warn');
    });

    it('should warn about missing doctype', () => {
      class ElementQux extends ElementMixin(PolymerElement) {
        static get is() {
          return 'element-qux';
        }
      }
      customElements.define(ElementQux.is, ElementQux);
      document.createElement('element-qux');
      expect(console.warn.calledOnce).to.be.true;
    });
  });
});
