import { expect } from '@esm-bundle/chai';
import { fixture, html } from '@open-wc/testing-helpers';
import { render } from 'lit-html';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import '../vaadin-select.js';

function enter(target) {
  keyDownOn(target, 13, [], 'Enter');
}

function scrollContainer(container, value, scrollLeft) {
  if (scrollLeft) {
    container.scrollLeft = scrollLeft;
  }
  container.scrollTop = value;
  window.dispatchEvent(new CustomEvent('scroll', { bubbles: true }));
}

describe('scrollable viewport', () => {
  let scrollableContainer, container, select, overlay, input, inputFieldBlock;

  beforeEach(async () => {
    scrollableContainer = await fixture(html`
      <div id="scrollable-container">
        <div id="container">
          <vaadin-select></vaadin-select>
        </div>
      </div>
      <style>
        #scrollable-container {
          position: absolute;
          top: 0px;
          height: 100%;
          overflow: auto;
          padding-left: 50px;
          padding-top: 50px;
        }

        #container {
          height: 150%;
          padding-left: 50px;
          padding-top: 50px;
          box-sizing: border-box;
        }
      </style>
    `);

    container = scrollableContainer.querySelector('#container');
    select = container.querySelector('vaadin-select');
    overlay = select._overlayElement;

    // Input without label and indents
    input = select._inputElement;
    inputFieldBlock = input.shadowRoot.querySelector('[part~="input-field"]');

    const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);

    // Position the input in the lower part of the viewport
    container.style.paddingTop = viewportHeight / 2 + 'px';
    scrollableContainer.scrollTop = 0;

    select.renderer = (root) => {
      if (root.firstElementChild) {
        return;
      }
      render(
        html`
          <vaadin-list-box>
            <vaadin-item>Option 1</vaadin-item>
            <vaadin-item>Option 2</vaadin-item>
            <vaadin-item>Option 3</vaadin-item>
          </vaadin-list-box>
        `,
        root
      );
    };
  });

  it('should toggle bottom-aligned attribute depending on the part of the viewport', () => {
    enter(input);
    expect(select._overlayElement.hasAttribute('bottom-aligned')).to.be.true;
    scrollContainer(scrollableContainer, 150);
    expect(select._overlayElement.hasAttribute('bottom-aligned')).to.be.false;
  });

  it('should update the position on scrolling', () => {
    enter(input);

    expect(overlay.getBoundingClientRect().bottom).to.be.equal(inputFieldBlock.getBoundingClientRect().bottom);
    expect(overlay.getBoundingClientRect().left).to.be.equal(inputFieldBlock.getBoundingClientRect().left);

    scrollContainer(scrollableContainer, 40, 40);

    expect(overlay.getBoundingClientRect().bottom).to.be.equal(inputFieldBlock.getBoundingClientRect().bottom);
    expect(overlay.getBoundingClientRect().left).to.be.equal(inputFieldBlock.getBoundingClientRect().left);
  });

  it('should update the position on iron-resize event', () => {
    enter(input);
    expect(overlay.getBoundingClientRect().bottom).to.be.equal(inputFieldBlock.getBoundingClientRect().bottom);
    expect(overlay.getBoundingClientRect().left).to.be.equal(inputFieldBlock.getBoundingClientRect().left);

    container.style.paddingTop = '200px';
    select.dispatchEvent(new CustomEvent('iron-resize', { bubbles: true }));

    expect(overlay.getBoundingClientRect().top).to.be.equal(inputFieldBlock.getBoundingClientRect().top);
    expect(overlay.getBoundingClientRect().left).to.be.equal(inputFieldBlock.getBoundingClientRect().left);
  });
});
