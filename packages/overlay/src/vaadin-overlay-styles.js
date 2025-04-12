/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const overlayStyles = css`
  :host {
    /* CSS API for host */
    --vaadin-overlay-viewport-bottom: 0;

    /* Use flexbox alignment for the overlay part. */
    display: flex;
    position: fixed;
    z-index: 200;
    bottom: var(--vaadin-overlay-viewport-bottom);
    flex-direction: column; /* makes dropdowns sizing easier */
    /* Align to center by default. */
    align-items: center;
    justify-content: center;

    /* Allow centering when max-width/max-height applies. */
    margin: auto;

    /* The host is not clickable, only the overlay part is. */
    pointer-events: none;

    /* Despite of what the names say, <vaadin-overlay> is just a container
          for position/sizing/alignment. The actual overlay is the overlay part. */

    /* Default position constraints: the entire viewport. Note: themes can
          override this to introduce gaps between the overlay and the viewport. */
    inset: 0;

    /* Remove tap highlight on touch devices. */
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]),
  :host(:not([opened]):not([closing])),
  :host(:not([opened]):not([closing])) [part='overlay'] {
    display: none !important;
  }

  [part='overlay'] {
    box-sizing: border-box;

    /* Prevent overflowing the host */
    max-width: 100%;
    overflow: auto;
    pointer-events: auto;
    -webkit-overflow-scrolling: touch;

    -webkit-tap-highlight-color: initial; /* reenable tap highlight inside */
  }

  [part='backdrop'] {
    content: '';
    position: fixed;
    z-index: -1;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: auto;
    inset: 0;
  }
`;
