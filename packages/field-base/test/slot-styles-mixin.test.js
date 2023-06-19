import { expect } from '@esm-bundle/chai';
import { defineLit, definePolymer, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { SlotStylesMixin } from '../src/slot-styles-mixin.js';

const runTests = (defineHelper, baseMixin) => {
  const COLOR = 'rgb(0, 100, 0)';

  const tag = defineHelper(
    'slot-styles-mixin',
    `
      <style>
        :host {
          display: block;
        }
      </style>
      <slot name="button"></slot>
      `,
    (Base) =>
      class extends SlotStylesMixin(baseMixin(Base)) {
        get slotStyles() {
          return [
            `
            button[slot='button'] {
              color: ${COLOR};
            }
            `,
          ];
        }

        ready() {
          super.ready();

          this.addController(
            new SlotController(this, 'button', 'button', (btn) => {
              btn.textContent = 'Button';
            }),
          );
        }
      },
  );

  let wrapper, element, button;

  beforeEach(async () => {
    wrapper = fixtureSync('<div></div');
    wrapper.attachShadow({ mode: 'open' });
    wrapper.shadowRoot.innerHTML = '<slot></slot>';

    element = document.createElement(tag);
    wrapper.shadowRoot.appendChild(element);
    await nextRender();

    button = element.querySelector('button');
  });

  afterEach(() => {
    element.remove();
  });

  it('should append styles to wrapper shadow root', () => {
    expect(getComputedStyle(button).color).to.equal(COLOR);
  });

  it('should only append styles with same ID once', async () => {
    const sibling = document.createElement(tag);
    element.parentNode.appendChild(sibling);
    await nextRender();
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
};

describe('SlotStylesMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('SlotStylesMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
