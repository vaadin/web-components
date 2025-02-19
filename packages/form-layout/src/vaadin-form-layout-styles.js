/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const formLayoutStyles = css`
  :host {
    /* Default values */
    --vaadin-form-layout-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em;
    --vaadin-form-layout-label-width: 8em;
    --vaadin-form-layout-label-spacing: 1em;

    display: block;
    max-width: 100%;
    align-self: stretch;
  }

  :host([hidden]) {
    display: none !important;
  }

  #layout {
    display: flex;

    align-items: baseline; /* default \`stretch\` is not appropriate */

    flex-wrap: wrap; /* the items should wrap */
  }

  #layout ::slotted(*) {
    /* Items should neither grow nor shrink. */
    flex-grow: 0;
    flex-shrink: 0;

    /* Margins make spacing between the columns */
    margin-left: calc(0.5 * var(--vaadin-form-layout-column-spacing));
    margin-right: calc(0.5 * var(--vaadin-form-layout-column-spacing));
  }

  #layout ::slotted(br) {
    display: none;
  }
`;

export const formItemStyles = css`
  :host {
    display: inline-flex;
    flex-direction: row;
    align-items: baseline;
    margin: calc(0.5 * var(--vaadin-form-item-row-spacing, var(--vaadin-form-layout-row-spacing, 1em))) 0;
  }

  :host([label-position='top']) {
    flex-direction: column;
    align-items: stretch;
  }

  :host([hidden]) {
    display: none !important;
  }

  #label {
    width: var(--vaadin-form-item-label-width, var(--vaadin-form-layout-label-width, 8em));
    flex: 0 0 auto;
  }

  :host([label-position='top']) #label {
    width: auto;
  }

  #spacing {
    width: var(--vaadin-form-item-label-spacing, var(--vaadin-form-layout-label-spacing, 1em));
    flex: 0 0 auto;
  }

  #content {
    flex: 1 1 auto;
  }

  #content ::slotted(.full-width) {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
`;
