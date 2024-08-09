import { expect } from '@vaadin/chai-plugins';
import { defineLit, definePolymer } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { LitElement } from 'lit';
import { ControllerMixin } from '../src/controller-mixin.js';

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

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper('controller-mixin', 'Content', (Base) => class extends baseMixin(Base) {});

  let element, controller;

  beforeEach(() => {
    element = document.createElement(tag);
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
};

describe('ControllerMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('ControllerMixin + Lit', () => {
  runTests(defineLit, ControllerMixin);

  it('should not apply ControllerMixin to LitElement-based classes', () => {
    class TestElement extends LitElement {}

    const mixinResult = ControllerMixin(TestElement);

    expect(mixinResult).to.equal(TestElement);
  });
});
