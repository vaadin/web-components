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
    /* Number of cols, defined by breakpoints. Default value is probably pointless. */
    --_grid-cols: 10;
    /* CSS API for host */
    --vaadin-form-item-label-width: 8em;
    --vaadin-form-item-label-spacing: 1em;
    --vaadin-form-item-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em; /* (default) */
    align-self: stretch;
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
    grid-template-columns: repeat(var(--_grid-cols), 1fr);
    gap: var(--vaadin-form-item-row-spacing) var(--vaadin-form-layout-column-spacing);
    align-items: baseline; /* default \`stretch\` is not appropriate */
  }

  #layout ::slotted(*) {
    grid-column: var(--_grid-colstart, auto) / span min(var(--_grid-colspan, 1), var(--_grid-cols));
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
