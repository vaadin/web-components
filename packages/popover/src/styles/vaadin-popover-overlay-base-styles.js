/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

const popoverOverlay = css`
  :host {
    --_arrow-size: var(--vaadin-popover-arrow-size, 8px);
    --_default-offset: 4px;
    --_rtl-multiplier: 1;
    --_border-width: var(--vaadin-popover-border-width, var(--vaadin-overlay-border-width, 1px));
  }

  [part='overlay']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  :host([dir='rtl']) {
    --_rtl-multiplier: -1;
  }

  :host([modeless][with-backdrop]) [part='backdrop'] {
    pointer-events: none;
  }

  :host([position^='top'][top-aligned]) [part='overlay'],
  :host([position^='bottom'][top-aligned]) [part='overlay'] {
    margin-top: var(--vaadin-popover-offset-top, var(--_default-offset));
  }

  [part='overlay'] {
    position: relative;
    overflow: visible;
    max-height: 100%;
    border: var(--_border-width) solid
      var(--vaadin-popover-border-color, var(--vaadin-overlay-border-color, var(--vaadin-border-color-secondary)));
    background: var(--vaadin-popover-background, var(--vaadin-overlay-background, var(--vaadin-background-color)));
    box-shadow: var(--vaadin-popover-shadow, var(--vaadin-overlay-shadow, 0 8px 24px -4px rgba(0, 0, 0, 0.3)));
    border-radius: var(--vaadin-popover-border-radius, var(--vaadin-overlay-border-radius, var(--vaadin-radius-m)));
  }

  [part='content'] {
    overflow: auto;
    overscroll-behavior: contain;
    box-sizing: border-box;
    max-height: 100%;
    padding: var(--vaadin-popover-padding, var(--vaadin-padding-s));
  }

  :host([theme~='no-padding']) [part='content'] {
    padding: 0 !important;
  }

  /* Increase the area of the popover so the pointer can go from the target directly to it. */
  [part='overlay']::before {
    position: absolute;
    content: '';
    inset-block: calc(var(--vaadin-popover-offset-top, var(--_default-offset)) * -1)
      calc(var(--vaadin-popover-offset-bottom, var(--_default-offset)) * -1);
    inset-inline: calc(var(--vaadin-popover-offset-start, var(--_default-offset)) * -1)
      calc(var(--vaadin-popover-offset-end, var(--_default-offset)) * -1);
    z-index: -1;
    pointer-events: auto;
  }

  :host([position^='top'][bottom-aligned]) [part='overlay'],
  :host([position^='bottom'][bottom-aligned]) [part='overlay'] {
    margin-bottom: var(--vaadin-popover-offset-bottom, var(--_default-offset));
  }

  :host([position^='start'][start-aligned]) [part='overlay'],
  :host([position^='end'][start-aligned]) [part='overlay'] {
    margin-inline-start: var(--vaadin-popover-offset-start, var(--_default-offset));
  }

  :host([position^='start'][end-aligned]) [part='overlay'],
  :host([position^='end'][end-aligned]) [part='overlay'] {
    margin-inline-end: var(--vaadin-popover-offset-end, var(--_default-offset));
  }

  [part='arrow'] {
    display: none;
  }

  :host([theme~='arrow']) {
    --_default-offset: var(--_arrow-size);
  }

  :host([theme~='arrow']) [part='arrow'] {
    display: block;
    position: absolute;
    background: inherit;
    border: inherit;
    border-start-start-radius: var(--vaadin-popover-arrow-border-radius, 0);
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
    :host([theme~='arrow']) [part='arrow'] {
      --ff: 1px;
    }
  }

  /* bottom / top */
  :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[start-aligned]) [part='arrow'] {
    inset-inline-start: calc(var(--_arrow-size) * 2);
  }

  :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[end-aligned]) [part='arrow'] {
    inset-inline-end: calc(var(--_arrow-size) * 2);
  }

  :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[arrow-centered]) [part='arrow'] {
    inset-inline-start: 50%;
  }

  /* bottom */
  :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[top-aligned]) [part='arrow'] {
    top: 0;
    translate: calc(-50% * var(--_rtl-multiplier)) -50%;
  }

  :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[end-aligned][top-aligned]) [part='arrow'] {
    translate: calc(50% * var(--_rtl-multiplier)) -50%;
  }

  /* top */
  :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[bottom-aligned]) [part='arrow'] {
    bottom: 0;
    rotate: 225deg;
    translate: calc(-50% * var(--_rtl-multiplier)) 50%;
  }

  :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[end-aligned][bottom-aligned]) [part='arrow'] {
    translate: calc(50% * var(--_rtl-multiplier)) 50%;
  }

  /* start / end */
  :host([theme~='arrow']:is([position^='start'], [position^='end'])[top-aligned]) [part='arrow'] {
    rotate: -45deg;
    top: calc(var(--_arrow-size) * 2);
  }

  :host([theme~='arrow']:is([position^='start'], [position^='end'])[bottom-aligned]) [part='arrow'] {
    rotate: -45deg;
    bottom: calc(var(--_arrow-size) * 2);
  }

  :host([theme~='arrow']:is([position='start'], [position='end'])[top-aligned]) [part='arrow'] {
    top: 50%;
  }

  :host([dir='rtl'][theme~='arrow']:is([position^='start'], [position^='end'])) [part='arrow'] {
    scale: -1;
  }

  /* end */
  :host([theme~='arrow']:is([position^='start'], [position^='end'])[start-aligned]) [part='arrow'] {
    inset-inline-start: 0;
    translate: calc(-50% * var(--_rtl-multiplier)) -50%;
  }

  :host([theme~='arrow']:is([position^='start'], [position^='end'])[start-aligned][bottom-aligned]) [part='arrow'] {
    translate: calc(-50% * var(--_rtl-multiplier)) 50%;
  }

  /* start */
  :host([theme~='arrow']:is([position^='start'], [position^='end'])[end-aligned]) [part='arrow'] {
    rotate: 135deg;
    inset-inline-end: 0;
    translate: calc(50% * var(--_rtl-multiplier)) -50%;
  }

  :host([theme~='arrow']:is([position^='start'], [position^='end'])[end-aligned][bottom-aligned]) [part='arrow'] {
    translate: calc(50% * var(--_rtl-multiplier)) 50%;
  }

  @media (forced-colors: active) {
    :host {
      --_border-width: 3px;
    }
  }
`;

export const popoverOverlayStyles = [overlayStyles, popoverOverlay];
