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
    --_label-col-width: var(--vaadin-form-item-label-width, 8em);
    --_label-col-spacing: var(--vaadin-form-item-label-spacing, 1em);
    --_grid-cols: auto-fill; /* Number of cols, defined by breakpoints. Default value is probably pointless. */

    /* CSS API for host */
    /* Let's not define defaults here – that way they can be set globally
    --vaadin-form-item-label-width: 8em;
    --vaadin-form-item-label-spacing: 1em;
    --vaadin-form-item-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em; */
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
    /* --_vaadin-form-layout-column-max-width below
      is set to 1fr by the WC expandColumns property
      to make the cols expand to fill available space .*/
    grid-template-columns: repeat(
      var(--_grid-cols),
      minmax(
        var(--_vaadin-form-layout-column-width),
        var(--_vaadin-form-layout-column-max-width, var(--_vaadin-form-layout-column-width))
      )
    );
    column-gap: var(--_vaadin-form-layout-column-gap, 2em);
    row-gap: var(--vaadin-form-item-row-spacing, 1em);

    align-items: baseline;
    justify-content: stretch;
    min-width: min-content;
  }

  #layout ::slotted(*) {
    /* Unless auto-rows is on, each field starts on a new line */
    grid-column-start: 1;
    /* Span is set via custom prop set by the WC; capped by current breakpoint's column count */
    grid-column-end: span min(var(--vaadin-form-layout-colspan), var(--_grid-cols));
  }

  :host([auto-rows]) #layout ::slotted(*) {
    /* In auto-rows mode, fields are laid out in multiple cols,
      but the WC overrides this to 1 using --_vaadin-form-layout-start-col
      following a <br>, vaadin-form-row or vaadin-form-section */
    grid-column-start: var(--_vaadin-form-layout-start-col, auto);
  }

  #layout ::slotted(br) {
    display: none;
  }

  :host([expand-columns='always']) #layout {
    --_vaadin-form-layout-column-max-width: 1fr;
  }

  /* If expand-columns="mobile", column expansion is enabled on small viewports */
  @media (max-width: 420px) {
    :host([expand-columns='mobile']) #layout {
      --_vaadin-form-layout-column-max-width: 1fr;
    }
  }

  /* Items are stretched to fit column when fit-fields is enabled */
  :host([fit-fields='always']) #layout {
    --_vaadin-form-item-fit-content: 1;
  }

  /* If fit-fields="mobile", field fitting is enabled on small viewports */
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
    /* This is a bit convoluted, but the end result is that
       LABELS ABOVE => align-items: stretch; justify-content: normal;
       LABELS ASIDE => align-items: baseline; justify-content: baseline; */
    flex-flow: var(--_vaadin-form-layout-label-position, column) nowrap;
    place-items: var(--_vaadin-form-layout-label-position, stretch) baseline;
    justify-content: normal;
  }

  :host([hidden]) {
    display: none !important;
  }

  #label {
    /* This inverts the label-positioning property... */
    --_not-label-pos: var(--_vaadin-form-layout-label-position, ' ') initial;
    /* ...so that it can be used to set flex-basis to
      --_label-col-width for LABELS ASIDE
      auto for LABELS ABOVE */
    flex: var(--_not-label-pos, var(--_label-col-width)) var(--_vaadin-form-layout-label-position, auto);
    flex-shrink: 0;
    flex-grow: 0;
  }

  #spacing {
    width: var(--_label-col-spacing);
    flex: 0 0 auto;
  }

  #content {
    flex: 1 1 auto;
    overflow: hidden;
  }

  #content ::slotted(*) {
    box-sizing: border-box;
    /* Sets width to 100% if fit-content is on */
    width: calc(100% * var(--_vaadin-form-item-fit-content));
    /* Sets min-width to 0 if fit-content is on */
    min-width: calc(1 - var(--_vaadin-form-item-fit-content));
  }

  /* Legacy full-width classname support */
  #content ::slotted(.full-width) {
    --_vaadin-form-item-fit-content: 1;
  }
`;

export const formSectionStyles = css`
  :host {
    display: contents;
  }

  [part~='header'] {
    /* Stretch header element across all available cols */
    grid-column: 1 / -1;
  }

  [part~='title'] {
    margin-block: 1em 0;
  }

  ::slotted(*:first-child) {
    grid-column-start: 1;
  }
`;
