/**
 * @license
 * Copyright (c) 2023 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

const sideNavOverlay = css`
  :host {
    --_offset: var(--vaadin-side-nav-overlay-offset, 4px);
  }

  [part='overlay'] {
    position: relative;
    /* The gap bridge below must not be clipped, so scrolling lives on the content part */
    overflow: visible;
    max-height: 100%;
    /* Keep the nav typography instead of the overlay CSS reset */
    font: inherit;
    white-space: inherit;
  }

  [part='content'] {
    box-sizing: border-box;
    max-height: 100%;
    overflow: auto;
    overscroll-behavior: contain;
    padding: var(--vaadin-side-nav-overlay-padding, var(--vaadin-padding-s));
  }

  :host([start-aligned]) [part='overlay'] {
    margin-inline-start: var(--_offset);
  }

  :host([end-aligned]) [part='overlay'] {
    margin-inline-end: var(--_offset);
  }

  /* Extend the hoverable area across the offset, so that moving the pointer
     from the item to the overlay does not leave the item's hover chain. */
  [part='overlay']::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline: calc(var(--_offset) * -1);
    z-index: -1;
    pointer-events: auto;
  }
`;

export const sideNavOverlayStyles = [overlayStyles, sideNavOverlay];
