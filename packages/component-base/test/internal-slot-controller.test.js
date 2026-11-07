import { expect } from '@vaadin/chai-plugins';
import { defineLit, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { InternalSlotController } from '../src/internal-slot-controller.js';
import { PolylitMixin } from '../src/polylit-mixin.js';

describe('InternalSlotController', () => {
  const tag = defineLit(
    'internal-slot-controller',
    `<slot name="foo"></slot>`,
    (Base) => class extends PolylitMixin(Base) {},
  );

  let element, controller, initializer;

  beforeEach(() => {
    element = fixtureSync(`<${tag}></${tag}>`);
    initializer = sinon.spy();
    controller = new InternalSlotController(element, 'foo', 'div', initializer);
  });

  describe('connected host', () => {
    beforeEach(() => {
      element.addController(controller);
    });

    it('should append the node to the named slot', () => {
      const node = element.querySelector('[slot="foo"]');
      expect(node).to.be.instanceOf(HTMLDivElement);
      expect(controller.node).to.equal(node);
    });

    it('should call the initializer with the node and the host', () => {
      expect(initializer).to.be.calledOnceWith(controller.node, element);
    });

    it('should not create another node on reconnect', () => {
      const node = controller.node;
      const parent = element.parentNode;
      parent.removeChild(element);
      parent.appendChild(element);
      expect(element.querySelectorAll('[slot="foo"]').length).to.equal(1);
      expect(controller.node).to.equal(node);
      expect(initializer).to.be.calledOnce;
    });

    it('should append the node again on reconnect when it was removed', () => {
      const node = controller.node;
      node.remove();
      const parent = element.parentNode;
      parent.removeChild(element);
      parent.appendChild(element);
      expect(node.parentNode).to.equal(element);
      expect(initializer).to.be.calledOnce;
    });
  });

  it('should create the node when added to a host that is not connected', () => {
    const host = document.createElement(tag);
    controller = new InternalSlotController(host, 'foo', 'div', initializer);
    host.addController(controller);
    expect(controller.node).to.be.null;

    element.parentNode.appendChild(host);
    expect(host.querySelector('[slot="foo"]')).to.equal(controller.node);
    expect(initializer).to.be.calledOnce;
  });

  it('should reuse an existing node with the same tag and slot', () => {
    const existing = document.createElement('div');
    existing.setAttribute('slot', 'foo');
    element.appendChild(existing);
    element.addController(controller);
    expect(controller.node).to.equal(existing);
    expect(element.querySelectorAll('[slot="foo"]').length).to.equal(1);
    expect(initializer).to.be.calledOnceWith(existing, element);
  });

  it('should not reuse a node with another tag in the slot', () => {
    const custom = document.createElement('span');
    custom.setAttribute('slot', 'foo');
    element.appendChild(custom);
    element.addController(controller);
    expect(controller.node).to.be.instanceOf(HTMLDivElement);
    expect(initializer).to.be.calledOnceWith(controller.node, element);
  });
});
