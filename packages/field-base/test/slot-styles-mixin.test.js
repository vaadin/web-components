import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';
import { SlotStylesMixin } from '../src/slot-styles-mixin.js';

describe('slot-styles-mixin', () => {
  const COLOR = 'rgb(0, 100, 0)';
  let wrapper, element, button;

  before(() => {
    customElements.define(
      'slot-styles-mixin-element',
      class extends SlotStylesMixin(SlotMixin(PolymerElement)) {
        static get template() {
          return html`<slot name="button"></slot>`;
        }

        get slots() {
          return {
            button: () => {
              const button = document.createElement('button');
              button.textContent = 'Button';
              return button;
            },
          };
        }

        get slotStyles() {
          return [
            `
              button[slot='button'] {
                color: ${COLOR};
              }
            `,
          ];
        }
      },
    );
  });

  beforeEach(() => {
    wrapper = fixtureSync('<div></div');
    wrapper.attachShadow({ mode: 'open' });
    element = document.createElement('slot-styles-mixin-element');
    wrapper.shadowRoot.appendChild(element);
    button = element.querySelector('button');
  });

  afterEach(() => {
    element.remove();
  });

  it('should append styles to wrapper shadow root', () => {
    expect(getComputedStyle(button).color).to.equal(COLOR);
  });

  it('should only append styles with same ID once', () => {
    const sibling = document.createElement('slot-styles-mixin-element');
    element.parentNode.appendChild(sibling);
    expect(wrapper.shadowRoot.querySelectorAll('style').length).to.equal(1);
  });

  it('should append styles when moved to other shadow root', () => {
    const inner = document.createElement('div');
    inner.attachShadow({ mode: 'open' });
    wrapper.shadowRoot.appendChild(inner);
    // Move to inner shadow root
    inner.shadowRoot.appendChild(element);
    expect(getComputedStyle(button).color).to.equal(COLOR);
  });

  it('should append styles when moved to document body', () => {
    // Move out of shadow root
    wrapper.appendChild(element);
    expect(getComputedStyle(button).color).to.equal(COLOR);
  });
});
