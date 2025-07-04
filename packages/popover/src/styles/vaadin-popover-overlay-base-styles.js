/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

const popoverOverlay = css`
  @layer base {
    :host {
      --_arrow-size: var(--vaadin-popover-arrow-size, 0.5rem);
      --_default-offset: 0.25rem;
      --_rtl-multiplier: 1;
      --_border-width: 1px;
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
    }

    [part='content'] {
      overflow: auto;
      box-sizing: border-box;
      max-height: 100%;
      padding: var(--vaadin-popover-padding, var(--vaadin-padding));
      position: relative;
      z-index: 1; /* to show above arrow */
    }

    :host([theme~='no-padding']) [part='content'] {
      padding: 0;
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
      --_default-offset: calc(0.25rem + var(--_arrow-size) / 2);
    }

    :host([theme~='arrow']) [part='arrow'] {
      display: block;
      position: absolute;
      background: var(--vaadin-overlay-background, var(--vaadin-background-color));
      border: var(--vaadin-overlay-border, var(--_border-width) solid var(--vaadin-border-color));
      width: var(--_arrow-size);
      height: var(--_arrow-size);
      rotate: 45deg;
    }

    :host([theme~='arrow']) [part='overlay']:focus-visible [part='arrow'] {
      --_border-width: var(--vaadin-focus-ring-width);
      border: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
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
      border-bottom-width: 0;
      border-right-width: 0;
      top: 0;
      translate: calc(-50% * var(--_rtl-multiplier)) calc(-50% - var(--_border-width));
    }

    :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[end-aligned][top-aligned]) [part='arrow'] {
      translate: calc(50% * var(--_rtl-multiplier)) calc(-50% - var(--_border-width));
    }

    /* top */
    :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[bottom-aligned]) [part='arrow'] {
      border-top-width: 0;
      border-left-width: 0;
      bottom: 0;
      translate: calc(-50% * var(--_rtl-multiplier)) calc(50% + var(--_border-width));
    }

    :host([theme~='arrow']:is([position^='bottom'], [position^='top'])[end-aligned][bottom-aligned]) [part='arrow'] {
      translate: calc(50% * var(--_rtl-multiplier)) calc(50% + var(--_border-width));
    }

    /* start / end */
    :host([theme~='arrow']:is([position^='start'], [position^='end'])[top-aligned]) [part='arrow'] {
      top: calc(var(--_arrow-size) * 2);
    }

    :host([theme~='arrow']:is([position^='start'], [position^='end'])[bottom-aligned]) [part='arrow'] {
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
      border-top-width: 0;
      border-right-width: 0;
      inset-inline-start: 0;
      translate: calc((-50% - var(--_border-width)) * var(--_rtl-multiplier)) -50%;
    }

    :host([theme~='arrow']:is([position^='start'], [position^='end'])[start-aligned][bottom-aligned]) [part='arrow'] {
      translate: calc((-50% - var(--_border-width)) * var(--_rtl-multiplier)) 50%;
    }

    /* start */
    :host([theme~='arrow']:is([position^='start'], [position^='end'])[end-aligned]) [part='arrow'] {
      border-bottom-width: 0;
      border-left-width: 0;
      inset-inline-end: 0;
      translate: calc((50% + var(--_border-width)) * var(--_rtl-multiplier)) -50%;
    }

    :host([theme~='arrow']:is([position^='start'], [position^='end'])[end-aligned][bottom-aligned]) [part='arrow'] {
      translate: calc((50% + var(--_border-width)) * var(--_rtl-multiplier)) 50%;
    }
  }
`;

export const popoverOverlayStyles = [overlayStyles, popoverOverlay];
