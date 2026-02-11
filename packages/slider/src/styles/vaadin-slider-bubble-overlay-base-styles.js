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
    --_border-width: var(
      --vaadin-slider-bubble-border-width,
      var(--vaadin-tooltip-border-width, var(--vaadin-overlay-border-width, 1px))
    );
    --_default-offset: var(--vaadin-slider-bubble-offset, 2px);
    --_rtl-multiplier: 1;
  }

  :host([dir='rtl']) {
    --_rtl-multiplier: -1;
  }

  [part='overlay'] {
    position: relative;
    overflow: visible;
    max-width: var(--vaadin-tooltip-max-width, 40ch);
    padding: var(
      --vaadin-slider-bubble-padding,
      var(--vaadin-tooltip-padding, var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container))
    );
    border: var(
        --vaadin-slider-bubble-border-width,
        var(--vaadin-tooltip-border-width, var(--vaadin-overlay-border-width, 1px))
      )
      solid
      var(
        --vaadin-slider-bubble-border-color,
        var(--vaadin-tooltip-border-color, var(--vaadin-overlay-border-color, var(--vaadin-border-color-secondary)))
      );
    border-radius: var(
      --vaadin-slider-bubble-border-radius,
      var(--vaadin-tooltip-border-radius, var(--vaadin-radius-m))
    );
    background: var(
      --vaadin-slider-bubble-background,
      var(--vaadin-tooltip-background, var(--vaadin-background-color))
    );
    color: var(--vaadin-slider-bubble-text-color, var(--vaadin-tooltip-text-color, inherit));
    font-size: var(--vaadin-slider-bubble-font-size, var(--vaadin-tooltip-font-size, 0.9em));
    font-weight: var(--vaadin-slider-bubble-font-weight, var(--vaadin-tooltip-font-weight, inherit));
    line-height: var(--vaadin-slider-bubble-line-height, var(--vaadin-tooltip-line-height, inherit));
    box-shadow: var(--vaadin-slider-bubble-shadow, var(--vaadin-tooltip-shadow, 0 3px 8px -1px rgba(0, 0, 0, 0.2)));
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
    border-start-start-radius: var(--vaadin-slider-bubble-arrow-border-radius, 0);
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
