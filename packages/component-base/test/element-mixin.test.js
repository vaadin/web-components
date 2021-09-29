import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '../src/element-mixin.js';
import { flush } from '../src/debounce.js';

describe('ElementMixin', () => {
  const defineCE = (tagName) => {
    customElements.define(
      tagName,
      class extends ElementMixin(PolymerElement) {
        static get is() {
          return tagName;
        }
      }
    );

    flush();

    return customElements.get(tagName);
  };

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

  describe('version', () => {
    let XElement;

    before(() => {
      XElement = defineCE('x-element');
    });

    it('should have a valid version number', () => {
      expect(XElement.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta|rc)\d+)?$/);
    });
  });

  describe('registrations', () => {
    let ElementFoo;

    before(() => {
      ElementFoo = defineCE('element-foo');
    });

    it('should store the class entry in registrations once instance created', () => {
      document.createElement(ElementFoo.is);
      flush();
      expect(window.Vaadin.registrations).to.be.instanceOf(Array);
      expect(window.Vaadin.registrations[0].is).to.equal('element-foo');
    });
  });

  describe('dev mode callback', () => {
    let ElementBar, stub;

    before(() => {
      stub = sinon.stub(window.Vaadin, 'developmentModeCallback').returns(undefined);
    });

    after(() => {
      stub.restore();
    });

    it('should be possible to exclude development mode detector', () => {
      ElementBar = defineCE('element-bar');
      expect(ElementBar.is).to.equal('element-bar');
    });
  });

  describe('stats checker', () => {
    let ElementBaz, ElementBaz2, spy;

    before(() => {
      spy = sinon.spy(window.Vaadin.usageStatsChecker, 'maybeGatherAndSend');
    });

    it('should collect usage statistics once per class', () => {
      ElementBaz = defineCE('element-baz');

      const elem1 = document.createElement(ElementBaz.is);
      document.body.appendChild(elem1);
      flush();
      expect(spy.calledOnce).to.be.true;

      const elem2 = document.createElement(ElementBaz.is);
      document.body.appendChild(elem2);
      flush();
      expect(spy.calledOnce).to.be.true;

      ElementBaz2 = defineCE('element-baz2');

      const elem3 = document.createElement(ElementBaz2.is);
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

  describe('controllers', () => {
    let element, controller;

    class ControllerHost extends ElementMixin(PolymerElement) {
      static get is() {
        return 'controller-host';
      }

      static get template() {
        return html`Content`;
      }
    }
    customElements.define(ControllerHost.is, ControllerHost);

    class SpyController {
      constructor(host) {
        this.host = host;
      }

      hostConnected() {
        // Used in spy
      }

      hostDisconnected() {
        // Used in spy
      }
    }

    beforeEach(() => {
      element = document.createElement('controller-host');
      controller = new SpyController(element);
      sinon.stub(controller, 'hostConnected');
      sinon.stub(controller, 'hostDisconnected');
    });

    describe('hostConnected', () => {
      afterEach(() => {
        document.body.removeChild(element);
      });

      it('should run hostConnected when controller is added before host is attached', () => {
        element.addController(controller);
        document.body.appendChild(element);
        expect(controller.hostConnected.calledOnce).to.be.true;
      });

      it('should run hostConnected when controller is added after host is attached', () => {
        document.body.appendChild(element);
        element.addController(controller);
        expect(controller.hostConnected.calledOnce).to.be.true;
      });
    });

    describe('hostDisconnected', () => {
      beforeEach(() => {
        document.body.appendChild(element);
        element.addController(controller);
      });

      it('should run hostDisconnected when host is detached', () => {
        document.body.removeChild(element);
        expect(controller.hostDisconnected.calledOnce).to.be.true;
      });

      it('should not run hostDisconnected if controller is removed', () => {
        element.removeController(controller);
        document.body.removeChild(element);
        expect(controller.hostDisconnected.calledOnce).to.be.false;
      });

      it('should run hostConnected when host is reattached', () => {
        document.body.removeChild(element);
        document.body.appendChild(element);
        expect(controller.hostConnected.calledTwice).to.be.true;
      });
    });
  });
});
