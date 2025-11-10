import { expect } from '@vaadin/chai-plugins';
import { defineCE, definePolymer, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '../src/controller-mixin.js';
import { SlotController } from '../src/slot-controller.js';

describe('SlotController', () => {
  const tag = definePolymer(
    'slot-controller',
    `<slot name="foo"></slot><slot></slot>`,
    (Base) => class extends ControllerMixin(Base) {},
  );

  let element, child, controller;

  describe('named slot', () => {
    let initializeSpy;

    describe('default content', () => {
      beforeEach(() => {
        element = fixtureSync(`<${tag}></${tag}>`);
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
          <${tag}>
            <div slot="foo">bar</div>
          </${tag}>
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
      let initializeSpy;

      beforeEach(() => {
        element = fixtureSync(`<${tag}></${tag}>`);
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
      let wrapper;

      const initializeSpy = sinon.spy();

      const innerTag = definePolymer(
        'slot-controller-inner',
        `<slot></slot>`,
        (Base) =>
          class extends ControllerMixin(Base) {
            ready() {
              super.ready();

              controller = new SlotController(this, '', 'div', { initializer: initializeSpy });
              this.addController(controller);
            }
          },
      );

      const wrapperTag = defineCE(
        class extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `
              <${innerTag}>
                <!-- Keep this comment and surrounding whitespace text nodes -->
                <div>baz</div>
                <!-- Keep this comment and surrounding whitespace text nodes -->
              </${innerTag}>
            `;
          }
        },
      );

      beforeEach(async () => {
        initializeSpy.resetHistory();
        wrapper = fixtureSync(`<${wrapperTag}></${wrapperTag}>`);
        // Wait for initial slotchange event
        await nextFrame();
        element = wrapper.shadowRoot.querySelector(innerTag);
        child = element.querySelector(':not([slot])');
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
      let initializeSpy;

      beforeEach(() => {
        element = fixtureSync(`<${tag}>baz</${tag}>`);
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
        element = fixtureSync(`<${tag}> </${tag}>`);
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
      element = fixtureSync(`<${tag}></${tag}>`);
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
      element = fixtureSync(`<${tag}></${tag}>`);
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

  describe('data-slot-ignore attribute', () => {
    let defaultNode;

    describe('single slot with observe enabled', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new SlotController(element, 'foo', 'div', {
          initializer: (node) => {
            node.textContent = 'default content';
          },
        });
        element.addController(controller);
        defaultNode = element.querySelector('[slot="foo"]');
        // Wait for initial slotchange event
        await nextFrame();
      });

      it('should ignore element with data-slot-ignore when checking slot children', () => {
        const ignored = document.createElement('div');
        ignored.setAttribute('slot', 'foo');
        ignored.setAttribute('data-slot-ignore', '');
        ignored.textContent = 'ignored';
        element.appendChild(ignored);

        const slotChildren = controller.getSlotChildren();
        expect(slotChildren).to.not.include(ignored);
        expect(slotChildren).to.include(defaultNode);
      });

      it('should not remove default node when element with data-slot-ignore is added', async () => {
        const ignored = document.createElement('div');
        ignored.setAttribute('slot', 'foo');
        ignored.setAttribute('data-slot-ignore', '');
        ignored.textContent = 'ignored';
        element.appendChild(ignored);

        await nextFrame();
        expect(defaultNode.isConnected).to.be.true;
        expect(defaultNode.textContent).to.equal('default content');
      });

      it('should remove default node when non-ignored element is added', async () => {
        const ignored = document.createElement('div');
        ignored.setAttribute('slot', 'foo');
        ignored.setAttribute('data-slot-ignore', '');
        ignored.textContent = 'ignored';
        element.appendChild(ignored);

        await nextFrame();
        expect(defaultNode.isConnected).to.be.true;

        const custom = document.createElement('div');
        custom.setAttribute('slot', 'foo');
        custom.textContent = 'custom';
        element.appendChild(custom);

        await nextFrame();
        expect(defaultNode.isConnected).to.be.false;
        expect(controller.node).to.equal(custom);
      });

      it('should not call initCustomNode for element with data-slot-ignore', async () => {
        const initSpy = sinon.spy(controller, 'initCustomNode');

        const ignored = document.createElement('div');
        ignored.setAttribute('slot', 'foo');
        ignored.setAttribute('data-slot-ignore', '');
        ignored.textContent = 'ignored';
        element.appendChild(ignored);

        await nextFrame();
        expect(initSpy.called).to.be.false;
      });
    });

    describe('multiple slot with observe enabled', () => {
      let defaultNode;

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new SlotController(element, '', 'div', {
          initializer: (node) => {
            node.textContent = 'default content';
          },
          multiple: true,
        });
        element.addController(controller);
        defaultNode = element.querySelector(':not([slot])');
        // Wait for initial slotchange event
        await nextFrame();
      });

      it('should ignore element with data-slot-ignore in multiple mode', () => {
        const ignored = document.createElement('div');
        ignored.setAttribute('data-slot-ignore', '');
        ignored.textContent = 'ignored';
        element.appendChild(ignored);

        const slotChildren = controller.getSlotChildren();
        expect(slotChildren).to.not.include(ignored);
        expect(slotChildren).to.include(defaultNode);
      });

      it('should not remove default node when element with data-slot-ignore is added in multiple mode', async () => {
        const ignored = document.createElement('div');
        ignored.setAttribute('data-slot-ignore', '');
        ignored.textContent = 'ignored';
        element.appendChild(ignored);

        await nextFrame();
        expect(defaultNode.isConnected).to.be.true;
        expect(controller.nodes).to.include(defaultNode);
        expect(controller.nodes).to.not.include(ignored);
      });

      it('should remove default node when non-ignored element is added in multiple mode', async () => {
        const ignored = document.createElement('div');
        ignored.setAttribute('data-slot-ignore', '');
        ignored.textContent = 'ignored';
        element.appendChild(ignored);

        await nextFrame();
        expect(defaultNode.isConnected).to.be.true;

        const custom = document.createElement('div');
        custom.textContent = 'custom';
        element.appendChild(custom);

        await nextFrame();
        expect(defaultNode.isConnected).to.be.false;
        expect(controller.nodes).to.include(custom);
        expect(controller.nodes).to.not.include(defaultNode);
        expect(controller.nodes).to.not.include(ignored);
      });

      it('should allow multiple custom elements alongside ignored elements', async () => {
        const custom1 = document.createElement('div');
        custom1.textContent = 'custom1';
        element.appendChild(custom1);

        const ignored = document.createElement('div');
        ignored.setAttribute('data-slot-ignore', '');
        ignored.textContent = 'ignored';
        element.appendChild(ignored);

        const custom2 = document.createElement('div');
        custom2.textContent = 'custom2';
        element.appendChild(custom2);

        await nextFrame();

        expect(defaultNode.isConnected).to.be.false;
        expect(controller.nodes).to.have.lengthOf(2);
        expect(controller.nodes).to.include(custom1);
        expect(controller.nodes).to.include(custom2);
        expect(controller.nodes).to.not.include(ignored);
      });
    });
  });

  describe('multiple nodes', () => {
    let children, initializeSpy;

    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
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

      it('should remove default node when new elements added to the slot', async () => {
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

      it('should store a reference to the default node in nodes array', () => {
        const nodes = controller.nodes;
        expect(nodes).to.be.instanceOf(Array);
        expect(nodes.length).to.equal(1);
        expect(nodes[0]).to.equal(controller.defaultNode);
      });

      it('should remove default node from nodes array when adding new element', () => {
        const nodes = controller.nodes;
        expect(nodes).to.be.instanceOf(Array);
        expect(nodes.length).to.equal(1);
        expect(nodes[0]).to.equal(controller.defaultNode);
      });

      it('should remove node from nodes array when removing it from the DOM', async () => {
        const foo = document.createElement('div');
        foo.textContent = 'foo';
        const bar = document.createElement('div');
        bar.textContent = 'bar';

        element.append(foo, bar);
        await nextFrame();

        element.removeChild(foo);
        await nextFrame();

        const nodes = controller.nodes;
        expect(nodes).to.be.instanceOf(Array);
        expect(nodes.length).to.equal(1);
        expect(nodes[0]).to.equal(bar);
      });
    });

    describe('custom', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}><div>foo</div><div>bar</div></${tag}>`);
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
        expect(nodes.length).to.equal(2);
        expect(nodes[0]).to.equal(children[0]);
        expect(nodes[1]).to.equal(children[1]);
      });

      it('should update references to custom slotted elements in nodes array', async () => {
        const newChild = document.createElement('div');
        element.append(newChild);

        await nextFrame();

        const nodes = controller.nodes;
        expect(nodes).to.be.instanceOf(Array);
        expect(nodes.length).to.equal(3);
        expect(nodes[0]).to.equal(children[0]);
        expect(nodes[1]).to.equal(children[1]);
        expect(nodes[2]).to.equal(newChild);
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

      it('should not remove custom elements when adding another custom element', async () => {
        const newChild = document.createElement('div');
        element.append(newChild);

        await nextFrame();
        expect(element.childElementCount).to.equal(3);
      });
    });

    describe('no tag node', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        initializeSpy = sinon.spy();
        controller = new SlotController(element, '', null, {
          multiple: true,
        });
        element.addController(controller);
        children = element.querySelectorAll(':not([slot])');
        // Wait for initial slotchange event
        await nextFrame();
      });

      it('should keep nodes array empty when no tag name for default node provided', () => {
        const nodes = controller.nodes;
        expect(nodes).to.be.instanceOf(Array);
        expect(nodes).to.have.lengthOf(0);
      });
    });
  });
});
