import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { SlotTargetMixin } from '../src/slot-target-mixin.js';

customElements.define(
  'slot-target-mixin-element-without-source',
  class extends SlotTargetMixin(PolymerElement) {
    static get template() {
      return html`
        <slot id="source"></slot>
        <div id="target"></div>
      `;
    }
  }
);

customElements.define(
  'slot-target-mixin-element-without-target',
  class extends SlotTargetMixin(PolymerElement) {
    static get template() {
      return html`
        <slot id="source"></slot>
        <div id="target"></div>
      `;
    }

    get _sourceSlot() {
      return this.$.source;
    }
  }
);

customElements.define(
  'slot-target-mixin-element',
  class extends SlotTargetMixin(PolymerElement) {
    static get template() {
      return html`
        <slot id="source"></slot>
        <div id="target"></div>
      `;
    }

    get _sourceSlot() {
      return this.$.source;
    }

    get _slotTarget() {
      return this.$.target;
    }
  }
);

describe('slot-target-mixin', () => {
  let element;

  describe('default', () => {
    let node1, node2;

    beforeEach(() => {
      element = document.createElement('slot-target-mixin-element');
      node1 = document.createElement('div');
      node2 = document.createTextNode('');
      element.append(node1, node2);

      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should populate the target element with nodes from the source slot', () => {
      expect(element._slotTarget.childNodes).to.have.lengthOf(2);
      expect(element._slotTarget.childNodes[0]).to.include(node1);
      expect(element._slotTarget.childNodes[1]).to.include(node2);
    });

    it('should not have any nodes in the source slot', () => {
      expect(element.childNodes).to.have.lengthOf(0);
    });
  });

  describe('source slot observer', () => {
    it('should populate the target element when adding nodes to the source slot lazily', async () => {
      element = fixtureSync(`<slot-target-mixin-element></slot-target-mixin-element>`);

      const node = document.createElement('div');
      element.appendChild(node);
      await nextFrame();

      expect(element._slotTarget.childNodes).to.have.lengthOf(1);
      expect(element._slotTarget.childNodes[0]).to.equal(node);
    });

    it('should re-populate the target element when adding new nodes to the source slot', async () => {
      element = fixtureSync(`<slot-target-mixin-element><div>Content</div></slot-target-mixin-element>`);

      const node = document.createElement('div');
      element.appendChild(node);
      await nextFrame();

      expect(element._slotTarget.childNodes).to.have.lengthOf(1);
      expect(element._slotTarget.childNodes[0]).to.equal(node);
    });
  });

  describe('warnings', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn about no implementation for _sourceSlot', () => {
      element = fixtureSync('<slot-target-mixin-element-without-source></slot-target-mixin-element-without-source>');

      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.args[0][0]).to.equal(
        `Please implement the '_sourceSlot' property in <slot-target-mixin-element-without-source>`
      );
    });

    it('should warn about no implementation for _slotTarget', () => {
      element = fixtureSync('<slot-target-mixin-element-without-target></slot-target-mixin-element-without-target>');

      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.args[0][0]).to.equal(
        `Please implement the '_slotTarget' property in <slot-target-mixin-element-without-target>`
      );
    });
  });
});
