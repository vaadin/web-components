import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { SlotController } from '../src/slot-controller.js';

customElements.define(
  'slot-controller-element',
  class extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`
        <slot name="foo"></slot>
        <slot></slot>
      `;
    }
  },
);

describe('slot-controller', () => {
  let element, child, controller, initializeSpy;

  describe('named slot', () => {
    describe('default content', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-controller-element></slot-controller-element>');
        initializeSpy = sinon.stub().callsFake((node) => {
          node.textContent = 'foo';
        });
        controller = new SlotController(element, 'foo', 'div', { initializer: initializeSpy });
        element.addController(controller);
        child = element.querySelector('[slot="foo"]');
      });

      it('should append an element to named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('foo');
      });

      it('should store a reference to named slot child', () => {
        expect(controller.node).to.equal(child);
      });

      it('should return a reference to named slot child', () => {
        expect(controller.getSlotChild()).to.equal(child);
      });

      it('should run initializer for named slot child', () => {
        expect(initializeSpy.calledOnce).to.be.true;
        expect(initializeSpy.firstCall.args[0]).to.equal(child);
        expect(initializeSpy.firstCall.args[1]).to.equal(element);
      });
    });

    describe('custom content', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <slot-controller-element>
            <div slot="foo">bar</div>
          </slot-controller-element>
        `);
        // Get element reference before adding the controller
        child = element.querySelector('[slot="foo"]');
        initializeSpy = sinon.spy();
        controller = new SlotController(element, 'foo', 'div', { initializer: initializeSpy });
        element.addController(controller);
      });

      it('should not override an element passed to named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('bar');
      });

      it('should store a reference to the custom slot child', () => {
        expect(controller.node).to.equal(child);
      });

      it('should return a reference to custom named slot child', () => {
        expect(controller.getSlotChild()).to.equal(child);
      });

      it('should run initializer for custom named slot child', () => {
        expect(initializeSpy.calledOnce).to.be.true;
        expect(initializeSpy.firstCall.args[0]).to.equal(child);
        expect(initializeSpy.firstCall.args[1]).to.equal(element);
      });
    });
  });

  describe('un-named slot', () => {
    describe('default content', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-controller-element></slot-controller-element>');
        initializeSpy = sinon.stub().callsFake((node) => {
          node.textContent = 'bar';
        });
        controller = new SlotController(element, '', 'div', { initializer: initializeSpy });
        element.addController(controller);
        child = element.querySelector(':not([slot])');
      });

      it('should append an element to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('bar');
      });

      it('should store a reference to un-named slot child', () => {
        expect(controller.node).to.equal(child);
      });

      it('should return a reference to un-named slot child', () => {
        expect(controller.getSlotChild()).to.equal(child);
      });

      it('should run initializer for un-named slot child', () => {
        expect(initializeSpy.calledOnce).to.be.true;
        expect(initializeSpy.firstCall.args[0]).to.equal(child);
        expect(initializeSpy.firstCall.args[1]).to.equal(element);
      });
    });

    describe('custom element', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <slot-controller-element>
            <div>baz</div>
          </slot-controller-element>
        `);
        // Get element reference before adding the controller
        child = element.querySelector(':not([slot])');
        initializeSpy = sinon.spy();
        controller = new SlotController(element, '', 'div', { initializer: initializeSpy });
        element.addController(controller);
      });

      it('should not override an element passed to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('baz');
      });

      it('should store a reference to element passed to un-named slot', () => {
        expect(controller.node).to.equal(child);
      });

      it('should return a reference to element passed to un-named slot', () => {
        expect(controller.getSlotChild()).to.equal(child);
      });

      it('should run initializer for un-named slot element', () => {
        expect(initializeSpy.calledOnce).to.be.true;
        expect(initializeSpy.firstCall.args[0]).to.equal(child);
        expect(initializeSpy.firstCall.args[1]).to.equal(element);
      });
    });

    describe('custom text node', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-controller-element>baz</slot-controller-element>');
        initializeSpy = sinon.spy();
        controller = new SlotController(element, '', 'div', { initializer: initializeSpy });
        element.addController(controller);
        // Check last child to ensure no custom node is added.
        child = element.lastChild;
      });

      it('should not override a text node passed to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('baz');
      });

      it('should store a reference to the slotted text node', () => {
        expect(controller.node).to.equal(child);
      });

      it('should return a reference to the slotted text node', () => {
        expect(controller.getSlotChild()).to.equal(child);
      });

      it('should run initializer for the slotted text node', () => {
        expect(initializeSpy.calledOnce).to.be.true;
        expect(initializeSpy.firstCall.args[0]).to.equal(child);
        expect(initializeSpy.firstCall.args[1]).to.equal(element);
      });
    });

    describe('empty text node', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-controller-element> </slot-controller-element>');
        child = element.firstChild;
      });

      it('should override an empty text node passed to un-named slot', () => {
        controller = new SlotController(element, '', 'div', {
          initializer: (node) => {
            node.textContent = 'bar';
          },
        });
        element.addController(controller);
        expect(controller.getSlotChild().textContent).to.equal('bar');
      });
    });
  });

  describe('Slot observing', () => {
    let defaultNode;

    beforeEach(async () => {
      element = fixtureSync('<slot-controller-element></slot-controller-element>');
      controller = new SlotController(element, 'foo', 'div', {
        initializer: (node) => {
          node.textContent = 'bar';
        },
      });
      element.addController(controller);
      defaultNode = element.querySelector('[slot="foo"]');
      // Wait for initial slotchange event
      await nextFrame();
    });

    it('should remove default node when custom slot child is added', async () => {
      const custom = document.createElement('div');
      custom.textContent = 'bar';
      custom.setAttribute('slot', 'foo');
      element.appendChild(custom);

      await nextFrame();
      expect(defaultNode.isConnected).to.be.false;
    });

    it('should call initCustomNode for custom slot child when it is added', async () => {
      const initSpy = sinon.spy(controller, 'initCustomNode');

      const custom = document.createElement('div');
      custom.textContent = 'bar';
      custom.setAttribute('slot', 'foo');
      element.appendChild(custom);

      await nextFrame();
      expect(initSpy.calledOnce).to.be.true;
      expect(initSpy.firstCall.args[0]).to.equal(custom);
    });

    it('should call teardownNode for default node when adding custom child', async () => {
      const teardownSpy = sinon.spy(controller, 'teardownNode');

      const custom = document.createElement('div');
      custom.textContent = 'bar';
      custom.setAttribute('slot', 'foo');
      element.appendChild(custom);

      await nextFrame();
      expect(teardownSpy.called).to.be.true;
      expect(teardownSpy.firstCall.args[0]).to.equal(defaultNode);
    });
  });

  describe('Slot observing disabled', () => {
    let defaultNode;

    beforeEach(async () => {
      element = fixtureSync('<slot-controller-element></slot-controller-element>');
      controller = new SlotController(element, 'foo', 'div', {
        observe: false,
        initializer: (node) => {
          node.textContent = 'bar';
        },
      });
      element.addController(controller);
      defaultNode = element.querySelector('[slot="foo"]');
      // Wait for initial slotchange event
      await nextFrame();
    });

    it('should not remove default node when custom slot child is added', async () => {
      const custom = document.createElement('div');
      custom.textContent = 'bar';
      custom.setAttribute('slot', 'foo');
      element.appendChild(custom);

      await nextFrame();
      expect(defaultNode.isConnected).to.be.true;
    });

    it('should not call initCustomNode for custom slot child when it is added', async () => {
      const initSpy = sinon.spy(controller, 'initCustomNode');

      const custom = document.createElement('div');
      custom.textContent = 'bar';
      custom.setAttribute('slot', 'foo');
      element.appendChild(custom);

      await nextFrame();
      expect(initSpy.calledOnce).to.be.false;
    });

    it('should not call teardownNode for default node when adding custom child', async () => {
      const teardownSpy = sinon.spy(controller, 'teardownNode');

      const custom = document.createElement('div');
      custom.textContent = 'bar';
      custom.setAttribute('slot', 'foo');
      element.appendChild(custom);

      await nextFrame();
      expect(teardownSpy.called).to.be.false;
    });
  });

  describe('multiple nodes', () => {
    let children;

    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync('<slot-controller-element></slot-controller-element>');
        initializeSpy = sinon.spy();
        controller = new SlotController(element, '', 'button', {
          initializer: initializeSpy,
          multiple: true,
        });
        element.addController(controller);
        children = element.querySelectorAll(':not([slot])');
        // Wait for initial slotchange event
        await nextFrame();
      });

      it('should append an element to un-named slot', () => {
        expect(children[0]).to.be.instanceOf(HTMLButtonElement);
      });

      it('should replace an element when new elements added to the slot', async () => {
        const defaultNode = children[0];

        const foo = document.createElement('div');
        foo.textContent = 'foo';
        const bar = document.createElement('div');
        bar.textContent = 'bar';

        element.append(foo, bar);
        await nextFrame();

        const slotChildren = controller.getSlotChildren();
        expect(slotChildren[0]).to.equal(foo);
        expect(slotChildren[1]).to.equal(bar);
        expect(defaultNode.isConnected).to.be.false;
      });
    });

    describe('custom', () => {
      beforeEach(async () => {
        element = fixtureSync('<slot-controller-element><div>foo</div><div>bar</div></slot-controller-element>');
        initializeSpy = sinon.spy();
        controller = new SlotController(element, '', 'button', {
          initializer: initializeSpy,
          multiple: true,
        });
        element.addController(controller);
        children = element.querySelectorAll(':not([slot])');
        // Wait for initial slotchange event
        await nextFrame();
      });

      it('should store a reference to custom slotted elements in nodes array', () => {
        const nodes = controller.nodes;
        expect(nodes).to.be.instanceOf(Array);
        expect(nodes[0]).to.equal(children[0]);
        expect(nodes[1]).to.equal(children[1]);
      });

      it('should get a reference to list of elements passed to un-named slot', () => {
        const slotChildren = controller.getSlotChildren();
        expect(slotChildren[0]).to.equal(children[0]);
        expect(slotChildren[1]).to.equal(children[1]);
      });

      it('should run initializer for each element passed to un-named slot', () => {
        expect(initializeSpy.calledTwice).to.be.true;
        expect(initializeSpy.firstCall.args[0]).to.equal(children[0]);
        expect(initializeSpy.secondCall.args[0]).to.equal(children[1]);
      });
    });
  });
});
