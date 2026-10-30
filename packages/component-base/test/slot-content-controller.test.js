import { expect } from '@vaadin/chai-plugins';
import { defineLit, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '../src/polylit-mixin.js';
import { SlotContentController } from '../src/slot-content-controller.js';

describe('SlotContentController', () => {
  const tag = defineLit(
    'slot-content-controller',
    '<slot name="foo"></slot><slot></slot>',
    (Base) => class extends PolylitMixin(Base) {},
  );

  class DefaultController extends SlotContentController {
    createDefaultNode() {
      return document.createElement('div');
    }
  }

  let element, controller, defaultNode;

  function addCustomNode(text = '') {
    const node = document.createElement('div');
    node.setAttribute('slot', 'foo');
    node.textContent = text;
    element.appendChild(node);
    return node;
  }

  describe('default content', () => {
    let initSpy, updateSpy;

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      controller = new DefaultController(element, 'foo');
      initSpy = sinon.spy(controller, '_initNode');
      updateSpy = sinon.spy(controller, '_updateNode');
      element.addController(controller);
      defaultNode = element.querySelector('[slot="foo"]');
    });

    it('should create the default node in the slot', () => {
      expect(defaultNode).to.be.instanceOf(HTMLDivElement);
    });

    it('should store references to the default node', () => {
      expect(controller.node).to.equal(defaultNode);
      expect(controller.nodes).to.have.ordered.members([defaultNode]);
      expect(controller.defaultNode).to.equal(defaultNode);
    });

    it('should call _initNode and then _updateNode for the default node', () => {
      expect(initSpy).to.be.calledOnceWith(defaultNode);
      expect(updateSpy).to.be.calledOnceWith(defaultNode);
      expect(initSpy).to.be.calledBefore(updateSpy);
    });
  });

  describe('no default content', () => {
    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      controller = new SlotContentController(element, 'foo');
      element.addController(controller);
    });

    it('should not create a default node when createDefaultNode returns null', () => {
      expect(element.querySelector('[slot="foo"]')).to.be.null;
      expect(controller.node).to.be.null;
      expect(controller.nodes).to.be.empty;
    });
  });

  describe('custom content', () => {
    let custom, initSpy, updateSpy;

    beforeEach(() => {
      element = fixtureSync(`<${tag}><div slot="foo">bar</div></${tag}>`);
      custom = element.querySelector('[slot="foo"]');
      controller = new DefaultController(element, 'foo');
      initSpy = sinon.spy(controller, '_initNode');
      updateSpy = sinon.spy(controller, '_updateNode');
      element.addController(controller);
    });

    it('should not create a default node', () => {
      expect(element.querySelectorAll('[slot="foo"]')).to.have.lengthOf(1);
      expect(controller.defaultNode).to.be.null;
    });

    it('should store references to the custom node', () => {
      expect(controller.node).to.equal(custom);
      expect(controller.nodes).to.have.ordered.members([custom]);
    });

    it('should call _initNode and then _updateNode for the custom node', () => {
      expect(initSpy).to.be.calledOnceWith(custom);
      expect(updateSpy).to.be.calledOnceWith(custom);
      expect(initSpy).to.be.calledBefore(updateSpy);
    });
  });

  describe('default slot', () => {
    describe('text node', () => {
      beforeEach(() => {
        element = fixtureSync(`<${tag}>bar</${tag}>`);
        controller = new DefaultController(element, '');
        element.addController(controller);
      });

      it('should use the text node as content', () => {
        expect(controller.node).to.equal(element.firstChild);
        expect(controller.node.nodeType).to.equal(Node.TEXT_NODE);
      });

      it('should not create a default node', () => {
        expect(controller.defaultNode).to.be.null;
      });
    });

    describe('empty text node', () => {
      beforeEach(() => {
        element = fixtureSync(`<${tag}> </${tag}>`);
        controller = new DefaultController(element, '');
        element.addController(controller);
      });

      it('should ignore the text node and create the default node', () => {
        expect(controller.defaultNode).to.be.instanceOf(HTMLDivElement);
        expect(controller.node).to.equal(controller.defaultNode);
      });

      it('should not set the slot attribute on the default node', () => {
        expect(controller.defaultNode.hasAttribute('slot')).to.be.false;
      });
    });
  });

  describe('slot changes', () => {
    let initSpy, teardownSpy;

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      controller = new DefaultController(element, 'foo');
      element.addController(controller);
      defaultNode = controller.node;
      // Wait for the initial slotchange event
      await nextFrame();
      initSpy = sinon.spy(controller, '_initNode');
      teardownSpy = sinon.spy(controller, '_teardownNode');
    });

    it('should replace the default node with the added custom node', async () => {
      const custom = addCustomNode();
      await nextFrame();
      expect(defaultNode.isConnected).to.be.false;
      expect(controller.node).to.equal(custom);
    });

    it('should call _teardownNode for the default node and then _initNode for the custom node', async () => {
      const custom = addCustomNode();
      await nextFrame();
      expect(teardownSpy).to.be.calledOnceWith(defaultNode);
      expect(initSpy).to.be.calledOnceWith(custom);
      expect(teardownSpy).to.be.calledBefore(initSpy);
    });

    it('should restore the default node when the custom node is removed', async () => {
      const custom = addCustomNode();
      await nextFrame();
      custom.remove();
      await nextFrame();
      expect(defaultNode.isConnected).to.be.true;
      expect(controller.node).to.equal(defaultNode);
    });

    it('should call _teardownNode for the removed custom node and _initNode for the restored default node', async () => {
      const custom = addCustomNode();
      await nextFrame();
      teardownSpy.resetHistory();
      initSpy.resetHistory();
      custom.remove();
      await nextFrame();
      expect(teardownSpy).to.be.calledOnceWith(custom);
      expect(initSpy).to.be.calledOnceWith(defaultNode);
    });

    it('should replace the custom node with another custom node appended after it', async () => {
      const custom = addCustomNode();
      await nextFrame();
      const other = addCustomNode();
      await nextFrame();
      expect(custom.isConnected).to.be.false;
      expect(controller.node).to.equal(other);
    });

    it('should replace the custom node with another custom node inserted before it', async () => {
      const custom = addCustomNode();
      await nextFrame();
      const other = document.createElement('div');
      other.setAttribute('slot', 'foo');
      element.insertBefore(other, custom);
      await nextFrame();
      expect(custom.isConnected).to.be.false;
      expect(controller.node).to.equal(other);
    });

    it('should call _initNode again when the same custom node is added back', async () => {
      const custom = addCustomNode();
      await nextFrame();
      custom.remove();
      await nextFrame();
      initSpy.resetHistory();
      element.appendChild(custom);
      await nextFrame();
      expect(initSpy).to.be.calledOnceWith(custom);
    });
  });

  describe('shouldRenderDefaultNode', () => {
    class LazyController extends DefaultController {
      visible = false;

      shouldRenderDefaultNode() {
        return this.visible;
      }
    }

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      controller = new LazyController(element, 'foo');
      element.addController(controller);
    });

    it('should not create the default node while shouldRenderDefaultNode returns false', () => {
      expect(element.querySelector('[slot="foo"]')).to.be.null;
      expect(controller.node).to.be.null;
    });

    it('should create the default node on update once shouldRenderDefaultNode returns true', () => {
      controller.visible = true;
      controller.update();
      defaultNode = element.querySelector('[slot="foo"]');
      expect(defaultNode).to.be.instanceOf(HTMLDivElement);
      expect(controller.node).to.equal(defaultNode);
    });

    it('should remove the default node on update once shouldRenderDefaultNode returns false', () => {
      controller.visible = true;
      controller.update();
      defaultNode = controller.node;
      const teardownSpy = sinon.spy(controller, '_teardownNode');

      controller.visible = false;
      controller.update();
      expect(defaultNode.isConnected).to.be.false;
      expect(controller.node).to.be.null;
      expect(teardownSpy).to.be.calledOnceWith(defaultNode);
    });

    it('should reuse the default node when showing it again', () => {
      controller.visible = true;
      controller.update();
      defaultNode = controller.node;
      controller.visible = false;
      controller.update();

      controller.visible = true;
      controller.update();
      expect(controller.node).to.equal(defaultNode);
    });

    it('should not create the default node while custom content is slotted', async () => {
      const custom = addCustomNode();
      await nextFrame();
      controller.visible = true;
      controller.update();
      expect(controller.defaultNode).to.be.null;
      expect(controller.node).to.equal(custom);
    });
  });

  describe('update', () => {
    let initSpy, updateSpy, changeSpy;

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      controller = new DefaultController(element, 'foo');
      initSpy = sinon.spy(controller, '_initNode');
      updateSpy = sinon.spy(controller, '_updateNode');
      changeSpy = sinon.spy();
      controller.addEventListener('slot-content-changed', changeSpy);
    });

    it('should do nothing before the controller is connected', () => {
      controller.update();
      expect(element.querySelector('[slot="foo"]')).to.be.null;
      expect(initSpy).to.be.not.called;
      expect(updateSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
    });

    describe('connected', () => {
      beforeEach(async () => {
        element.addController(controller);
        defaultNode = controller.node;
        // Wait for the initial slotchange event
        await nextFrame();
        initSpy.resetHistory();
        updateSpy.resetHistory();
        changeSpy.resetHistory();
      });

      it('should call _updateNode but not _initNode for the default node', () => {
        controller.update();
        expect(updateSpy).to.be.calledOnceWith(defaultNode);
        expect(initSpy).to.be.not.called;
      });

      it('should call _updateNode but not _initNode for the custom node', async () => {
        const custom = addCustomNode();
        await nextFrame();
        updateSpy.resetHistory();
        initSpy.resetHistory();
        controller.update();
        expect(updateSpy).to.be.calledOnceWith(custom);
        expect(initSpy).to.be.not.called;
      });

      it('should dispatch slot-content-changed with the default content details', () => {
        controller.update();
        expect(changeSpy).to.be.calledOnce;
        const { detail } = changeSpy.firstCall.args[0];
        expect(detail.node).to.equal(defaultNode);
        expect(detail.nodes).to.have.ordered.members([defaultNode]);
        expect(detail.hasContent).to.be.false;
        expect(detail.isDefault).to.be.true;
      });

      it('should dispatch slot-content-changed with the custom content details', async () => {
        const custom = addCustomNode('bar');
        await nextFrame();
        const { detail } = changeSpy.firstCall.args[0];
        expect(detail.node).to.equal(custom);
        expect(detail.nodes).to.have.ordered.members([custom]);
        expect(detail.hasContent).to.be.true;
        expect(detail.isDefault).to.be.false;
      });
    });
  });

  describe('generated ID', () => {
    const ID_REGEX = new RegExp(`^foo-${tag}-\\d+$`, 'u');

    describe('default node', () => {
      let changeSpy;

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new DefaultController(element, 'foo', { idPrefix: 'foo' });
        element.addController(controller);
        defaultNode = controller.node;
        // Wait for the initial slotchange event
        await nextFrame();
        changeSpy = sinon.spy();
        controller.addEventListener('slot-content-changed', changeSpy);
      });

      it('should set the generated ID on the default node', () => {
        expect(defaultNode.id).to.match(ID_REGEX);
        expect(defaultNode.id).to.equal(controller.defaultId);
      });

      it('should restore the generated ID when it is removed', async () => {
        defaultNode.removeAttribute('id');
        await nextFrame();
        expect(defaultNode.id).to.equal(controller.defaultId);
      });

      it('should dispatch slot-content-changed once when the ID is removed', async () => {
        defaultNode.removeAttribute('id');
        await nextFrame();
        expect(changeSpy).to.be.calledOnce;
      });

      it('should keep a changed ID and dispatch slot-content-changed', async () => {
        defaultNode.id = 'custom-id';
        await nextFrame();
        expect(defaultNode.id).to.equal('custom-id');
        expect(changeSpy).to.be.calledOnce;
      });
    });

    describe('custom node', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new DefaultController(element, 'foo', { idPrefix: 'foo' });
        element.addController(controller);
        // Wait for the initial slotchange event
        await nextFrame();
      });

      it('should set the generated ID on a custom node without an ID', async () => {
        const custom = addCustomNode();
        await nextFrame();
        expect(custom.id).to.equal(controller.defaultId);
      });

      it('should keep the own ID of a custom node', async () => {
        const custom = addCustomNode();
        custom.id = 'custom-id';
        await nextFrame();
        expect(custom.id).to.equal('custom-id');
      });
    });

    describe('multiple', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}><div>foo</div><div>bar</div></${tag}>`);
        controller = new DefaultController(element, '', { multiple: true, idPrefix: 'foo' });
        element.addController(controller);
        // Wait for the initial slotchange event
        await nextFrame();
      });

      it('should set the generated ID on the first node only', () => {
        expect(controller.nodes[0].id).to.equal(controller.defaultId);
        expect(controller.nodes[1].id).to.equal('');
      });
    });

    describe('no prefix', () => {
      beforeEach(() => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new DefaultController(element, 'foo');
        element.addController(controller);
      });

      it('should not set an ID on the default node', () => {
        expect(controller.node.id).to.equal('');
        expect(controller.defaultId).to.be.undefined;
      });
    });
  });

  describe('observeContent', () => {
    let changeSpy;

    describe('enabled', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new DefaultController(element, 'foo', { observeContent: true });
        element.addController(controller);
        defaultNode = controller.node;
        // Wait for the initial slotchange event
        await nextFrame();
        changeSpy = sinon.spy();
        controller.addEventListener('slot-content-changed', changeSpy);
      });

      it('should dispatch slot-content-changed when the content becomes non-empty', async () => {
        defaultNode.textContent = 'bar';
        await nextFrame();
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy.firstCall.args[0].detail.hasContent).to.be.true;
      });

      it('should dispatch slot-content-changed when the content becomes empty', async () => {
        defaultNode.textContent = 'bar';
        await nextFrame();
        changeSpy.resetHistory();
        defaultNode.textContent = '';
        await nextFrame();
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy.firstCall.args[0].detail.hasContent).to.be.false;
      });

      it('should dispatch slot-content-changed when a child text node changes', async () => {
        defaultNode.appendChild(document.createTextNode(''));
        await nextFrame();
        changeSpy.resetHistory();
        defaultNode.firstChild.textContent = 'bar';
        await nextFrame();
        expect(changeSpy).to.be.calledOnce;
      });

      it('should not dispatch slot-content-changed when hasContent does not change', async () => {
        defaultNode.textContent = 'bar';
        await nextFrame();
        changeSpy.resetHistory();
        defaultNode.textContent = 'baz';
        await nextFrame();
        expect(changeSpy).to.be.not.called;
      });

      it('should observe the custom node that replaced the default node', async () => {
        const custom = addCustomNode();
        await nextFrame();
        changeSpy.resetHistory();
        custom.textContent = 'bar';
        await nextFrame();
        expect(changeSpy).to.be.calledOnce;
      });

      it('should stop observing the removed custom node', async () => {
        const custom = addCustomNode();
        await nextFrame();
        custom.remove();
        await nextFrame();
        changeSpy.resetHistory();
        custom.textContent = 'bar';
        await nextFrame();
        expect(changeSpy).to.be.not.called;
      });
    });

    describe('changes made by _updateNode', () => {
      class TextController extends DefaultController {
        text = '';

        _updateNode(node) {
          node.textContent = this.text;
        }
      }

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new TextController(element, 'foo', { observeContent: true });
        element.addController(controller);
        // Wait for the initial slotchange event
        await nextFrame();
        changeSpy = sinon.spy();
        controller.addEventListener('slot-content-changed', changeSpy);
      });

      it('should dispatch slot-content-changed only once for an update', async () => {
        controller.text = 'bar';
        controller.update();
        await nextFrame();
        expect(changeSpy).to.be.calledOnce;
      });
    });

    describe('disabled', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new DefaultController(element, 'foo');
        element.addController(controller);
        defaultNode = controller.node;
        // Wait for the initial slotchange event
        await nextFrame();
        changeSpy = sinon.spy();
        controller.addEventListener('slot-content-changed', changeSpy);
      });

      it('should not dispatch slot-content-changed when the content changes', async () => {
        defaultNode.textContent = 'bar';
        await nextFrame();
        expect(changeSpy).to.be.not.called;
      });
    });
  });

  describe('multiple', () => {
    let children;

    describe('default node', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        controller = new DefaultController(element, '', { multiple: true });
        element.addController(controller);
        defaultNode = controller.node;
        // Wait for the initial slotchange event
        await nextFrame();
      });

      it('should create the default node when nothing is slotted', () => {
        expect(defaultNode).to.be.instanceOf(HTMLDivElement);
        expect(controller.nodes).to.have.ordered.members([defaultNode]);
      });

      it('should replace the default node with the added custom node', async () => {
        const custom = document.createElement('div');
        element.appendChild(custom);
        await nextFrame();
        expect(defaultNode.isConnected).to.be.false;
        expect(controller.nodes).to.have.ordered.members([custom]);
      });
    });

    describe('custom nodes', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}><div>foo</div><div>bar</div></${tag}>`);
        children = [...element.children];
        controller = new DefaultController(element, '', { multiple: true });
        element.addController(controller);
        // Wait for the initial slotchange event
        await nextFrame();
      });

      it('should store references to all the custom nodes', () => {
        expect(controller.node).to.equal(children[0]);
        expect(controller.nodes).to.have.ordered.members(children);
      });

      it('should keep the custom nodes when another one is added', async () => {
        const custom = document.createElement('div');
        element.appendChild(custom);
        await nextFrame();
        expect(children[0].isConnected).to.be.true;
        expect(controller.nodes).to.have.ordered.members([...children, custom]);
      });

      it('should remove the node from nodes when it is removed', async () => {
        children[0].remove();
        await nextFrame();
        expect(controller.nodes).to.have.ordered.members([children[1]]);
      });

      it('should create the default node when all the custom nodes are removed', async () => {
        children.forEach((child) => child.remove());
        await nextFrame();
        expect(controller.defaultNode).to.be.instanceOf(HTMLDivElement);
        expect(controller.nodes).to.have.ordered.members([controller.defaultNode]);
      });
    });
  });

  describe('data-slot-ignore', () => {
    let ignored;

    beforeEach(async () => {
      element = fixtureSync(`<${tag}><div slot="foo" data-slot-ignore></div></${tag}>`);
      ignored = element.querySelector('[data-slot-ignore]');
      controller = new DefaultController(element, 'foo');
      element.addController(controller);
      // Wait for the initial slotchange event
      await nextFrame();
    });

    it('should not treat the ignored node as content', () => {
      expect(controller.node).to.equal(controller.defaultNode);
      expect(controller.nodes).to.not.include(ignored);
    });

    it('should keep the ignored node in the DOM', () => {
      expect(ignored.isConnected).to.be.true;
    });
  });

  describe('create', () => {
    let hooks;

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      hooks = {
        createDefaultNode: sinon.stub().callsFake(() => document.createElement('div')),
        _initNode: sinon.spy(),
        _updateNode: sinon.spy(),
        _teardownNode: sinon.spy(),
      };
      controller = SlotContentController.create(element, 'foo', { idPrefix: 'foo', ...hooks });
      element.addController(controller);
      defaultNode = controller.node;
    });

    it('should create a SlotContentController instance', () => {
      expect(controller).to.be.instanceOf(SlotContentController);
    });

    it('should pass the config to the controller', () => {
      expect(defaultNode.id).to.equal(controller.defaultId);
    });

    it('should call the hooks with the controller as this', () => {
      expect(hooks.createDefaultNode).to.be.calledOnce;
      expect(hooks.createDefaultNode).to.be.calledOn(controller);
      expect(hooks._initNode).to.be.calledOnceWith(defaultNode);
      expect(hooks._initNode).to.be.calledOn(controller);
      expect(hooks._updateNode).to.be.calledOnceWith(defaultNode);
    });

    it('should call the teardown hook when the node stops being content', async () => {
      addCustomNode();
      await nextFrame();
      expect(hooks._teardownNode).to.be.calledOnceWith(defaultNode);
    });

    it('should not change the prototype of the class it is called on', () => {
      expect(SlotContentController.prototype._initNode).to.not.equal(hooks._initNode);
    });

    it('should create an instance of the class it is called on', () => {
      class SubController extends SlotContentController {}
      expect(SubController.create(element, 'foo')).to.be.instanceOf(SubController);
    });

    it('should warn about an unknown hook', () => {
      const stub = sinon.stub(console, 'warn');
      SlotContentController.create(element, 'foo', { initNode: () => {} });
      stub.restore();
      expect(stub).to.be.calledOnce;
      expect(stub.firstCall.args[0]).to.include('initNode');
    });
  });
});
