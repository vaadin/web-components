/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

const sliderBubbleOverlay = css`
  :host {
    --_arrow-size: var(--vaadin-slider-bubble-arrow-size, 8px);
    --_border-width: var(--vaadin-slider-bubble-border-width, var(--vaadin-overlay-border-width, 1px));
    --_default-offset: var(--vaadin-slider-bubble-offset, 2px);
    --_rtl-multiplier: 1;
  }

  :host([dir='rtl']) {
    --_rtl-multiplier: -1;
  }

  [part='overlay'] {
    position: relative;
    overflow: visible;
  }

  [part='content'] {
    padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container);
  }

  :host([top-aligned]) [part='overlay'] {
    margin-top: var(--vaadin-slider-bubble-offset, calc(var(--_arrow-size) + var(--_default-offset)));
  }

  :host([bottom-aligned]) [part='overlay'] {
    margin-bottom: var(--vaadin-slider-bubble-offset, calc(var(--_arrow-size) + var(--_default-offset)));
  }

  [part='arrow'] {
    display: block;
    position: absolute;
    background: inherit;
    border: inherit;
    border-start-start-radius: var(--vaadin-popover-arrow-border-radius, 0);
    inset-inline-start: 50%;
    outline: inherit;
    box-shadow: inherit;
    width: var(--_arrow-size);
    height: var(--_arrow-size);
    rotate: 45deg;
    --o: 20px; /* clip-path outset, how far outward it extends to reveal the outline and box shadow */
    --b: var(--_border-width);
    /* We need this elaborate clip-path to allow the arrow bg and border to cover
      the overlay border but prevent the outline and box-shadow from covering it */
    clip-path: polygon(
      calc(var(--o) * -1) calc(var(--o) * -1),
      calc(100% + var(--o) - var(--b)) calc(var(--o) * -1),
      calc(100% - var(--b) * 1.4) 0,
      100% 0,
      calc(100% - var(--b)) var(--b),
      calc(100% - var(--b)) calc(var(--b) + var(--ff, 0px)),
      calc(var(--b) + var(--ff, 0px)) calc(100% - var(--b)),
      calc(var(--b)) calc(100% - var(--b)),
      0 100%,
      0 calc(100% - var(--b) * 1.4),
      calc(var(--o) * -1) calc(100% + var(--o) - var(--b))
    );
  }

  /* Firefox renders a blurry edge for a diagonal clip-path + rotation,
    so we need to extend the clip-path slightly further on the diagonal */
  @supports (-moz-appearance: none) {
    [part='arrow'] {
      --ff: 1px;
    }
  }

  :host([top-aligned]) [part='arrow'] {
    top: 0;
    translate: calc(-50% * var(--_rtl-multiplier)) -50%;
  }

  :host([end-aligned][top-aligned]) [part='arrow'] {
    translate: calc(50% * var(--_rtl-multiplier)) -50%;
  }

  :host([bottom-aligned]) [part='arrow'] {
    bottom: 0;
    rotate: 225deg;
    translate: calc(-50% * var(--_rtl-multiplier)) 50%;
  }

  :host([end-aligned][bottom-aligned]) [part='arrow'] {
    translate: calc(50% * var(--_rtl-multiplier)) 50%;
  }
`;

export const sliderBubbleOverlayStyles = [overlayStyles, sliderBubbleOverlay];
