import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-overlay.js';
import { OverlayElement } from '../src/vaadin-overlay.js';
import { PositionMixin } from '../src/vaadin-overlay-position-mixin.js';

class PositionedOverlay extends PositionMixin(OverlayElement) {
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
    overlay.positionTarget = target;
    overlay.opened = true;
    updatePositionSpy.resetHistory();
  });

  it('should update position on resize when opened', () => {
    fire(window, 'resize');
    expect(updatePositionSpy.called).to.be.true;
  });

  it('should not update position on resize when closed', () => {
    overlay.opened = false;
    fire(window, 'resize');
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

      it(`should update position on ${name} scroll when opened`, () => {
        fire(scrollableNode, 'scroll');
        expect(updatePositionSpy.called).to.be.true;
      });

      it(`should not update position on ${name} scroll when closed`, () => {
        overlay.opened = false;
        fire(scrollableNode, 'scroll');
        expect(updatePositionSpy.called).to.be.false;
      });

      it(`should not update position on ${name} scroll when disconnected from the DOM`, () => {
        const parentElement = overlay.parentElement;
        parentElement.removeChild(overlay);
        fire(scrollableNode, 'scroll');
        expect(updatePositionSpy.called).to.be.false;
      });

      it(`should update position on ${name} scroll when reconnected to the DOM`, () => {
        const parentElement = overlay.parentElement;
        parentElement.removeChild(overlay);
        parentElement.appendChild(overlay);
        fire(scrollableNode, 'scroll');
        expect(updatePositionSpy.called).to.be.true;
      });
    });
  });
});
