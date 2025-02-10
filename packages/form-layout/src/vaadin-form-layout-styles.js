/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const formLayoutStyles = css`
  :host {
    display: block;
    max-width: 100%;
    /* CSS API for host */
    --vaadin-form-item-label-width: 8em;
    --vaadin-form-item-label-spacing: 1em;
    --vaadin-form-layout-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em; /* (default) */
    align-self: stretch;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([auto-responsive])) #layout {
    display: flex;

    align-items: baseline; /* default \`stretch\` is not appropriate */

    flex-wrap: wrap; /* the items should wrap */
  }

  :host(:not([auto-responsive])) #layout ::slotted(*) {
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

  :host([auto-responsive]) {
    --vaadin-form-layout-column-max-width: var(--vaadin-form-layout-column-width);
  }

  :host([auto-responsive]) #layout {
    --_max-columns: var(--vaadin-form-layout-max-columns);
    --_column-width: var(--vaadin-form-layout-column-width);

    --_total-gap-width: calc((var(--_max-columns) - 1) * var(--vaadin-form-layout-column-spacing));
    --_total-col-width: calc(var(--_max-columns) * var(--_column-width));

    --_column-max-width: var(--vaadin-form-layout-column-max-width);
    --_column-min-width: max(var(--_column-width), calc((100% - var(--_total-gap-width)) / var(--_max-columns)));

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--_column-min-width), var(--_column-max-width)));
    gap: var(--vaadin-form-layout-row-spacing) var(--vaadin-form-layout-column-spacing);
  }

  :host([auto-responsive]:not([expand-columns])) #layout {
    max-width: calc(var(--_total-col-width) + var(--_total-gap-width));
  }

  :host([auto-responsive][expand-columns='always']) {
    --vaadin-form-layout-column-max-width: 1fr;
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
    width: var(--vaadin-form-item-label-width, 8em);
    flex: 0 0 auto;
  }

  :host([label-position='top']) #label {
    width: auto;
  }

  #spacing {
    width: var(--vaadin-form-item-label-spacing, 1em);
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
