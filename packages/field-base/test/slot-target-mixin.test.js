import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { SlotTargetMixin } from '../src/slot-target-mixin.js';

customElements.define(
  'slot-target-mixin-element-warnings',
  class extends SlotTargetMixin(PolymerElement) {
    static get template() {
      return html`<div></div>`;
    }
  }
);

describe('slot-target-mixin', () => {
  let element, slotTargetContentChangeSpy;

  before(() => {
    slotTargetContentChangeSpy = sinon.spy();

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

        _onSlotTargetContentChange() {
          slotTargetContentChangeSpy();
        }
      }
    );
  });

  afterEach(() => {
    slotTargetContentChangeSpy.resetHistory();
  });

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

  // describe('target element observer', () => {
  //   it('should notify when the target element is populated at the initialization', async () => {
  //     element = fixtureSync(`<slot-target-mixin-element><div>Content<div></slot-target-mixin-element>`);
  //     await nextFrame();

  //     expect(slotTargetContentChangeSpy.calledOnce).to.be.true;
  //   });

  //   it('should notify when the target element is populated lazily', async () => {
  //     element = fixtureSync(`<slot-target-mixin-element></slot-target-mixin-element>`);

  //     const node = document.createElement('div');
  //     element.appendChild(node);
  //     await nextFrame();

  //     expect(slotTargetContentChangeSpy.calledOnce).to.be.true;
  //   });

  //   it('should notify when adding new nodes directly to the target element', async () => {
  //     element = fixtureSync(`<slot-target-mixin-element><div>Content<div></slot-target-mixin-element>`);

  //     const node = document.createElement('div');
  //     element._slotTarget.appendChild(node);
  //     await nextFrame();

  //     expect(slotTargetContentChangeSpy.calledOnce).to.be.true;
  //   });

  //   it('should notify when replacing nodes directly in the target element', async () => {
  //     element = fixtureSync(`<slot-target-mixin-element><div>Content<div></slot-target-mixin-element>`);

  //     const node = document.createElement('div');
  //     element._slotTarget.replaceChildren(node);
  //     await nextFrame();

  //     expect(slotTargetContentChangeSpy.calledOnce).to.be.true;
  //   });

  //   it('should notify when removing nodes directly from the target element', async () => {
  //     element = fixtureSync(`<slot-target-mixin-element><div>Content<div></slot-target-mixin-element>`);

  //     element._slotTarget.removeChild(element._slotTarget.firstChild);
  //     await nextFrame();

  //     expect(slotTargetContentChangeSpy.calledOnce).to.be.true;
  //   });

  //   it('should notify when adding new nodes to the source slot', async () => {
  //     element = fixtureSync(`<slot-target-mixin-element><div>Content<div></slot-target-mixin-element>`);
  //     await nextFrame();

  //     slotTargetContentChangeSpy.resetHistory();

  //     const node = document.createElement('div');
  //     element.appendChild(node);
  //     await nextFrame();

  //     expect(slotTargetContentChangeSpy.calledOnce).to.be.true;
  //   });
  // });

  // describe('warnings', () => {
  //   beforeEach(() => {
  //     sinon.stub(console, 'warn');

  //     element = fixtureSync('<slot-target-mixin-element-warnings>Content</slot-target-mixin-element-warnings>');
  //   });

  //   afterEach(() => {
  //     console.warn.restore();
  //   });

  //   it('should warn about no implementation for _sourceSlot', () => {
  //     expect(console.warn.calledOnce).to.be.true;
  //     expect(console.warn.args[0][0]).to.equal(
  //       `Please implement the '_sourceSlot' property in <slot-target-mixin-element-warnings>`
  //     );
  //   });

  //   it('should warn about no implementation for _slotTarget', () => {
  //     expect(console.warn.calledOnce).to.be.true;
  //     expect(console.warn.args[0][0]).to.equal(
  //       `Please implement the '_slotTarget' property in <slot-target-mixin-element-warnings>`
  //     );
  //   });
  // });
});
