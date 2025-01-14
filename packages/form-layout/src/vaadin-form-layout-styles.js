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
    animation: 1ms vaadin-form-layout-appear;
    align-self: stretch;
    container-type: inline-size;
    container-name: form-grid;

    /* CSS API for host */
    --vaadin-form-item-label-width: 8em;
    --vaadin-form-item-label-spacing: 1em;
    --vaadin-form-item-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em; /* (default) */

    /* Private shit */
    --_default-field-column: 1;
    --_grid-cols: auto-fill; /* col count defaults to "whatever fits" if not provided - this does not actually work with colspan capping */
    --_default-field-column: auto; /* auto: auto-rows; 1: single-col default */
  }

  @keyframes vaadin-form-layout-appear {
    to {
      opacity: 1 !important; /* stylelint-disable-line keyframe-declaration-no-important */
    }
  }

  :host([hidden]) {
    display: none !important;
  }

  #layout {
    --_grid-col-width: var(--vaadin-form-layout-column-width, 1fr);
    --_grid-col-gap: var(--vaadin-form-layout-column-spacing);
    --_grid-col-max-width: var(var(--_grid-col-width));

    display: grid;
    grid-template-columns: repeat(var(--_grid-cols), var(--_grid-col-width));
    column-gap: var(--_grid-col-gap);
    row-gap: 0;

    align-items: baseline; /* default \`stretch\` is not appropriate */
    justify-content: stretch;

    flex-wrap: wrap; /* the items should wrap */
  }

  #layout ::slotted(*:not(vaadin-grid-row)) {
    grid-column-start: var(--_vaadin-form-layout-start-col, var(--_default-field-column));
    grid-column-end: span min(var(--vaadin-form-layout-colspan), var(--_grid-cols));
  }

  #layout ::slotted(br) {
    display: none;
  }
`;

/* FORM ITEM STYLES */

export const formItemStyles = css`
  :host {
    display: inline-flex;
    align-items: var(--_vaadin-form-item-align-items, baseline); /* stretch */
    flex-direction: var(--_vaadin-form-item-flex-dir, row); /* column */
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
