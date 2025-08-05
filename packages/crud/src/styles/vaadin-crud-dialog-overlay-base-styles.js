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
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { dialogOverlayStyles } from '@vaadin/dialog/src/styles/vaadin-dialog-overlay-base-styles.js';

const crudDialogOverlay = css`
  [part='header'] {
    color: var(--vaadin-crud-dialog-header-color, var(--vaadin-color));
    font-size: var(--vaadin-crud-dialog-header-font-size, 1em);
    font-weight: var(--vaadin-crud-dialog-header-font-weight, 600);
    line-height: var(--vaadin-crud-dialog-header-line-height, inherit);
    padding: var(--vaadin-crud-header-padding, var(--vaadin-padding));
  }

  ::slotted([slot='header']) {
    color: inherit !important;
    display: contents;
    font: inherit !important;
    overflow-wrap: anywhere;
  }

  :host(:is(*, #id)) [part='content'] {
    overflow: auto;
    overscroll-behavior: contain;
    padding: var(--vaadin-crud-form-padding, var(--vaadin-padding));
  }

  ::slotted([slot='form']) {
    --vaadin-crud-form-padding: 0;
  }

  [part='footer'] {
    justify-content: normal;
    background: var(--vaadin-crud-footer-background, transparent);
    border-top: var(--vaadin-crud-border-width, 1px) solid var(--vaadin-crud-border-color, var(--vaadin-border-color));
  }
`;

export const crudDialogOverlayStyles = [...dialogOverlayStyles, crudDialogOverlay];
