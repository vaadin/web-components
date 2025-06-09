/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css } from 'lit';
import { dialogOverlay, resizableOverlay } from '@vaadin/dialog/src/vaadin-dialog-styles.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';

const crudDialogOverlay = css`
  [part='overlay'] {
    max-width: 54em;
    min-width: 20em;
  }

  [part='footer'] {
    justify-content: flex-start;
    flex-direction: row-reverse;
  }

  /* Make buttons clickable */
  [part='footer'] ::slotted(:not([disabled])) {
    pointer-events: all;
  }

  :host([fullscreen]) {
    inset: 0;
    padding: 0;
  }

  :host([fullscreen]) [part='overlay'] {
    height: 100vh;
    width: 100vw;
    border-radius: 0 !important;
  }

  :host([fullscreen]) [part='content'] {
    flex: 1;
  }
`;

export const crudDialogOverlayStyles = [overlayStyles, dialogOverlay, resizableOverlay, crudDialogOverlay];
