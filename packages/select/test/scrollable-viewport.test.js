import { expect } from '@esm-bundle/chai';
import { fixtureSync, enterKeyDown, nextFrame } from '@vaadin/testing-helpers';
import { html, render } from 'lit';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import './not-animated-styles.js';
import '../vaadin-select.js';

function scrollContainer(container, value, scrollLeft) {
  if (scrollLeft) {
    container.scrollLeft = scrollLeft;
  }
  container.scrollTop = value;
  window.dispatchEvent(new CustomEvent('scroll', { bubbles: true }));
}

describe('scrollable viewport', () => {
  let scrollableContainer, container, select, overlay, valueButton, inputFieldBlock;

  beforeEach(() => {
    scrollableContainer = fixtureSync(`
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
    valueButton = select._valueButton;
    inputFieldBlock = select._inputContainer;

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

  it('should update the position on scrolling', () => {
    enterKeyDown(valueButton);

    expect(overlay.$.overlay.getBoundingClientRect().top).to.be.closeTo(inputFieldBlock.getBoundingClientRect().top, 1);
    expect(overlay.$.overlay.getBoundingClientRect().left).to.be.closeTo(
      inputFieldBlock.getBoundingClientRect().left,
      1
    );

    scrollContainer(scrollableContainer, 40, 40);

    expect(overlay.$.overlay.getBoundingClientRect().top).to.be.closeTo(inputFieldBlock.getBoundingClientRect().top, 1);
    expect(overlay.$.overlay.getBoundingClientRect().left).to.be.closeTo(
      inputFieldBlock.getBoundingClientRect().left,
      1
    );
  });

  it('should update the position on iron-resize event', async () => {
    enterKeyDown(valueButton);
    expect(overlay.$.overlay.getBoundingClientRect().top).to.be.closeTo(inputFieldBlock.getBoundingClientRect().top, 1);
    expect(overlay.$.overlay.getBoundingClientRect().left).to.be.closeTo(
      inputFieldBlock.getBoundingClientRect().left,
      1
    );

    // vaadin-overlay-position-mixin does a second position update on the next frame, wait until it's done
    await nextFrame();

    container.style.paddingTop = '200px';
    select.dispatchEvent(new CustomEvent('iron-resize', { bubbles: true }));

    expect(overlay.$.overlay.getBoundingClientRect().top).to.be.closeTo(inputFieldBlock.getBoundingClientRect().top, 1);
    expect(overlay.$.overlay.getBoundingClientRect().left).to.be.closeTo(
      inputFieldBlock.getBoundingClientRect().left,
      1
    );
  });
});
