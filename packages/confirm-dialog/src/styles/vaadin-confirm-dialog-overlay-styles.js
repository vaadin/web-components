/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { dialogOverlayBase } from '@vaadin/dialog/src/vaadin-dialog-overlay-styles.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';

const confirmDialogOverlay = css`
  :host {
    --_vaadin-confirm-dialog-content-width: auto;
    --_vaadin-confirm-dialog-content-height: auto;
  }

  [part='overlay'] {
    width: var(--_vaadin-confirm-dialog-content-width);
    height: var(--_vaadin-confirm-dialog-content-height);
  }

  #resizerContainer {
    height: 100%;
  }

  ::slotted([slot='header']) {
    pointer-events: auto;
  }

  /* Make buttons clickable */
  [part='footer'] > * {
    pointer-events: all;
  }
`;

export const confirmDialogOverlayStyles = [overlayStyles, dialogOverlayBase, confirmDialogOverlay];
