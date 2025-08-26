import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fire, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
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
        <vaadin-positioned-overlay id="overlay"></vaadin-positioned-overlay>
      </scrollable-wrapper>
    `);
    target = wrapper.querySelector('#target');
    overlay = wrapper.querySelector('#overlay');
    overlay.renderer = (root) => {
      if (!root.firstChild) {
        const div = document.createElement('div');
        div.id = 'overlay-child';
        div.style.width = '50px';
        div.style.height = '50px';
        root.appendChild(div);
      }
    };
    updatePositionSpy = sinon.spy(overlay, '_updatePosition');
  });

  describe('opened without position target', () => {
    beforeEach(async () => {
      overlay.opened = true;
      await nextFrame();
      updatePositionSpy.resetHistory();
    });

    it('should not update position on visual viewport resize', () => {
      resize(window.visualViewport);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should not update position on document scroll', () => {
      scroll(document);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should not update position on visual viewport scroll', () => {
      scroll(window.visualViewport);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should not update position on ancestor scroll', () => {
      const scrollableAncestor = wrapper.shadowRoot.querySelector('#scrollable');
      scroll(scrollableAncestor);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should update position on visual viewport resize after assigning a position target', () => {
      overlay.positionTarget = target;
      updatePositionSpy.resetHistory();
      resize(window.visualViewport);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should update position on visual viewport scroll after assigning a position target', () => {
      overlay.positionTarget = target;
      updatePositionSpy.resetHistory();
      scroll(window.visualViewport);
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

    it('should not update position on window resize', () => {
      resize(window);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should update position on document scroll', () => {
      scroll(document);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should update position on visual viewport resize', () => {
      resize(window.visualViewport);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should not update position on visual viewport resize when closed', () => {
      overlay.opened = false;
      resize(window.visualViewport);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should update position on visual viewport scroll', () => {
      scroll(window.visualViewport);
      expect(updatePositionSpy.called).to.be.true;
    });

    it('should not update position on document scroll when closed', () => {
      overlay.opened = false;
      scroll(document);
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should not update position on visual viewport scroll when closed', () => {
      overlay.opened = false;
      scroll(window.visualViewport);
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

    it('should update position on target move by changing style', async () => {
      target.style.position = 'static';
      await nextFrame();
      updatePositionSpy.resetHistory();

      target.marginTop = '20px';
      // Wait for intersection observer
      await nextFrame();
      await nextFrame();

      expect(updatePositionSpy.called).to.be.true;
    });

    it('should not update position on target move when closed', async () => {
      target.style.position = 'static';
      await nextFrame();
      updatePositionSpy.resetHistory();

      overlay.opened = false;

      target.marginTop = '20px';
      await nextFrame();
      await nextFrame();
      expect(updatePositionSpy.called).to.be.false;
    });

    it('should close overlay when target is scrolled out of viewport', async () => {
      target.style.position = 'static';
      await nextFrame();
      await nextFrame();

      const scrollableAncestor = wrapper.shadowRoot.querySelector('#scrollable');
      scrollableAncestor.scrollTop = 200;
      await nextFrame();
      await nextFrame();
      expect(overlay.opened).to.be.false;
    });

    ['document', 'visual viewport', 'ancestor'].forEach((name) => {
      describe(name, () => {
        let scrollableNode;

        beforeEach(() => {
          if (name === 'document') {
            scrollableNode = document;
          }
          if (name === 'visual viewport') {
            scrollableNode = window.visualViewport;
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

      it('should update position on visual viewport scroll', () => {
        scroll(window.visualViewport);
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

      it('should update position on visual viewport scroll after re-opened', async () => {
        scroll(window.visualViewport);
        expect(updatePositionSpy.called).to.be.true;

        overlay.opened = false;
        overlay.opened = true;
        await nextFrame();
        updatePositionSpy.resetHistory();

        scroll(window.visualViewport);
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
