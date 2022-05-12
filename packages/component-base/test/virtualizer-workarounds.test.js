import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { Virtualizer } from '@vaadin/component-base/src/virtualizer.js';

customElements.define(
  'test-element',
  class extends HTMLElement {
    constructor() {
      super();

      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host {
            display: block;
            height: 400px;
            transform: translateZ(0);
            overflow: auto;
          }

          #items > ::slotted(*) {
            width: 100%;
          }
        </style>

        <div id="items">
          <slot></slot>
        </div>`;

      this.virtualizer = new Virtualizer({
        createElements: this.__createElements,
        updateElement: this.__updateElement,
        elementsContainer: this,
        scrollTarget: this,
        scrollContainer: this.shadowRoot.querySelector('#items'),
      });
    }

    __createElements(count) {
      return [...Array(count)].map(() => document.createElement('div'));
    }

    __updateElement(el, index) {
      el.textContent = `item ${index}`;
    }
  },
);

describe('virtualizer - workarounds', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync(`<test-element></test-element>`);
  });

  describe('with items', () => {
    beforeEach(() => {
      element.virtualizer.size = 100000;
    });

    it('should have an item at the bottom of the viewport after scrolling up', async () => {
      // Scroll to end
      element.virtualizer.scrollToIndex(100000);
      await nextFrame();

      // Scroll upwards in 1000px steps
      for (let i = 0; i < 10; i++) {
        await nextFrame();
        element.scrollTop -= 1000;
      }

      // There should be an item at the bottom of the viewport
      await nextFrame();
      const listRect = element.getBoundingClientRect();
      const lastVisibleElement = element.getRootNode().elementFromPoint(listRect.left, listRect.bottom - 1);
      expect(lastVisibleElement.textContent).to.equal('item 99473');
    });
  });
});
