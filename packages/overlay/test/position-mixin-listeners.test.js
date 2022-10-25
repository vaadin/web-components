import { expect } from '@esm-bundle/chai';
import { aTimeout, fire, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import { Overlay } from '../src/vaadin-overlay.js';
import { PositionMixin } from '../src/vaadin-overlay-position-mixin.js';

class PositionedOverlay extends PositionMixin(Overlay) {
  static get is() {
    return 'vaadin-positioned-overlay';
  }
}
customElements.define(PositionedOverlay.is, PositionedOverlay);

class ScrollableWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <div id="scrollable" style="overflow: scroll; height: 200px;">
        <div style="height: 400px;">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
customElements.define('scrollable-wrapper', ScrollableWrapper);

describe('position mixin listeners', () => {
  let wrapper, target, overlay, updatePositionSpy;

  function resize(node) {
    fire(node, 'resize', undefined, { bubbles: false, composed: false });
  }

  function scroll(node) {
    fire(node, 'scroll', undefined, { bubbles: true, composed: false });
  }

  beforeEach(() => {
    wrapper = fixtureSync(`
      <scrollable-wrapper>
        <div id="target" style="position: fixed; top: 100px; left: 100px; width: 20px; height: 20px; border: 1px solid">
          target
        </div>
        <vaadin-positioned-overlay id="overlay">
          <template>
            <div id="overlay-child" style="width: 50px; height: 50px;"></div>
          </template>
        </vaadin-positioned-overlay>
      </scrollable-wrapper>
    `);
    target = wrapper.querySelector('#target');
    overlay = wrapper.querySelector('#overlay');
    updatePositionSpy = sinon.spy(overlay, '_updatePosition');
  });

  describe('opened without position target', () => {
    beforeEach(async () => {
      overlay.opened = true;
      await nextFrame();
      updatePositionSpy.resetHistory();
    });

    it('should not update position on resize', () => {
      resize(window);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should not update position on document scroll', () => {
      scroll(document);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should not update position on ancestor scroll', () => {
      const scrollableAncestor = wrapper.shadowRoot.querySelector('#scrollable');
      scroll(scrollableAncestor);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should update position on resize after assigning a position target', () => {
      overlay.positionTarget = target;
      updatePositionSpy.resetHistory();
      resize(window);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should update position on document scroll after assigning a position target', () => {
      overlay.positionTarget = target;
      updatePositionSpy.resetHistory();
      scroll(document);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should update position on ancestor scroll after assigning a position target', () => {
      overlay.positionTarget = target;
      updatePositionSpy.resetHistory();
      const scrollableAncestor = wrapper.shadowRoot.querySelector('#scrollable');
      scroll(scrollableAncestor);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should not update position on scroll that occurs inside the overlay', async () => {
      overlay.positionTarget = target;
      // Wait for the overlay open to finish (invokes _updatePosition once)
      await nextFrame();
      updatePositionSpy.resetHistory();

      // Scroll inside the overlay
      scroll(overlay);
      expect(updatePositionSpy.called).to.be.false;
    });
  });

  describe('opened', () => {
    beforeEach(async () => {
      overlay.positionTarget = target;
      overlay.opened = true;
      await nextFrame();
      updatePositionSpy.resetHistory();
    });

    it('should update position on resize', () => {
      resize(window);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should not update position on resize when closed', () => {
      overlay.opened = false;
      resize(window);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should update position on target resize', async () => {
      target.style.width = '100px';
      await aTimeout(50);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should not update position on target resize when closed', async () => {
      overlay.opened = false;
      target.style.width = '100px';
      await aTimeout(50);
      expect(updatePositionSpy.called).to.be.false;
    });

    ['document', 'ancestor'].forEach((name) => {
      describe(name, () => {
        let scrollableNode;

        beforeEach(() => {
          if (name === 'document') {
            scrollableNode = document;
          }
          if (name === 'ancestor') {
            scrollableNode = wrapper.shadowRoot.querySelector('#scrollable');
          }
        });

        it(`should update position on ${name} scroll`, () => {
          scroll(scrollableNode);
          expect(updatePositionSpy.called).to.be.true;
        });

        it(`should not update position on ${name} scroll when closed`, () => {
          overlay.opened = false;
          scroll(scrollableNode);
          expect(updatePositionSpy.called).to.be.false;
        });

        it(`should not update position on ${name} scroll when disconnected from the DOM`, () => {
          const parentElement = overlay.parentElement;
          parentElement.removeChild(overlay);
          scroll(scrollableNode);
          expect(updatePositionSpy.called).to.be.false;
        });

        it(`should update position on ${name} scroll when reconnected to the DOM`, () => {
          const parentElement = overlay.parentElement;
          parentElement.removeChild(overlay);
          parentElement.appendChild(overlay);
          scroll(scrollableNode);
          expect(updatePositionSpy.called).to.be.true;
        });
      });
    });

    describe('the position target is changed', () => {
      let newWrapper, newTarget;

      beforeEach(() => {
        newWrapper = fixtureSync(`
          <scrollable-wrapper>
            <div id="target" style="position: fixed; top: 100px; left: 100px; width: 20px; height: 20px; border: 1px solid">
              New Target
            </div>
          </scrollable-wrapper>
        `);
        newWrapper.appendChild(target);
        newTarget = newWrapper.querySelector('#target');
        overlay.positionTarget = newTarget;
        updatePositionSpy.resetHistory();
      });

      it('should update position on document scroll', () => {
        scroll(document);
        expect(updatePositionSpy.called).to.be.true;
      });

      it('should not update position on old ancestor scroll', () => {
        const oldScrollableAncestor = wrapper.shadowRoot.querySelector('#scrollable');
        scroll(oldScrollableAncestor);
        expect(updatePositionSpy.called).to.be.false;
      });

      it('should update position on new ancestor scroll', () => {
        const newScrollableAncestor = newWrapper.shadowRoot.querySelector('#scrollable');
        scroll(newScrollableAncestor);
        expect(updatePositionSpy.called).to.be.true;
      });
    });

    describe('the position target is moved within the DOM', () => {
      let newWrapper;

      beforeEach(() => {
        newWrapper = fixtureSync(`<scrollable-wrapper></scrollable-wrapper>`);
        newWrapper.appendChild(target);
      });

      it('should update position on document scroll after re-opened', async () => {
        scroll(document);
        expect(updatePositionSpy.called).to.be.true;

        overlay.opened = false;
        overlay.opened = true;
        await nextFrame();
        updatePositionSpy.resetHistory();

        scroll(document);
        expect(updatePositionSpy.called).to.be.true;
      });

      it('should update position on new ancestor scroll after re-opened', async () => {
        const newScrollableAncestor = newWrapper.shadowRoot.querySelector('#scrollable');

        scroll(newScrollableAncestor);
        expect(updatePositionSpy.called).to.be.false;

        overlay.opened = false;
        overlay.opened = true;
        await nextFrame();
        updatePositionSpy.resetHistory();

        scroll(newScrollableAncestor);
        expect(updatePositionSpy.called).to.be.true;
      });

      it('should not update position on old ancestor scroll after re-opened', async () => {
        const oldScrollableAncestor = wrapper.shadowRoot.querySelector('#scrollable');

        scroll(oldScrollableAncestor);
        expect(updatePositionSpy.called).to.be.true;

        overlay.opened = false;
        overlay.opened = true;
        await nextFrame();
        updatePositionSpy.resetHistory();

        scroll(oldScrollableAncestor);
        expect(updatePositionSpy.called).to.be.false;
      });
    });
  });
});
