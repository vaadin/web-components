/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { dialogOverlayBase } from '@vaadin/dialog/src/styles/vaadin-dialog-overlay-core-styles.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';

const confirmDialogOverlay = css`
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
