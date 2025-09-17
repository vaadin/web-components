/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { dialogOverlayBase } from '@vaadin/dialog/src/styles/vaadin-dialog-overlay-base-styles.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

const confirmDialogOverlay = css`
  :host {
    --vaadin-dialog-min-width: var(--vaadin-confirm-dialog-min-width, 15em);
    --vaadin-dialog-max-width: var(--vaadin-confirm-dialog-max-width, 25em);
  }

  ::slotted([slot='header']) {
    display: contents;
    font: inherit !important;
    color: inherit !important;
  }

  [part='header'] {
    color: var(--vaadin-dialog-title-color, var(--vaadin-text-color));
    font-weight: var(--vaadin-dialog-title-font-weight, 600);
    font-size: var(--vaadin-dialog-title-font-size, 1em);
    line-height: var(--vaadin-dialog-title-line-height, inherit);
  }

  [part='overlay'] {
    display: flex;
    flex-direction: column;
  }

  [part='content'] {
    flex: 1;
  }
`;

export const confirmDialogOverlayStyles = [overlayStyles, dialogOverlayBase, confirmDialogOverlay];
