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
    /* Let's not define defaults here – that way they can be set globally
    --vaadin-form-item-label-width: 8em;
    --vaadin-form-item-label-spacing: 1em;
    --vaadin-form-item-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em; */

    /* Private shit */
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
    display: grid;
    grid-template-columns: repeat(
      var(--_grid-cols),
      minmax(
        var(--_vaadin-form-layout-column-width),
        var(--_vaadin-form-layout-column-max-width, var(--_vaadin-form-layout-column-width))
      )
    );
    column-gap: var(--_vaadin-form-layout-column-gap, 2em);
    row-gap: var(--vaadin-form-item-row-spacing, 1em);

    align-items: baseline; /* default \`stretch\` is not appropriate */
    justify-content: stretch;

    flex-wrap: wrap; /* the items should wrap */

    min-width: 300px;
  }

  #layout ::slotted(*:not(vaadin-grid-row)) {
    grid-column-start: 1;
    grid-column-end: span min(var(--vaadin-form-layout-colspan), var(--_grid-cols));
  }

  :host([auto-rows]) #layout ::slotted(*:not(vaadin-grid-row)) {
    grid-column-start: auto;
  }

  #layout ::slotted(br) {
    display: none;
  }

  :host([expand-columns='always']) #layout {
    --_vaadin-form-layout-column-max-width: 1fr;
  }

  @media (max-width: 420px) {
    :host([expand-columns='mobile']) #layout {
      --_vaadin-form-layout-column-max-width: 1fr;
    }
  }

  :host([fit-fields='always']) #layout {
    --_vaadin-form-item-fit-content: 1;
  }

  @media (max-width: 420px) {
    :host([fit-fields='mobile']) #layout {
      --_vaadin-form-item-fit-content: 1;
    }
  }
`;

/* FORM ITEM STYLES */

export const formItemStyles = css`
  :host {
    display: inline-flex;
    flex-flow: var(--_vaadin-form-layout-label-position, column) nowrap;
    place-items: var(--_vaadin-form-layout-label-position, stretch) baseline;
    justify-content: normal;
  }

  :host([hidden]) {
    display: none !important;
  }

  #label {
    width: var(--vaadin-form-item-label-width, 8em);
    flex: 0 0 auto;
  }

  /* TODO: Refactor */
  :host([label-position='top']) #label {
    width: auto;
  }

  #spacing {
    width: var(--vaadin-form-item-label-spacing, 1em);
    flex: 0 0 auto;
  }

  #content {
    flex: 1 1 auto;
    overflow: hidden;
  }

  #content ::slotted(*) {
    box-sizing: border-box;
    width: calc(100% * var(--_vaadin-form-item-fit-content));
    min-width: calc(1 - var(--_vaadin-form-item-fit-content));
  }

  #content ::slotted(.full-width) {
    --_vaadin-form-item-fit-content: 1;
  }
`;
