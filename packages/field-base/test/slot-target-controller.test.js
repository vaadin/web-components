import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { SlotTargetController } from '../src/slot-target-controller.js';

customElements.define(
  'slot-target-mixin-element',
  class extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`
        <slot id="source"></slot>
        <div id="target"></div>
        <div id="other"></div>
      `;
    }
  },
);

describe('slot-target-mixin', () => {
  let element, source, target;

  describe('default', () => {
    let node1, node2;

    beforeEach(() => {
      element = document.createElement('slot-target-mixin-element');
      node1 = document.createElement('div');
      node1.textContent = 'node1';
      node2 = document.createTextNode('');
      element.append(node1, node2);

      document.body.appendChild(element);

      source = element.$.source;
      target = element.$.target;
      element.addController(new SlotTargetController(source, () => target));
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should populate the target element with non-empty nodes from the source slot', () => {
      expect(target.firstChild.textContent).to.equal('node1');
    });

    it('should not clone whitespace text nodes', () => {
      expect(element.childNodes).to.have.lengthOf(2);
      expect(target.childNodes).to.have.lengthOf(1);
    });
  });

  describe('lazy', () => {
    beforeEach(async () => {
      element = fixtureSync(`<slot-target-mixin-element></slot-target-mixin-element>`);
      source = element.$.source;
      target = element.$.target;
      element.addController(new SlotTargetController(source, () => target));
      await nextFrame();
    });

    it('should populate the target element when adding nodes to the source slot lazily', async () => {
      const node = document.createElement('div');
      node.textContent = 'node';
      element.appendChild(node);
      await nextFrame();

      expect(target.childNodes).to.have.lengthOf(1);
      expect(target.firstChild.textContent).to.equal('node');
    });
  });

  describe('callback', () => {
    let spy;

    beforeEach(async () => {
      element = fixtureSync(`<slot-target-mixin-element><div>Content</div></slot-target-mixin-element>`);
      source = element.$.source;
      target = element.$.target;
      spy = sinon.spy();
      element.addController(new SlotTargetController(source, () => target, spy));
      await nextFrame();
    });

    it('should call the spy every time the content is copied to the target', async () => {
      expect(spy.calledOnce).to.be.true;

      const node = document.createElement('div');
      node.textContent = 'lazy';
      element.appendChild(node);
      await nextFrame();
      expect(spy.calledTwice).to.be.true;
    });
  });

  describe('content changes', () => {
    beforeEach(async () => {
      element = fixtureSync(`<slot-target-mixin-element><div>Content</div></slot-target-mixin-element>`);
      source = element.$.source;
      target = element.$.target;
      element.addController(new SlotTargetController(source, () => target));
      await nextFrame();
    });

    it('should copy new nodes from source slot to the target', async () => {
      const node = document.createElement('div');
      node.textContent = 'New content';
      element.appendChild(node);
      await nextFrame();
      expect(target.childNodes).to.have.lengthOf(2);
      expect(target.children[0].textContent).to.equal('Content');
      expect(target.children[1].textContent).to.equal('New content');
    });

    it('should reflect content mutations to the target copy', async () => {
      expect(target.textContent).to.equal('Content');
      await nextFrame();
      element.firstChild.textContent = 'New content';
      await nextFrame();
      expect(target.textContent).to.equal('New content');
    });

    it('should reflect content attribute mutations to the target copy', async () => {
      element.firstChild.setAttribute('data-name', 'content');
      await nextFrame();
      expect(target.firstElementChild.dataset.name).to.equal('content');
    });

    it('should reflect content subtree mutations to the target copy', async () => {
      const subtree = document.createElement('div');
      element.firstChild.appendChild(subtree);
      await nextFrame();
      subtree.textContent = 'New content';
      await nextFrame();
      expect(target.firstElementChild.firstElementChild.textContent).to.equal('New content');
    });

    it('should reflect content character data mutations to the target copy', async () => {
      element.firstChild.firstChild.textContent = 'New content';
      await nextFrame();
      expect(target.firstElementChild.textContent).to.equal('New content');
    });

    it('should remove target copy when source slot content gets cleared', async () => {
      element.firstChild.remove();
      await nextFrame();
      expect(target.children).to.be.empty;
    });
  });

  describe('detached', () => {
    let node1, node2;

    beforeEach(async () => {
      element = document.createElement('slot-target-mixin-element');
      node1 = document.createElement('div');
      node1.textContent = 'node1';
      node2 = document.createTextNode('');
      element.append(node1, node2);

      document.body.appendChild(element);

      source = element.$.source;
      target = element.$.target;
      element.addController(new SlotTargetController(source, () => target));

      await nextFrame();
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should copy nodes again after clearing target while detached', async () => {
      document.body.removeChild(element);

      // Clear target content
      target.innerHTML = '';

      document.body.appendChild(element);
      await nextFrame();

      expect(target.childNodes).to.have.lengthOf(1);
      expect(target.firstChild.textContent).to.equal('node1');
    });

    it('should copy nodes to new target changed while detached', async () => {
      document.body.removeChild(element);

      // Change target reference
      target = element.$.other;

      document.body.appendChild(element);
      await nextFrame();

      expect(target.childNodes).to.have.lengthOf(1);
      expect(target.firstChild.textContent).to.equal('node1');
    });
  });
});
