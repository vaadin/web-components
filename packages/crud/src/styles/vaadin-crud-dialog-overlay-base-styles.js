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
import { dialogOverlayBase } from '@vaadin/dialog/src/styles/vaadin-dialog-overlay-core-styles.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';

const crudDialogOverlay = css`
  [part='header'] {
    color: var(--vaadin-crud-dialog-header-color, var(--vaadin-color));
    font-size: var(--vaadin-crud-dialog-header-font-size, 1em);
    font-weight: var(--vaadin-crud-dialog-header-font-weight, 600);
    line-height: var(--vaadin-crud-dialog-header-line-height, inherit);
  }

  ::slotted([slot='header']) {
    color: inherit !important;
    display: contents;
    font: inherit !important;
    overflow-wrap: anywhere;
  }

  [part='footer'] {
    flex-direction: row-reverse;
    justify-content: normal;
  }

  ::slotted([slot='delete-button']) {
    margin-inline-end: auto;
  }
`;

export const crudDialogOverlayStyles = [overlayStyles, dialogOverlayBase, crudDialogOverlay];
